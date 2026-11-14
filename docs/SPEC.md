# Spesifikasi Teknis (Technical Specification)
# Platform Penilaian Kinerja Pegawai

> Diperbarui 2026-11-14 — disinkronkan dengan implementasi aktual di `backend/` dan
> `frontend/` (audit kode langsung; bila kode dan dokumen ini berbeda, kode yang benar).

## 1. Ringkasan arsitektur

Aplikasi terdiri dari **dua komponen** yang terpisah:

- **Backend** — REST API Laravel + SQLite. Menyimpan data master (user, team, role,
  komponen, pertanyaan, pilihan jawaban, periode), penilaian (assessments/scores/reasons),
  kehadiran, dan banding; menjalankan **mesin skoring** di sisi server. Auth memakai
  **Sanctum token**.
- **Frontend** — SPA Angular 18 (standalone components + signals). Mengonsumsi API
  untuk login, beranda welcome, daftar pegawai (360°), form penilaian multi-step,
  dashboard hasil, dan pengaturan admin.

Skor dihitung **server-side** hanya dari penilaian berstatus `submitted`.
**Grade band (A–E) dihitung di frontend** dari total yang dikembalikan API.

Penilaian bersifat **360°** — tidak ada pembatasan tim di sisi API; siapa pun dapat
menilai siapa pun, termasuk diri sendiri.

## 2. Stack teknologi

### 2.1 Frontend
- Angular 18 (standalone components, signals, `ngModel` untuk isian form).
- Tailwind CSS 3 + design token **PILAR UII** (`tailwind.config.js`).
- Routing Angular, HTTP client + interceptor auth (Bearer token).
- Playwright (E2E, folder `e2e/`).

### 2.2 Backend
- PHP 8.3+, Laravel (framework terbaru), Sanctum token auth.
- SQLite (demo) — migration memakai idiom Laravel standar, kompatibel MySQL.
- PHPUnit untuk test fitur.
- **Laravel Boost** (`composer require laravel/boost --dev`) — guidelines + skill +
  MCP best-practice.

## 3. Struktur repositori

```
backend/
  app/Http/Controllers/   Auth, Assessment, Result, Appeal, Settings
  app/Services/           ScoringService
  app/Models/             User, Team, JobRole, Component, Question, AnswerChoice,
                          Assessment, Score, Reason, Attendance, Period, Appeal
  database/migrations/    ...
  database/seeders/       DatabaseSeeder
frontend/
  src/app/
    auth/                 login, guard, interceptor, admin guard
    layout/               sidebar + shell
    welcome/ team/ assessment/ results/ settings/
    services/             auth, team, assessment, results, appeal, settings
    models/               interfaces
    stepper-button-set/   komponen stepper PILAR
    api-url.ts            API_URL (base API — ubah di sini bila port backend beda)
  e2e/                    Playwright E2E
docs/                     PRD, SPEC, DOCUMENT-SPEC, BPMN, user-manual, pitch
```

## 4. Backend (Laravel)

### 4.1 Controller
- `AuthController` — `login()` (issue token).
- `AssessmentController` — `team()` (semua pegawai, 360°), `template(assessedId)`,
  `store(assessedId)` + deteksi pengisian asal (`computeFlag`).
- `ResultController` — `show(userId)` (otorisasi: admin semua, pegawai diri sendiri).
- `AppealController` — `store()` (ajukan banding), `index()` (admin, daftar banding).
- `SettingsController` — periode, pertanyaan, pilihan jawaban, komponen (bobot).

### 4.2 Routing & middleware
Semua endpoint di bawah prefix `/api`. Endpoint selain `login` dilindungi
`auth:sanctum`; endpoint `settings/*` dan `GET /appeals` juga dilindungi middleware
`admin`. Exception dirender JSON untuk `api/*`.

### 4.3 Model & relasi
- `User belongsTo Team`, `User belongsTo JobRole`.
- `Question belongsTo Component` dan `Question belongsTo JobRole` (nullable =
  berlaku semua role); `AnswerChoice belongsTo Question`.
- `Assessment belongsTo assessor(User)` dan `assessed(User)`.
- `Score belongsTo Assessment` dan `Question`; `Reason belongsTo Assessment` dan
  `Question` (alasan per pertanyaan).
- `Attendance belongsTo User`; `Appeal belongsTo User`; `Period` standalone.

### 4.4 Skema database
Tabel: `users`, `teams`, `job_roles`, `components`, `questions`, `answer_choices`,
`assessments`, `scores`, `reasons`, `attendance`, `periods`, `appeals`,
`personal_access_tokens`.

Komponen dengan `code` & `weight`: `core_value`=10, `soft_skill`=25,
`hard_skill`=30, `growth_innovation`=15, **`kehadiran`=20** ("Kehadiran &
Kedisiplinan"). Komponen `kehadiran` **tidak punya pertanyaan** dan **dikecualikan**
dari template maupun perhitungan komponen — poinnya datang dari tabel `attendance`.

### 4.5 Periode
`Period` punya `name`, `start`, `end`, `is_open`. Periode aktif = satu-satunya
periode `is_open` (`Period::open()`); fallback `'2026-Q4'` bila tidak ada.
Admin membuka/menutup periode dari tab Pengaturan → Periode.

### 4.6 Mesin skoring (`ScoringService::compute`)
```
skor komponen per penilai = round(avg(nilai pertanyaan) / 5 × bobot, 1)
skor final komponen       = round(avg(skor komponen antar penilai submitted), 1)
total                     = round(Σ skor final komponen + attendance.points, 1)
```
- `per_assessor[i].label` = "Penilai A", "Penilai B", … urutan `submitted_at` (anonim);
  setiap penilai menyertakan `reasons` (alasan per pertanyaan).
- Tanpa assessor submitted → `total: null`; skor per penilai yang kosong diabaikan
  dari rata-rata.
- Kehadiran dari `attendance.points` (maks 20), bukan input penilai.
- **Grade band tidak dihitung backend** — frontend memetakan total ke A–E.

### 4.7 Deteksi pengisian asal
`computeFlag(scores, reasons)` → flag string (comma-separated), tersimpan di
`assessments.flag`:
- `skor_seragam` — semua nilai sama (≥2 nilai).
- `semua_maksimal` — semua nilai = 5.
- `alasan_copas` — ada teks alasan non-kosong yang sama persis (case-insensitive).

Frontend menghitung indikasi yang sama secara client-side dan menampilkan dialog
konfirmasi sebelum submit.

## 5. Kontrak API

### 5.1 Konvensi respons
- JSON; error validasi → `422` dengan `message` (+`errors`).
- Unauthorized → `401`; melihat hasil orang lain (non-admin) → `403`.
- Kirim ulang penilaian yang sudah `submitted` → `409`.
- Submit dengan pertanyaan belum lengkap → `422` "Semua pertanyaan harus diisi".

### 5.2 `POST /api/login`
Request `{ email, password }` → `200 { token, user: { id, name, team_id, job_role_id, is_admin } }`.

### 5.3 `GET /api/team`
`200 { members: [{ id, name, job_role_name, is_self, is_teammate, status }] }` —
**semua pegawai** (360°), urut nama; `status ∈ {not_started, draft, submitted}`
untuk periode aktif.

### 5.4 `GET /api/assessments/{assessedId}`
```
200 {
  assessed: { id, name, job_role_name, is_self },
  components: [{ id, code, name, weight,
    questions: [{ id, text, sort_order,
      choices: [{ id, label, point_value }] }] }],
  draft: { relationship, scores: [{question_id, value}],
           reasons: [{question_id, text}] } | null
}
```
Komponen `kehadiran` dikecualikan. Pertanyaan `hard_skill` (bertipe role-specific)
difilter berdasarkan `job_role_id` orang yang dinilai; pertanyaan role-agnostic
(`job_role_id` null) tampil untuk semua role. Draf diambil untuk pasangan
penilai–dinilai pada periode aktif.

### 5.5 `POST /api/assessments/{assessedId}`
Body `{ action: draft|submit, relationship: string|null, scores: [{ question_id, value(0–5) }],
reasons: [{ question_id, text }] }` → `200 { id, status, flag }`.
- Upsert penilaian pasangan penilai–dinilai per periode (draf menimpa draf).
- `submit` mensyaratkan semua pertanyaan template terisi (else `422`) dan mengunci
  penilaian (kirim ulang → `409`).
- Skor & alasan lama diganti seluruhnya saat menyimpan.

### 5.6 `GET /api/results/{userId}`
```
200 {
  total: float|null,
  components: [{ code, name, weight, score: float|null,
    per_assessor: [{ label, score: float|null,
      reasons: [{ question_id, question_text, text }] }] }],
  attendance: { points: int, max: 20 }
}
```
Grade **tidak** disertakan backend — frontend menghitung A–E dari `total`.

### 5.7 Banding
- `POST /api/appeals` (auth) — body `{ reason }` → `201 { appeal }`; status awal
  `pending`, terikat periode aktif.
- `GET /api/appeals` (admin) — `200 { appeals: [...] }` dengan data pengaju,
  urut terbaru. *(Endpoint tersedia; UI admin belum ada.)*

### 5.8 Pengaturan (admin)
- `GET /api/settings/periods` · `POST /api/settings/periods` ·
  `POST /api/settings/periods/{id}/toggle` (buka/tutup).
- `GET /api/settings/questions` · `POST` · `PUT /{id}` · `DELETE /{id}`
  (teks, komponen, role nullable).
- `POST /api/settings/questions/{id}/choices` · `PUT /api/settings/choices/{id}` ·
  `DELETE /api/settings/choices/{id}` (label + point_value 0–5).
- `GET /api/settings/components` · `PUT /api/settings/components/{id}`
  (nama + bobot).

## 6. Frontend (Angular)

### 6.1 Struktur `frontend/src/app/`
- `auth/` — `login.component`, `auth.guard`, `admin.guard`, `auth.interceptor`.
- `layout/` — sidebar + shell (PILAR).
- `welcome/`, `team/`, `assessment/`, `results/`, `settings/`.
- `stepper-button-set/` — komponen stepper PILAR (first/middle/last step).
- `services/` — `auth`, `team`, `assessment`, `results`, `appeal`, `settings`.
- `models/` — interfaces (assessment, results, settings, team, auth, appeal).
- `api-url.ts` — `API_URL` (base API; ubah di sini bila port backend berbeda).

### 6.2 Routing
`/login`, lalu di bawah `LayoutComponent` + `authGuard`:
`/welcome`, `/team`, `/assess/:id`, `/results/:id`, `/settings` (admin guard).

### 6.3 State management
Signals (`signal`/`computed`) per komponen; token & user di `AuthService`
(signal + `localStorage`).

### 6.4 Form penilaian multi-step
- Satu langkah per komponen (`currentStep`), step pills, tombol stepper PILAR.
- Skor & alasan di `Record<question_id, value|text>` (signal) — pindah langkah
  tidak menghilangkan isian; draf terisi ulang saat form dibuka.
- `warnings` (computed, client-side): skor seragam / semua maksimal / alasan copas
  → dialog konfirmasi sebelum `submit`.
- Progress % = pertanyaan terisi / total pertanyaan.

### 6.5 Dashboard hasil
- Grade band dihitung client-side (`gradeFor()`): A ≥90 · B 80–89 · C 70–79 ·
  D 60–69 · E <60.
- Form banding (alasan) untuk pegawai pada hasil dirinya → `POST /api/appeals`.

### 6.6 Halaman welcome
- Rentang periode, notifikasi, aktivitas — **data statis/placeholder** (belum dari API).

### 6.7 Design token (Tailwind — PILAR)
Token di `tailwind.config.js`: `brand`, `background`, `text`, `border`, spacing
`50–600`, radius `s/m/l`. Lihat skill `dev-workflow` untuk konvensi.

## 7. Alur data kunci

1. **Menilai**: buka `/assess/:id` → `GET /api/assessments/:id` (template + draf) →
   isi → `POST` (draft/submit) → kembali ke `/team`.
2. **Hasil**: buka `/results/:id` → `GET /api/results/:id` → render total + komponen +
   grade (frontend) + banding.
3. **Pengaturan**: admin → `/settings` → periode/pertanyaan+choices/bobot via
   `settings/*` API.

## 8. Cara menjalankan

### 8.1 Backend (default port 8000)
```bash
cd backend && php artisan migrate --seed && php artisan serve
```
Port lain: `php artisan serve --port=8002`.

### 8.2 Frontend (default port 4200)
```bash
cd frontend && npm install && npm start
```
Port lain: `npm start -- --port 4300`. Bila port backend bukan 8000, sesuaikan
`src/app/api-url.ts` (mis. `http://127.0.0.1:8002/api`).

Buka `http://localhost:4200` (atau port yang dipakai).

## 9. Pengujian

- **Backend (PHPUnit):** `php artisan test` — data model, auth, assessment API,
  scoring, deteksi.
- **E2E (Playwright):** `npm run e2e` di `frontend/` (folder `e2e/`,
  `playwright.config.ts`).
- **Build:** `npm run build` di `frontend/`.
- Kasus uji penting: draf tidak memengaruhi skor; tanpa penilai submitted → total
  `null`; submit belum lengkap → 422; kirim ulang → 409; hasil orang lain → 403.

## 10. Keterbatasan & utang teknis

- **SQLite untuk demo** — workflow standar memakai MySQL; migrasi sudah kompatibel.
- **Belum deploy** ke gateway UII.
- Kehadiran di-seed, tidak terhubung absensi nyata.
- Auth sederhana (tanpa SSO).
- Welcome: notifikasi/aktivitas statis.
- `GET /api/appeals` (admin) belum punya UI.
- Penilaian 360°: semua pegawai saling menilai — belum ada pembatasan cakupan
  (mis. hanya tim + atasan) meski kolom `relationship` sudah tersimpan.

## 11. Glosarium singkat

| Istilah | Arti |
|---|---|
| Assessor | Penilai |
| Assessed | Yang dinilai |
| 360° | Penilaian lintas pegawai tanpa batas tim, termasuk diri sendiri |
| Flag | Penanda deteksi pengisian asal |
| Grade band | Predikat A–E (dihitung frontend) |
| Kehadiran | Komponen `kehadiran` — poin dari tabel `attendance`, bukan penilaian |
| Period | Periode penilaian aktif (satu `is_open`) |
