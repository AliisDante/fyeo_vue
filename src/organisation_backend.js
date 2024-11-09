import { socket, http_protocol, backend_host } from './file_backend.js'

let organisation_channel = null

function connect_organisation_channel() {
  organisation_channel = socket.channel('organisation', {})
  organisation_channel
    .join()
    .receive('ok', (resp) => {
      console.log('Joined successfully', resp)
    })
    .receive('error', (resp) => {
      console.log('Unable to join', resp)
      organisation_channel.leave()
    })
}

function organisation_signup(form) {
  let signup_url = '/organisation_signup'
  let options = { method: 'post', body: form }
  return fetch(http_protocol + backend_host + signup_url, options)
    .then((response) => response.json())
    .then((json) => {
      if (json.success) {
        return { success: true }
      } else if (json.error) {
        let error_message = json.error_message
        console.error('Signup Error: %s', error_message)
        return { success: false, message: error_message }
      }
    })
}

function create_user(params, callback, error_callback) {
  organisation_channel.push('create_user', params).receive('ok', callback).receive('error', error_callback)
}

function get_users(callback) {
  organisation_channel.push('get_users').receive('ok', callback)
}

function delete_user(username, callback) {
  organisation_channel.push('delete_user', username).receive('ok', callback)
}

export { organisation_signup, create_user, get_users, delete_user, connect_organisation_channel, organisation_channel }
