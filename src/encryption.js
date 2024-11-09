
import CryptoJS from "crypto-js";
let keys = {};
let selected_key = 'default'

function getLocalKeys(){
    return JSON.parse(window.localStorage.getItem('keys'))
}

keys = getLocalKeys();

function getKeyValue(keyName){
    return keys[keyName]
}

function setKey(keyName){
    selected_key = keyName
}

async function encrypt_string(plaintext) {
    let base64_plaintext = plaintext
    let key = getKeyValue(selected_key)
    return CryptoJS.AES.encrypt(base64_plaintext, key).toString()
}

async function encrypt_file(fileObject) {

    // assume get key from keyname
    // let key = "abcdefg";
    let key = getKeyValue(selected_key)

    // extract file contents
    let contents = "";
    let reader = new FileReader();
    reader.readAsText(fileObject);
    let wait = new Promise((resolve, reject) => {
        reader.onloadend=() => { resolve("done!") }
    });
    await wait;
    contents = CryptoJS.enc.Base64.stringify(reader.result)

    // encrypt content
    let ciphertext = CryptoJS.AES.encrypt(contents, key).toString();

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

async function decrypt_string(ciphertext) {
    let key = getKeyValue(selected_key)
    return hexToString(CryptoJS.AES.decrypt(ciphertext, key).toString())
}

async function decrypt_file(fileObject){

    // assume get key from keyname
    // let key = "abcdefg";
    let key = getKeyValue(selected_key)

    // extract file contents
    let contents = "";
    let reader = new FileReader();
    reader.readAsText(fileObject);
    let wait = new Promise((resolve, reject) => {
        reader.onloadend=() => { resolve("done!") }
    });
    await wait;
    contents = CryptoJS.enc.Base64.parse(reader.result)

    // encrypt content
    let plaintext = hexToString(CryptoJS.AES.decrypt(contents, key).toString())

    // reconstruct file
    var blob = new Blob([plaintext], { type: 'text/plain' });
    var file = new File([blob], fileObject.name, {type: "text/plain"});
    return file
};

export { selected_key, setKey, encrypt_string, encrypt_file, decrypt_string, decrypt_file }
