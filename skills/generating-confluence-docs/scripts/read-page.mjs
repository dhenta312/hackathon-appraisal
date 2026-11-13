// read-page.mjs — baca halaman Confluence dari URL/ID, lalu konversi ADF → markdown.
// Penggunaan: node read-page.mjs "<url-atau-pageId>"
import { readFileSync } from 'node:fs';

function loadEnv(p){const o={};for(const l of readFileSync(p,'utf8').split('\n')){const t=l.trim();if(!t||t.startsWith('#'))continue;const i=t.indexOf('=');if(i===-1)continue;o[t.slice(0,i).trim()]=t.slice(i+1).trim();}return o;}
const { CONFLUENCE_BASE_URL, CONFLUENCE_EMAIL, CONFLUENCE_TOKEN } = loadEnv('../.env.confluence');
const auth = 'Basic ' + Buffer.from(`${CONFLUENCE_EMAIL}:${CONFLUENCE_TOKEN}`).toString('base64');

function extractPageId(input) {
  const m = String(input).match(/\/pages\/(\d+)/);
  return m ? m[1] : String(input).replace(/[^\d]/g, '');
}

// ADF → markdown (sederhana tapi cukup untuk bahan diskusi)
function inline(node) { return (node.content || []).map(adfToMarkdown).join(''); }
function adfToMarkdown(node) {
  switch (node.type) {
    case 'text': return node.text || '';
    case 'hardBreak': return '\n';
    case 'paragraph': return inline(node) + '\n\n';
    case 'heading': return '#'.repeat(node.attrs?.level || 1) + ' ' + inline(node) + '\n\n';
    case 'blockquote': return '> ' + inline(node).trim() + '\n\n';
    case 'codeBlock': return '```\n' + inline(node) + '\n```\n\n';
    case 'rule': return '---\n\n';
    case 'bulletList':
      return (node.content || []).map(it => '- ' + inline(it).trim()).join('\n') + '\n\n';
    case 'orderedList':
      return (node.content || []).map((it, i) => `${i + 1}. ` + inline(it).trim()).join('\n') + '\n\n';
    case 'listItem': return inline(node);
    case 'table': {
      const rows = (node.content || []).map(row =>
        '| ' + (row.content || []).map(cell => inline(cell).replace(/\n+/g, ' ').trim()).join(' | ') + ' |');
      return rows.join('\n') + '\n\n';
    }
    case 'mediaSingle': case 'media': return '*(gambar)*\n\n';
    default: return inline(node);
  }
}

const input = process.argv[2];
if (!input) { console.error('Gunakan: node read-page.mjs "<url-atau-pageId>"'); process.exit(1); }
const pageId = extractPageId(input);
if (!pageId) { console.error('Page ID tidak ditemukan dari:', input); process.exit(1); }

const r = await fetch(`${CONFLUENCE_BASE_URL}/wiki/api/v2/pages/${pageId}?body-format=atlas_doc_format`, {
  headers: { Accept: 'application/json', Authorization: auth },
});
if (r.status >= 300) { console.error('Gagal baca halaman:', r.status); process.exit(1); }
const j = await r.json();
const body = JSON.parse(j.body?.value || '{}');

console.log('# ' + j.title + '\n');
console.log(adfToMarkdown(body).trim());
