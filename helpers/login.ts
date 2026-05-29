import { Page, expect, request } from "@playwright/test";
import { createWorker } from 'tesseract.js';


export async function loginSuccess(page: Page) {
  // await page.goto("https://admincargo-beta.kai.id/login");

  // await page.fill('input[name="username"]', "superadmin");
  // await page.fill('input[name="password"]', "Portalangbar2025!");

  // //Test 1 Captcha handling
  // const captchaText = await page.locator('div[style*="text-align:center"] span').innerText();
  // console.log('Captcha Text: ', captchaText);
  // const result = eval(captchaText);
  // console.log('Captcha Result: ', result);
  // await page.fill('input[name="captcha"]', result.toString());
  await page.goto('https://iris-beta.kai.id/auth/login');

  // Fill in the login credentials
  await page.locator('#nipp').fill('64186');
  await page.locator('input[name="password"]').fill('#H4nyaS3mentar@saJa');

  // Test 3 Captcha handling with OCR
  const captcha = await page.locator('#captchaImage').screenshot();
  const worker = await createWorker('eng');
  const { data: { text } } = await worker.recognize(captcha);
  await worker.terminate();
  await page.fill('input[name="captcha"]', text.trim());

  // Click the login button
  await page.locator('button[type="submit"]').click();

  // Verify successful navigation to the dashboard
  await expect(page).toHaveURL(/.*dashboard/);


  const apiContext = await request.newContext();
  // const response = await apiContext.post("https://admincargo-beta.kai.id/login", {
  //   data: {
  //     username: "superadmin",
  //     password: "[PASSWORD]",
  //   },
  // });

  // const response = await apiContext.get(process.env.BASE_URL_LOGIN + process.env.USERNAME);
  // const body = await response.json();
  // console.log("Login Response : " + body.data.accessToken);
  // const token = body.data.accessToken;

  await apiContext.storageState({ path: 'storageState.json' });

}