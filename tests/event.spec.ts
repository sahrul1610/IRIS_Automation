import { test, expect } from '@playwright/test';
import * as UI from "../helpers/ui";

test.describe("Event Management", () => {

    test.beforeEach(async ({ page }) => {
        // Asumsi user sudah login berdasarkan auth.setup.spec.ts
        await page.goto('https://event-cms-beta.kai.id/events');
        await expect(page).toHaveURL(/events/);
    });

    test("1. Verifikasi Halaman Daftar Event", async ({ page }) => {
        // Memastikan heading Event Management tampil
        const heading = page.locator('h2', { hasText: 'Event Management' });
        await expect(heading).toBeVisible();

        // Memastikan tombol Buat Tiket tampil
        const btnBuatTiket = page.locator('a', { hasText: 'Buat TIket' });
        await expect(btnBuatTiket).toBeVisible();
        await expect(btnBuatTiket).toHaveAttribute('href', /events\/create/);

        // Memastikan tabel data event tampil
        const table = page.locator('table');
        await expect(table).toBeVisible();
    });

    test("2. Pencarian Event", async ({ page }) => {
        const keyword = "Test UAT";
        
        // Input text pencarian
        await UI.inputByPlaceholder(page, "Cari event...", keyword);
        await UI.waitForTimeout(page, 3000); // Tunggu debounce / API call

        // Memastikan hasil pencarian muncul di tabel
        await UI.expectTableVisible(page, keyword);
    });

    test("3. Navigasi ke Halaman Buat Tiket", async ({ page }) => {
        // Klik tombol Buat Tiket
        await page.locator('a', { hasText: 'Buat TIket' }).click();

        // Memastikan URL berpindah ke halaman form pembuatan tiket
        await expect(page).toHaveURL(/events\/create/);
    });

    test("4. Navigasi Pagination", async ({ page }) => {
        // Tunggu hingga tabel termuat
        await expect(page.locator('table')).toBeVisible();

        // Cari tombol Next Page dan pastikan bisa diklik
        const btnNext = page.locator('button:has-text("Go to next page"), a:has-text("Go to next page")').first();
        
        if (await btnNext.isVisible()) {
            await btnNext.click();
            await UI.waitForTimeout(page, 2000); // Tunggu data termuat
            await expect(page).toHaveURL(/page=2/);
        }
    });

});
