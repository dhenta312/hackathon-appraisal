# User Manual Guidance — BSI UII (Confluence UX)

> Sumber: https://bsi-uii.atlassian.net/wiki/spaces/UX/pages/150405155/User+Manual+Guidance
> Template resmi: Google Doc `12aduIlpSj0sFMo9QDvmjMH9R2HcWYAwi-NEY-wlR7EU`
> (salinan lokal: `templates/user-manual-template.docx`, sudah di-export dari Google Doc di atas).
> Panduan ini **wajib** diikuti saat membuat user manual.

## Prinsip penulisan

- Bahasa **to the point (jelas) dan formal**.
- Ejaan baik & benar: `di tempat` ✅ / `ditempat` ❌ · `silakan` ✅ / `silahkan` ❌.
- **Satu user manual per user** (per peran). Contoh: Pendaftar, Petugas verifikasi, Kaprodi, dsb.
- Nomor heading dibuat **manual** (ketik angka), **jangan** pakai auto-numbering — indent
  auto terlalu jauh.
- Screenshot diberi **anotasi** (panah/kotak). Extension yang disarankan tim:
  [Awesome Screenshot Recorder](https://chromewebstore.google.com/detail/awesome-screen-recorder-s/nlipoenfbbikpbjkfpfillcgkoblgpmj).

## Alur membuat (dari halaman guidance)

1. **Copy** template (Google Doc → File → Make a copy), taruh di folder Drive tim.
   → **Di nano:** pakai `templates/user-manual-template.docx` sebagai dasar, **jangan buat dari nol**.
   Simpan versi baru, jangan menimpa template.
2. **Rename** file: `Manual [sistem]: [fitur dan versi] - [user: fitur utama]`
   → contoh: `Manual UIIAdmisi: Pascasarjana v1.0 - Pendaftar: Pendaftaran Pascasarjana`.
3. Catat di sheet indeks tim (Google Sheet) — di nano, cukup catat nama file + versi di `state.md`.
4. **Edit isi** mengikuti instruksi (comment) pada template.
5. Jika ada hal kurang jelas, hubungi **Zulkarnaen Dwi Syahputra** (pemilik guidance).

## Struktur dokumen (urut dari template)

### A. Cover
- **Logo UII** di atas, inline, lebar **3.0 in**, di tengah (asset: `templates/cover-logo.png`).
- **Grafik latar dekoratif** biru-kuning **melayang di belakang teks** (anchor `behindDoc=1`),
  lebar **8.51 in × 4.73 in**, posisi `relativeFrom="page"` V ≈ **6.27 in** (menempel bawah
  halaman). Asset: `templates/cover-bg.png`. Di template asli: para-0 logo (inline, 3.0×0.84 in),
  para-10 background (anchor, from page H=0 / V=6.27 in).
- Teks judul di tengah: `Manual` (bold, biru `#093697`)
- `[Nama user]` (center, 24 pt, biru) — comment: *"Ganti dengan nama user"*
- `[Nama sistem]: [fitur]` (center, 20 pt, biru)
- `[Versi aplikasi]` (center, 20 pt, biru) — comment: *"Ganti sesuai versi (DUPLIKASI bila versi baru)"*
- Alamat kampus, IT Support (phone + email) — format seperti template.

### B. Pembuka & Overview
- Salam pembuka: *"Assalamualaikum warahmatullahi wabarakatuh"*.
- **Overview** — penjelasan sistem, diawali seperti contoh.
- **Garis besar alur** harus dilakukan user — butir alur yang jadi tanggung jawab user
  ditulis **bold**. (comment 6)
- Penutup: *"Selamat datang dan terima kasih."*
- **Daftar isi.**

### C. Isi per fitur / per langkah (Heading berjenjang)
Format numbering **manual**, seperti:
| Heading | Ukuran | Warna | Lain |
|---|---|---|---|
| Heading 1 — `1. Judul` | 24 pt | biru `#093697` | bold + highlight kuning |
| Heading 2 — `1.1. Sub Judul` | 18 pt | biru `#093697` | bold |
| Heading 3 — `1.1.1. Sub Judul` | 14 pt | biru `#093697` | bold |
| Heading 4 — `1.1.1.1. Sub Judul` | 11 pt | hitam | bold |

Tiap bagian berisi:
- Kalimat pengantar: **"Berikut langkah-langkah yang harus dilakukan, yaitu:"**
- Langkah-langkah bernomor (format seperti contoh).
- **Catatan** di bawah langkah bila perlu — ditulis **italic**.
- **Di akhir setiap step WAJIB tambahkan kalimat penutup bahwa langkah telah selesai**
  (mis. *"Pada langkah ini, … telah selesai."*).

### D. Screenshot
- Ukuran **width 7.4 in, tinggi mengikuti** (proporsional).
- First-line indent `0.00`, left indent `0.25`.
- **Tambahkan anotasi** (panah/kotak) agar user paham.
- Jika gambar terlalu panjang, **potong** jadi beberapa — **jangan** potong tepat di teks/field.
- Ikon di dalam teks: **width 0.2 in**.

### E. Penutup
- Paragraf penutup (seperti contoh: "Demikian manual …").
- *"Terima kasih atas waktu dan perhatiannya."*
- *"Wassalamualaikum warahmatullahi wabarakatuh"*.

## Tips teknis saat memakai template `.docx`

- Template punya **31 gambar** dan **komentar** berisi instruksi. Komentar tidak tampil setelah
  diedit; hapus komentar produksi di salinan final.
- Style heading **sudah terdefinisi** di `styles.xml` (jangan buat style baru):
  Heading1 = 24pt bold + highlight kuning · Heading2/3 = biru `#093697` bold · Heading4 = bold hitam.
- Margin halaman: A4 (12.240×15.840 twips) — margin cover 1 in, halaman isi 0.4 in.
- Nomor heading **diketik manual** — jangan aktifkan auto-numbering.
- Verifikasi hasil: buka ulang dengan python-docx, cek jumlah heading, gambar, dan teks
  penutup tiap step sebelum menyerahkan.
