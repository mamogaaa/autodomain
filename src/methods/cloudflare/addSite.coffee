import request from './request.coffee'
import chalk from 'chalk'

export default addSite = (domainname = 'test.com') ->
  res = await request().post 'https://api.cloudflare.com/client/v4/zones',
    name: domainname
  console.log chalk.green "Zone #{domainname} has been successfully added!"
  res.data