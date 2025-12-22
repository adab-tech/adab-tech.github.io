// axe-audit.js
const { chromium } = require('playwright');
const { checkA11y } = require('@axe-core/playwright');
const fs = require('fs');
const path = require('path');

// Some versions of @axe-core/playwright export injectAxe differently.
// We'll use checkA11y which handles injection internally, but also
// provide a helpful error message and ensure we write a results file.

(async () => {
  const outPath = path.resolve(process.cwd(), 'axe-results.json');
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:8000');

    // run the accessibility checks (checkA11y injects axe)
    const results = await checkA11y(page, null, { detailedReport: true }).catch(err => {
      // surface useful debug info
      console.error('checkA11y failed:', err && err.message ? err.message : err);
      throw err;
    });

    // write results to file so the workflow can upload them
    try {
      fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
      console.log('WROTE_AXE_RESULTS', outPath);
    } catch (writeErr) {
      console.error('Failed to write axe results:', writeErr && writeErr.message ? writeErr.message : writeErr);
      // still print results to stdout as a fallback
      console.log(JSON.stringify(results, null, 2));
    }
  } catch (err) {
    console.error('Audit failed:', err && err.stack ? err.stack : err);
    // ensure we produce some output file to avoid empty artifact; write error JSON
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
