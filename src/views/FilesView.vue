<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import ActionBarInclude from '../components/ActionBarInclude.vue'
import FileRow from '../components/FileRow.vue'
import FolderRow from '../components/FolderRow.vue'
import UserModal from '../components/UserModal.vue'
import { get_files, confirm_upload } from '../file_backend.js'
// import { encrypt_string, encrypt_file } from '../encryption.js'
import { add_message } from '../messages.js'
// import { encryptFile } from '../encryption2'
import { encrypt_bytes, encrypt_string, generate_iv, uint8array_to_b64 } from '../encryption_2.js'
import { post_encrypted_file } from '../s3.js'
import { decrypt_filename } from '../file_encryption.js'

let create_folder_open = ref(false)

let files = ref([])
let route = useRoute()
let router = useRouter()
let new_folders = ref([])
let new_folder_name = ref("")

let full_folder = ref(null)

function dragover_handler(e) {
  e.preventDefault();
  return;
}

async function process_new_files(files) {
  for (const i of files) {
    let filename = full_folder.value + i.name

    post_encrypted_file(filename, i, (encrypted_filename) => {
      add_message('success', `Uploading ${filename}`)
      confirm_upload(encrypted_filename)
      update_user_files()
      console.info("File processed: %s", i.name)
      add_message('success', `Uploaded ${filename}`)
    })
  }
}

function drop_handler(e) {
  e.preventDefault();
  let drop_files = e.dataTransfer.files;
  process_new_files(drop_files);
}

function file_input_handler(e) {
  let file_input = e.target
  process_new_files(file_input.files)
}

function update_user_files() {
  let callback = (retrieved_files) => {
    files.value = retrieved_files
    get_folders()
  }
  get_files(callback)
}

function load_folder() {
  let read_path_without_files_re = new RegExp('/files(/.*)?')
  let match = route.path.match(read_path_without_files_re)
  let path = match[1] || '/'
  if (!path.endsWith('/')) {
    path += '/'
  }
  folder.value = path
}

function get_folders() {
  new_folders.value = []

  files.value.forEach((encrypted_filename) => {
    decrypt_filename(encrypted_filename.external_id, (decrypted_filepath) => {
      let separate_path_filename_re = new RegExp('^(.*/)?(.*?)$')
      let match = decrypted_filepath.match(separate_path_filename_re)
      let path = match[1] || ''

      if (path != full_folder.value) {
        let first_following_path_component_re = new RegExp(`^${full_folder.value}(.*?)/(?:.*/)?$`)
        let match = path.match(first_following_path_component_re)
        let first_following_path_component = match[1]
        if (match && !new_folders.value.includes(first_following_path_component)) {
          new_folders.value.push(match[1])
        }
      }
    })
  })
}

function build_folder_url_from_current(folder_name) {
  let folder_params = route.params.folder
  if (typeof(folder_params) == "string") {
    return router.resolve({name: 'files', params: {folder: [folder_name]}})
  }
  else {
    folder_params = folder_params.slice()
    folder_params.push(folder_name)
    return router.resolve({name: 'files', params: {folder: folder_params}})
  }
}

function load_full_folder(route) {
  if (typeof(route.params.folder) == "string") {
    full_folder.value = '/'
  }
  else {
    full_folder.value = '/' + route.params.folder.join('/') + '/'
  }
}

onBeforeRouteUpdate((to) => {
  load_full_folder(to)
  update_user_files()
})

load_full_folder(route)
update_user_files()
</script>

<template>
  <div @dragover="dragover_handler" @drop="drop_handler">
    <ActionBarInclude active_nav="files">
      <main class="min-h-screen flex flex-col">
        <div class="pt-10 pl-10 pb-8 text-xl font-semibold bg-slate-50">
        Files 
      </div>
        <FolderRow v-for="i in new_folders" :href="build_folder_url_from_current(i)" :folder_name="i" />
        <FileRow v-for="f in files" :filename="f.external_id" :folder="full_folder" @reload_files="update_user_files"/>
        <div class="h-full grow gap-y-3 flex flex-col items-center justify-center text-slate-600">
          <span>Drag your files here</span>
          <div class="flex items-center">
            <span class="me-3">Or</span>
            <div class="flex flex-col">
              <button class="text-white font-bold bg-black rounded-sm text-center px-3.5 py-1.5" @click="create_folder_open = !create_folder_open">Create Folder</button>
              <div class="flex" v-if="create_folder_open">
                <input type="text" name="new_folder_name" placeholder="New folder name" class="px-2 border border-blue-600" v-model="new_folder_name">
                <button class="px-3 py-1 bg-green-600 text-white font-bold" @click="router.push(build_folder_url_from_current(new_folder_name))">Go</button>
              </div>
            </div>
          </div>
        </div>

        <UserModal v-if="false">
          <h1>Hello!</h1>
        </UserModal>
      </main>
      <label for="upload_button" class="fixed right-8 bottom-8 w-8 h-8 bg-black text-white rounded-sm text-center">
        <input type="file" id="upload_button" class="absolute -left-8 opacity-0 hover:cursor-pointer" multiple @change="file_input_handler">
        +
      </label>
    </ActionBarInclude>
  </div>
</template>
