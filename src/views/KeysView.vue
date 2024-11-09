<script setup>
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
import { ref, onMounted } from 'vue';

import AdvisoryPopup from "../components/AdvisoryPopup.vue"
import ActionBarInclude from '../components/ActionBarInclude.vue'
import { add_and_save_key, set_key, delete_key, get_local_encoded_keys, add_local_encoded_key } from '../encryption_2.js'

let cam = ref(false);
let keys = {};
let selected = ref(false);
let selectedName = "";
let mode = ref("");
let keyName = ref("");
let keyData = ref("");
let blurKey = ref(true);


function showKeyCode(){
    blurKey.value=false;
}
function onDetect(code){
    const useful = JSON.parse(JSON.parse(JSON.stringify(code[0]["rawValue"])));
    console.log(useful["name"])

    // keys[useful["name"]] = useful["data"];
    let key_name = useful["name"]
    let key_data = useful["data"]
    add_local_encoded_key(key_name, key_data)

    cam.value = false;
}

function offCam(){
    cam.value = false;
}
function scanKey(){
    cam.value = true;
}
function deleteKey(){
    console.log(selectedName)
    delete_key(selectedName)
    selected.value = false;
}
function editKey(existedName){
    blurKey.value = true;
    mode.value = "editing";
    console.log(mode.value)
    selectedName = existedName;
    keyName.value = existedName;
    keyData.value = keys[existedName];
    console.log("editing "+existedName);
    selected.value = true;
}
function saveKey(){
    if (keyName.value == ""){return;}

    if (selectedName == ""){
        console.log(mode.value)
        // keys[keyName.value] = keyData.value;
        add_local_encoded_key(keyName.value, keyData.value)
    }else if (selectedName != keyName.value){
        // keys[keyName.value] = keyData.value;
        add_local_encoded_key(keyName.value, keyData.value)
        console.log(selectedName)

        delete_key(selectedName)
    }
    selected.value = false;
}
function setKey() {
  set_key(selectedName)
}
function getDataSrc(){
    return "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="+JSON.stringify({name:selectedName, data: keyData.value});
}
function createKey(){
  let new_key_name = generate_random_name()
  add_and_save_key(new_key_name, () => {
    keyData.value = get_local_encoded_keys()[new_key_name]
  })

    blurKey.value = true;
    mode.value = "create";
    keyName.value = new_key_name
    selected.value = true;
    selectedName = "";
}

function closeKey(){selected.value = false;}

function getLocalKeys(){
    return get_local_encoded_keys()
}

function generate_random_name() {
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz0123456789@#$';
 
    for (let i = 1; i <= 8; i++) {
        let char = Math.floor(Math.random()
            * str.length + 1);
 
        pass += str.charAt(char)
    }
 
    return pass;
}

onMounted(() => keys = get_local_encoded_keys())
</script>
<template>
    <AdvisoryPopup  v-if="true" />
    <ActionBarInclude>
    <div id="streaming" v-if="cam" class="w-screen h-screen absolute bg-black z-10 bg-gray-400/70 top-0">
        <div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 z-10">
            <div class="bg-white rounded flex-none">
            <qrcode-stream @detect="onDetect"></qrcode-stream>
            <button type="button" class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-5" @click="offCam();">STOP</button>
            </div>
        </div>
    </div>

    <div id="key-setting" v-if="selected" class="w-screen h-screen absolute bg-black z-10 bg-gray-400/70 top-0">
        <div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 z-10">
            <div class="bg-white rounded flex-none md:flex">
                <div class="mx-10 my-2 inline-block w-52">
                    <h2 class="text-2xl text-red-800 font-nasalization font-bold my-2">Key Data</h2>

                    <div @click="showKeyCode();" v-if="blurKey" class="h-48 w-48 my-5 rounded bg-black  cursor-pointer p-10">
                        <p class="text-white text-center">CLICK TO SHOW KEY</p>
                    </div>
                    <img v-if="!blurKey" class="h-48 w-48 my-5 rounded" :src="getDataSrc()"/>
                </div>
                <div class="mx-10 my-2 inline-block w-64">
                    <h2 class="text-2xl text-red-800 font-nasalization font-bold my-4">Settings</h2>
                    <input v-model="keyName" type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Key Name" required>
                    <button type="button" class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-5 " @click="deleteKey();">DELETE</button> 
                    <button type="button" class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-5 mx-2" @click="saveKey();">SAVE</button> 
                    <button type="button" class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-5 mx-2" @click="setKey();">SET ACTIVE</button> 
                    <button type="button" class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-5 " @click="closeKey();">ClOSE</button>
                </div>
            </div>
        </div>
    </div>

    <div class="w-full">
        <div class="w-full mx-auto mb-2 py-2">
            
            
            <div class="mx-auto px-16 mt-10 gap-16">
            <div class="h-full w-full bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 p-4">
                <!--generate key, then show qr code (look cool)-->
                <h2 class="text-2xl text-red-800 font-nasalization font-bold my-4">Key Management</h2>

                <button @click="createKey();" type="button" class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">CREATE KEY</button>
                <button @click="scanKey();" type="button" class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">SCAN KEY</button>

                <h2 class="text-2xl text-red-800 font-nasalization font-bold my-4">Stored Keys</h2>

                

                    <div class="m-5 p-5 h-48 w-48 bg-white rounded inline-block" v-if="Object.keys(getLocalKeys()).length == 0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-24 h-24 mx-auto">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        <p class="font-bold w-full text-center my-4 mx-auto text-m">NO KEYS YET</p>
                    </div>
    
                <div v-if="Object.keys(get_local_encoded_keys()).length != 0" v-for="key in Object.keys(get_local_encoded_keys())" class="w-fit inline-block">
                    <div class="m-5 p-5 h-48 w-48 bg-white rounded  hover:shadow-xl cursor-pointer" @click="editKey(key);">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-24 h-24 mx-auto">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                        </svg>
                        <p class="font-bold w-full text-center my-4 mx-auto text-m">{{key}}</p>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
  </ActionBarInclude>
</template>
