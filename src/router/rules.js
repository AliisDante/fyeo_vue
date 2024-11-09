import { auth_token } from '../file_backend.js'

const paths_exempted_from_auth_token = ['login', 'home', 'about', 'classification']
function only_with_auth_token({ name: path_name }) {
  if (auth_token) {
    return true
  }
  else if (paths_exempted_from_auth_token.includes(path_name)) {
    return true
  }
  else {
    return false
  }
}

export { only_with_auth_token }
