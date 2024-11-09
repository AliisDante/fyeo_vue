let local_storage_key = 'keys'

let key = null

function get_local_encoded_keys() {
  return JSON.parse(window.localStorage.getItem(local_storage_key)) || {}
}

function add_local_encoded_key(key_name, key_data) {
  let jwk_keys = get_local_encoded_keys()
  jwk_keys[key_name] = key_data
  window.localStorage.setItem(local_storage_key, JSON.stringify(jwk_keys))
}

function delete_key(key_name) {
  let jwk_keys = get_local_encoded_keys()
  delete jwk_keys[key_name]
  window.localStorage.setItem(local_storage_key, JSON.stringify(jwk_keys))
}

function add_and_save_key(key_name, callback) {
  window.crypto.subtle.generateKey({name: "AES-GCM", length: 256}, true, ["encrypt", "decrypt"])
    .then(generated_key => {
      return window.crypto.subtle.exportKey('jwk', generated_key)
    })
    .then(encoded_key => {
      add_local_encoded_key(key_name, encoded_key)
      callback()
    })
}

function set_key(key_name) {
  let jwk_keys = get_local_encoded_keys()
  let selected_jwk_key = jwk_keys[key_name]
  window.crypto.subtle.importKey('jwk', selected_jwk_key, {name: "AES-GCM"}, true, ["encrypt", "decrypt"]).then(decoded_key => {
    key = decoded_key
  })
}

function generate_iv() {
  let iv = new Uint8Array(12)
  window.crypto.getRandomValues(iv)
  return iv
}

function random_b64() {
  return uint8array_to_b64(generate_iv())
}

function uint8array_to_b64(uint8_array) {
  let binary_string = ""
  for (let i of uint8_array) {
    binary_string += String.fromCharCode(i)
  }

  let b64_string = btoa(binary_string)
  return b64_string
}

function b64_to_uint8array(b64_string) {
  let binary_string = atob(b64_string)
  let uint8_array = new Uint8Array(binary_string.length)
  for (let i = 0; i < binary_string.length; i++) {
    uint8_array[i] = binary_string.charCodeAt(i)
  }
  return uint8_array
}

async function encrypt_bytes(data, iv) {
  return await window.crypto.subtle.encrypt({name: "AES-GCM", iv: iv}, key, data)
}

async function encrypt_string(input_string, iv) {
  let text_encoder = new TextEncoder()
  let input_uint8_array = text_encoder.encode(input_string)

  let out_array_buffer = await encrypt_bytes(input_uint8_array, iv)
  let out_uint8_array = new Uint8Array(out_array_buffer)

  return uint8array_to_b64(out_uint8_array)
}

async function decrypt_bytes(data, iv) {
  return window.crypto.subtle.decrypt({name: "AES-GCM", iv: iv}, key, data)
}

async function decrypt_string(encrypted_string_b64, iv) {
  let encrypted_binary_bytes = b64_to_uint8array(encrypted_string_b64)

  let out_array_buffer = await decrypt_bytes(encrypted_binary_bytes, iv)

  let text_decoder = new TextDecoder("utf-8")
  return text_decoder.decode(out_array_buffer)
}

function input_string_to_codepoints(input_string) {
  let codepoint_array = []
  for (let i of input_string) {
    codepoint_array.push(i.codePointAt(0))
  }
  return codepoint_array
}

function codepoints_to_output_string(codepoints) {
  let output_string = ""
  for (let i of codepoints) {
    output_string += String.fromCodePoint(i)
  }
  return output_string
}

function initialise() {
  let default_key = get_local_encoded_keys().default
  if (!default_key) {
    add_and_save_key('default', () => {
      set_key('default')
    })
  }
  set_key('default')
}

initialise()

export { generate_iv, random_b64, uint8array_to_b64, b64_to_uint8array, encrypt_bytes, decrypt_bytes, input_string_to_codepoints, codepoints_to_output_string, encrypt_string, decrypt_string, add_and_save_key, set_key, get_local_encoded_keys, add_local_encoded_key, delete_key }
