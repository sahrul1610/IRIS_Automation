import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: 'storageState.json' });
  const page = await context.newPage();
  await page.goto('https://iris-beta.kai.id/locotrack/locomotives/add');
  // Wait for form container
  await page.waitForSelector('form');
  // Grab all input/select/textarea fields inside the form
  const fields = await page.$$eval('form input, form select, form textarea', els =>
    els.map(el => ({
      tag: el.tagName.toLowerCase(),
      id: el.id,
      name: el.getAttribute('name'),
      placeholder: el.getAttribute('placeholder'),
      type: el.getAttribute('type'),
      label: el.closest('label')?.innerText.trim() || null
    }))
  );
  console.log('=== FORM FIELDS ===');
  console.dir(fields, { depth: null });
  // Try to submit empty form to capture validation messages
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  const errors = await page.$$eval('[role="alert"], .error, .invalid-feedback', els =>
    els.map(el => el.textContent?.trim()).filter(Boolean)
  );
  console.log('=== VALIDATION MESSAGES ===');
  console.dir(errors);
  await browser.close();
})();
