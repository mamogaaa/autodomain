import chalk from 'chalk'
import inquirer from 'inquirer'
import fs from 'fs'
import path from 'path'

import * as _config from './config.coffee'
global.CONFIG = { ..._config }

# methods
import searchDomains from './methods/searchDomains.coffee'
import registerDomain from './methods/registerDomain.coffee'
import addSite from './methods/cloudflare/addSite.coffee'
import loadSettings from './methods/loadSettings.coffee'
import saveSettings from './methods/saveSettings.coffee'

# actions
import * as ACTIONS from './actions/index.coffee'

do ->
  unless fs.existsSync CONFIG.configFilePath
    console.log chalk.yellow 'Config file not found! Creating new one...'
    saveSettings()
  loadSettings()
  while true
    result = await inquirer.prompt [
        type: 'list'
        name: 'action'
        message: 'Select action'
        choices: [
            name: 'Attach cloudflare to domain'
            value: 'addSite'
          ,
            name: 'Register new domain'
            value: 'registerDomain'
          ,
            name: 'Setup cloudflare'
            value: 'setupCloudflare'
          ,
            name: 'Setup freenom'
            value: 'setupFreenom'
          ,
            name: 'Exit'
            value: 'exit'
        ]
    ]

    try
      await ACTIONS[result.action]()
    catch err
      console.log chalk.red err
