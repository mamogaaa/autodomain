#!/usr/bin/env node 

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var axios = _interopDefault(require('axios'));
var puppeteer = _interopDefault(require('puppeteer'));
var chalk = _interopDefault(require('chalk'));
var sleep = _interopDefault(require('sleep-promise'));
var fs = _interopDefault(require('fs'));
var inquirer = _interopDefault(require('inquirer'));

var freenom = {
  email: '',
  password: '',
  period: '12M',
  profile: {
    firstname: 'Ivan',
    lastname: 'Petrov',
    companyname: 'Ivan Petrov Inc.',
    address1: 'Morozova st. 1',
    zipcode: '167032',
    country: 'RU',
    city: 'Siktivkar',
    stateselect: 'RU-KO',
    phonenr: '9172342376'
  }
};

var cloudflare = {
  nameservers: ['meera.ns.cloudflare.com', 'west.ns.cloudflare.com'],
  email: '',
  key: ''
};

var configFilePath = path.join(require('os').homedir(), 'autodomain.config.json');

var _config = /*#__PURE__*/Object.freeze({
  freenom: freenom,
  cloudflare: cloudflare,
  configFilePath: configFilePath
});

var searchDomains;

var searchDomains$1 = searchDomains = async function(domainname = 'test') {
  var domain, err, res, result, status;
  res = (await axios.get('https://api.freenom.com/v2/domain/search', {
    params: {
      domainname: domainname,
      domaintype: 'FREE',
      email: CONFIG.freenom.email,
      password: CONFIG.freenom.password
    }
  }));
  ({status, result, domain} = res.data);
  if (!(status === 'OK' && result === 'DOMAIN AVAILABLE')) {
    err = new Error('DOMAIN UNAVAILABLE');
    err.status = 400;
    throw err;
  }
  return res.data;
};

var createBrowser;

var createBrowser$1 = createBrowser = async function() {
  var browser;
  browser = (await puppeteer.launch({
    headless: false
  }));
  process.on('SIGUSR2', function() {
    return browser.close();
  });
  return browser;
};

var login;

var login$1 = login = async function(browser) {
  var page;
  page = (await browser.newPage());
  await page.setViewport({
    width: 1680,
    height: 800
  });
  await page.goto('https://my.freenom.com');
  await page.evaluate(function({freenom}) {
    var password, rememberMe, submit, username;
    username = document.querySelector('#username');
    password = document.querySelector('#password');
    rememberMe = document.querySelector('#rememberMe');
    submit = document.querySelector('#password').parentElement.parentElement.parentElement.querySelector('input[type=\'submit\']');
    username.value = freenom.email;
    password.value = freenom.password;
    rememberMe.checked = true;
    return submit.click();
  }, {
    freenom: CONFIG.freenom
  });
  await page.waitForNavigation();
  return page;
};

var login$2;

var registerDomain = login$2 = async function(page, domainname) {
  await page.goto('https://my.freenom.com/domains.php');
  await page.evaluate(function({freenom, domainname}) {
    var dinput, submit;
    dinput = document.querySelector('#domainForm input');
    submit = document.querySelector('#domainForm a');
    dinput.value = domainname;
    return submit.click();
  }, {
    freenom: CONFIG.freenom,
    domainname: domainname
  });
  await page.waitForSelector('#targetForFix > div > div > div > h2.succes > a');
  await page.evaluate(function() {
    var checkout;
    console.log(checkout = document.querySelector('#targetForFix > div > div > div > h2.succes > a'));
    return checkout.click();
  });
  await page.waitForNavigation();
  await page.evaluate(function({cloudflare, freenom}) {
    var dnsInputs;
    document.querySelector('#domainconfig > tbody > tr > td.usage > ul > li.useDNSList > div.freenomBtn.useDNS').click();
    document.querySelector('#domainconfig > tbody > tr > td.usage > ul > li.useDNSList.active > div.wrapperDNS > ul > li.useOwnDNS > div.freenomBtn.useOwnDNS').click();
    dnsInputs = document.querySelectorAll('.wrapperOwnDNS .dnsname_input');
    dnsInputs[0].value = cloudflare.nameservers[0];
    return dnsInputs[1].value = cloudflare.nameservers[1];
  }, {
    cloudflare: CONFIG.cloudflare,
    freenom: CONFIG.freenom
  });
  try {
    await page.waitForSelector('.select_period');
    await page.evaluate(function({cloudflare, freenom}) {
      var periodSelector;
      periodSelector = document.querySelector('.select_period');
      return periodSelector.value = freenom.period;
    }, {
      cloudflare: CONFIG.cloudflare,
      freenom: CONFIG.freenom
    });
  } catch (error) {
    console.log(chalk.red("Can't change registration period!"));
  }
  await page.evaluate(function() {
    return document.querySelector('#configure_submit_button').click();
  });
  await page.waitForNavigation();
  await page.waitForSelector('#firstname');
  await page.evaluate(function({profile}) {
    document.querySelector('#firstname').value = profile.firstname;
    document.querySelector('#lastname').value = profile.lastname;
    document.querySelector('#companyname').value = profile.companyname;
    document.querySelector('#address1').value = profile.address1;
    document.querySelector('#zipcode').value = profile.zipcode;
    document.querySelector('#country').value = profile.country;
    setTimeout(function() {
      document.querySelector('#city').value = profile.city;
      return document.querySelector('#phonenr').value = profile.phonenr;
    }, 500);
    return setTimeout(function() {
      document.querySelector('#stateselect').value = profile.stateselect;
      document.querySelector('#accepttos').checked = true;
      return document.querySelector('#formSubmit').click();
    }, 1000);
  }, {
    profile: CONFIG.freenom.profile
  });
  await page.waitForNavigation();
  return page;
};

async function registerDomain$1(domainname = 'test') {
  var browser, page, result;
  ({result} = (await searchDomains$1(domainname)));
  browser = (await createBrowser$1());
  page = (await login$1(browser));
  await registerDomain(page, domainname);
  return browser.close();
}

function request() {
  return axios.create({
    headers: {
      'X-Auth-Email': CONFIG.cloudflare.email,
      'X-Auth-Key': CONFIG.cloudflare.key
    },
    transformResponse: axios.defaults.transformResponse.concat(function(data, headers) {
      if (!data.success) {
        throw new Error(data.errors.map(function(x) {
          return `${x.code} ${x.message}`;
        }).join('\n\n'));
      }
      return data;
    })
  });
}

var addSite;

var addSite$1 = addSite = async function(domainname = 'test.com') {
  var res;
  res = (await request().post('https://api.cloudflare.com/client/v4/zones', {
    name: domainname
  }));
  console.log(chalk.green(`Zone ${domainname} has been successfully added!`));
  return res.data;
};

var loadSettings;

var loadSettings$1 = loadSettings = function() {
  var err, field, file, results;
  try {
    file = fs.readFileSync(CONFIG.configFilePath);
    file = JSON.parse(file);
    results = [];
    for (field in file) {
      results.push(CONFIG[field] = file[field]);
    }
    return results;
  } catch (error) {
    err = error;
    return console.log(chalk.red(`Can't save config file! ${err.toString()}`));
  }
};

var saveSettings;

var saveSettings$1 = saveSettings = function() {
  var err;
  try {
    return fs.writeFileSync(CONFIG.configFilePath, JSON.stringify(CONFIG, null, 2));
  } catch (error) {
    err = error;
    return console.log(chalk.red(`Can't save config file! ${err.toString()}`));
  }
};

async function setupCloudflare() {
  var email, key;
  ({email, key} = (await inquirer.prompt([
    {
      type: 'input',
      name: 'email',
      default: CONFIG.cloudflare.email,
      message: 'Enter cloudflare email'
    },
    {
      type: 'input',
      name: 'key',
      default: CONFIG.cloudflare.key,
      message: 'Enter cloudflare key'
    }
  ])));
  CONFIG.cloudflare.email = email;
  CONFIG.cloudflare.key = key;
  return (await saveSettings$1());
}

var _addSite;

var addSite$2 = _addSite = async function(domainname) {
  var err, timeout, tryAgain;
  if (!(CONFIG.cloudflare.email && CONFIG.cloudflare.key)) {
    await setupCloudflare();
  }
  if (!domainname) {
    ({domainname} = (await inquirer.prompt([
      {
        type: 'input',
        name: 'domainname',
        message: 'Enter domain name'
      }
    ])));
  }
  while (true) {
    try {
      await addSite$1(domainname);
      return;
    } catch (error) {
      err = error;
      console.log(chalk.red(err.toString()));
      ({tryAgain} = (await inquirer.prompt([
        {
          type: 'confirm',
          name: 'tryAgain',
          message: 'Try again in n minutes?'
        }
      ])));
      if (!tryAgain) {
        return;
      }
      ({timeout} = (await inquirer.prompt([
        {
          type: 'input',
          name: 'timeout',
          default: CONFIG.cloudflare.timeout || 0,
          message: 'Enter timeout in minutes'
        }
      ])));
      CONFIG.cloudflare.timeout = timeout;
      await saveSettings$1();
      await sleep(timeout * 60 * 1000);
    }
  }
};

async function setupFreenom() {
  var email, password;
  ({email, password} = (await inquirer.prompt([
    {
      type: 'input',
      name: 'email',
      default: CONFIG.freenom.email,
      message: 'Enter freenom email'
    },
    {
      type: 'password',
      name: 'password',
      default: CONFIG.freenom.password,
      message: 'Enter freenom password'
    }
  ])));
  CONFIG.freenom.email = email;
  CONFIG.freenom.password = password;
  return (await saveSettings$1());
}

async function registerDomain$2(domainname) {
  var attachCloudflare, err, tryAgain;
  if (!(CONFIG.freenom.email && CONFIG.freenom.password)) {
    await setupFreenom();
  }
  if (!domainname) {
    ({domainname} = (await inquirer.prompt([
      {
        type: 'input',
        name: 'domainname',
        message: 'Enter domain name'
      }
    ])));
  }
  while (true) {
    try {
      await registerDomain$1(domainname);
      ({attachCloudflare} = (await inquirer.prompt([
        {
          type: 'confirm',
          name: 'attachCloudflare',
          message: 'Would you like to attach cloudflare?'
        }
      ])));
      if (attachCloudflare) {
        await addSite$2(domainname);
      }
      return;
    } catch (error) {
      err = error;
      console.log(chalk.red(err.toString()));
      ({tryAgain} = (await inquirer.prompt([
        {
          type: 'confirm',
          name: 'tryAgain',
          default: false,
          message: 'Try again?'
        }
      ])));
      if (!tryAgain) {
        return;
      }
    }
  }
}

var exit = function() {
  return process.exit();
};

var ACTIONS = /*#__PURE__*/Object.freeze({
  addSite: addSite$2,
  registerDomain: registerDomain$2,
  setupFreenom: setupFreenom,
  setupCloudflare: setupCloudflare,
  exit: exit
});

global.CONFIG = {..._config};

(async function() {
  var err, result, results;
  if (!fs.existsSync(CONFIG.configFilePath)) {
    console.log(chalk.yellow('Config file not found! Creating new one...'));
    saveSettings$1();
  }
  loadSettings$1();
  results = [];
  while (true) {
    result = (await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Select action',
        choices: [
          {
            name: 'Attach cloudflare to domain',
            value: 'addSite'
          },
          {
            name: 'Register new domain',
            value: 'registerDomain'
          },
          {
            name: 'Setup cloudflare',
            value: 'setupCloudflare'
          },
          {
            name: 'Setup freenom',
            value: 'setupFreenom'
          },
          {
            name: 'Exit',
            value: 'exit'
          }
        ]
      }
    ]));
    try {
      results.push((await ACTIONS[result.action]()));
    } catch (error) {
      err = error;
      results.push(console.log(chalk.red(err)));
    }
  }
  return results;
})();
