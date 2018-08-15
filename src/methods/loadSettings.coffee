import fs from 'fs'
import chalk from 'chalk'

export default loadSettings = ->
  try
    file = fs.readFileSync CONFIG.configFilePath
    file = JSON.parse file
    for field of file
      CONFIG[field] = file[field]
  catch err
    console.log chalk.red "Can't save config file! #{err.toString()}"