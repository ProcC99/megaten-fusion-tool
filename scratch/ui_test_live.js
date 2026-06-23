const puppeteer = require('puppeteer-core');

(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9222/json/version');
    const data = await res.json();
    const webSocketDebuggerUrl = data.webSocketDebuggerUrl;

    const browser = await puppeteer.connect({ browserWSEndpoint: webSocketDebuggerUrl, defaultViewport: null });
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    console.log("Navigating to LIVE skill recipe page...");
    await page.goto('https://procc99.github.io/megaten-fusion-tool/#/dso/skill-recipe', {waitUntil: 'networkidle2'});

    console.log("Typing Gagyson...");
    await page.waitForSelector('input.demon-search-input');
    await page.type('input.demon-search-input', 'Gagyson');
    await page.waitForSelector('.suggestion-item');
    await page.click('.suggestion-item');

    console.log("Selecting Mabufu...");
    await page.waitForSelector('.free-slot');
    await page.click('.free-slot');
    await page.waitForSelector('input.skill-search-input');
    await page.type('input.skill-search-input', 'Mabufu');
    await page.waitForSelector('.skill-suggestion-item');
    await page.click('.skill-suggestion-item');

    console.log("Clicking Generate...");
    await page.waitForSelector('button.btn-generate');
    await page.click('button.btn-generate');

    await new Promise(r => setTimeout(r, 2000));
    
    console.log("Done!");
    await page.close();
    process.exit(0);
  } catch (err) {
    console.error("Failed!", err);
    process.exit(1);
  }
})();
