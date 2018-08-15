import chalk from 'chalk'
import sleep from 'sleep-promise'

export default login = (page, domainname) ->
  await page.goto 'https://my.freenom.com/domains.php'
  await page.evaluate ({ freenom, domainname }) ->
    dinput = document.querySelector '#domainForm input'
    submit = document.querySelector '#domainForm a'
    dinput.value = domainname
    submit.click()
  ,
    freenom: CONFIG.freenom
    domainname: domainname
  await page.waitForSelector '#targetForFix > div > div > div > h2.succes > a'
  await page.evaluate () ->
    console.log checkout = document.querySelector '#targetForFix > div > div > div > h2.succes > a'
    checkout.click()
  await page.waitForNavigation()
  await page.evaluate ({ cloudflare, freenom }) ->
    document.querySelector('#domainconfig > tbody > tr > td.usage > ul > li.useDNSList > div.freenomBtn.useDNS').click()
    document.querySelector('#domainconfig > tbody > tr > td.usage > ul > li.useDNSList.active > div.wrapperDNS > ul > li.useOwnDNS > div.freenomBtn.useOwnDNS').click()
    dnsInputs = document.querySelectorAll('.wrapperOwnDNS .dnsname_input')
    dnsInputs[0].value = cloudflare.nameservers[0]
    dnsInputs[1].value = cloudflare.nameservers[1]
  ,
    cloudflare: CONFIG.cloudflare
    freenom: CONFIG.freenom
  try
    await page.waitForSelector('.select_period')
    await page.evaluate ({ cloudflare, freenom }) ->
      periodSelector = document.querySelector('.select_period')
      periodSelector.value = freenom.period
    ,
      cloudflare: CONFIG.cloudflare
      freenom: CONFIG.freenom
  catch err
    console.log chalk.red "Can't change registration period!"
  await page.evaluate ->
    document.querySelector('#configure_submit_button').click()
  await page.waitForNavigation()
  await page.waitForSelector('#firstname')
  await page.evaluate ({ profile }) ->
    document.querySelector('#firstname').value = profile.firstname
    document.querySelector('#lastname').value = profile.lastname
    document.querySelector('#companyname').value = profile.companyname
    document.querySelector('#address1').value = profile.address1
    document.querySelector('#zipcode').value = profile.zipcode
    document.querySelector('#country').value = profile.country
    setTimeout ->
      document.querySelector('#city').value = profile.city
      document.querySelector('#phonenr').value = profile.phonenr
    , 500
    setTimeout ->
      document.querySelector('#stateselect').value = profile.stateselect
      document.querySelector('#accepttos').checked = true
      document.querySelector('#formSubmit').click()
    
    , 1000
  , profile: CONFIG.freenom.profile
  await page.waitForNavigation()
  page