import { generate_iv, uint8array_to_b64, encrypt_string, encrypt_bytes } from './encryption_2.js'
import { get_file_head_presigned_url, get_presigned_for_new_upload } from './file_backend.js'

const S3_HEADER_IV = "x-amz-meta-e2ee-iv"

async function post_encrypted_file(filename, file_obj, callback) {
  let file_iv = generate_iv()
  let b64_iv = uint8array_to_b64(file_iv)

  let encrypted_filename = await encrypt_string(filename, file_iv)
  let encrypted_file_data = await encrypt_bytes(await file_obj.arrayBuffer(), file_iv)

  let additional_data = {}
  additional_data[S3_HEADER_IV] = b64_iv

  post_file(encrypted_filename, encrypted_file_data, additional_data, (filename, response) => {
    callback(filename, file_iv, response)
  })
}

async function post_file(filename, file_obj, additional_form_data, callback) {

  get_presigned_for_new_upload(filename, async ({url, fields}) => {
    let form_data = new FormData()
    form_data.set(S3_HEADER_IV, "")

    for (const i in fields) {
      form_data.set(i, fields[i])
    }

    for (const j in additional_form_data) {
      form_data.set(j, additional_form_data[j])
    }

    form_data.set("file", new Blob([file_obj]))

    let response = await fetch(url, {method: "post", body: form_data})

    callback(filename, response)
  })
}

async function get_encrypted_file(url) {
  let response = await fetch(url)
  let iv = response.headers.get(S3_HEADER_IV)
  return [response, iv]
}

function get_encrypted_file_iv(filename, callback) {
  get_file_head_presigned_url(filename, async (url) => {
    let response = await fetch(url, {method: "head"})
    let file_iv = response.headers.get(S3_HEADER_IV)
    callback(file_iv)
    return file_iv
  })
}

export { post_file, post_encrypted_file, get_encrypted_file, get_encrypted_file_iv }
