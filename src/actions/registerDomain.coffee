import inquirer from 'inquirer'
import addSite from './addSite.coffee'
import registerDomain from '../methods/registerDomain.coffee'
import saveSettings from '../methods/saveSettings.coffee'
import setupFreenom from './setupFreenom.coffee'
import chalk from 'chalk'
import sleep from 'sleep-promise'

export default (domainname) ->

  unless CONFIG.freenom.email && CONFIG.freenom.password
    await setupFreenom()

  unless domainname
    { domainname } = await inquirer.prompt [
        type: 'input'
        name: 'domainname'
        message: 'Enter domain name'
    ]

  while true
    try
      await registerDomain domainname
      { attachCloudflare } = await inquirer.prompt [
          type: 'confirm'
          name: 'attachCloudflare'
          message: 'Would you like to attach cloudflare?'
      ]
      if attachCloudflare
        await addSite domainname
      return
    catch err
      console.log chalk.red err.toString()
      { tryAgain } = await inquirer.prompt [
          type: 'confirm'
          name: 'tryAgain'
          default: false
          message: 'Try again?'
      ]
      unless tryAgain then return
