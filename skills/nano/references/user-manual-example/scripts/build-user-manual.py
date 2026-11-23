#!/usr/bin/env python3
"""Bangun contoh User Manual Penilaian Kinerja mengikuti template BSI UII.

Struktur & style mengikuti `templates/user-manual-template.docx`:
- Cover biru #093697, alamat/IT support, salam.
- Overview + garis besar alur (langkah yang jadi tanggung jawab user di-BOLD).
- Heading numbering MANUAL: H1 24pt bold highlight kuning, H2/H3 biru #093697 bold, H4 hitam bold.
- Tiap langkah: "Berikut langkah-langkah yang harus dilakukan, yaitu:", list bernomor,
  catatan italic, dan penutup "… telah selesai."
- Screenshot width 7.4in, proporsional, anotasi (panah) untuk memperjelas.
"""
import argparse, os, sys
from docx import Document
from docx.shared import Pt, RGBColor, Inches, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.text import WD_COLOR_INDEX
from docx.oxml.ns import qn, nsdecls
from docx.oxml import OxmlElement, parse_xml
import copy

# --- Konfigurasi (bisa dioverride lewat argumen CLI) ---
SKILL_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
_ap = argparse.ArgumentParser(description="Bangun user manual BSI UII dari template.")
_ap.add_argument("--out", default="Manual.docx", help="path file .docx hasil")
_ap.add_argument("--shots", default="shots", help="folder screenshot")
_ap.add_argument("--logo", default=os.path.join(SKILL_DIR, "templates", "cover-logo.png"))
_ap.add_argument("--bg", default=os.path.join(SKILL_DIR, "templates", "cover-bg.png"))
_args, _ = _ap.parse_known_args()

BLUE = RGBColor(0x09, 0x36, 0x97)
SHOTS = _args.shots
LOGO = _args.logo
BG = _args.bg

doc = Document()

# ---------- Page setup: A4, margin isi 0.4in ----------
sec = doc.sections[0]
sec.page_width = Inches(8.27)
sec.page_height = Inches(11.69)
for m in ("top_margin", "bottom_margin", "left_margin", "right_margin"):
    setattr(sec, m, Inches(0.8))

# ---------- Base font ----------
normal = doc.styles["Normal"]
normal.font.name = "Arial"
normal.font.size = Pt(11)
normal._element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")

# ---------- Heading styles (redefinisi agar sesuai template) ----------
def style_heading(name, size_pt, color, bold=True, highlight=False, level=1):
    st = doc.styles["Heading %d" % level]
    st.font.name = "Arial"
    st.font.size = Pt(size_pt)
    st.font.bold = bold
    if color is not None:
        st.font.color.rgb = color
    else:
        st.font.color.rgb = RGBColor(0, 0, 0)
    if highlight:
        st.font.highlight_color = WD_COLOR_INDEX.YELLOW
    # indent 0
    pf = st.paragraph_format
    pf.space_before = Pt(12); pf.space_after = Pt(6)
    pf.left_indent = Inches(0); pf.first_line_indent = Inches(0)

style_heading("H1", 24, BLUE, bold=True, highlight=True, level=1)
style_heading("H2", 18, BLUE, bold=True, level=2)
style_heading("H3", 14, BLUE, bold=True, level=3)
style_heading("H4", 11, None, bold=True, level=4)

# ---------- helpers ----------
def p(text="", size=11, bold=False, italic=False, color=None, align=None,
      space_after=None, space_before=None):
    para = doc.add_paragraph()
    if align is not None:
        para.alignment = align
    if space_after is not None:
        para.paragraph_format.space_after = Pt(space_after)
    if space_before is not None:
        para.paragraph_format.space_before = Pt(space_before)
    if text:
        r = para.add_run(text)
        r.font.size = Pt(size); r.font.bold = bold; r.font.italic = italic
        if color is not None:
            r.font.color.rgb = color
    return para

def h(level, text):
    para = doc.add_heading(level=level)
    r = para.add_run(text)
    return para

import re

def step_para(text, italic=False, size=11):
    """Paragraph langkah dengan indent kiri 0.25in; **teks** di-render bold."""
    para = doc.add_paragraph()
    para.paragraph_format.left_indent = Inches(0.25)
    para.paragraph_format.space_after = Pt(4)
    parts = re.split(r"(\*\*.*?\*\*|\*[^*]+?\*)", text)
    for part in parts:
        if part.startswith("**") and part.endswith("**"):
            r = para.add_run(part[2:-2]); r.font.bold = True; r.font.size = Pt(size)
        elif part.startswith("*") and part.endswith("*") and len(part) > 2:
            r = para.add_run(part[1:-1]); r.font.italic = True; r.font.size = Pt(size)
        elif part:
            r = para.add_run(part); r.font.size = Pt(size); r.font.italic = italic
    return para

def note(text):
    para = doc.add_paragraph()
    para.paragraph_format.left_indent = Inches(0.25)
    para.paragraph_format.space_after = Pt(6)
    for part in re.split(r"(\*\*.*?\*\*)", text):
        if part.startswith("**") and part.endswith("**"):
            r = para.add_run(part[2:-2]); r.font.italic = True; r.font.bold = True
        elif part:
            r = para.add_run(part); r.font.italic = True
        else:
            continue
        r.font.size = Pt(10); r.font.color.rgb = RGBColor(0x44, 0x44, 0x44)
    return para

def screenshot(path, caption=None, arrow=None):
    """width 7.4in, proporsional; caption italic kecil di bawah."""
    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    para.paragraph_format.space_before = Pt(4)
    para.paragraph_format.space_after = Pt(2)
    run = para.add_run()
    run.add_picture(path, width=Inches(6.0))  # 6in agar muat margin A4
    if caption:
        cap = doc.add_paragraph()
        cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cap.paragraph_format.space_after = Pt(10)
        cr = cap.add_run(caption); cr.font.italic = True; cr.font.size = Pt(9)
        cr.font.color.rgb = RGBColor(0x66, 0x66, 0x66)

def page_break():
    doc.add_page_break()

def add_cover_logo(path, width_in):
    """Logo UII inline di atas cover (seperti template)."""
    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    para.paragraph_format.space_after = Pt(18)
    para.add_run().add_picture(path, width=Inches(width_in))

def add_cover_background(path, width_in, height_in, v_from_page_in):
    """Grafik latar dekoratif melayang DI BELAKANG teks, posisi relatif halaman."""
    para = doc.add_paragraph()
    para.paragraph_format.space_after = Pt(0)
    run = para.add_run()
    run.add_picture(path, width=Inches(width_in), height=Inches(height_in))
    drawing = run._element.find(qn("w:drawing"))
    inline = drawing.find(qn("wp:inline"))
    extent = inline.find(qn("wp:extent"))
    graphic = inline.find(qn("a:graphic"))
    v_emu = int(v_from_page_in * 914400)
    anchor = parse_xml(
        f'<wp:anchor {nsdecls("wp","a","r","pic","w")} distT="0" distB="0" distL="0" distR="0" '
        f'simplePos="0" relativeHeight="0" behindDoc="1" locked="0" layoutInCell="1" allowOverlap="1">'
        f'<wp:simplePos x="0" y="0"/>'
        f'<wp:positionH relativeFrom="page"><wp:posOffset>0</wp:posOffset></wp:positionH>'
        f'<wp:positionV relativeFrom="page"><wp:posOffset>{v_emu}</wp:posOffset></wp:positionV>'
        f'</wp:anchor>'
    )
    # urutan anak sesuai skema OOXML
    anchor.append(extent)
    anchor.append(parse_xml(f'<wp:effectExtent {nsdecls("wp")} l="0" t="0" r="0" b="0"/>'))
    anchor.append(parse_xml(f'<wp:wrapNone {nsdecls("wp")}/>'))
    anchor.append(parse_xml(f'<wp:docPr {nsdecls("wp")} id="9001" name="cover-bg"/>'))
    anchor.append(graphic)
    drawing.remove(inline)
    drawing.append(anchor)

# ==================== COVER ====================
add_cover_logo(LOGO, 3.0)
for _ in range(2):
    p()
p("Manual", size=32, bold=True, color=BLUE, align=WD_ALIGN_PARAGRAPH.CENTER)
p("Penilai / Rekan Sejawat", size=28, bold=True, color=BLUE, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=4)
p("Penilaian Kinerja", size=18, color=BLUE, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=4)
p("v1.0", size=18, color=BLUE, align=WD_ALIGN_PARAGRAPH.CENTER)
# grafik latar dekoratif melayang di belakang teks (dari halaman ~6.3in)
add_cover_background(BG, 8.51, 4.73, 6.3)
for _ in range(4):
    p()
p("Kampus Terpadu UII Jalan Kaliurang km. 14,5", size=12, bold=True, color=BLUE)
p("Sleman Yogyakarta 55584", size=12, bold=True, color=BLUE)
p()
p("IT SUPPORT BSI - Phone: (0274) 898-444 Ext 1414/1415", size=12, bold=True, color=BLUE)
p("Email: itsupport@uii.ac.id", size=12, bold=True, color=BLUE)

page_break()

# ==================== PEMBUKA & OVERVIEW ====================
p("Assalamualaikum warahmatullahi wabarakatuh", space_before=0)
p()
p("Selamat datang dan terima kasih.", bold=False)

para = doc.add_paragraph()
r = para.add_run("Overview"); r.font.size = Pt(16); r.font.bold = True; r.font.color.rgb = BLUE
para.paragraph_format.space_before = Pt(8); para.paragraph_format.space_after = Pt(4)

p("Platform Penilaian Kinerja adalah sistem yang hadir untuk memudahkan proses penilaian "
  "kinerja pegawai di lingkungan Universitas Islam Indonesia. Sistem ini menggantikan proses "
  "penilaian berbasis Google Form yang memerlukan rekap manual menjadi aplikasi dengan alur "
  "menilai yang ringan dan skor yang transparan.")
p("Manual ini ditujukan untuk pengguna berperan sebagai penilai (rekan sejawat). Sebagai "
  "penilai, Anda menilai kinerja rekan satu tim menggunakan form penilaian yang isiannya "
  "menyesuaikan role yang dinilai.")
p("Secara garis besar, alur penilaian sebagai penilai adalah sebagai berikut:")
overview_steps = [
    ("Masuk ke aplikasi menggunakan email dan kata sandi.", True),
    ("Buka halaman Penilaian lalu pilih rekan yang akan dinilai.", True),
    ("Isi form penilaian sesuai komponen dan skala yang tersedia.", True),
    ("Simpan sebagai draf apabila belum selesai, atau kirim apabila sudah selesai.", True),
    ("Pemilik yang dinilai dapat melihat hasil penilaian secara transparan.", True),
]
for s, _ in overview_steps:
    step_para(f"**{s}**")
p("Selesai. Melalui manual ini, Anda dapat memaksimalkan pemanfaatan sistem penilaian "
  "kinerja sesuai standar yang telah ditetapkan.")

para = doc.add_paragraph()
r = para.add_run("Daftar isi:"); r.font.bold = True; r.font.size = Pt(11)
p("1. Masuk ke Aplikasi", space_before=0)
p("2. Membuka Form Penilaian")
p("3. Mengisi dan Mengirim Penilaian")

page_break()

# ==================== 1. MASUK KE APLIKASI ====================
h(1, "1. Masuk ke Aplikasi")
p("Untuk dapat menilai kinerja rekan, Anda harus masuk terlebih dahulu ke aplikasi "
  "Penilaian Kinerja menggunakan akun yang terdaftar.")
p("Berikut langkah-langkah yang harus dilakukan, yaitu:")
step_para("Langkah pertama silakan buka aplikasi Penilaian Kinerja pada peramban (browser). "
          "Akan tampil halaman **Masuk Penilaian Kinerja** seperti pada gambar berikut.")
screenshot(f"{SHOTS}/01-login.png", "Halaman masuk (login) Penilaian Kinerja")
step_para("Silakan isi **Email** dan **Kata sandi** akun Anda pada kolom yang tersedia. "
          "Klik ikon mata di kolom kata sandi untuk menampilkan atau menyamarkan kata sandi.")
note("Catatan: Email dan kata sandi menggunakan akun yang telah didaftarkan oleh pihak IT. "
     "Jika lupa kata sandi, silakan klik tautan Atur ulang kata sandi.")
step_para("Setelah data terisi, silakan klik tombol **Masuk**.")
step_para("Apabila email dan kata sandi benar, Anda akan diarahkan ke halaman Beranda "
          "Penilaian Kinerja.")
note("Catatan: Apabila muncul pesan kesalahan, periksa kembali email dan kata sandi Anda, "
     "lalu ulangi proses masuk.")
p("Pada tahap ini, proses masuk ke aplikasi telah selesai.")

# ==================== 2. MEMBUKA FORM PENILAIAN ====================
h(1, "2. Membuka Form Penilaian")
p("Setelah berhasil masuk, Anda akan menemukan daftar rekan satu tim yang perlu dinilai.")
p("Berikut langkah-langkah yang harus dilakukan, yaitu:")
step_para("Pada menu **Penilaian**, silakan pilih **Penilaian Kinerja** untuk membuka halaman "
          "**Daftar Karyawan**.")
step_para("Pada halaman Daftar Karyawan akan tampil daftar rekan beserta kolom **Nama**, "
          "**Role**, **Hubungan**, **Status**, dan **Aksi**. Perhatikan indikator progres "
          "\"Sudah X dari Y dinilai\" di atas tabel.")
screenshot(f"{SHOTS}/02-team.png", "Halaman Daftar Karyawan beserta progres penilaian")
step_para("Status tiap rekan ditampilkan melalui label berwarna, yaitu **Selesai** (hijau), "
          "**Draf** (kuning), dan **Belum** (abu-abu).")
note("Catatan: Status **Draf** menandakan penilaian sudah dimulai namun belum dikirim, "
     "sehingga dapat dilanjutkan kapan saja.")
step_para("Silakan klik tombol **Nilai** pada baris rekan yang ingin dinilai. Untuk menilai "
          "diri sendiri, klik tombol **Nilai diri**.")
step_para("Halaman **Form Penilaian** akan terbuka dan menampilkan nama rekan yang dinilai. "
          "Isian form otomatis menyesuaikan role rekan tersebut sehingga penilai tidak perlu "
          "memilih role secara manual.")
p("Pada tahap ini, proses membuka form penilaian telah selesai.")

# ==================== 3. MENGISI DAN MENGIRIM ====================
h(1, "3. Mengisi dan Mengirim Penilaian")
p("Pada tahap ini, Anda mengisi seluruh pertanyaan penilaian lalu mengirimkannya.")
p("Berikut langkah-langkah yang harus dilakukan, yaitu:")
step_para("Pada halaman Form Penilaian, silakan pilih **Hubungan Anda dengan yang dinilai** "
          "melalui menu tarik-turun (misalnya *Rekan sejawat*).")
step_para("Pilih komponen penilaian melalui tab yang tersedia (misalnya **Core Value**). "
          "Setiap pertanyaan diberi skala **0 sampai 5** beserta penjelasannya.")
screenshot(f"{SHOTS}/05-results-q.png" if False else f"{SHOTS}/03-assess.png",
           "Halaman Form Penilaian dengan tab komponen dan skala 0–5")
step_para("Untuk setiap pertanyaan, silakan pilih salah satu nilai pada skala yang paling "
          "sesuai dengan perilaku rekan yang dinilai. Anda dapat menuliskan contoh perilaku "
          "pada kolom yang tersedia.")
note("Catatan: Gunakan tombol **Selanjutnya** dan **Sebelumnya** untuk berpindah antar "
     "komponen. Indikator \"X dari Y pertanyaan\" menunjukkan progres pengisian.")
step_para("Setelah semua pertanyaan terisi, silakan tuliskan **alasan** penilaian untuk setiap "
          "komponen.")
step_para("Apabila penilaian belum selesai, silakan klik tombol **Draf** untuk menyimpan "
          "sementara tanpa mengirim.", size=11)
note("Catatan: Penilaian berstatus draf tidak ikut dihitung. Penilaian hanya dihitung setelah "
     "dikirim.")
step_para("Apabila seluruh isian sudah sesuai dan objektif, silakan klik tombol "
          "**Selanjutnya** hingga tahap akhir lalu klik **Kirim**.")
step_para("Setelah dikirim, status rekan di halaman Daftar Karyawan akan berubah menjadi "
          "**Selesai** dan progres penilaian bertambah.")
p("Pada tahap ini, proses mengisi dan mengirim penilaian telah selesai.")

page_break()

# ==================== PENUTUP ====================
h(2, "Penutup")
p("Sekilas, hasil penilaian dapat dilihat pada halaman Hasil Penilaian yang menampilkan "
  "total skor beserta rincian per komponen dan bobotnya secara transparan.")
screenshot(f"{SHOTS}/05-results.png", "Contoh halaman Hasil Penilaian yang transparan")
p()
p("Demikian manual Penilaian Kinerja untuk pengguna penilai (rekan sejawat). Semoga dengan "
  "hadirnya sistem ini dapat memberikan kemudahan dan kelancaran dalam proses penilaian "
  "kinerja.")
p()
p("Terima kasih atas waktu dan perhatiannya.")
p()
p("Wassalamualaikum warahmatullahi wabarakatuh")

out = _args.out
doc.save(out)
print("saved:", out)
