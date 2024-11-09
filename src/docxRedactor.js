// docxRedactor.js

const fs = require('fs');
const Docxtemplater = require('docxtemplater');

function redactTextInDocx(inputFilePath, textToRedact, outputFilePath) {
    // Read the input Word document
    const content = fs.readFileSync(inputFilePath, 'binary');

    // Initialize Docxtemplater with the content
    const doc = new Docxtemplater();
    doc.loadZip(content);

    // Define options for redaction
    const options = {
        parser: {
            // Custom parser to handle redaction
            getParagraph: function (tagValue, tagName) {
                if (tagValue && typeof tagValue === 'string') {
                    const regex = new RegExp(textToRedact, 'g');
                    tagValue = tagValue.replace(regex, '█'.repeat(textToRedact.length)); // Replace text with black squares (█)
                }
                return {
                    text: tagValue || '',
                };
            },
        },
    };

    // Apply redaction options and generate the output Word document
    doc.setData({});
    doc.render();
    const output = doc.getZip().generate({ type: 'nodebuffer' });

    // Write the output to a new Word document
    fs.writeFileSync(outputFilePath, output);
}

module.exports = redactTextInDocx; // Export the function directly
