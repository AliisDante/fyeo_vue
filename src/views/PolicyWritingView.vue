<script setup>
import { ref, onMounted } from 'vue';
import { checkSensitiveWords } from "../wordcheck";
import extractFileContent from "../getFileContents" 
import Chip from "../components/Chip.vue";
import Loading from "../components/Loading.vue"
import ActionBarInclude from "../components/ActionBarInclude.vue"

import { HfInference } from '@huggingface/inference'

const hf = new HfInference('CENSORED')

async function getAIResponse(input){
    llamaAIResponse.value = "analysing"
    loadingScreen.value = true;
    console.log(llamaAIResponse.value)
    // for await (const output of hf.textGenerationStream({
    //     model: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
    //     inputs: '<|system|>\ninput: '+input.replace(/[<|>\\",:]/g,"")+'</s>\nread the input and reply with only one word and it must be one of the following: "safe", "sensitive", "confidential"</s>\n<|assistant|>\nreply: ',
    //     parameters: { max_new_tokens: 250 }
    // }, {
    //     use_cache: false
    // })) {
    //     llamaAIResponse.value = [llamaAIResponse[0], llamaAIResponse[1]+=output.token.text];
    // }
    await hf.textGeneration({
        model: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
        inputs: input+' can be rewritten as '
    }).then(res => {
        let answer = res.generated_text;
        console.log(answer);
        llamaAIResponse.value = answer;
        text1.value = answer;
        loadingScreen.value = false;
    });
    console.log(llamaAIResponse.value)

    //wait until done, then show result
    //policy is to ensure system availability, the threats are malware this policy applies to employees
}
let llamaAIResponse = ref("");

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
    }
  }
};

onMounted(() => {
  // Determine classification level based on parameters
  checkClassification();
});

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

let text1 = ref("")
</script>

<template>
    <Loading  v-if="loadingScreen" />
    <ActionBarInclude>
    <div class="w-full">
        <div class="w-11/12 mx-auto mb-5 py-2">
            <div class="mx-auto px-16 mt-10">
            <h2 class="text-2xl text-red-800 font-nasalization font-bold mb-1">Context</h2>
            <h3>Security policies are complicated, and as a business you need them to ensure safeguards are in place. We are here to break it down for you, even providing you an AI assistant when you need it! This tool focuses on <b>non-technical security practices</b> such acceptable use and employee training.</h3>
            </div>
            <div class="mx-auto px-16 mt-10 grid grid-cols-2 gap-16">
                <div>
                    <h2 class="text-2xl text-red-800 font-nasalization font-bold mb-10">Step-by-step Guide</h2>

                    <h4>Section 1 - Purpose and scope</h4>
                    <ul>
                      <li class="list-disc">What are the primary goals of this security policy? (e.g., protecting sensitive data, ensuring system availability, complying with regulations)</li>
                      <li class="list-disc">What are the main risks and threats this policy aims to address?</li>
                      <li class="list-disc">What is the scope of this policy? (e.g., does it apply to all employees, contractors, systems, data types?)</li>
                      <li class="list-disc">Who is the intended audience for this policy?</li>
                    </ul>
                    <textarea v-model="text1" id="message" rows="4" class="block p-5 my-5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your policy"></textarea>
                    <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mb-10" @click="getAIResponse(text1)">Rewrite with AI</button>

                    <h4>Section 2 - Acceptable Use</h4>
                    <textarea v-model="text2" id="message" rows="4" class="block p-5 my-5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your policy"></textarea>
                    <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mb-10">Rewrite with AI</button>

                    <h4>Section 3 - Security Awareness Training</h4>
                    <textarea v-model="text3" id="message" rows="4" class="block p-5 my-5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your policy"></textarea>
                    <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mb-10">Rewrite with AI</button>

                    <h4>Section 4 - Incident Response</h4>
                    <textarea v-model="text4" id="message" rows="4" class="block p-5 my-5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your policy"></textarea>
                    <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mb-10">Rewrite with AI</button>
                </div>
                <div>
                    <h2 class="text-2xl text-red-800 font-nasalization font-bold mb-1">Crafted Security Policy</h2>
                    <h2 class="border-2 border-black w-full h-64" rows="100%" cols="100%">
                      Purpose and scope<br/><br/>
                      {{text1}}<br/><br/>
                      Acceptable Use<br/><br/>
                      Security Awarness Training<br/><br/>
                      Incidence Response
                    </h2>
                </div>
            </div>

        </div>
    </div>
    </ActionBarInclude>

</template>
