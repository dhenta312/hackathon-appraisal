---
name: generating-confluence-docs
description: Use when publishing, updating, re-publishing, or reading documentation (PRD, FSD/SPEC, BPMN diagrams, UI screenshots, user manuals) to/from Confluence Cloud, or when a Confluence page renders as raw JSON, images show "preview unavailable", or pages appear centered instead of full-width.
---

# Generating Confluence Docs

Menerbitkan dokumentasi proyek (`docs/*.md`, BPMN, screenshot UI) ke **Confluence Cloud**.
Kredensial + target (space/parent) dibaca dari `.env.confluence` (gitignored — lihat catatan
keamanan). Script siap pakai ada di `scripts/`.

## Konfigurasi (`.env.confluence`, gitignored)

```
CONFLUENCE_EMAIL=
CONFLUENCE_TOKEN=
CONFLUENCE_BASE_URL=
CONFLUENCE_SPACE_ID=       # id numerik space
CONFLUENCE_PARENT_PAGE_ID= # id numerik parent page
CONFLUENCE_SPACE_KEY=      # key space (mis. "AT") untuk URL halaman
```

> ⚠️ Token Confluence mengandung `=` (mis. `ATATT...=ECB40041`). Saat parsing `.env`,
> **split pada `=` pertama saja** — kalau tidak token terpotong dan auth gagal.

## Fakta kritis (baca dulu — ini yang paling sering bikin salah)

1. **`atlas_doc_format`, bukan `storage`.** Kirim `body.representation: "atlas_doc_format"`,
   `body.value` = `JSON.stringify(adf)` dengan `adf = {version:1, type:'doc', content:[...]}`.
   Kalau pakai `storage`, editor baru render JSON sebagai teks mentah — halaman "berantakan".
2. **Teks literal.** Jangan escape `<`, `>`, `&` pada teks ADF. Atlas format bukan XML/HTML.
3. **Gambar pakai `fileId`, bukan id attachment.** Node gambar = `mediaSingle` berisi `media`
   dengan `attrs: {type:'file', id:<fileId>, collection:<pageId>}`. `fileId` adalah UUID dari
   `GET /wiki/api/v2/attachments/{attId}` (bukan `att...`).
4. **Full-width** = dua content property: `content-appearance-published` dan
   `content-appearance-draft` bernilai `"full-width"` (kunci pakai DASH). Set lewat
   `POST /wiki/rest/api/content/{id}/property`.
5. **Tinggi gambar maks ~1900px.** Lebih dari itu → "preview unavailable". Gunakan screenshot
   viewport, bukan full-page.
6. **Update halaman wajib `version.number` = versi sekarang + 1.** Fetch versi terkini dulu,
   else 409.
7. **Space/parent bukan hardcode.** Baca `CONFLUENCE_SPACE_ID` + `CONFLUENCE_PARENT_PAGE_ID`
   dari `.env.confluence`, jangan hardcode (tiap tim/proyek beda).

## Alur

1. **Konversi** markdown → ADF (`scripts/convert.mjs`).
2. **Upload gambar** (bila ada) → ambil `fileId` tiap gambar.
3. **Buat/perbarui halaman** via v2 API dengan `representation: "atlas_doc_format"`.
4. **BPMN** → PNG (`scripts/render-bpmn.mjs`).
5. **Screenshot UI** (`scripts/shoot-app.mjs`).
6. **Set full-width** pada halaman baru.

## Endpoint API

| Aksi | Endpoint |
| --- | --- |
| Buat halaman | `POST /wiki/api/v2/pages` — `{spaceId, parentId, title, body}` |
| Perbarui halaman | `PUT /wiki/api/v2/pages/{id}` — `{id, status:'current', title, spaceId, version, body}` |
| Upload attachment | `POST /wiki/rest/api/content/{id}/child/attachment` (multipart, header `X-Atlassian-Token: no-check`) |
| Ambil `fileId` | `GET /wiki/api/v2/attachments/{attId}` |
| Baca body | `GET /wiki/api/v2/pages/{id}?body-format=atlas_doc_format` (`value` = string JSON) |
| Set full-width | `POST /wiki/rest/api/content/{id}/property` |

## Script (`scripts/`)

| File | Isi |
| --- | --- |
| `convert.mjs` | markdown → ADF (markdown-it) |
| `upload-atlas.mjs` | upload halaman + gambar |
| `render-bpmn.mjs` | BPMN `.bpmn` → PNG |
| `shoot-app.mjs` | screenshot UI via Playwright |
| `table-final.mjs` | rebuild tabel (bulletList di sel) |
| `read-page.mjs` | baca halaman dari URL/ID → markdown |

Dependency script: `npm install markdown-it` (untuk `convert.mjs`).

## Membaca halaman (dari link)

```bash
node scripts/read-page.mjs "https://xxx.atlassian.net/wiki/spaces/AT/pages/1234567"
```

Output: markdown (judul + isi) — kebalikan dari `convert.mjs`. Berguna untuk menjadikan
notulensi rapat / dokumen di Confluence sebagai **bahan diskusi & analisis** (mis. input
"Diskusi & Analisis" di nano).

## Kesalahan umum

| Gejala | Sebab |
| --- | --- |
| Halaman jadi JSON mentah | pakai `storage`, bukan `atlas_doc_format` |
| "preview unavailable" | id attachment klasik (harus `fileId`) ATAU gambar terlalu tinggi |
| 409 saat update | `version` tidak ditambah (harus `current+1`) |
| Auth gagal | token terpotong (split semua `=`, bukan `=` pertama) |
| Halaman di tengah | property `content-appearance-*` belum di-set |
