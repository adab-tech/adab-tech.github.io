// axe-audit.js
const { chromium } = require('playwright');
const { injectAxe, checkA11y } = require('@axe-core/playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:8000');

  // inject axe runtime into the page
  await injectAxe(page);

  // run the accessibility checks
  const results = await checkA11y(page, null, { detailedReport: true });
  console.log(JSON.stringify(results, null, 2));

  await browser.close();
})();
