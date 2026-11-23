import zipfile, base64, re, html, argparse
from docx import Document
from docx.oxml.ns import qn

_ap = argparse.ArgumentParser(description="Konversi .docx user manual -> HTML (untuk print ke PDF).")
_ap.add_argument("docx", help="path file .docx")
_ap.add_argument("--out", default="manual.html", help="path HTML hasil")
_args = _ap.parse_args()

DOCX = _args.docx
OUT_HTML = _args.out

doc = Document(DOCX)
zipf = zipfile.ZipFile(DOCX)

rels = {}
for rid, rel in doc.part.rels.items():
    if "image" in rel.reltype:
        tgt = rel.target_ref
        if not tgt.startswith("word/"):
            tgt = "word/" + tgt
        rels[rid] = tgt

def img_data_uri(rid):
    path = rels.get(rid)
    if not path: return None
    try:
        data = zipf.read(path)
    except KeyError:
        return None
    ext = path.rsplit(".",1)[-1].lower()
    mime = "image/png" if ext=="png" else "image/jpeg" if ext in ("jpg","jpeg") else "image/"+ext
    return f"data:{mime};base64," + base64.b64encode(data).decode()

A = 'http://schemas.openxmlformats.org/drawingml/2006/main'

def run_html(run):
    if not run.text:
        return ""
    style = []
    if run.bold: style.append("font-weight:700")
    if run.italic: style.append("font-style:italic")
    c = run.font.color
    if c and c.rgb is not None: style.append(f"color:#{c.rgb}")
    if run.font.size: style.append(f"font-size:{run.font.size.pt}pt")
    if run.font.highlight_color is not None and str(run.font.highlight_color).startswith("YELLOW"):
        style.append("background:#fff200")
    s = f' style="{";".join(style)}"' if style else ""
    return f"<span{s}>{html.escape(run.text)}</span>"

def collect_images(p):
    """Kembalikan (inline_imgs, bg_imgs) tiap elemen (uri, width_in)."""
    inline_imgs, bg_imgs = [], []
    for drawing in p._element.iter(qn('w:drawing')):
        inline = drawing.find(qn('wp:inline'))
        anchor = drawing.find(qn('wp:anchor'))
        node = inline if inline is not None else anchor
        if node is None: continue
        ext = node.find(qn('wp:extent'))
        w = int(ext.get('cx'))/914400 if (ext is not None and ext.get('cx')) else None
        for blip in node.iter(f'{{{A}}}blip'):
            uri = img_data_uri(blip.get(qn('r:embed')))
            if not uri: continue
            (inline_imgs if inline is not None else bg_imgs).append((uri, w))
    return inline_imgs, bg_imgs

def has_page_break(p):
    for br in p._element.iter(qn('w:br')):
        if br.get(qn('w:type')) == 'page':
            return True
    return False

HSTYLE = {"Heading 1":"h1","Heading 2":"h2","Heading 3":"h3","Heading 4":"h4"}

from docx.enum.text import WD_ALIGN_PARAGRAPH
def align_css(p):
    a = p.alignment
    if a == WD_ALIGN_PARAGRAPH.CENTER: return "text-align:center;"
    if a == WD_ALIGN_PARAGRAPH.RIGHT: return "text-align:right;"
    if a == WD_ALIGN_PARAGRAPH.JUSTIFY: return "text-align:justify;"
    return ""

# ---- susun per halaman (split di page break) ----
pages = []          # daftar (list paragraf-html, list bg image)
cur = []
cur_bgs = []
for p in doc.paragraphs:
    tag = HSTYLE.get(p.style.name, "p")
    inlines, bgs = collect_images(p)
    inner = "".join(run_html(r) for r in p.runs)
    inner += "".join(
        f'<img src="{u}" style="width:{w:.2f}in;display:block;margin:8px auto;">' if w
        else f'<img src="{u}" style="max-width:100%;display:block;margin:8px auto;">'
        for u, w in inlines
    )
    cur_bgs.extend(bgs)
    on_cover = (len(pages) == 0)
    al = align_css(p)
    if tag == "p":
        is_note = bool(p.runs) and all((r.italic or not r.text) for r in p.runs) and p.text.strip()
        cls = ' class="note"' if is_note else ""
        if inner.strip():
            cur.append(f'<p{cls} style="{al}">{inner}</p>')
        elif on_cover and not has_page_break(p):
            cur.append('<p class="sp">&nbsp;</p>')  # pertahankan jarak di cover
    else:
        cur.append(f'<{tag} style="{al}">{inner}</{tag}>')
    if has_page_break(p):
        pages.append((cur, cur_bgs)); cur, cur_bgs = [], []
if cur:
    pages.append((cur, cur_bgs))

# ---- rakit HTML: tiap halaman = div.page, halaman 1 = cover dengan bg ----
page_html = []
for idx, (content_list, bgs) in enumerate(pages):
    bg_html = "".join(f'<img class="cover-bg" src="{u}" />' for u, w in bgs)
    cls = "page cover" if idx == 0 else "page"
    page_html.append(
        f'<div class="{cls}">{bg_html}<div class="content">{"".join(content_list)}</div></div>'
    )

html_doc = f"""<!doctype html><html><head><meta charset="utf-8"><style>
@page {{ size: A4; margin: 0; }}
* {{ box-sizing: border-box; }}
body {{ margin:0; font-family: Arial, Helvetica, sans-serif; font-size: 11pt; color:#000; line-height:1.4; }}
.page {{ position: relative; width: 210mm; min-height: 297mm; padding: 0.8in; page-break-after: always; overflow: hidden; }}
.page:last-child {{ page-break-after: auto; }}
.cover {{ height: 297mm; }}
.cover-bg {{ position: absolute; left: 0; bottom: 0; width: 100%; z-index: 0; }}
.content {{ position: relative; z-index: 1; }}
p {{ margin: 0 0 8px 0; text-align: justify; }}
h1 {{ font-size:24pt; font-weight:700; color:#093697; margin:14px 0 8px; page-break-after:avoid; }}
h1 span {{ background:#fff200; }}
h2 {{ font-size:18pt; font-weight:700; color:#093697; margin:12px 0 6px; page-break-after:avoid; }}
h3 {{ font-size:14pt; font-weight:700; color:#093697; margin:10px 0 6px; }}
h4 {{ font-size:11pt; font-weight:700; color:#000; margin:8px 0 4px; }}
p.note {{ font-style:italic; color:#444; font-size:10pt; margin-left:18px; }}
p.sp {{ height:16pt; margin:0; }}
img {{ max-width:100%; }}
</style></head><body>
{''.join(page_html)}
</body></html>"""

open(OUT_HTML,"w",encoding="utf-8").write(html_doc)
print("HTML:", OUT_HTML, "| halaman:", len(pages), "| imgs:", len(rels))
