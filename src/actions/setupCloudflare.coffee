import inquirer from 'inquirer'
import saveSettings from '../methods/saveSettings.coffee'

export default ->
  { email, key } = await inquirer.prompt [
      type: 'input'
      name: 'email'
      default: CONFIG.cloudflare.email
      message: 'Enter cloudflare email'
    ,
      type: 'input'
      name: 'key'
      default: CONFIG.cloudflare.key
      message: 'Enter cloudflare key'
  ]
  CONFIG.cloudflare.email = email
  CONFIG.cloudflare.key = key
  await saveSettings()