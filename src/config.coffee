import path from 'path'

export freenom =
  email: ''
  password: ''
  period: '12M'
  profile:
    firstname: 'Ivan'
    lastname: 'Petrov'
    companyname: 'Ivan Petrov Inc.'
    address1: 'Morozova st. 1'
    zipcode: '167032'
    country: 'RU'
    city: 'Siktivkar'
    stateselect: 'RU-KO'
    phonenr: '9172342376'

export cloudflare =
  nameservers: ['meera.ns.cloudflare.com', 'west.ns.cloudflare.com']
  email: ''
  key: ''

export configFilePath = path.join require('os').homedir(), 'autodomain.config.json'