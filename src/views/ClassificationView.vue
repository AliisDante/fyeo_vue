<script setup>
import { ref, onMounted } from 'vue';
import { active_file } from '../store/FileStore.js'
import { checkSensitiveWords } from "../wordcheck";
import extractFileContent from "../getFileContents" 
import Chip from "../components/Chip.vue";
import Loading from "../components/Loading.vue"
// import { addNewParameter } from '../AddParameter';

import { HfInference } from '@huggingface/inference'

const hf = new HfInference('CENSORED')

import axios from 'axios';
import CryptoJS from 'crypto-js';

const VTKey = "CENSORED"
const popup = atob("CENSORED");

async function getAIResponse(classifySettings){
    llamaAIResponse.value = ["Analysing", "Processing"]
    classifyAIResponse.value = ["Analysing", "Processing"]
    // for await (const output of hf.textGenerationStream({
    //     model: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
    //     inputs: '<|system|>\ninput: '+input.replace(/[<|>\\",:]/g,"")+'</s>\nread the input and reply with only one word and it must be one of the following: "safe", "sensitive", "confidential"</s>\n<|assistant|>\nreply: ',
    //     parameters: { max_new_tokens: 250 }
    // }, {
    //     use_cache: false
    // })) {
    //     llamaAIResponse.value = [llamaAIResponse[0], llamaAIResponse[1]+=output.token.text];
    // }
    // await hf.textGeneration({
    //     model: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
    //     inputs: '<|system|>\ninput: '+input.replace(/[<|>\\",:]/g,"")+'</s>\nread the input and reply with only one word and it must be one of the following: "safe", "sensitive", "confidential"</s>\n<|assistant|>\nreply:'
    // }).then(res => {
    //     let answer = res.generated_text.split("reply:")[1];
    //     if (answer.search("confidential") != -1){
    //         answer = "CONFIDENTIAL"
    //     }else if (answer.search("confidential") != -1){
    //         answer = "INTERNAL"
    //     }else{
    //         answer = "None"
    //     }
    //     llamaAIResponse.value = [answer,res.generated_text]
    // });

    await hf.textClassification({
        model: 'distilbert-base-uncased-finetuned-sst-2-english',
        inputs: classifySettings
    }).then(res => {
        console.log(res);
        let positive = 0;
        let negative = 0;
        if (res[0]["label"] == "POSITIVE"){
            positive = res[0]["score"];
            negative = res[1]["score"];
        }else{
            positive = res[1]["score"];
            negative = res[0]["score"];
        }
        llamaAIResponse.value = [( positive > negative ? "safe" : "sensitive"), `positive: ${positive}, negetive: ${negative}`]
    })

    //wait until done, then show result
}
let llamaAIResponse = ref(["None","Empty"]);
let classifyAIResponse = ref(["None","Empty"]);

let stringContent = ref('');
// let classificationResults = ref('');
let classificationResults = ref([]);
let loadingScreen = ref(false);

const parameters = {
  "internal": {
    "location": {
        "value": true,
        "regex": [/location/i]
    },
    "address": {
        "value": true,
        "regex": [/address/i]
    }
  },

  "confidential": {
    "NRIC": {
      "value": true,
      "regex": [/[a-z]\d{7}[a-z]/i]
    },
    "Credit Card": {
        "value": true,
        "regex": [/[0-9]{4}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}/]
    }
  }
};

onMounted(() => {
  // Determine classification level based on parameters
  checkClassification();
});

// Function to add new internal parameters
const addNewInternalParameter = () => {
  const parameterName = prompt("Enter internal parameter name:");
  if (parameterName) {
    const regexPattern = new RegExp(parameterName, 'i');
    parameters.internal[parameterName] = {
      value: true, // You can set a default value if needed
      regex: [regexPattern]
    };
  }
}

const updateParameterValue = (category, paramName, checked) => {
    parameters[category][paramName].value = checked;
}

function checkClassification() {
    // getAIResponse(stringContent.value);

    classificationResults.value = [];   

  // Display string
//   const stringContentDisplay = document.getElementById('string-content-display');
//   if (stringContentDisplay) {
//     stringContentDisplay.textContent = stringContent.value;
//   }

  // determine the lvl
  console.log('Calling checkSensitiveWords with:', stringContent.value, parameters, 'teststring');
//   classificationResults.value = checkSensitiveWords(stringContent.value, parameters, 'teststring');
  const newResults = checkSensitiveWords(stringContent.value, parameters, 'teststring')
//   console.log('Classification Results:', classificationResults.value);
  console.log('Classification Results: ', newResults);

  // add new results to the array
  classificationResults.value = [...classificationResults.value, ...newResults];


  // Display results
//   const classificationResultsDisplay = document.getElementById('classification-results');
//   if (classificationResultsDisplay) {
//     classificationResultsDisplay.innerHTML = classificationResults.value;
//   }
}

import cryptojs from 'crypto-js';
async function encrypt(fileObject, keyName){

    // assume get key from keyname
    let key = "abcdefg";

    // extract file contents
    let contents = "";
    let reader = new FileReader();
    reader.readAsText(fileObject);
    let wait = new Promise((resolve, reject) => {
        reader.onloadend=() => { resolve("done!") }
    });
    await wait;
    contents = reader.result;

    // encrypt content
    let ciphertext = cryptojs.AES.encrypt(contents, key).toString();

    // reconstruct file
    var blob = new Blob([ciphertext], { type: 'text/plain' });
    var file = new File([blob], fileObject.name, {type: "text/plain"});
    return file
}

function hexToString(hex) {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    let charCode = parseInt(hex.substr(i, 2), 16);
    str += String.fromCharCode(charCode);
  }
  return str;
}

async function decrypt(fileObject, keyName){

    // assume get key from keyname
    let key = "abcdefg";

    // extract file contents
    let contents = "";
    let reader = new FileReader();
    reader.readAsText(fileObject);
    let wait = new Promise((resolve, reject) => {
        reader.onloadend=() => { resolve("done!") }
    });
    await wait;
    contents = reader.result;

    // encrypt content
    let plaintext = hexToString(cryptojs.AES.decrypt(contents, key).toString())

    // reconstruct file
    var blob = new Blob([plaintext], { type: 'text/plain' });
    var file = new File([blob], fileObject.name, {type: "text/plain"});
    return file
}

async function onFileChanged($event) {
    loadingScreen.value = true;
    const target = $event.target;
    console.log(target.files[0]);
    const targetFile = target.files[target.files.length-1];
    extractFileContent(targetFile, stringContent, loadingScreen);

    let reader = new FileReader();
    reader.readAsBinaryString(targetFile);
    let wait = new Promise((resolve, reject) => {
        reader.onloadend=() => { resolve("done!") }
    });
    await wait;
    const contents = reader.result;
    console.log(contents)
    var md5 = CryptoJS.MD5(contents).toString();
    console.log(md5)

    let malicious = false;

    const options = {
    method: 'GET',
    url: 'https://www.virustotal.com/api/v3/files/'+md5,
    headers: {accept: 'application/json', 'x-apikey': VTKey}
    };
    axios
    .request(options)
    .then(function (response) {
        if (response.data["data"]["attributes"]["last_analysis_stats"]["malicious"] > 10){
            alert("the file is malicious!");
            malicious = true;
        }else{alert(popup);}
        console.log(response.data["data"]["attributes"]["last_analysis_stats"]);
    })
    .catch(function (error) {
        console.error(error);
        alert(popup);
    });

    // use malicious variable to prevent upload
    if (malicious){}

    // just trying encryption
    // let fileObject = target.files[0];
    // console.log(fileObject);
    // console.log("encryping file result:")
    // let encryptedFile = await encrypt(fileObject,"random");
    // console.log(await encryptedFile.text());

    // console.log("decryping file result:")
    // let decryptedFile = await decrypt(encryptedFile,"random");
    // console.log(await decryptedFile.text());
}

const maskSensitiveContent = (content) => {
  // Check if content >= 2 letters
  if (content && content.length >= 2) {
    // take first and last char
    const firstChar = content.charAt(0);
    const lastChar = content.charAt(content.length - 1);

    // Create a mask string between the first and last characters
    const maskedContent = `${firstChar}${'*'.repeat(content.length - 2)}${lastChar}`;
    
    return maskedContent;
  } else {
    // Return the original content if empty
    return content;
  }
};

onMounted(() => {
  if (active_file.value) {
    extractFileContent(active_file.value, stringContent, loadingScreen)
  }
})


</script>

<template>
    <Loading  v-if="loadingScreen" />
    <div class="w-full">
        <div class="w-11/12 mx-auto border-l-sky-700 border-r-sky-700 border-4 bg-cyan-200/50 backdrop-brightness-50 backdrop-blur my-5 py-2">
            <!-- <h1>This is an classification page</h1> -->
        
            
            <div class="mx-auto px-16 mt-10 grid grid-cols-3 gap-16">

                <div>
                    <!--UPLOAD FILE/FILE DETAILS--->
                    <h2 class="text-2xl text-red-800 font-nasalization font-bold mb-1">File Upload</h2>
                    <div class="flex items-center justify-center">
                        <label for="dropzone-file" class="flex flex-col items-center justify-center rounded-full m-4 w-64 h-64 border-4 border-gray-900 border-dashed cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or TXT</p>
                            </div>
                            <input id="dropzone-file" @change="onFileChanged($event)" type="file" class="hidden" />
                        </label>
                        
                    </div>
                    <router-link to="/Watermark">
                            <button class="mx-auto inline-flex items-center py-2.5 px-4 text-3x1 font-medium text-center text-white bg-red-700 border-2 border-white" style="margin-left: 133px;">
                                PREVIEW
                            </button>
                            </router-link>
                </div>
                
                <div>
                    <p class="text-2xl text-red-800 font-nasalization font-bold mb-1">Contents</p>
                    
                    <div class="my-4 w-full h-64 mb-4 border border-4 border-gray-600 bg-gray-50 dark:bg-gray-800 ">
                        <div class="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                            <label for="comment" class="sr-only">Your comment</label>
                            <textarea id="comment" rows="4" class="h-40 w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Upload file or input content here!" v-model="stringContent" required></textarea>
                        </div>
                        <div class="flex items-center justify-between px-3 py-2 border-t bg-gray-800 border-gray-700">
                            <button class="mx-auto inline-flex items-center py-2.5 px-4 text-3x1 font-medium text-center text-white bg-red-700 border-2 border-white" @click="checkClassification(); getAIResponse(stringContent);">
                                SCAN
                            </button>
                            
                        </div>
                    </div>
                </div>

                <div>     

                    <!--Customizable / default classification method-->
                    <!-- <h2 class="text-2xl text-red-800 font-nasalization font-bold mb-1">Parameters</h2> -->

                    <p class="text-xl text-red-800 font-nasalization font-bold mb-1">Internal Parameters</p>
                    
                    <!-- <Chip chipName="paramName"/> -->
                    <div v-for="(param, paramName) in parameters.internal" :key="paramName">
                        <div class="flex">

                            <p class="text-lg font-bold mr-4">{{ paramName }}</p>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    value="" 
                                    class="sr-only peer" 
                                    v-bind:checked="param.value"
                                    @change="updateParameterValue('internal', paramName, $event.target.checked)"
                                >
                                <!-- Toggle button visual representation -->
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        
                             </label>
                 
                        </div>
                    </div>

                    <p class="text-xl text-red-800 font-nasalization font-bold mb-1 pt-8">Confidential Parameters</p>
                    
                    <!-- <Chip chipName="NIRC"/> -->
                    <div v-for="(param, paramName) in parameters.confidential" :key="paramName">
                        <div class="flex">

                            <p class="text-lg font-bold mr-4">{{ paramName }}</p>
    
                            <!-- Toggle button -->
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    value="" 
                                    class="sr-only peer" 
                                    v-bind:checked="param.value"
                                    @change="updateParameterValue('confidential', paramName, $event.target.checked)"
                                >
                                <!-- Toggle button visual representation -->
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            
                             </label>
                        </div>
                        <!-- <p>Value: {{ param.value ? 'Enabled' : 'Disabled' }}</p> -->
                    </div>
                    <!-- Add button to add new internal parameters -->
                    <button class="mx-auto inline-flex items-center py-2.5 px-4 text-3x1 font-medium text-center text-white bg-red-700 border-2 border-white" style="margin-top: 37px;" @click="addNewInternalParameter">Add New Internal Parameter</button>
                </div>
            </div>
            
            <div class="grid-cols-2 grid my-8 px-16">
            <!--Analysis results?-->
            <div class="my-5 mx-auto">
                <h2 class="text-2xl text-red-800 font-nasalization font-bold mb-1">Summary</h2>
    
                <div class="relative overflow-x-auto my-4">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Method
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Result
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Analysis
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                AI (DistilBERT base uncased)
                                </th>
                                <td class="px-6 py-4">
                                    {{llamaAIResponse[0]}}
                                </td>
                                <td class="px-6 py-4">
                                    {{llamaAIResponse[1]}}
                                </td>
                            </tr>
                            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                AI (Still finding model)
                                </th>
                                <td class="px-6 py-4">
                                    {{classifyAIResponse[0]}}
                                </td>
                                <td class="px-6 py-4">
                                    {{classifyAIResponse[1]}}
                                </td>
                            </tr>
                            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                Rules-Based
                                </th>
                                <td class="px-6 py-4">
                                    {{ classifyAIResponse[1] == "Empty" ? "None" : (classificationResults.length == 0 ? "safe" : "sensitive" ) }}
                                </td>
                                <td class="px-6 py-4">
                                    NA
                                    <!-- {{ classificationResults.length == 0 ? "None" : classificationResults[0].content }} -->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="my-5 mx-auto">
                <h2 class="text-2xl text-red-800 font-nasalization font-bold mb-1">Detailed</h2>
    
                <div class="relative overflow-x-auto my-4">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Parameter
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Result
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Info Detected
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(result, index) in classificationResults" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {{ result.key }}
                                </th>
                                <td class="px-6 py-4">
                                    <!-- No -->
                                    {{ result.type }}
                                </td>
                                <td class="px-6 py-4">
                                    <!-- XXXXXXXXX -->
                                    {{ result.content }}
                                    <!-- {{ maskSensitiveContent(result.content) }} -->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            </div>

        </div>
    </div>

</template>
