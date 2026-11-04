# Spesifikasi Teknis (Technical Specification)
# Platform Penilaian Kinerja Pegawai

## 1. Ringkasan arsitektur

Aplikasi terdiri dari **dua komponen** yang terpisah:

- **Backend** — REST API Laravel + SQLite. Menyimpan data master (user, team, role, komponen,
  pertanyaan), penilaian (assessments/scores/reasons), presensi, periode, dan menjalankan
  **mesin skoring** di sisi server. Auth memakai **Sanctum token**.
- **Frontend** — SPA Angular 18 (standalone components + signals). Mengonsumsi API untuk login,
  landing "Tim saya", form penilaian multi-step, dashboard hasil, dan pengaturan admin.

Skor dihitung **server-side** hanya dari penilaian berstatus `submitted`.

## 2. Stack teknologi

### 2.1 Frontend
- Angular 18 (standalone components, signals, reactive forms via `ngModel` untuk skor).
- Tailwind CSS 3 + design token **PILAR UII** (`tailwind.config.js`).
- Routing Angular, HTTP client + interceptor auth (Bearer token).

### 2.2 Backend
- PHP 8.3+, Laravel (framework terbaru), Sanctum token auth.
- SQLite (demo) — migration memakai idiom Laravel standar, kompatibel MySQL.
- PHPUnit untuk test fitur.

## 3. Struktur repositori

```
backend/
  app/Http/Controllers/   Auth, Assessment, Result, Settings
  app/Services/           ScoringService
  app/Models/             User, Team, JobRole, Component, Question, AnswerChoice,
                          Assessment, Score, Reason, Attendance, Period, Appeal
  database/migrations/    ...
  database/seeders/       DatabaseSeeder
frontend/
  src/app/
    auth/                 login, guard, interceptor
    layout/               sidebar + shell
    welcome/ team/ assessment/ results/ settings/
    services/             auth, team, assessment, results, settings
    models/               interfaces
    stepper-button-set/   komponen stepper PILAR
docs/                     PRD, SPEC, DOCUMENT-SPEC, user-manual, pitch
```

## 4. Backend (Laravel)

### 4.1 Struktur `backend/app/`
- `AuthController` — login (issue token).
- `AssessmentController` — `team()`, `template(assessedId)`, `store(assessedId, request)` +
  deteksi pengisian asal (`computeFlag`).
- `ResultController` — hasil (otorisasi: admin semua, pegawai diri sendiri).
- `SettingsController` — periode, pertanyaan, pilihan, bobot.

### 4.2 Routing & controller
Semua endpoint di bawah prefix `/api`, endpoint selain `login` dilindungi `auth:sanctum`.
Endpoint admin (`settings`) dilindungi middleware `admin`.

### 4.3 Model & relasi
- `User belongsTo Team`, `User belongsTo JobRole`.
- `Question belongsTo Component` dan `Question belongsTo JobRole` (nullable untuk role-agnostic).
- `Assessment belongsTo assessor(User)` dan `assessed(User)`.
- `Score belongsTo Assessment` dan `Question`; `Reason belongsTo Assessment` dan `Question`.
- `Attendance belongsTo User`.

### 4.4 Skema database
Tabel utama: `users`, `teams`, `job_roles`, `components`, `questions`, `answer_choices`,
`assessments`, `scores`, `reasons`, `attendance`, `periods`, `appeals`, `personal_access_tokens`.

Komponen dengan `code` & `weight`: `core_value=10`, `soft_skill=25`, `hard_skill=30`,
`growth_innovation=15`, `presensi=20`.

### 4.5 Mesin skoring (`ScoringService::compute`)
```
component_score = round(avg(question_values) / 5 * weight, 1)
final component = round(avg(component_score across submitted assessors), 1)
total           = round(sum(final components for 4 assessed) + presensi.points, 1)
```
- `per_assessor[i].label` = "Penilai A", "Penilai B", … urutan submit (anonim).
- Tanpa assessor submitted → `total: null`.
- Presensi dari `attendance.points`, bukan input penilai.

### 4.6 Deteksi pengisian asal
`computeFlag(scores, reasons)` → flag string (comma-separated):
- `skor_seragam` — semua nilai unik = 1 (≥2 nilai).
- `semua_maksimal` — semua nilai = 5.
- `alasan_copas` — ada teks alasan yang sama persis.

## 5. Kontrak API

### 5.1 Konvensi respons
- JSON; error validasi → `422` dengan `message` + `errors`.
- Unauthorized → `401`; forbidden (bukan tim/role) → `403`.

### 5.2 `POST /api/login`
Request `{ email, password }` → `200 { token, user: { id, name, team_id, job_role_id, is_admin } }`.

### 5.3 `GET /api/team`
`200 { members: [{ id, name, job_role_name, is_self, status }] }`; `status ∈ {not_started, draft, submitted}`.

### 5.4 `GET /api/assessments/{assessedId}`
`200 { assessed: { id, name, job_role_name }, components: [{ id, code, name, weight, questions: [{ id, text, sort_order, choices: [{ id, label, point_value }] }] }], draft }`.
`hard_skill` difilter berdasarkan `job_role_id`; sisanya role-agnostic.

### 5.5 `POST /api/assessments/{assessedId}`
Body `{ action: draft|submit, relationship, scores: [{ question_id, value }], reasons: [{ question_id, text }] }` → `200 { id, status, flag }`.

### 5.6 `GET /api/results/{userId}`
`200 { total, components: [{ code, name, weight, score, per_assessor: [{ label, score }] }], attendance: { points, max }, grade }`.

## 6. Frontend (Angular)

### 6.1 Struktur `frontend/src/app/`
- `auth/` — `login.component`, `auth.guard`, `admin.guard`, `auth.interceptor`.
- `layout/` — sidebar + shell (PILAR).
- `welcome/`, `team/`, `assessment/`, `results/`, `settings/`.
- `stepper-button-set/` — komponen stepper PILAR (first/middle/last step).
- `services/` — `auth`, `team`, `assessment`, `results`, `settings` (HttpClient).
- `models/` — interfaces (assessment, results, settings, team, auth, appeal).
- `api-url.ts` — `API_URL` (base API).

### 6.2 Routing
`/login`, `/welcome`, `/team`, `/assess/:id`, `/results/:id`, `/settings` (admin guard).

### 6.3 State management
Signals (`signal`/`computed`) untuk state per komponen; token & user di `AuthService` (signal + `localStorage`).

### 6.4 Form penilaian multi-step
- Paginasi per komponen (`currentStep`), step pills, komponen `stepper-button-set`.
- Skor & alasan disimpan di `Record<question_id, value|text>` (signal), sehingga pindah langkah tidak menghilangkan isian.
- Deteksi peringatan dihitung client-side (`warnings` computed) sebelum submit.

### 6.5 Design token (Tailwind — PILAR)
Token di `tailwind.config.js`: `brand`, `background`, `text`, `border`, spacing `50–600`, radius `s/m/l`. Lihat skill `dev-workflow` untuk konvensi.

## 7. Alur data kunci

1. **Menilai**: buka `/assess/:id` → `GET /api/assessments/:id` (template + draf) → isi → `POST` (draft/submit) → kembali ke `/team`.
2. **Hasil**: buka `/results/:id` → `GET /api/results/:id` → render total + komponen + grade.

## 8. Cara menjalankan

### 8.1 Backend
```bash
cd backend && php artisan migrate --seed && php artisan serve
```

### 8.2 Frontend
```bash
cd frontend && npm install && npm start
```

Buka `http://localhost:4200`.

## 9. Pengujian

- **Backend (PHPUnit):** `php artisan test` — data model, auth, assessment API, scoring.
- **Frontend:** build `npm run build`; verifikasi alur utama manual (login → menilai → hasil).
- **Deteksi:** test kasus skor seragam / semua-maksimal / alasan copas.

## 10. Keterbatasan & utang teknis

- **SQLite untuk demo** — standar workflow memakai MySQL; migrasi sudah kompatibel.
- **Belum deploy** ke gateway UII (langkah 8 workflow belum dieksekusi).
- Presensi di-seed, tidak terhubung absensi nyata.
- Auth sederhana (tanpa SSO).

## 11. Glosarium singkat

| Istilah | Arti |
|---|---|
| Assessor | Penilai |
| Assessed | Yang dinilai |
| Flag | Penanda deteksi pengisian asal |
| Grade band | Predikat A–E |
| Period | Periode penilaian aktif |
