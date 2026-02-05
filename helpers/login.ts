import { Page, expect } from "@playwright/test";
// import { createWorker } from 'tesseract.js';


export async function loginSuccess(page: Page) {
  await page.goto("https://admincargo-beta.kai.id/login");

  await page.fill('input[name="username"]', "superadmin");
  await page.fill('input[name="password"]', "Portalangbar2025!");

  //Test 1 Captcha handling
  const captchaText = await page.locator('div[style*="text-align:center"] span').innerText();
  console.log('Captcha Text: ', captchaText);
  const result = eval(captchaText);
  console.log('Captcha Result: ', result);
  await page.fill('input[name="captcha"]', result.toString());

  // Test 2 Static captcha handling
  // tunggu elemen yang menampilkan kode verifikasi muncul
  // const codeEl = await page.waitForSelector('span.badge.bg-primary >> strong');
  // const codeText = (await codeEl.innerText()).trim(); // e.g. "THLDBK"
  // isi input kode verifikasi (sesuaikan selector input)
  // await page.fill('input[name="captcha"]', codeText);

  // Test 3 Captcha handling with OCR
  // const captcha = await page.locator('#captcha-img').screenshot();
  // const worker = await createWorker('eng');
  // const { data: { text } } = await worker.recognize(captcha);
  // await page.fill('input[name="captcha"]',  text.trim());


  await page.waitForTimeout(500);
  await page.click('button[type="submit"]'); // sesuaikan
  await expect(page).not.toHaveURL(/\/login/);
  await page.waitForTimeout(1000);

}