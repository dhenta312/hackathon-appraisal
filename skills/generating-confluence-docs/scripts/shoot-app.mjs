// shoot-app.mjs — screenshot viewport terkontrol (tinggi < 1900px, agar preview Confluence normal).
import { createRequire } from 'node:module';
import { mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('/Users/nukiarii/Documents/Belajar_VS_Code/App_Purnatugas/frontend/node_modules/playwright');
const BASE = 'http://127.0.0.1:4201';
const OUT = '/Users/nukiarii/Documents/Belajar_VS_Code/App_Purnatugas/.confluence-upload/shots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1400 } });
page.on('pageerror', e => console.log('[pageerror]', e.message.slice(0,120)));

async function shot(name, h = 1400) {
  await page.setViewportSize({ width: 1920, height: h });
  await page.waitForTimeout(600);
  const path = join(OUT, name);
  await page.screenshot({ path });
  const kb = Math.round(statSync(path).size / 1024);
  console.log(`  ${name}: ${kb}KB (h=${h})`);
}
async function go(path) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
}

// 1) Dashboard
await go('/');
await shot('01-dashboard.png', 1400);

// 2) Daftar pegawai
await go('/pegawai');
await shot('02-daftar-pegawai.png', 1400);

// 3) Lookup NIK (state awal form)
await go('/pegawai/tambah');
await page.fill('input[placeholder*="Nomor Induk"]', '3214323341');
await shot('07-lookup-nik.png', 1080);

// 4) Form step 1 (setelah lookup)
await page.click('button[aria-label="Cari Nomor Induk Kepegawaian"]');
await page.waitForTimeout(2500);
await shot('03-form-tambah.png', 1600);

// 5) Form step 2 (Keluarga)
await page.click('button:has-text("Selanjutnya")');
await page.waitForTimeout(1200);
await shot('11-data-keluarga.png', 1600);

// 6) Form step 3 (SK)
await page.click('button:has-text("Selanjutnya")');
await page.waitForTimeout(1200);
await shot('08-lookup-sk.png', 1600);

// 7) Detail
await go('/pegawai/7');
await shot('05-detail-pegawai.png', 1600);

// 8) Edit
await go('/pegawai/7/edit');
await shot('04-edit-pegawai.png', 1600);

// 9) Upload (form step 1 scrolled ke tombol Unggah)
await go('/pegawai/tambah');
await page.fill('input[placeholder*="Nomor Induk"]', '3214323341');
await page.click('button[aria-label="Cari Nomor Induk Kepegawaian"]');
await page.waitForTimeout(2500);
await page.locator('button:has-text("Unggah")').first().scrollIntoViewIfNeeded();
await shot('09-upload.png', 1080);

// 10) Dialog Hapus
await go('/pegawai');
await page.locator('button[aria-label="Hapus"]').first().click();
await page.waitForTimeout(1000);
await shot('06-dialog-hapus.png', 1080);
await page.keyboard.press('Escape');

// 11) Dialog Riwayat
await page.locator('button[aria-label="Riwayat perubahan"]').first().click();
await page.waitForTimeout(1200);
await shot('12-dialog-riwayat.png', 1080);
await page.keyboard.press('Escape');

// 12) Toolbar Export (list)
await go('/pegawai');
await shot('10-export.png', 1080);

await browser.close();
console.log('\nselesai');
