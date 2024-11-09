<script setup>
  let props = defineProps(["filename", "folder"])
  let emit = defineEmits(['reload_files'])

  import { ref, onMounted } from 'vue'
  import { useRouter, onBeforeRouteUpdate } from 'vue-router'
  import mime from 'mime'
  import IconThreeDots from './icons/IconThreeDots.vue';
  import { active_file } from '../store/FileStore.js'
  import { channel, confirm_share, get_presigned_for_delete, get_file_get_presigned_url, confirm_delete } from '../file_backend.js'
  // import { decrypt_file, decrypt_string } from '../encryption.js'
  import { add_message } from '../messages.js'
  import { random_b64, b64_to_uint8array, decrypt_string, decrypt_bytes } from '../encryption_2.js'
  import { post_file, get_encrypted_file, get_encrypted_file_iv } from '../s3.js'

  let encrypted_filename = props.filename
  let loaded_folder = props.folder

  let hidden_class = ref("hidden");
  let decrypted_filename = ref(encrypted_filename)
  let decrypted_filepath = ref(null)
  let decrypted_file_url = ref(null)
  let decrypted_file_contents = null
  let router = useRouter()
  let hidden = ""

  function menu_handler() {
    if (hidden_class.value == "") {
      hidden_class.value = "hidden"
    }
    else {
      hidden_class.value = ""
    }
  }

  function set_hidden() {
    hidden = "hidden"
  }

  function set_not_hidden() {
    hidden = ""
  }

  function delete_handler() {
    get_presigned_for_delete(props.filename, (url) => {
      fetch(url, {method: "delete"}).then(() => {
        confirm_delete(props.filename)
        console.info("File deleted: %s", props.filename)
        emit('reload_files')
      })
    })
  }

  function share_handler() {
    let random_filename = random_b64()
    load_decrypted_content((file) => {
      post_file(random_filename, file, {}, () => {
        confirm_share(random_filename)
      })
    })
  }

  function load_decrypted_content(callback) {
    if (!decrypted_file_url.value) {
      get_file_get_presigned_url(props.filename, (url) => {
        get_encrypted_file(url).then(async ([response, base64_iv]) => {
          let file_iv = b64_to_uint8array(base64_iv)
          let response_arraybuffer = await response.arrayBuffer()
          let decrypted_file_data = await decrypt_bytes(response_arraybuffer, file_iv)
          let file = new File([decrypted_file_data], decrypted_filename.value)
          decrypted_file_contents = file

          let blob_url = URL.createObjectURL(file)
          decrypted_file_url.value = blob_url
          add_message('success', 'File decrypted')
          callback(file)
        })
      })
    }
    else {
      callback(decrypted_file_contents)
    }
  }

  function download_decrypted_content() {
    load_decrypted_content(() => window.open(decrypted_file_url.value, '_blank'))
  }

  // Function to initiate file download
  function downloadFile() {
    const link = document.createElement('a');
  link.href = retrieved_files.value;
  link.setAttribute('download', props.filename);
  link.style.display = 'none'; // Hide the link visually
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); // Remove the link after clicking
  }

  function decrypt_filename() {
    get_encrypted_file_iv(encrypted_filename, (iv) => {
      decrypt_string(encrypted_filename, b64_to_uint8array(iv))
        .then(filename => {
          decrypted_filepath.value = filename
          decrypted_filename.value = filename
          file_within_folder()
        })
    })
  }

  function file_within_folder() {
    let separate_path_filename_re = new RegExp('(^.*/)?(.*?)$')
    let match = decrypted_filepath.value.match(separate_path_filename_re)
    let path = match[1] || ''
    decrypted_filename.value = match[2]

    if (path != loaded_folder) {
      set_hidden()
    } else {
      set_not_hidden()
    }
  }

  function wait_for_decryption() {
    if (channel) {
      decrypt_filename()
    }
    else {
      setTimeout(wait_for_decryption, 50)
    }
  }

  function load_classification() {
    load_decrypted_content(file => {
      let mime_type = mime.getType(decrypted_filename.value)
      active_file.value = new File([file], file.name, {type: mime_type})
      router.push({name: 'classification'})
    })
  }

  decrypt_filename()
  onBeforeRouteUpdate(() => {
    loaded_folder = props.folder
    decrypt_filename()
  })
</script>
<template>
  <div class="flex items-center px-4 py-2 rounded-sm transition-shadow hover:shadow-md hover:font-semibold" :class="[hidden]">
    <input type="checkbox" class="mr-4">
    <a class="grow text-red-800 cursor-pointer" :download="decrypted_filename" :href="decrypted_file_url" @click="download_decrypted_content">{{ decrypted_filename }}</a>
    <router-link to="/image">
      <button style="padding-right: 10px;">Image Redactor</button>
    </router-link>
    <button @click="load_classification" style="padding-right: 10px;">Classify</button>
    <button @click="downloadFile" class="download-button" style="color: red; padding-right: 5px;">Download</button> <div class="font-normal"></div>
  <div class="font-normal">
    <button @click="menu_handler" class="pl-4 pr-2 flex items-center"><IconThreeDots /></button>
    <div class="menu z-1 bg-white absolute right-4 grid grid-rows-2" :class="hidden_class">
        <button href="#" class="text-m p-2 hover:font-semibold hover:bg-slate-100" @click="share_handler">Share</button>
        <button href="#" class="text-m p-2 hover:font-semibold hover:bg-slate-100" @click="delete_handler">Delete</button>
    </div>
  </div> 
  </div>
</template>
