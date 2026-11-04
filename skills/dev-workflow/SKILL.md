---
name: dev-workflow
description: Use when working on a UII web project — Laravel + Angular + SQLite + Tailwind (PILAR design system) — to run dev servers, run tests (only on request), follow commit conventions, use PILAR design tokens, build stepper forms, and avoid recurring pitfalls.
---

# Dev Workflow — Web UII (Laravel + Angular + PILAR)

Konvensi berulang untuk proyek web UII. Sebagian besar berlaku lintas stack
(commit, workflow, token PILAR, jebakan); bagian "menjalankan server" khusus
Laravel + Angular.

## Stack utama

| Path | Isi |
| --- | --- |
| `backend/` | Laravel + SQLite, API di `/api/*` |
| `frontend/` | Angular (standalone components) + Tailwind |
| `docs/superpowers/` | Spec & plan hasil brainstorming/writing-plans |

> Proyek lain memakai stack berbeda (Express, React, Next.js). Bagian commit,
> token PILAR, workflow, dan jebakan tetap berlaku; sesuaikan perintah server
> per stack-nya.

## 1. Menjalankan dev server (Laravel + Angular)

```bash
# Backend — http://localhost:8000
cd backend && php artisan serve --host=127.0.0.1 --port=8000

# Frontend — http://localhost:4200
cd frontend && npm start
```

E2E (Playwright) membutuhkan keduanya hidup.

## 2. Menjalankan test — hanya saat diminta

**Jangan** membuat file test untuk perilaku baru, dan **jangan** menjalankan test
sebagai bagian rutin perubahan kode. Test dijalankan hanya bila diminta eksplisit —
E2E (`npx playwright test`) khususnya, karena butuh backend + frontend hidup.

```bash
# Backend (PHPUnit)
cd backend && php artisan test

# Frontend unit (Karma) — --watch=false wajib, kalau tidak proses menggantung
cd frontend && npx ng test --watch=false --browsers=ChromeHeadless

# E2E (Playwright) — butuh backend + frontend hidup
cd frontend && npx playwright test
```

Reset data demo bila pernah ada run E2E gagal (sisa baris duplikat bikin assertion
"sudah terhapus" ikut gagal):

```bash
cd backend && php artisan migrate:fresh --seed
```

## 3. Konvensi commit

- Bahasa Indonesia, format `<type>: <deskripsi>`, tanpa scope, tanpa titik akhir.
- `type`: `feat`, `fix`, `style`, `test`, `docs`, `refactor`.
- Satu commit = satu perubahan logis. Perubahan markup dan penyesuaian test-nya
  digabung dalam satu commit.
- Akhiri pesan dengan baris atribusi:

  ```
  Co-Authored-By: Claude Code <noreply@anthropic.com>
  ```

## 4. Konvensi UI (PILAR)

**Sumber desain:** design-to-code & code-to-design wajib memakai **PILAR Design System UII** — file Figma `AYHhj3V2tSnZleViFsIjEx` (https://www.figma.com/design/AYHhj3V2tSnZleViFsIjEx/PILAR-DESIGN-SYSTEM), badge/token https://pilarng.github.io/badge.

Token ada di `frontend/tailwind.config.js`. **Jangan** menulis hex warna langsung —
kecuali pengecualian terdokumentasi.

- Teks: `text-text-primary` / `-primary-2` / `-secondary` / `-tertiary` / `-muted`.
- Merah untuk penanda wajib, error, dan aksi hapus: `text-text-destructive`
  (aksi destruktif tombol pakai `bg-red-800`).
- Brand: `bg-brand-600`, `bg-brand-50`, `border-brand-100`, `text-text-brand-1`.
- Permukaan: `bg-background-primary|secondary|tertiary`; garis: `border-border-secondary`.
- Tipografi: `text-body-m`, `text-heading-xxs`, `text-heading-m`, `font-semibold`.
- Tombol disabled: **jangan** meredupkan dengan `opacity`. Pakai warna eksplisit —
  `disabled:bg-background-disabled disabled:text-text-muted disabled:cursor-not-allowed`.
- Spacing (`50`–`600`) dan radius (`s`/`m`/`l`) tersedia sebagai token. Kode lama
  banyak yang masih pakai skala default Tailwind — untuk komponen baru pakai token
  bila pemetaannya jelas, ikuti gaya sekitar bila tidak.
- Pengecualian terdokumentasi: divider kuning header `bg-[#FFF67A]`.

### Label field wajib

Teks label + tanda `*` dibungkus **satu** `<span>`:

```html
<label class="flex flex-col gap-1 text-body-m"><span>Nama lengkap <span class="text-text-destructive">*</span></span><input ...></label>
```

`<label>` memakai `flex flex-col`, sehingga tiap anak langsung jadi item flex
tersendiri. Tanpa pembungkus, tanda `*` turun ke baris sendiri.

## 5. Form bertahap (stepper)

- Komponen indikator hanya menggambar progres; perpindahan diatur halaman pemakai.
- Hanya langkah aktif yang dirender (`@switch` / `@if`). Nilai kontrol tetap hidup
  di `FormGroup`, jadi pindah langkah tidak menghilangkan isian.
- `next()` menolak maju bila langkah belum valid dan menandai field *touched*.
- Tombol maju juga **nonaktif** (`[disabled]="!stepValid(step())"`), bukan cuma
  ditolak setelah diklik.
- `submit()` lompat ke langkah bermasalah pertama bila masih ada yang kurang.

## 6. Jebakan yang sering muncul

| Gejala | Sebab / solusi |
| --- | --- |
| Test DOM gagal padahal form terisi | Render digerbangi signal — panggil `fixture.detectChanges()` setelah signal berubah. |
| `getByLabel('Nama lengkap *')` tidak ketemu | Nama aksesibel label memuat spasi + `*`. Pertahankan keduanya. |
| Respons JSON gagal di-parse frontend | PHP 8.5 mendeprekasi `PDO::MYSQL_ATTR_SSL_CA`; jaga `error_reporting(E_ALL & ~E_DEPRECATED)` di `bootstrap/app.php`. |
| Proses `ng test` tidak berhenti | Lupa `--watch=false`. |
| `rounded-s` / `rounded-l` tidak memberi radius token | Nama token radius bentrok dengan utility sisi Tailwind 3.4. Pakai `rounded-m` atau `rounded-[12px]`. |
| Port backend/frontend sudah dipakai | Ada project lain yang jalan — cek `lsof -iTCP:<port>` sebelum `serve`. |

## 7. Alur kerja & skill yang dipakai

1. **brainstorming** — sepakati kebutuhan sebelum menulis kode.
2. **writing-plans** — simpan spec & plan di `docs/superpowers/specs/` dan `plans/`.
3. **executing-plans** — kerjakan rencananya. Test **tidak** ditulis/dijalankan
   otomatis; **test-driven-development** hanya bila diminta.
4. **systematic-debugging** — cari akar masalah sebelum menambal.
5. **verification-before-completion** — jangan klaim selesai tanpa bukti; sebutkan
   jujur apa yang sudah/belum diperiksa.
6. **requesting-code-review** / **receiving-code-review** — sebelum menggabungkan.
7. **finishing-a-development-branch** — rapikan sebelum merge.

Untuk proses hulu-ke-hilir (PRD → FSD → build → deploy), lihat
`ai-native-development-workflow`.

## Bahasa

Narasi ke pengguna memakai **bahasa Indonesia**. Nama kode, perintah shell, nama
field, dan identifier tetap apa adanya (tidak diterjemahkan).
