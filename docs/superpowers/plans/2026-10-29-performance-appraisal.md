# Platform Penilaian Kinerja — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A runnable MVP that lets an employee assess their teammates through a low-friction per-person flow and see a transparent 0–100 score breakdown, replacing the current Google-Form + hidden-Excel-formula process.

**Architecture:** A Laravel 11 JSON API (`backend/`) backed by SQLite holds users, teams, role-specific question templates, assessments, and the scoring logic. An Angular 18 SPA (`frontend/`) consumes that API for login, the "Tim saya" landing, the assessment form, and the results dashboard. Scoring is computed server-side from submitted assessments only; presensi is a seeded data value, not assessor input.

**Tech Stack:** PHP 8.2+, Laravel 11 (Sanctum token auth), SQLite; Angular 18 (standalone components, signals, no state library), plain CSS.

**Spec:** `docs/superpowers/specs/2026-10-29-performance-appraisal-design.md`

## Global Constraints

- Repo layout: `backend/` (Laravel) and `frontend/` (Angular) at repo root; this plan is the only source of truth for the API contract.
- Database: SQLite at `backend/database/database.sqlite`.
- Auth: Laravel Sanctum bearer tokens. Login is by seeded `email` + `password` (password `password` for all seeded users). No registration/SSO.
- Components — exact `code` and `weight`: `core_value`=10, `soft_skill`=25, `hard_skill`=30, `growth_innovation`=15, `presensi`=20.
- Question score scale: integers 1–5. `presensi` has **no** questions; its points come from `attendance.points`.
- Scoring formula (locked): `component_score = round(avg(question_values)/5 * weight, 1)`; final per-component = `round(avg(component_score across submitted assessors), 1)`; `total = round(sum(final components for the 4 assessed components) + presensi.points, 1)`. Only `status = 'submitted'` assessments count.
- Single active period string: `"2026-Q4"` (no period picker).
- All user-facing copy in Bahasa Indonesia.

## Review Focus

The five conditions the spec implies but whose handling is most likely to break a real user; each gets a test in its owning task.

1. **No assessor has submitted for a person** → the results endpoint must not divide by zero; it returns an empty per-assessor list and a `total: null` (or explicit "belum dinilai" state). *(Test in Task 4.)*
2. **An assessor targets someone outside their own team** → 403, no assessment row created. *(Test in Task 3.)*
3. **A saved-but-unsubmitted draft must not affect scores** → drafts are excluded from every aggregate; only `submitted` counts. *(Test in Task 4.)*
4. **A role with zero hard-skill questions (or a user with no role)** → template returns an empty `hard_skill` question list without erroring. *(Test in Task 3.)*
5. **An empty `reason` string** → optional; stored as-is and ignored by scoring, never a validation error. *(Test in Task 3.)*

---

### Task 1: Backend scaffold + data model

**Files:**
- Create: `backend/` Laravel project (composer, artisan, config)
- Create: `backend/database/migrations/*` (users, teams, job_roles, components, questions, assessments, scores, reasons, attendance)
- Create: `backend/app/Models/{User,Team,JobRole,Component,Question,Assessment,Score,Reason,Attendance}.php`
- Create: `backend/database/seeders/DatabaseSeeder.php`
- Modify: `backend/.env` (SQLite), `backend/config/database.php` (default sqlite)

**Interfaces:**
- Produces: Eloquent models with relationships — `User belongsTo Team`, `User belongsTo JobRole`, `Question belongsTo Component` and `Question belongsTo JobRole` (nullable for role-agnostic), `Assessment belongsTo assessor(User)` and `assessed(User)`, `Score belongsTo Assessment` and `Question`, `Reason belongsTo Assessment` and `Component`, `Attendance belongsTo User`.

- [ ] **Step 1: Write a failing test that seeding produces the expected structure**

`backend/tests/Feature/DataModelTest.php` — `test_seeder_creates_expected_structure()` asserts: 5 components with the exact codes/weights from Global Constraints; `hard_skill` questions differ per `job_role`; `core_value`/`soft_skill`/`growth_innovation` questions have null `job_role_id`; 1 team with 6 members across 3 roles; attendance rows exist for the demo period.

- [ ] **Step 2: Run it, confirm it fails** (no tables yet)

Run: `cd backend && php artisan test --filter=DataModelTest`
Expected: FAIL (missing tables / models).

- [ ] **Step 3: Scaffold Laravel + create migrations/models/seeder**

`composer create-project laravel/laravel backend` then set SQLite; write migrations for the 9 tables; write models with the relationships above; write `DatabaseSeeder` seeding: 5 components, 3 roles (`ux`, `frontend`, `backend`), 1 team (`Team Alpha`) of 6 users (2 flagged as demo assessors), role-agnostic questions for 3 components (3–5 each), role-specific `hard_skill` questions per role, and `attendance` rows (points 0–20) for each user in period `2026-Q4`. Question wording is placeholder — structure is what matters.

- [ ] **Step 4: Run it, confirm it passes**

Run: `cd backend && php artisan test --filter=DataModelTest`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend
git commit -m "feat(backend): scaffold Laravel + appraisal data model & seeders"
```

---

### Task 2: Backend auth (login)

**Files:**
- Create: `backend/app/Http/Controllers/AuthController.php`
- Create: `backend/tests/Feature/AuthTest.php`
- Modify: `backend/routes/api.php`

**Interfaces:**
- Produces: `POST /api/login` — request `{ email, password }` → `200 { token, user: { id, name, team_id, job_role_id, is_admin } }`; `401` on bad credentials. Token is a Sanctum `plainTextToken`.

- [ ] **Step 1: Write the failing test**

`test_login_returns_token_and_user()` posts `{ email: "andi@example.com", password: "password" }` and asserts `200`, JSON has `token` (non-empty) and `user.email` matches; `test_login_rejects_bad_password()` asserts `401`.

- [ ] **Step 2: Run it, confirm it fails** (`/api/login` undefined)

Run: `cd backend && php artisan test --filter=AuthTest`
Expected: FAIL (404/405).

- [ ] **Step 3: Implement `AuthController::login()` + route + Sanctum**

`login(Request $request): JsonResponse` — validate `email`/`password`, `Auth::attempt`, on success `$user->createToken('appraisal')->plainTextToken`; return the user shape above. Add `Route::post('login', [AuthController::class, 'login'])` under the `api` prefix (no auth middleware).

- [ ] **Step 4: Run it, confirm it passes**

Run: `cd backend && php artisan test --filter=AuthTest`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/app/Http/Controllers/AuthController.php backend/routes/api.php backend/tests/Feature/AuthTest.php
git commit -m "feat(backend): token login endpoint"
```

---

### Task 3: Backend assessment API (team, template, save draft/submit)

**Files:**
- Create: `backend/app/Http/Controllers/AssessmentController.php`
- Create: `backend/tests/Feature/AssessmentApiTest.php`
- Modify: `backend/routes/api.php`

**Interfaces:**
- Consumes: auth (Task 2), models (Task 1).
- Produces (all under Sanctum `auth:sanctum`):
  - `GET /api/team` → `200 { members: [{ id, name, job_role_name, status }] }` where `status ∈ {not_started, draft, submitted}` for period `2026-Q4` and members are the caller's teammates (excludes self).
  - `GET /api/assessments/{assessedId}` → `200 { assessed: { id, name, job_role_name }, components: [{ id, code, name, weight, questions: [{ id, text, sort_order }] }], draft: { scores: [{ question_id, value }], reasons: [{ component_id, text }] } }`. `hard_skill` questions are filtered by the assessed user's `job_role_id`; role-agnostic questions appear for every role. `draft` is null when none exists.
  - `POST /api/assessments/{assessedId}` → body `{ action: "draft"|"submit", scores: [{ question_id, value }], reasons: [{ component_id, text }] }` → `200 { id, status }`. Upserts the caller's assessment for that person; `submit` sets `status=submitted` + `submitted_at`.

- [ ] **Step 1: Write failing tests**

In `AssessmentApiTest`: `test_team_lists_teammates_with_status()`; `test_team_forbids_non_teammate_is_excluded` (asserts only same-team members); `test_template_returns_role_specific_hard_skill()` (UX member gets UX hard-skill questions, null for shared); `test_template_empty_hard_skill_when_no_role()` (Review Focus 4); `test_save_draft_round_trips()`; `test_submit_marks_submitted()`; `test_assess_outside_team_is_forbidden()` (403 — Review Focus 2); `test_empty_reason_is_accepted()` (Review Focus 5).

- [ ] **Step 2: Run it, confirm failures**

Run: `cd backend && php artisan test --filter=AssessmentApiTest`
Expected: FAIL (routes undefined).

- [ ] **Step 3: Implement `AssessmentController` + routes**

Methods: `team()`, `template(int $assessedId)`, `store(int $assessedId, Request $request)`. Enforce same-team check in `template`/`store` (abort 403). Filter `hard_skill` by the assessed user's role. Upsert assessment + `scores` + `reasons` (reason is one row per `component_id`, text may be empty). Add the three routes with `auth:sanctum` middleware.

- [ ] **Step 4: Run it, confirm passes**

Run: `cd backend && php artisan test --filter=AssessmentApiTest`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/app/Http/Controllers/AssessmentController.php backend/routes/api.php backend/tests/Feature/AssessmentApiTest.php
git commit -m "feat(backend): assessment API (team, template, draft/submit)"
```

---

### Task 4: Backend scoring engine + results API

**Files:**
- Create: `backend/app/Services/ScoringService.php`
- Create: `backend/app/Http/Controllers/ResultController.php`
- Create: `backend/tests/Feature/ScoringTest.php`
- Modify: `backend/routes/api.php`

**Interfaces:**
- Consumes: models (Task 1), submitted assessments (Task 3).
- Produces: `ScoringService::compute(int $userId, string $period): array` returning:
  ```
  {
    total: float|null,           // null when no submitted assessor
    components: [
      { code, name, weight, score: float|null, per_assessor: [{ label, score }] }
    ],
    attendance: { points, max: 20 }
  }
  ```
  `per_assessor[i].label` = `"Penilai A"`, `"Penilai B"`, … in submission order (anonymized). Formula from Global Constraints.
  - `GET /api/results/{userId}` → `200` with the same payload (Sanctum auth; admin sees any user, employee only self — else 403).

- [ ] **Step 1: Write failing tests**

In `ScoringTest`: `test_component_score_matches_formula()` (one assessor, known values → exact expected component score); `test_average_across_two_assessors()` (per_assessor has 2 entries, score = their average); `test_draft_is_excluded()` (Review Focus 3); `test_no_submitted_assessor_returns_null_total()` (Review Focus 1); `test_presensi_from_attendance_not_assessor()`; `test_employee_cannot_view_other_results()` (403).

- [ ] **Step 2: Run it, confirm failures**

Run: `cd backend && php artisan test --filter=ScoringTest`
Expected: FAIL.

- [ ] **Step 3: Implement `ScoringService::compute()` + `ResultController` + route**

Compute per component: gather submitted assessments for `$userId` in `$period`; per assessor, `component_score = round(avg(values)/5 * weight, 1)`; final = average across assessors. Presensi from `attendance.points`. Total = sum of the 4 assessed components + presensi, or null if no submitted assessor. Guard division by zero. Enforce view-own vs admin in the controller.

- [ ] **Step 4: Run it, confirm passes**

Run: `cd backend && php artisan test --filter=ScoringTest`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/app/Services/ScoringService.php backend/app/Http/Controllers/ResultController.php backend/routes/api.php backend/tests/Feature/ScoringTest.php
git commit -m "feat(backend): scoring engine + results API"
```

---

### Task 5: Frontend scaffold + auth (login)

**Files:**
- Create: `frontend/` Angular 18 project (standalone components)
- Create: `frontend/src/app/services/auth.service.ts`
- Create: `frontend/src/app/auth/login.component.ts` (+ template/styles)
- Create: `frontend/src/app/auth/auth.interceptor.ts`
- Modify: `frontend/src/app/app.config.ts`, `frontend/src/app/app.routes.ts`

**Interfaces:**
- Consumes: `POST /api/login` (Task 2).
- Produces: `AuthService.login(email, password): Observable<AuthUser>` storing the token + user in a signal `currentUser`; `AuthInterceptor` attaches `Authorization: Bearer <token>` to `/api` calls; route `/login` renders `LoginComponent`.

- [ ] **Step 1: Write failing specs**

`auth.service.spec.ts` — `login() stores token and user on success` (mock `HttpClient` returning a token), `login() clears state on 401`. `login.component.spec.ts` — `submits email/password to AuthService` and `navigates to /team on success`.

- [ ] **Step 2: Run it, confirm failures**

Run: `cd frontend && npx ng test --watch=false`
Expected: FAIL (specs reference missing symbols).

- [ ] **Step 3: Scaffold Angular + implement auth service/interceptor/login**

`ng new frontend` with routing + no standalone:false; add `provideHttpClient(withInterceptors([authInterceptor]))` and routes. Implement `AuthService`, the interceptor (skips `/api/login`), and `LoginComponent` (email/password form → `AuthService.login` → `router.navigate(['/team'])`).

- [ ] **Step 4: Run it, confirm passes**

Run: `cd frontend && npx ng test --watch=false`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend
git commit -m "feat(frontend): scaffold Angular + login"
```

---

### Task 6: Frontend "Tim saya" landing

**Files:**
- Create: `frontend/src/app/services/team.service.ts`
- Create: `frontend/src/app/team/team-list.component.ts` (+ template/styles)
- Modify: `frontend/src/app/app.routes.ts`

**Interfaces:**
- Consumes: `GET /api/team` (Task 3).
- Produces: `TeamService.list(): Observable<TeamMember[]>`; route `/team` renders `TeamListComponent` showing member cards (name, role, status badge) and a progress line "sudah X dari N"; clicking a member navigates to `/assess/:id`.

- [ ] **Step 1: Write failing specs**

`team.service.spec.ts` — `list() returns members`; `team-list.component.spec.ts` — `shows progress text "sudah 2 dari 5"` given 2 submitted + 3 pending, and `navigates to /assess/{id} on card click`.

- [ ] **Step 2: Run it, confirm failures**

Run: `cd frontend && npx ng test --watch=false`
Expected: FAIL.

- [ ] **Step 3: Implement `TeamService` + `TeamListComponent` + route**

Service fetches `/api/team`. Component computes submitted count and renders progress + cards; status badge text: `not_started`→"Belum", `draft`→"Draf", `submitted`→"Selesai".

- [ ] **Step 4: Run it, confirm passes**

Run: `cd frontend && npx ng test --watch=false`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/services/team.service.ts frontend/src/app/team frontend/src/app/app.routes.ts
git commit -m "feat(frontend): team landing with progress"
```

---

### Task 7: Frontend assessment form

**Files:**
- Create: `frontend/src/app/services/assessment.service.ts`
- Create: `frontend/src/app/assessment/assessment-form.component.ts` (+ template/styles)
- Modify: `frontend/src/app/app.routes.ts`

**Interfaces:**
- Consumes: `GET/POST /api/assessments/{id}` (Task 3).
- Produces: `AssessmentService.load(id): Observable<AssessmentTemplate>`; `AssessmentService.save(id, payload): Observable<void>`; route `/assess/:id` renders `AssessmentFormComponent` grouped by component, each question a 1–5 selector, one reason textarea per component, and two buttons — "Simpan draf" (`action:'draft'`) and "Kirim" (`action:'submit'`). On load it pre-fills any existing draft.

- [ ] **Step 1: Write failing specs**

`assessment.service.spec.ts` — `load() maps template`, `save() posts payload`. `assessment-form.component.spec.ts` — `groups questions by component`, `one reason field per component`, `"Simpan draf" sends action:'draft'` and `"Kirim" sends action:'submit'`, `prefills draft values`.

- [ ] **Step 2: Run it, confirm failures**

Run: `cd frontend && npx ng test --watch=false`
Expected: FAIL.

- [ ] **Step 3: Implement `AssessmentService` + `AssessmentFormComponent` + route**

Service wraps the two endpoints. Component loads by route param, renders components in weight order, binds scores to a reactive model keyed by `question_id`, binds reasons keyed by `component_id`, and dispatches save with the current draft state.

- [ ] **Step 4: Run it, confirm passes**

Run: `cd frontend && npx ng test --watch=false`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/services/assessment.service.ts frontend/src/app/assessment frontend/src/app/app.routes.ts
git commit -m "feat(frontend): per-person assessment form with draft/submit"
```

---

### Task 8: Frontend results dashboard

**Files:**
- Create: `frontend/src/app/services/results.service.ts`
- Create: `frontend/src/app/results/results-dashboard.component.ts` (+ template/styles)
- Modify: `frontend/src/app/app.routes.ts`

**Interfaces:**
- Consumes: `GET /api/results/{id}` (Task 4).
- Produces: `ResultsService.get(id): Observable<ResultPayload>`; route `/results/:id` renders `ResultsDashboardComponent` showing total (or "Belum dinilai"), per-component rows with weight + score + per-assessor (anonymized) + reason, and a presensi row (`points`/20).

- [ ] **Step 1: Write failing specs**

`results.service.spec.ts` — `get() returns payload`. `results-dashboard.component.spec.ts` — `shows total 78`, `shows per-assessor labels "Penilai A"/"Penilai B"`, `shows "Belum dinilai" when total is null`, `shows presensi 18/20`.

- [ ] **Step 2: Run it, confirm failures**

Run: `cd frontend && npx ng test --watch=false`
Expected: FAIL.

- [ ] **Step 3: Implement `ResultsService` + `ResultsDashboardComponent` + route**

Component renders the payload; null total → placeholder text; presensi row separate with `points`/20.

- [ ] **Step 4: Run it, confirm passes**

Run: `cd frontend && npx ng test --watch=false`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/services/results.service.ts frontend/src/app/results frontend/src/app/app.routes.ts
git commit -m "feat(frontend): transparent results dashboard"
```

---

### Task 9: Integration + demo polish

**Files:**
- Create: `README.md` (run instructions + demo script)
- Modify: `backend/database/seeders/DatabaseSeeder.php` (ensure the demo arc data is complete and realistic)

**Interfaces:**
- Consumes: all prior tasks.

- [ ] **Step 1: Run the full backend suite and full frontend suite; both green**

Run: `cd backend && php artisan test` then `cd frontend && npx ng test --watch=false`
Expected: PASS for both.

- [ ] **Step 2: Manual end-to-end smoke via `php artisan serve` + `ng serve`**

Expected: login as a seeded assessor → see "Tim saya" → assess one teammate (role template auto-loads) → save draft → resume → submit → switch to admin → open that teammate's results → see total + per-component + anonymized per-assessor + presensi.

- [ ] **Step 3: Write README (run steps + the 3-minute demo script from the spec §9)**

- [ ] **Step 4: Commit**

```bash
git add README.md backend/database/seeders/DatabaseSeeder.php
git commit -m "docs: run instructions + demo script"
```
