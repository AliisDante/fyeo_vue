import { Socket } from 'phoenix'

const http_protocol = 'http://'
const backend_host = 'localhost:4000'

let auth_token_storage_key = 'auth_token'
let auth_token = window.localStorage.getItem(auth_token_storage_key)
let socket = null
let channel = null

function set_auth_token(value) {
  window.localStorage.setItem(auth_token_storage_key, value)
  auth_token = value
}

function login(form) {
  let login_url = '/login'
  let options = { method: 'post', body: form }
  return fetch(http_protocol + backend_host + login_url, options)
    .then((response) => response.json())
    .then((json) => {
      if (json.success) {
        set_auth_token(json.user_token)
        connect_storage_channel()
        return { success: true }
      } else if (json.error) {
        let error_message = json.error_message
        console.error('Login Error: %s', error_message)
        return { success: false, message: error_message }
      }
    })
}

function logout() {
  socket.disconnect(() => null)
  window.localStorage.removeItem(auth_token_storage_key)
  auth_token = null
  channel = null
  socket = null
}

function connect_storage_channel() {
  let socket_url = '/sstorage'
  socket = new Socket('//' + backend_host + socket_url, { params: { token: auth_token } })
  socket.connect()

  channel = socket.channel('storage', {})
  channel
    .join()
    .receive('ok', (resp) => {
      console.log('Joined successfully', resp)
    })
    .receive('error', (resp) => {
      console.log('Unable to join', resp)
    })
}

function get_presigned_for_new_upload(encoded_filename, callback) {
  channel.push("upload_new", {encoded_filename}).receive('ok', callback)
}

function get_presigned_for_delete(filename, callback) {
  channel.push("delete_file", {filename}).receive('ok', callback)
}

function get_files(callback) {
  channel.push("get_user_files").receive('ok', callback)
}

function get_file_get_presigned_url(filename, callback) {
  channel.push("get_file_get_presigned_url", {filename}).receive('ok', callback)
}

function get_file_head_presigned_url(filename, callback) {
  channel.push("get_file_head_presigned_url", {filename}).receive('ok', callback)
}

function confirm_upload(filename) {
  channel.push("confirm_upload", {filename})
}

function confirm_delete(filename) {
  channel.push("confirm_delete", {filename})
}

function confirm_share(filename) {
  channel.push("confirm_share", {filename})
}

export { http_protocol, backend_host, socket, login, logout, connect_storage_channel, auth_token, channel, get_files, get_presigned_for_new_upload, get_file_get_presigned_url, get_file_head_presigned_url, get_presigned_for_delete, confirm_upload, confirm_delete, confirm_share }
