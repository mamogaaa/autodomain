import addSite from './addSite.coffee'
import registerDomain from './registerDomain.coffee'
import setupFreenom from './setupFreenom.coffee'
import setupCloudflare from './setupCloudflare.coffee'

export { addSite, registerDomain, setupFreenom, setupCloudflare }

export exit = ->
  process.exit()