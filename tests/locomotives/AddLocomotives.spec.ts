// Negative test for adding a locomotive with invalid data
import { test, expect } from '@playwright/test';
test.use({ storageState: 'storageState.json' });

test.describe('Locomotives - Add (Negative)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://iris-beta.kai.id/locotrack/locomotives/add');
    await expect(page).toHaveURL(/\/locotrack\/locomotives\/add/);
  });

  test('Berhasil menambahkan data lokomotif dengan data valid', async ({ page }) => {
    // 🔥 gunakan data unik biar tidak duplicate
    const vtdid = `S123222`;
    // const uniqueName = `Loco-${Date.now()}`;

    await page.fill('#vtdid', vtdid);
    await page.fill('#name', 'tes123');
    await page.fill('#no_gsm', '08123456789');
    await page.fill('#dipolok', 'BD');
    await page.fill('#kereta', 'K100');
    //await page.fill('#apn', 'APN123');
    await page.selectOption('#gps_group', { label: 'Jawa' });
    await page.waitForTimeout(10000);
    // klik submit
    await page.locator('button[type="submit"]').click();

    // ✅ Tunggu response / proses selesai
    //await page.waitForLoadState('networkidle');

    // ✅ Validasi berhasil (pilih salah satu sesuai UI kamu)

    // Opsi 1: cek notifikasi sukses
    await expect(
      page.getByText('Add data success.')
    ).toBeVisible({ timeout: 10000 });

    // Opsi 2: redirect ke halaman list
    await expect(page).toHaveURL(/locomotives/);

  });

  test('Menampilkan validasi ketika semua field wajib dikosongkan', async ({ page }) => {
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText('Field ID Locotrack is required.')).toBeVisible();
    await expect(page.getByText('Field No Sarana is required.')).toBeVisible();
    await expect(page.getByText('Field No GSM is required.')).toBeVisible();
    await expect(page.getByText('Field Dipolok is required.')).toBeVisible();
    await expect(page.getByText('Field GPS Group is required.')).toBeVisible();
  });

  test('Menampilkan error ketika menambahkan lokomotif yang sudah terdaftar', async ({ page }) => {
    await page.fill('#vtdid', 'S474');
    await page.fill('#name', 'Existing Locomotive');
    await page.fill('#no_gsm', '987654321');
    await page.fill('#dipolok', 'BD');
    await page.fill('#kereta', 'K100');
    await page.fill('#apn', 'APN123');
    await page.selectOption('#gps_group', { label: 'Jawa' });

    await page.locator('button[type="submit"]').click();

    await expect(page.getByText('Id Locotrack sudah digunakan.')).toBeVisible();
  });

  // 🔥 Tambahan testcase 1
  test('Menampilkan error ketika No GSM berisi huruf (harus angka)', async ({ page }) => {
    await page.fill('#vtdid', 'S999');
    await page.fill('#name', 'Test Loco');
    await page.fill('#no_gsm', 'ABCDEF'); // ❌ invalid
    await page.fill('#dipolok', 'BD');
    await page.selectOption('#gps_group', { label: 'Jawa' });

    await page.locator('button[type="submit"]').click();

    await expect(
      page.getByText('No GSM hanya boleh angka.')
    ).toBeVisible();
  });

  // 🔥 Tambahan testcase 2
  test('Menampilkan error ketika No GSM kurang dari 9 digit', async ({ page }) => {
    await page.fill('#vtdid', 'S998');
    await page.fill('#name', 'Test Loco');
    await page.fill('#no_gsm', '12345'); // ❌ kurang dari 9 digit
    await page.fill('#dipolok', 'BD');
    await page.selectOption('#gps_group', { label: 'Jawa' });

    await page.locator('button[type="submit"]').click();

    await expect(
      page.getByText(/no gsm minimal 9 digit/i)
    ).toBeVisible();
  });

});