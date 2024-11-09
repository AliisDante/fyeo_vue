import { get_encrypted_file_iv } from './s3.js'
import { b64_to_uint8array, decrypt_string } from './encryption_2.js'

function decrypt_filename(encrypted_filename, callback) {
  get_encrypted_file_iv(encrypted_filename, (iv) => {
    decrypt_string(encrypted_filename, b64_to_uint8array(iv))
      .then(callback)
  })
}

export { decrypt_filename }
