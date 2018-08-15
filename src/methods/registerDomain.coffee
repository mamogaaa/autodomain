import axios from 'axios'

import searchDomains from './searchDomains.coffee'
import createBrowser from './browser/createBrowser.coffee'
import login from './browser/login.coffee'
import registerDomain from './browser/registerDomain.coffee'

export default (domainname = 'test') ->
  { result } = await searchDomains domainname
  browser = await createBrowser()
  page = await login browser
  await registerDomain page, domainname
  browser.close()