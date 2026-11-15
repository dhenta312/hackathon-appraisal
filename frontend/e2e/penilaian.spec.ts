import { test, expect } from '@playwright/test';

test('alur menilai rekan: login → tim → form multi-step → simpan draf', async ({ page }) => {
  // 1. Login
  await page.goto('/login');
  await page.locator('#email').fill('andi@example.com');
  await page.locator('#password').fill('password');
  await page.getByRole('button', { name: 'Masuk' }).click();
  await page.waitForURL('**/welcome');
  await expect(page.getByText(/Penilaian Kinerja/).first()).toBeVisible();
  await page.screenshot({ path: 'test-results/01-login-berhasil.png', fullPage: true });

  // 2. Buka "Tim saya" (menu Penilaian)
  await page.getByRole('link', { name: 'Penilaian', exact: true }).click();
  await expect(page.getByText(/dinilai/)).toBeVisible();
  await page.screenshot({ path: 'test-results/02-tim-saya.png', fullPage: true });

  // 3. Klik "Nilai" pada rekan pertama (bukan diri sendiri)
  await page.getByRole('button', { name: 'Nilai', exact: true }).first().click();

  // 4. Form multi-step terbuka di langkah 1 (Core Value)
  await expect(page.getByText(/Menilai:/)).toBeVisible();
  await expect(page.getByText(/Core Value/).first()).toBeVisible();
  await page.screenshot({ path: 'test-results/03-form-step1.png', fullPage: true });

  // 5. Simpan draf → kembali ke halaman tim
  await page.getByRole('button', { name: 'Simpan draf' }).click();
  await page.waitForURL('**/team');
});
