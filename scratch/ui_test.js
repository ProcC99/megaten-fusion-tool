const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });

  console.log("Navigating to home page...");
  await page.goto('http://localhost:4200/');
  
  try {
    console.log("Clicking Devil Survivor Overclocked...");
    await page.waitForSelector('a[href="/dso/demons"]', { timeout: 10000 });
    await page.click('a[href="/dso/demons"]');
    
    console.log("Waiting for app navigation...");
    // The DSO module should load
    await page.waitForSelector('.nav-links a', { timeout: 10000 });
    
    console.log("Clicking Skill Recipe Generator...");
    // Find the link that says Skill Recipe
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      const target = links.find(l => l.textContent.includes('Skill Recipe'));
      if (target) target.click();
    });
    
    // Wait for the app to load
    await page.waitForSelector('app-smt-demon-list input', { timeout: 10000 });
    
    console.log("Setting Target Demon...");
    // First demon list is the target demon
    const inputs = await page.$$('app-smt-demon-list input');
    await inputs[0].type('Gagyson');
    await page.waitForSelector('ul.suggestions li');
    const suggestions = await page.$$('ul.suggestions li');
    await suggestions[0].click();

    console.log("Setting Required Skill...");
    const skillInputs = await page.$$('app-smt-skill-list input');
    await skillInputs[0].type('Taunt');
    await page.waitForSelector('ul.suggestions li');
    const skillSuggestions = await page.$$('ul.suggestions li');
    await skillSuggestions[0].click();

    console.log("Adding 5 Owned Demons...");
    const addOwnedBtn = await page.$('button.add-btn');
    for (let i = 0; i < 5; i++) {
      await addOwnedBtn.click();
    }

    // The newly added owned demons are the inputs from index 1 to 5 (since index 0 is target)
    const demons = [
      { name: 'Pixie', skills: 'Zio, Dia' },
      { name: 'Slime', skills: 'Lunge, Life Bonus' },
      { name: 'Poltergeist', skills: 'Agi, Bufu' },
      { name: 'Ogre', skills: 'Tarukaja, Power Punch' },
      { name: 'Angel', skills: 'Hama, Patra, Lullaby' }
    ];

    for (let i = 0; i < 5; i++) {
      // Re-fetch inputs since DOM changed
      const currentInputs = await page.$$('app-smt-demon-list input');
      const input = currentInputs[i + 1]; // +1 because target demon is 0
      await input.click({clickCount: 3});
      await input.type(demons[i].name);
      // Click the first suggestion
      await page.waitForSelector('ul.suggestions li');
      const suggs = await page.$$('ul.suggestions li');
      await suggs[0].click();

      // The skill input for the owned demon is adjacent in the table
      // Let's use page.evaluate to set the value directly to avoid complex selector mapping
      await page.evaluate((idx, skills) => {
        const rows = document.querySelectorAll('.owned-demons-section table tbody tr');
        if (rows && rows[idx]) {
          const skillInput = rows[idx].querySelector('input[type="text"]');
          if (skillInput) {
            skillInput.value = skills;
            skillInput.dispatchEvent(new Event('change'));
          }
        }
      }, i, demons[i].skills);
    }

    console.log("Selecting Max Owned criteria...");
    // Click the 4th tab (index 3)
    const tabs = await page.$$('.tabs button');
    await tabs[3].click();

    console.log("Clicking Generate...");
    const generateBtn = await page.$('button.generate-btn');
    await generateBtn.click();

    console.log("Waiting for result...");
    // Wait for result-steps to appear
    await page.waitForSelector('.result-steps', { timeout: 10000 });

    console.log("Taking screenshot...");
    await page.screenshot({ path: '/home/jpurple/.gemini/antigravity/brain/5ebcca8c-1d83-492d-b946-91abd0511933/test_5_owned_ui_success.png' });
    console.log("Success screenshot taken!");
  } catch(e) {
    console.log("Failed! Taking debug screenshot...", e);
    await page.screenshot({ path: '/home/jpurple/.gemini/antigravity/brain/5ebcca8c-1d83-492d-b946-91abd0511933/debug_ui_error.png' });
  }

  await browser.close();
  console.log("Done!");
})();
