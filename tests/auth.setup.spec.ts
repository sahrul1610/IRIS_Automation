import { test as setup } from '@playwright/test';
import { loginSuccess } from '../helpers/login';

setup('authenticate', async ({ page }) => {
  await loginSuccess(page);

  await page.context().storageState({
    path: 'storageState.json',
  });
});
