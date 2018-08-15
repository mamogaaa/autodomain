import puppeteer from 'puppeteer'
export default createBrowser = ->
  browser = await puppeteer.launch({headless: false})
  process.on 'SIGUSR2', -> browser.close()
  browser