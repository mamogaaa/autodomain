import axios from 'axios'

export default () ->
  axios.create
    headers:
      'X-Auth-Email': CONFIG.cloudflare.email
      'X-Auth-Key': CONFIG.cloudflare.key
    transformResponse: axios.defaults.transformResponse.concat (data, headers) ->
      unless data.success
        throw new Error data.errors.map((x) -> "#{x.code} #{x.message}").join '\n\n'
      return data