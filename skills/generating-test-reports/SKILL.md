---
name: generating-test-reports
description: Use when running automated tests (Playwright E2E or PHPUnit) and needing to generate a test report — HTML and PDF — with screenshots and a per-feature explanation of what was tested and the pass/fail result.
---

# Generating Test Reports

## Overview

Jalankan test otomatis → tangkap screenshot (E2E Playwright + output terminal) → hasilkan
report **HTML + PDF** berisi status lolos/gagal per fitur, screenshot, dan penjelasan apa yang
diverifikasi.

## Prasyarat

- Playwright `@playwright/test` + `playwright.config.ts` (`testDir: './e2e'`, `baseURL` app).
- PHPUnit untuk backend (bila perlu).
- Chrome (untuk konversi HTML → PDF).

## Langkah

### 1. Jalankan test backend (PHPUnit)
```bash
cd backend && php artisan test 2>&1 | tee /tmp/test-backend.log
```

### 2. Jalankan E2E Playwright + screenshot
Pastikan backend + frontend hidup, lalu:
```bash
cd frontend && npx playwright test --reporter=html 2>&1 | tee /tmp/test-e2e.log
```
- `--reporter=html` menghasilkan `playwright-report/index.html` (interaktif, otomatis memuat screenshot).
- Tangkap screenshot per langkah dalam test:
  ```ts
  await page.screenshot({ path: 'test-results/01-login.png', fullPage: true });
  // atau lampirkan langsung ke report:
  testInfo.attach('login', { body: await page.screenshot(), contentType: 'image/png' });
  ```
- Screenshot saat gagal otomatis tertangkap oleh reporter html.

### 3. Buat report HTML ringkasan (untuk PDF)
Report bawaan Playwright (`playwright-report/index.html`) bagus untuk **browser**, tapi itu
**JS SPA** — tidak bisa langsung di-print ke PDF. Untuk PDF, buat **HTML ringkasan sendiri**
yang self-contained:
1. **Ringkasan** — total test, lolos, gagal.
2. **Per fitur** — nama fitur, status (✅/❌), screenshot alur (base64 inline), penjelasan apa yang diverifikasi.

### 4. Konversi HTML → PDF
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --no-pdf-header-footer \
  --print-to-pdf="test-report.pdf" test-report.html
```

## Template Test Report (format QA TEST)

Laporan akhir mengikuti format **QA TEST** — **satu baris per alur (scenario)**, screenshot
tertanam di kolom `Screenshot` tiap baris (bukan ditumpuk di bawah teks).

### Struktur

1. **Metadata table** (label → nilai): `Tester` (mis. "Playwright (E2E otomatis)"),
   `Testing Date`, `Environment`, `Scenario`, `Description`.
2. **Success Scenario** — tabel dengan kolom:
   `No | Test Case | Steps | Expected Result | Actual Result | Status | Screenshot`
   - **Tiap alur = satu baris** (contoh: "Alur login", "Buka menu Penilaian (Tim saya)",
     "Buka form penilaian", "Simpan draf").
   - `Steps` = aksi/skenario; `Expected Result` = hasil yang diharapkan; `Actual Result` =
     "Sesuai — …"; `Status` = status pill hijau `PASS`.
   - `Screenshot` = screenshot alur tersebut, tertanam di sel barisnya.
3. **Error Scenario** (bila ada test gagal/diblokir) — kolom sama; status merah/kuning,
   tambah `Analysis` / `Repaired By` bila perlu.

### Screenshot per alur

- Di test Playwright, panggil `page.screenshot({ path: 'test-results/NN-*.png', fullPage: true })`
  **per langkah** (login, tim, form, simpan draf, dst.) — bukan satu screenshot utuh.
- Saat publish ke Confluence: upload tiap screenshot sebagai attachment, lalu embed `mediaSingle`
  di sel `Screenshot` baris yang sesuai.

### Catatan Confluence (ADF)

- Gambar di dalam sel tabel harus `mediaSingle` — `media` inline di `paragraph` **ditolak**
  editor baru (berubah jadi "unsupported content").
- Status hijau = node `status` `{ text: "PASS", color: "green" }`.

## Jebakan umum

| Gejala | Sebab / solusi |
| --- | --- |
| E2E gagal semua "connection refused" | Backend/frontend tidak hidup — nyalakan dulu (lihat `dev-workflow`). |
| Screenshot tidak muncul di report | Pakai `--reporter=html` (bukan `list`) atau `testInfo.attach()`. |
| Data duplikat bikin E2E gagal | Reset sebelum run: `php artisan migrate:fresh --seed`. |
| PDF berisi "No tests found" | Report bawaan Playwright itu JS SPA — tak ter-render saat print-to-pdf. Buat HTML ringkasan custom (inline base64 + CSS), jangan print report bawaan. |
| Screenshot terminal hilang | Redirect output ke file (`tee /tmp/test-e2e.log`) lalu sertakan di report. |

## Studi kasus

Dipakai di project UII (App Purnatugas): E2E Playwright alur CRUD + lookup + upload, dengan
report HTML yang memuat screenshot tiap langkah dan status lolos/gagal per alur.
