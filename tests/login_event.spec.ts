import { test, expect } from '@playwright/test';

test("login to Event CMS Beta successfully", async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://event-cms-beta.kai.id/login');

    // Fill in the login credentials
    await page.locator('#email').fill('superadmin@admin.com');
    await page.locator('#password').fill('password');

    // Click the login button
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(5000);
    // Verify successful navigation to the dashboard
    await expect(page).toHaveURL('https://event-cms-beta.kai.id/dashboard');
    //await expect(page.locator("h1.page-title")).toContainText("Home");
});
