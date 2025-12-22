// axe-audit.js
const { chromium } = require('playwright');
const axeCore = require('axe-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const outPath = path.resolve(process.cwd(), 'axe-results.json');
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:8000', { waitUntil: 'networkidle' });

    // inject axe-core into the page by adding the source as a script
    await page.addScriptTag({ content: axeCore.source });

    // run axe in the page context
    const results = await page.evaluate(async () => {
      // axe is available on the page after injection
      return await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2aa'] } });
    });

    // write results to file so the workflow can upload them
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    console.log('WROTE_AXE_RESULTS', outPath);
  } catch (err) {
    console.error('Audit failed:', err && err.stack ? err.stack : err);
    try {
      fs.writeFileSync(outPath, JSON.stringify({ error: String(err) }, null, 2));
      console.log('WROTE_AXE_RESULTS_ERROR', outPath);
    } catch (e) {
      console.error('Failed to write error file:', e && e.message ? e.message : e);
    }
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
  }
})();
