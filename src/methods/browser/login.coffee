
export default login = (browser) ->
  page = await browser.newPage()
  await page.setViewport({ width: 1680, height: 800 })
  await page.goto 'https://my.freenom.com'
  await page.evaluate ({ freenom }) ->
    username = document.querySelector '#username'
    password = document.querySelector '#password'
    rememberMe = document.querySelector '#rememberMe'
    submit = document.querySelector('#password').parentElement.parentElement.parentElement.querySelector 'input[type=\'submit\']'
    username.value = freenom.email
    password.value = freenom.password
    rememberMe.checked = true
    submit.click()

  , freenom: CONFIG.freenom
  await page.waitForNavigation()
  page