import axios from 'axios'

export default searchDomains = (domainname = 'test') ->
  res = await axios.get 'https://api.freenom.com/v2/domain/search',
    params:
      domainname: domainname
      domaintype: 'FREE'
      email: CONFIG.freenom.email
      password: CONFIG.freenom.password
  
  { status, result, domain } = res.data
  unless status == 'OK' && result == 'DOMAIN AVAILABLE'
    err = new Error 'DOMAIN UNAVAILABLE'
    err.status = 400
    throw err
  res.data