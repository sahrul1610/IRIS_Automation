import { test, expect } from '@playwright/test';
import * as UI from "../helpers/ui";
import { random, formatDate, getBannerPath } from '../helpers/util';
import { get } from 'http';

test.describe("Beranda", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://event-cms-beta.kai.id/events');
        await expect(page).toHaveURL(/events/);
    });

    test("Search", async ({ page }) => {
        await UI.waitForTimeout(page, 5000);
        await UI.inputByPlaceholder(page, "Cari event...", "Marathon Pagi3");

        await UI.waitForTimeout(page, 5000);
        // await UI.button(page, "Cari");
        await UI.expectTableVisible(page, "Marathon Pagi3");
        await UI.waitForTimeout(page, 5000);
    });

    // test("TC002 - Tambah Banner", async ({ page }) => {
    //     await UI.linkByName(page, "Tambah Banner");
    //     await UI.waitForTimeout(page, 2000);
    //     await UI.inputByPlaceholder(page, "Nama Banner", 'Auto ' + random(5));
    //     await UI.inputByPlaceholder(page, "Judul Banner", "Banner Auto " + random(5));

    //     const startDate = new Date();
    //     const endDate = new Date(startDate);
    //     endDate.setDate(endDate.getDate() + 7);

    //     await UI.inputById(page, "start_date", formatDate(startDate));
    //     await UI.inputById(page, "end_date", formatDate(endDate));

    //     await UI.inputByPlaceholder(page, "Sub Judul Banner", "Ini adalah sub judul banner otomatis");

    //     await UI.uploadBanner(page, getBannerPath('assets/images/banner-beranda.png'));
    //     await UI.waitForTimeout(page, 2000);
    //     await UI.buttonById(page, "confirmCrop");
    //     await UI.waitForTimeout(page, 2000);
    //     await UI.buttonByOnclick(page, "saveForm()");
    //     await UI.waitForTimeout(page, 2000);
    //     await UI.expectModal(page, '#swal2-title', 'Success!');
    // });

    // test("TC003 - Edit Banner", async ({ page }) => {
    //     await UI.inputByPlaceholder(page, "Masukkan kata kunci pencarian", "Happy");
    //     await UI.button(page, "Cari");
    //     await UI.waitForTimeout(page, 2000);
    //     await UI.expectTable(page, "Happy");

    //     // await page.locator('i.bx-edit').first().click();
    //     await UI.buttonById(page, 'button.btnStatus[data-id="31"]');
    //     await UI.waitForTimeout(page, 2000);
    //     await UI.inputByPlaceholder(page, "Judul Banner", "Banner Edited " + random(5));
    //     await UI.buttonByOnclick(page, "saveForm()");
    //     await UI.waitForTimeout(page, 2000);
    //     await UI.expectModal(page, '#swal2-title', 'Success!');
    // });


});