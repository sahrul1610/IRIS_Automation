// import { test } from '@playwright/test';

// test.use({ storageState: 'storageState.json' });

// test('dump row data for BD', async ({ page }) => {
//   await page.goto('https://iris-beta.kai.id/locotrack/locomotives', { waitUntil: 'networkidle' });
//   await page.locator('#filterLokasi').selectOption('BD');
//   await page.waitForTimeout(1000);
//   const rowHtml = await page.locator('table tbody tr').first().innerHTML();
//   console.log('ROW HTML:\n', rowHtml);
// });
