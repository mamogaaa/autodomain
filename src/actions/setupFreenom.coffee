import inquirer from 'inquirer'
import saveSettings from '../methods/saveSettings.coffee'

export default ->
  { email, password } = await inquirer.prompt [
      type: 'input'
      name: 'email'
      default: CONFIG.freenom.email
      message: 'Enter freenom email'
    ,
      type: 'password'
      name: 'password'
      default: CONFIG.freenom.password
      message: 'Enter freenom password'
  ]
  CONFIG.freenom.email = email
  CONFIG.freenom.password = password
  await saveSettings()