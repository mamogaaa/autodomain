import fs from 'fs'
import chalk from 'chalk'

export default saveSettings = ->
  try
    fs.writeFileSync CONFIG.configFilePath, JSON.stringify CONFIG, null, 2
  catch err
    console.log chalk.red "Can't save config file! #{err.toString()}"