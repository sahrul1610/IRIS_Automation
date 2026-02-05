import { test, expect } from '@playwright/test';
import * as UI from "../helpers/ui";
import { random } from '../helpers/util';

test.describe("Unit Kerja", () => {


  test.beforeEach(async ({ page }) => {
    await page.goto('https://admincargo-beta.kai.id/master-data/unit-kerja');
    await expect(page).toHaveURL(/unit-kerja/);
  });


  test("TC001 - Search", async ({ page }) => {
    await UI.input(page, "Masukkan kata kunci pencarian", "Solo");
    await UI.button(page, "Cari");
    await UI.waitForTimeout(page, 2000);
    await UI.expectTable(page, "Solo");
    await UI.waitForTimeout(page, 2000);
  });

  test("TC002 - Tambah Unit", async ({ page }) => {

    await UI.link(page, "Tambah Unit");

    await UI.input(page, "Kode Unit", random(4));
    await UI.input(page, "Nama Unit", 'Auto ' + random(5));
    await UI.input(page, "Alias Unit", 'AL ' + random(3)); 
    await UI.waitForTimeout(page, 2000);
    await UI.buttonByOnclick(page, "saveForm()");
    await UI.expectModal(page, '#swal2-title', 'Success!');
    await UI.waitForTimeout(page, 2000);
  });

  test("TC003 - Edit Unit", async ({ page }) => {
    await UI.waitForTimeout(page, 2000);
    await page.locator('i.bx-edit').first().click();
    await UI.waitForTimeout(page, 2000);
    await UI.buttonByOnclick(page, "saveForm()");
    await UI.expectModal(page, '#swal2-title', 'Success!');
    await UI.waitForTimeout(page, 2000);
  });
  
  test("TC004 - Update Status Unit", async ({ page }) => {
    await UI.waitForTimeout(page, 2000);
    await page.locator('i.bx-checkbox-square').first().click();
    await UI.waitForTimeout(page, 2000);
    await UI.button(page, /Aktif|Non-aktif/);
    await UI.expectModal(page, '#swal2-title', 'Success');
    await UI.waitForTimeout(page, 2000);
  });




});