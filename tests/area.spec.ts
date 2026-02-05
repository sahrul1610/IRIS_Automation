import { test, expect } from '@playwright/test';
import * as UI from "../helpers/ui";

test.describe("Area", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://admincargo-beta.kai.id/master-data/area');
        await expect(page).toHaveURL(/area/);
    });

    test("TC001 - Search", async ({ page }) => {
        await UI.input(page, "Masukkan kata kunci pencarian", "Pidada");
        await UI.button(page, "Cari");
        await UI.waitForTimeout(page, 1000);
        await UI.expectTable(page, "Pidada");
    });

    test("TC002 - Tambah Unit", async ({ page }) => {

        await UI.link(page, "Tambah Area");

        const random = Date.now();

        await UI.input(page, "Nama Terminal", 'KD3' + random + '1');
        await UI.selectOption(page, "select2-id_unit-container", "KANTOR PUSAT");
        await UI.selectOption(page, "select2-id_provinsi-container", "BANDAR LAMPUNG");

        await page.click('button:has-text("Submit")');

        await page.waitForTimeout(2000);
        await expect(page.locator('#swal2-title')).toHaveText('Success!');
    });

    test("TC003 - Edit Unit", async ({ page }) => {
        await page.locator('i.bx-edit').first().click();
        await expect(page.locator('#swal2-title')).toHaveText('Success!');
    });
    
    test("TC004 - Update Status Unit", async ({ page }) => {
        await page.locator('i.bx-checkbox-square').first().click();
        await page.locator('button', { hasText: /Aktif|Non-aktif/ }).click();
        await expect(page.locator('#swal2-title')).toHaveText('Success');
    });
});