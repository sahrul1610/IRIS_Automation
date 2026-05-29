import { test, expect } from '@playwright/test';

// Menggunakan state login yang sudah disimpan sebelumnya (storageState)
test.use({ storageState: 'storageState.json' });

test.describe('Testing Halaman Locomotives', () => {

    test.beforeEach(async ({ page }) => {
        // Navigasi ke halaman locomotives sebelum setiap test
        await page.goto('https://iris-beta.kai.id/locotrack/locomotives');

        // Tunggu hingga elemen utama termuat
        await page.waitForSelector('#filterLokasi');
    });

    test('Skenario: Menggunakan filter Dipo Lok (Bandung)', async ({ page }) => {
        const filterLokasi = page.locator('#filterLokasi');

        // Pastikan dropdown filter terlihat
        await expect(filterLokasi).toBeVisible();

        // Cari dan pilih opsi yang berkaitan dengan 'Bandung'
        const options = await filterLokasi.locator('option').allTextContents();
        const bandungOption = options.find(opt => opt.toLowerCase().includes('bandung'));

        if (bandungOption) {
            await filterLokasi.selectOption({ label: bandungOption.trim() });
        } else {
            // Fallback jika opsi Bandung tidak ditemukan secara tekstual (misal valuenya langsung BD)
            await filterLokasi.selectOption('BD').catch(() => filterLokasi.selectOption({ index: 1 }));
        }

        // Tunggu sebentar agar tabel merespons filter
        await page.waitForTimeout(1000);

        // [Expected] Tabel wajib menampilkan data setelah filter - tidak boleh kosong
        const tableRows = page.locator('table tbody tr');
        await expect(tableRows).not.toHaveCount(0, { timeout: 5000 });

        // [Expected] Pastikan SEMUA baris mengandung 'BD' - jika tidak, test GAGAL
        const allRowTexts = await tableRows.allInnerTexts();
        for (const rowText of allRowTexts) {
            expect(rowText).toContain('BD');
        }
    });

    test('Skenario: Menggunakan fitur Search', async ({ page }) => {
        const searchInput = page.locator('#customSearchInput');

        // Pastikan input terlihat
        await expect(searchInput).toBeVisible();
        // Isi search
        await searchInput.fill('CC2039504');
        await searchInput.press('Enter');

        // Validasi input terisi
        await expect(searchInput).toHaveValue('CC2039504');
        // Locator baris tabel
        const tableRows = page.locator('table tbody tr');
        // Tunggu sampai minimal 1 row muncul (auto retry)
        await expect(tableRows.first()).toBeVisible({ timeout: 50000 });
        // Optional: tunggu sampai jumlah row stabil (jika ada loading)
        await page.waitForLoadState('networkidle');
        // Ambil semua text
        const allRowTexts = await tableRows.allInnerTexts();
        // Validasi isi
        for (const rowText of allRowTexts) {
            expect(rowText.toLowerCase()).toContain('cc2039504');
        }
    });

    test('Skenario: Menguji tombol Refresh Data', async ({ page }) => {
        const refreshBtn = page.locator('#refresh-data');
        await refreshBtn.scrollIntoViewIfNeeded();

        // [Expected] Tombol Refresh wajib terlihat dan bisa diklik
        await expect(refreshBtn).toBeVisible();
        await expect(refreshBtn).toBeEnabled();

        // Klik tombol Refresh
        await refreshBtn.click();
        await page.waitForTimeout(500);

        // [Expected] Setelah refresh, halaman harus tetap di URL locomotives
        await expect(page).toHaveURL(/.*\/locotrack\/locomotives/);
    });

    // test('Skenario: Menguji tombol Download', async ({ page }) => {
    //     const downloadBtn = page.locator('#downloadBtn');

    //     // [Expected] Tombol Download wajib ada di halaman (hidden oleh CSS secara default)
    //     // await expect(downloadBtn).toBeAttached();
    //     // await expect(downloadBtn).toBeEnabled();
    //     await downloadBtn.click({ force: true });
    //     // await downloadBtn.click({ force: true }); // Gunakan force:true jika ingin klik tombol hidden
    // });

    test('Skenario: Menguji tombol Tambah Data (Add)', async ({ page }) => {
        const addBtn = page.locator('button[onclick*="/locotrack/locomotives/add"]');
        await addBtn.scrollIntoViewIfNeeded();

        // [Expected] Tombol Add wajib terlihat dan bisa diklik
        await expect(addBtn).toBeVisible();
        await expect(addBtn).toBeEnabled();

        // [Expected] Klik tombol Add harus mengarahkan ke halaman form
        await addBtn.click();
        await expect(page).toHaveURL(/.*\/locotrack\/locomotives\/add/);
    });


    test('Skenario: Menguji tombol Edit dan Delete di tabel', async ({ page }) => {
        // Tombol Edit wajib ada (minimal 1 data di tabel) - jika kosong test GAGAL
        const editButtons = page.locator('button.edit-btn-custom.btn-outline-primary');
        await expect(editButtons).not.toHaveCount(0, { timeout: 5000 });

        // [Expected] Semua tombol edit harus terlihat dan bisa diklik - jika tidak, test GAGAL
        const editCount = await editButtons.count();
        for (let i = 0; i < editCount; i++) {
            await expect(editButtons.nth(i)).toBeVisible();
            await expect(editButtons.nth(i)).toBeEnabled();
        }

        // Tombol Delete wajib ada - jika kosong test GAGAL
        const deleteButtons = page.locator('button.edit-btn-custom.btn-outline-danger');
        await expect(deleteButtons).not.toHaveCount(0, { timeout: 5000 });

        // [Expected] Jumlah tombol delete harus sama dengan tombol edit - jika tidak, test GAGAL
        await expect(deleteButtons).toHaveCount(editCount);

        // [Expected] Semua tombol delete harus terlihat dan bisa diklik - jika tidak, test GAGAL
        for (let i = 0; i < editCount; i++) {
            await expect(deleteButtons.nth(i)).toBeVisible();
            await expect(deleteButtons.nth(i)).toBeEnabled();
        }
    });

    test('Skenario: Menguji tombol Edit', async ({ page }) => {
        const editButtons = page.locator('button.edit-btn-custom.btn-outline-primary');

        // ✅ Tunggu sampai minimal 1 tombol muncul
        await expect(editButtons.first()).toBeVisible({ timeout: 10000 });
        // ✅ Pastikan jumlah tombol > 0
        const count = await editButtons.count();
        expect(count).toBeGreaterThan(0);
        // ✅ Ambil tombol pertama saja (best practice, tidak perlu loop semua)
        const firstEditBtn = editButtons.first();
        await expect(firstEditBtn).toBeEnabled();
        // ✅ Klik dan tunggu navigasi / perubahan UI
        await Promise.all([
            page.waitForLoadState('networkidle'), // jika ada API
            firstEditBtn.click()
        ]);
        // ✅ Validasi halaman edit muncul
        await expect(
            page.getByText("Update Data Locomotives").first()
        ).toBeVisible({ timeout: 10000 });
    });

});
