<script setup>
import ActionBarInclude from '../components/ActionBarInclude.vue'
import { PDFDocument, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.mjs';
let uploadedFile = null;
let redactionAreas = []; // Array to store redaction areas
var redactionWords = []; // Array to store words to redact
var pdf2TextConverter = new Pdf2Text;


// Function to handle file change event
async function onFileChanged($event) {
    const target = $event.target;
    uploadedFile = target.files[target.files.length-1];
    
    // Check if a file is selected
    if (uploadedFile) {
        // Create a new FileReader instance
        const reader = new FileReader();
        
        // Define a callback function to be executed when file reading is complete
        reader.onload = function(event) {
            // Extract the ArrayBuffer from the FileReader result
            const pdfData = event.target.result;
            
            // Define a callback function for tracking progress of each page
            function onPageDone(currentPage, totalPages) {
                console.log("Page " + currentPage + " out of " + totalPages + " is done.");
            }

            // Define a callback function for handling the extracted text when all pages are processed
            function onAllDone(fullText) {
                console.log("All pages are processed. Full text extracted:");
                console.log(fullText);
            }

            // Call the pdfToText method with the PDF data and callback functions
            pdf2TextConverter.pdfToText(pdfData, onPageDone, onAllDone);
        };
        
        // Read the file as ArrayBuffer
        reader.readAsArrayBuffer(uploadedFile);
    } else {
        console.error("No file selected.");
    }
}



// Function to add a redaction area based on user input from textarea
function addRedactionArea() {
    // Get input from textarea
    const userInput = document.getElementById('userInput').value;
    redactionWords.push(userInput)
    // Parse input string to extract coordinates and dimensions


    // Validate input

    // Add the redaction area

}


// Function to remove a redaction area
function removeRedactionArea(index) {
    redactionAreas.splice(index, 1);
}

// Function to perform PDF redaction
async function redactPdf() {
    if (!uploadedFile) {
        console.error('No file uploaded.');
        return null; // Return null if no file is uploaded
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(event) {
            const pdfData = new Uint8Array(event.target.result);
            const pdfDoc = await PDFDocument.load(pdfData);
            
            // Iterate over redaction areas and apply redaction
            for (const area of redactionAreas) {
                const { x, y, width, height } = area;
                const pages = pdfDoc.getPages();
                for (const page of pages) {
                    page.drawRectangle({
                        x,
                        y,
                        width,
                        height,
                        color: rgb(0, 0, 0), // Black
                    });
                }
            }

            const modifiedPdfBytes = await pdfDoc.save();
            resolve(modifiedPdfBytes); // Resolve with modified PDF data
        };
        reader.onerror = reject; // Reject on error
        reader.readAsArrayBuffer(uploadedFile);
    });
}

// Function to preview the redacted PDF
async function previewPdf() {
    const modifiedPdfBytes = await redactPdf(); // Redact the PDF first

    if (!modifiedPdfBytes) {
        console.error('Failed to redact PDF.');
        return;
    }

    // Convert the modified PDF bytes to a Blob
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

    // Create a URL for the Blob
    const blobUrl = URL.createObjectURL(blob);

    // Display the redacted PDF within the specified div
    const pdfDiv = document.getElementById('pdfContainer');
    pdfDiv.innerHTML = `<embed src="${blobUrl}" width="100%" height="100%" />`;
}


function Pdf2Text() {
    var self = this;
    this.complete = 0;

    // Define parameters object with regular expressions
    var [width, height] = [100,30];
    const parameters = {
        "confidential": {
            "NRIC": {
                "value": true,
                "regex": [/[a-z]\d{7}[a-z]/i]
            }
        }
    };

    /**
     *
     * @param data ArrayBuffer of the pdf file content
     * @param callbackPageDone To inform the progress each time
     *        when a page is finished. The callback function's input parameters are:
     *        1) number of pages done;
     *        2) total number of pages in file.
     * @param callbackAllDone The input parameter of callback function is 
     *        the result of extracted text from pdf file.
     *
     */
    this.pdfToText = function(data, callbackPageDone, callbackAllDone) {
        console.assert(data instanceof ArrayBuffer || typeof data == 'string');
        var pdf = pdfjsLib.getDocument(data);
        pdf.promise.then(function(pdf) {
            var total = pdf.numPages;
            callbackPageDone(0, total);
            var layers = {};
            for (let i = 1; i <= total; i++) {
                pdf.getPage(i).then(function(page) {
                    var n = page.pageNumber;
                    page.getTextContent().then(function(textContent) {
                        if (textContent && textContent.items) {
                            var page_text = "";
                            var last_block = null;
                            for (var k = 0; k < textContent.items.length; k++) {
                                var block = textContent.items[k];
                                // Extract word, x, and y coordinates
                                var word = block.str;
                                var x = block.transform[4];
                                var y = block.transform[5];
                                console.log("Word:", word, "X:", x, "Y:", y)
                                for (var j = 0; j < redactionWords.length; j++) {
                                    var redactionWord = redactionWords[j];
                                    if (word === redactionWord) {
                                        // Log word and its coordinates
                                        console.log("Redaction Word:", word, "X:", x, "Y:", y);
                                        redactionAreas.push({ x, y, width, height });
                                        break; // Stop looping through redaction words once matched
                                    }
                                }
                                // Check if the word matches any regex in parameters object
                                for (const category in parameters) {
                                    for (const key in parameters[category]) {
                                        if (parameters[category][key].value) {
                                            for (const regex of parameters[category][key].regex) {
                                                if (word.match(regex)) {
                                                    // Log word and its coordinates
                                                    console.log("Word:", word, "X:", x, "Y:", y);
                                                    redactionAreas.push({ x, y, width, height})
                                                    break; // Stop looping through regexes once matched
                                                }
                                            }
                                        }
                                    }
                                }
                                
                                if (last_block != null && last_block.str[last_block.str.length - 1] != ' ') {
                                    if (block.x < last_block.x)
                                        page_text += "\r\n";
                                    else if (last_block.y != block.y && (last_block.str.match(/^(\s?[a-zA-Z])$|^(.+\s[a-zA-Z])$/) == null))
                                        page_text += ' ';
                                }
                                page_text += block.str;
                                last_block = block;
                            }
                            textContent != null && console.log("page " + n + " finished."); //" content: \n" + page_text);
                            layers[n] = page_text + "\n\n";
                        }
                        ++self.complete;
                        callbackPageDone(self.complete, total);
                        if (self.complete == total) {
                            window.setTimeout(function() {
                                var full_text = "";
                                var num_pages = Object.keys(layers).length;
                                for (var j = 1; j <= num_pages; j++)
                                    full_text += layers[j];
                                callbackAllDone(full_text);
                            }, 1000);
                        }
                    }); // end  of page.getTextContent().then
                }); // end of page.then
            } // of for
        });
    }; // end of pdfToText()
}; // end of class


</script>


<template>
    <ActionBarInclude>
        <h2 class="text-2xl text-red-800 font-nasalization font-bold pt-10 pl-10">Redaction</h2>
        <div class="grid grid-cols-3">
            <div class="col-span-1">
                <p class="m-10">
                    To redact a PDF, just upload a PDF by clicking into the empty space below. FYEO shall help to redact data we think is first sensitive before giving you the opportunity to redact words of your choice.
                </p>
                <p class="ml-10">
                    How it works?
                </p>
                <p class="m-10">
                    Simply type out word by word that you want to redact and press 'GO!' and FYEO shall do the rest.
                </p>

                <div class="m-10">
                    <!-- gButton to add redaction area -->
                    <textarea class="border-2 border-black w-full h-64" rows="100%" cols="100%" placeholder="Words to redact" id="userInput"></textarea>
                    <button type="button" class="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-600 dark:focus:ring-red-700" @click="addRedactionArea()">Add Redaction Word</button>
                    <!-- Button to remove redaction area -->
                    <button type="button" class="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-600 dark:focus:ring-red-700" @click="removeRedactionArea(redactionAreas.length - 1)">Remove Last Redaction Area</button>
                    <!-- Button to trigger PDF redaction -->
                    <button type="button" class="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-600 dark:focus:ring-red-700" @click="previewPdf">GO!</button>
                </div>

                </div>

            <div class=" w-full h-screen col-span-2 p-10">
                <!-- jutify-self-center -->
                <!-- Input to upload PDF file -->
                <label for="myfile" class="custom-file-upload">
                    <input type="file" id="myfile" name="myfile" style="display: none;" @change="onFileChanged($event)">
                
                    <!-- Placeholder for displaying PDF content -->
                    <div class="border-2 h-5/6 flex justify-center items-center" id="pdfContainer">
                        <!-- Display redacted PDF here -->
                        Click on the empty space to start uploading!
                    </div>

                </label>
            </div>
            
        </div>
        
    </ActionBarInclude>
</template>
