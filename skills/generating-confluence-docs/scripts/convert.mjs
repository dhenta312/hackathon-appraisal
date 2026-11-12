// convert.mjs — Markdown → Atlassian Document Format (ADF) JSON.
// Digunakan oleh main.mjs untuk mengubah docs/*.md menjadi body halaman Confluence.
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,     // raw HTML jadi token html_inline/html_block agar <br> bisa ditangani
  breaks: false,
  linkify: false,
  typographer: false,
});
md.enable(['table', 'strikethrough']);

// Bahasa code fence → bahasa yang dikenal editor Confluence (fallback: tanpa language).
const LANG_MAP = {
  jsonc: 'json',
  json: 'json',
  bash: 'shell',
  sh: 'shell',
  shell: 'shell',
  ts: 'typescript',
  typescript: 'typescript',
  js: 'javascript',
  javascript: 'javascript',
  html: 'xml',
  xml: 'xml',
  php: 'php',
  sql: 'sql',
  md: 'markdown',
  yml: 'yaml',
  yaml: 'yaml',
  text: 'plain',
  txt: 'plain',
  '': 'plain',
};

// Escape & < > agar tidak dianggap markup oleh format storage (XML) Confluence.
// CATATAN: sekarang kita kirim sebagai `atlas_doc_format` (teks literal, bukan XML),
// sehingga escaping tidak diperlukan lagi — fungsi ini kini no-op. Dipertahankan
// agar titik pemanggilan tidak berubah (bisa diaktifkan ulang jika kembali ke storage).
function escapeHtml(s) {
  return String(s);
}

function normLang(info) {
  const key = (info || '').trim().toLowerCase();
  if (LANG_MAP[key] !== undefined) return LANG_MAP[key];
  // Kenali awalan kata pertama, mis. "js tab=..." → js
  const first = key.split(/[\s{]/)[0];
  return LANG_MAP[first] !== undefined ? LANG_MAP[first] : null;
}

// ---------------------------------------------------------------------------
// Inline (token.children) → array node blok ADF (paragraph / mediaSingle).
// Gambar (mediaSingle) bersifat block, sehingga satu baris inline bisa
// menghasilkan beberapa blok.
// ---------------------------------------------------------------------------
function inlineToBlocks(inlineToken, ctx) {
  const children = inlineToken.children || [];
  const blocks = [];
  let buffer = []; // isi paragraph yang sedang dirakit (array inline ADF)
  const marks = []; // stack mark ADF

  const flush = () => {
    // buang hardBreak trailing (sisa <br> tepat sebelum gambar)
    while (buffer.length && buffer[buffer.length - 1].type === 'hardBreak') buffer.pop();
    if (buffer.length) {
      blocks.push({ type: 'paragraph', content: buffer });
      buffer = [];
    }
  };

  const pushText = (text, extraMarks = []) => {
    if (!text) return;
    const allMarks = [...marks, ...extraMarks];
    const node = { type: 'text', text: escapeHtml(text) };
    if (allMarks.length) node.marks = allMarks;
    buffer.push(node);
  };

  for (const c of children) {
    switch (c.type) {
      case 'text':
        pushText(c.content);
        break;
      case 'code_inline':
        pushText(c.content, [{ type: 'code' }]);
        break;
      case 'softbreak':
        pushText(' ');
        break;
      case 'hardbreak':
        pushText('\n');
        break;
      case 'strong_open':
        marks.push({ type: 'strong' });
        break;
      case 'strong_close':
        marks.pop();
        break;
      case 'em_open':
        marks.push({ type: 'em' });
        break;
      case 'em_close':
        marks.pop();
        break;
      case 's_open':
        marks.push({ type: 'strike' });
        break;
      case 's_close':
        marks.pop();
        break;
      case 'link_open': {
        const href = c.attrs?.find((a) => a[0] === 'href')?.[1] || '';
        marks.push({ type: 'link', attrs: { href } });
        break;
      }
      case 'link_close':
        marks.pop();
        break;
      case 'html_inline': {
        const raw = c.content;
        if (/^\s*<br\s*\/?>\s*$/i.test(raw)) {
          buffer.push({ type: 'hardBreak' });
        } else {
          // HTML lain (kebanyakan sudah di dalam backtick) → tampilkan sebagai teks polos
          pushText(raw);
        }
        break;
      }
      case 'image': {
        flush();
        const src = c.attrs?.find((a) => a[0] === 'src')?.[1] || '';
        const alt = c.content || '';
        const media = ctx.resolveImage ? ctx.resolveImage(src, alt) : null;
        if (media) {
          blocks.push(media);
        } else {
          blocks.push({ type: 'paragraph', content: [{ type: 'text', text: escapeHtml(alt || src) }] });
        }
        break;
      }
      default:
        // token lain (entity, dsb.) abaikan
        break;
    }
  }
  flush();
  return blocks;
}

// ---------------------------------------------------------------------------
// Blok
// ---------------------------------------------------------------------------
function blockToADF(tokens, i, ctx) {
  const open = tokens[i];
  switch (open.type) {
    case 'heading_open': {
      const level = Number(open.tag.slice(1)) || 1;
      const inline = tokens[i + 1];
      return {
        type: 'heading',
        attrs: { level },
        content: inlineToBlocks(inline, ctx).flatMap((b) => b.content ?? []),
      };
    }
    case 'paragraph_open': {
      const inline = tokens[i + 1];
      return inlineToBlocks(inline, ctx);
    }
    case 'fence':
    case 'code_block': {
      return {
        type: 'codeBlock',
        attrs: { language: normLang(open.info) },
        content: [{ type: 'text', text: escapeHtml(open.content) }],
      };
    }
    case 'hr':
      return { type: 'rule' };
    case 'bullet_list_open':
    case 'ordered_list_open': {
      const ordered = open.type === 'ordered_list_open';
      const items = [];
      let j = i + 1;
      while (j < tokens.length && tokens[j].type !== (ordered ? 'ordered_list_close' : 'bullet_list_close')) {
        if (tokens[j].type === 'list_item_open') {
          const item = { type: 'listItem', content: [] };
          let k = j + 1;
          while (k < tokens.length && tokens[k].type !== 'list_item_close') {
            const tk = tokens[k];
            if (tk.type === 'paragraph_open') {
              item.content.push(...inlineToBlocks(tokens[k + 1], ctx));
              k += 2;
            } else if (tk.type === 'bullet_list_open' || tk.type === 'ordered_list_open') {
              const sub = blockToADF(tokens, k, ctx);
              item.content.push(sub.node);
              k = sub.end + 1;
            } else {
              k++;
            }
          }
          items.push(item);
          j = k + 1;
        } else {
          j++;
        }
      }
      const node = { type: ordered ? 'orderedList' : 'bulletList', content: items };
      if (ordered) node.attrs = { order: Number(open.attrGet('start') || 1) };
      return { node, end: j };
    }
    case 'blockquote_open': {
      const content = [];
      let j = i + 1;
      while (j < tokens.length && tokens[j].type !== 'blockquote_close') {
        const tk = tokens[j];
        if (tk.nesting === 1) {
          const b = blockToADF(tokens, j, ctx);
          if (Array.isArray(b)) content.push(...b);
          else if (b.node) { content.push(b.node); j = b.end; continue; }
          else content.push(b);
        }
        j++;
      }
      return { node: { type: 'blockquote', content }, end: j };
    }
    case 'table_open': {
      const rows = [];
      let j = i + 1;
      while (j < tokens.length && tokens[j].type !== 'table_close') {
        const tk = tokens[j];
        if (tk.type === 'tr_open') {
          const row = { type: 'tableRow', content: [] };
          let k = j + 1;
          let isHeader = false;
          while (k < tokens.length && tokens[k].type !== 'tr_close') {
            const cellTk = tokens[k];
            if (cellTk.type === 'th_open') {
              isHeader = true;
              const inline = tokens[k + 1];
              row.content.push({ type: 'tableHeader', attrs: {}, content: inlineToBlocks(inline, ctx) });
              k += 2;
            } else if (cellTk.type === 'td_open') {
              const inline = tokens[k + 1];
              row.content.push({ type: 'tableCell', attrs: {}, content: inlineToBlocks(inline, ctx) });
              k += 2;
            } else {
              k++;
            }
          }
          rows.push(row);
          j = k + 1;
        } else {
          j++;
        }
      }
      return {
        node: {
          type: 'table',
          attrs: { isNumberColumnEnabled: false, layout: 'default' },
          content: rows,
        },
        end: j,
      };
    }
    case 'html_block': {
      const text = open.content.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '');
      if (!text.trim()) return [];
      return { type: 'paragraph', content: [{ type: 'text', text: escapeHtml(text.trim()) }] };
    }
    default:
      return [];
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
export function mdToADF(markdown, { resolveImage } = {}) {
  const tokens = md.parse(markdown, {});
  const ctx = { resolveImage };
  const content = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.nesting !== 1 && !['fence', 'code_block', 'hr', 'html_block'].includes(t.type)) continue;
    const b = blockToADF(tokens, i, ctx);
    if (Array.isArray(b)) {
      content.push(...b);
    } else if (b && b.node) {
      content.push(b.node);
      i = b.end;
    } else if (b && b.type) {
      content.push(b);
    }
  }
  return { version: 1, type: 'doc', content };
}
