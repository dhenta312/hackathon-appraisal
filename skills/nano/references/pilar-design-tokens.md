# PILAR Design System — Design Tokens

Referensi token desain resmi UII, dirangkum dari: audit PILAR (Figma), `tailwind.config.js`
proyek-proyek UII (Hackathon & App Purnatugas), skill `dev-workflow`, dan hasil design-to-code
komponen Figma.

## Sumber resmi

- **File Figma:** `AYHhj3V2tSnZleViFsIjEx` — https://www.figma.com/design/AYHhj3V2tSnZleViFsIjEx/PILAR-DESIGN-SYSTEM
- **Badge/token:** https://pilarng.github.io/badge
- **Audit:** "COLOR BALANCE EVALUATION" (palet teks & tipografi — nilai WCAG AA terverifikasi)

---

## 1. Palet teks (WCAG AA)

Progression rekomendasi: 11% → 32% → 45% → 67%.

| Token | Hex | Kegelapan | Kontras | Penggunaan |
|---|---|---|---|---|
| `text-primary` | `#101828` | 11% | 7.4:1 | heading / label |
| `text-primary-2` | `#364153` | 27% | — | tone heading sekunder |
| `text-secondary` | `#475569` | 32% | 5.2:1 | body text |
| `text-tertiary` | `#64748B` | 45% | 3.8:1 | caption |
| `text-muted` | `#94A3B8` | 67% | 2.1:1 | disabled / metadata / placeholder |

## 2. Warna brand (navy UII)

| Shade | Hex |
|---|---|
| `brand-50` | `#e5eeff` |
| `brand-100` | `#ccddff` |
| `brand-200` | `#a3bef5` (border "field masih kosong") |
| `brand-600` | `#0044cd` (utama) |
| `brand-700` | `#003399` |
| `brand-800` | `#002266` |
| `brand-900` | `#001133` |

## 3. Warna pendukung

| Kelompok | Shade | Hex | Keterangan |
|---|---|---|---|
| **slate** | 50 / 100 / 200 / 400 / 500 / 600 / 900 | `#f8fafc` … `#0f172a` | `slate-500`=tertiary, `slate-600`=secondary |
| **cyan** | 50 / 100 / 600 / 800 / 900 | `#ecfeff` … `#104e64` | aksen sekunder |
| **red** | 100 / 800 | `#ffe2e2` / `#9f0712` | bahaya |
| **green** | 50 / 600 / 800 | `#f0fdf4` / `#00a63e` / `#016630` | sukses (toast berhasil) |

## 4. Permukaan & garis

| Token | Hex |
|---|---|
| `background-primary` | `#ffffff` |
| `background-secondary` | `#f9fafb` |
| `background-tertiary` | `#f3f4f6` |
| `background-disabled` | `#e5e7eb` (permukaan tombol disabled) |
| `border-secondary` | `#e5e7eb` |
| `border-white` | `#ffffff` |

## 5. Warna semantik

| Token | Hex | Penggunaan |
|---|---|---|
| `text-destructive` | `#e7000b` | penanda field wajib `*`, teks error, aksi hapus |
| `text-brand-1` | `#0044cd` | teks brand |
| warning | `#e17100` | tombol/aksi peringatan (dari stepper PILAR) |
| divider kuning | `#FFF67A` | divider header (desain PILAR node 7382-27382) |

## 6. Spacing

`50`=2px · `100`=4px · `150`=6px · `200`=8px · `250`=10px · `300`=12px · `400`=16px · `500`=20px · `600`=24px

## 7. Radius

| Token | Nilai |
|---|---|
| `rounded-s` | 8px |
| `rounded-m` | 10px |
| `rounded-l` | 12px |

> ⚠️ `rounded-s`/`rounded-l` bentrok dengan utility sisi Tailwind 3.4 — pakai `rounded-m` atau
> `rounded-[12px]` eksplisit.

## 8. Tipografi

**Font size (size / line-height):**
`body-xs` 10/14 · `body-s` 12/16 · `body-m` 14/20 · `heading-xxs` 14/20 · `heading-m` 24/28 · `metric-l` 28/32

**Font weight:** `regular` 400 · `medium` 500 · `semibold` 600 · `bold` 700

**Font family:** Inter.

## 9. Konvensi penting

- **Tombol disabled:** pakai `background-disabled` (#E5E7EB) + `text-muted` (#94A3B8) — **jangan** diredupkan `opacity`.
- **Border/focus:** tebal 2px, offset 2.
- **Label wajib:** teks label + tanda `*` dibungkus **satu** `<span>` (label pakai `flex flex-col`).
- **Brand cyan/red/background/radius/spacing** belum ada di dokumen audit (nilai dipertahankan dari implementasi) — tunggu library sumber bila perlu nilai kanonik.
