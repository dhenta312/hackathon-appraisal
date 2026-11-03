---
name: editing-powerpoint-with-python
description: Use when programmatically editing PowerPoint (.pptx) decks — inspecting structure, changing text without breaking inherited formatting, replacing or removing pictures, deleting slides, adding colored shapes, or generating diagrams to embed with Pillow.
---

# Editing PowerPoint with Python

Otomasi deck `.pptx` memakai `python-pptx` (manipulasi) + `Pillow` (generate diagram).

## Prasyarat & backup

```bash
pip install python-pptx pillow
cp deck.pptx deck-backup.pptx   # SELALU backup sebelum edit
```

## Inspect struktur dulu

Sebelum mengubah apa pun, pahami struktur deck: layout yang dipakai, nama shape,
posisi, dan di mana formatting (font/warna) sebenarnya didefinisikan.

```python
from pptx import Presentation
p = Presentation("deck.pptx")
for i, slide in enumerate(p.slides, 1):
    print(i, slide.slide_layout.name)
    for shape in slide.shapes:
        print("  ", shape.name, shape.shape_type, getattr(shape, "text", "")[:60])
```

`shape.shape_type == 13` = gambar (PICTURE), `1` = autoshape (rectangle dsb).

## Edit teks tanpa merusak formatting

Deck hasil desain biasanya mewariskan font/warna dari theme (`run.font.color is None`
= warna tema, bukan hilang). **Jangan** `clear()` lalu `add_paragraph()` — itu bisa
mereset `defRPr`. Reuse run pertama, baru tambah/hapus paragraf:

```python
def set_text(shape, lines):
    tf = shape.text_frame
    for i, line in enumerate(lines):
        if i < len(tf.paragraphs):
            p = tf.paragraphs[i]
            if p.runs:
                p.runs[0].text = line
                for extra in p.runs[1:]:          # buang run tambahan
                    extra._r.getparent().remove(extra._r)
            else:
                p.add_run().text = line
        else:
            tf.add_paragraph().text = line
    while len(tf.paragraphs) > len(lines):        # hapus paragraf berlebih
        tf.paragraphs[-1]._p.getparent().remove(tf.paragraphs[-1]._p)
```

Temukan shape berdasarkan nama (`TextBox 2` = judul, `TextBox 4` = bullet, dsb.):

```python
def find_shape(slide, name):
    return next((s for s in slide.shapes if s.name == name), None)
```

## Ganti / hapus gambar

```python
# ganti gambar di posisi yang sama
old = next((s for s in slide.shapes if s.shape_type == 13), None)
left, top, width = old.left, old.top, old.width
old._element.getparent().remove(old._element)
slide.shapes.add_picture("baru.png", left, top, width=width)  # tinggi ikut rasio

# hapus semua gambar
for s in list(slide.shapes):
    if s.shape_type == 13:
        s._element.getparent().remove(s._element)
```

## Hapus slide

```python
def delete_slide(prs, index):                     # index 0-based
    sldIdLst = prs.slides._sldIdLst
    sldId = sldIdLst[index]
    rId = sldId.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
    prs.part.drop_rel(rId)
    sldIdLst.remove(sldId)
```

Hapus dari index terbesar dulu bila menghapus beberapa, agar index tidak bergeser.

## Tambah aksen (bar, badge) dengan warna

```python
from pptx.util import Inches
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(0.14), Inches(7.5))
bar.fill.solid(); bar.fill.fore_color.rgb = RGBColor(0x00, 0x44, 0xCD)
bar.line.fill.background()          # tanpa garis
bar.shadow.inherit = False          # hilangkan bayangan default autoshape
```

Untuk warna judul: `run.font.color.rgb = RGBColor(...)`.

## Generate diagram dengan Pillow lalu tanam

Gambar diagram (kartu, panah, teks) dengan Pillow, simpan PNG, lalu `add_picture`.
Gunakan font TTF sistem agar teks tajam (macOS: `/System/Library/Fonts/Supplemental/Arial.ttf`).

```python
from PIL import Image, ImageDraw, ImageFont
img = Image.new("RGB", (2200, 600), "white"); d = ImageDraw.Draw(img)
f = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 30)
d.rounded_rectangle([50, 50, 600, 400], radius=24, outline=(0,68,205), width=4)
w = d.textlength("Teks", font=f); d.text((c - w/2, y), "Teks", font=f, fill=(16,24,40))
img.save("diagram.png")
```

## Jebakan umum

| Gejala | Sebab / solusi |
| --- | --- |
| `shape.fill.fore_color.rgb` bernilai `None` | Fill pakai warna tema (`schemeClr`), bukan RGB eksplisit. Lihat XML mentah untuk warna sesungguhnya. |
| Teks berubah jadi polos setelah edit | Formatting diwariskan — pakai pola `set_text` di atas, jangan `clear()`. |
| `add_shape` menampilkan bayangan | Set `shape.shadow.inherit = False`. |
| Hapus beberapa slide urutannya kacau | Hapus dari index terbesar. |
| Gambar baru kepotong/aneh | `add_picture(width=...)` menjaga rasio; jangan set tinggi & lebar sekaligus. |
