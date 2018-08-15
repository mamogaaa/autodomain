import inquirer from 'inquirer'
import addSite from '../methods/cloudflare/addSite.coffee'
import saveSettings from '../methods/saveSettings.coffee'
import setupCloudflare from './setupCloudflare.coffee'
import chalk from 'chalk'
import sleep from 'sleep-promise'

export default _addSite = (domainname) ->

  unless CONFIG.cloudflare.email && CONFIG.cloudflare.key
    await setupCloudflare()

  unless domainname
    { domainname } = await inquirer.prompt [
        type: 'input'
        name: 'domainname'
        message: 'Enter domain name'
    ]

  while true
    try
      await addSite domainname
      return
    catch err
      console.log chalk.red err.toString()
      { tryAgain } = await inquirer.prompt [
          type: 'confirm'
          name: 'tryAgain'
          message: 'Try again in n minutes?'
      ]
      unless tryAgain then return
      { timeout } = await inquirer.prompt [
          type: 'input'
          name: 'timeout'
          default: CONFIG.cloudflare.timeout || 0
          message: 'Enter timeout in minutes'
      ]
      CONFIG.cloudflare.timeout = timeout
      await saveSettings()
      await sleep timeout * 60 * 1000
      
