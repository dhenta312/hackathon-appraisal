// table-final.mjs — rebuild DOCUMENT-SPEC: tabel dengan bulletList/orderedList + gambar full-screen (700px).
import { readFileSync } from 'node:fs';
import { mdToADF } from './convert.mjs';

function loadEnv(p){const o={};for(const l of readFileSync(p,'utf8').split('\n')){const t=l.trim();if(!t||t.startsWith('#'))continue;const i=t.indexOf('=');if(i===-1)continue;o[t.slice(0,i).trim()]=t.slice(i+1).trim();}return o;}
const { CONFLUENCE_BASE_URL, CONFLUENCE_EMAIL, CONFLUENCE_TOKEN } = loadEnv('../.env.confluence');
const auth = 'Basic ' + Buffer.from(`${CONFLUENCE_EMAIL}:${CONFLUENCE_TOKEN}`).toString('base64');
const PAGE_ID = '1404797056';
const IMG_W = 700;

async function api(method,path,body,extra={}){const r=await fetch(`${CONFLUENCE_BASE_URL}${path}`,{method,headers:{Accept:'application/json',Authorization:auth,...extra,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,json:await r.json().catch(()=>null)};}
async function upload(pageId, filePath, filename) {
  const buf = readFileSync(filePath);
  const fd = new FormData();
  fd.append('file', new Blob([buf], { type:'image/png' }), filename);
  const r = await fetch(`${CONFLUENCE_BASE_URL}/wiki/rest/api/content/${pageId}/child/attachment`, { method:'POST', headers:{Authorization:auth,'X-Atlassian-Token':'no-check'}, body:fd });
  const j = await r.json().catch(()=>null);
  const attId = j.results?.[0]?.id;
  const v2 = await api('GET', `/wiki/api/v2/attachments/${attId}`);
  return { fileId: v2.json?.fileId, collection: pageId, attId };
}
function mediaNode(att, maxW) {
  return { type:'mediaSingle', attrs:{layout:'align-start', width:maxW, widthType:'pixel'}, content:[{ type:'media', attrs:{ type:'file', id:att.fileId, collection:att.collection } }] };
}
// inline markdown → node inline ADF (ambil isi paragraf pertama)
function inline(mdText) {
  const adf = mdToADF(mdText, { resolveImage: () => null });
  const first = adf.content[0];
  return first?.content || [{ type:'text', text: mdText }];
}

// 1) parse DOCUMENT-SPEC.md
const md = readFileSync('../docs/DOCUMENT-SPEC.md','utf8');
const lines = md.split('\n');
const tableStart = lines.findIndex(l => /^\|\s*No\s*\|/.test(l));
const dataLines = lines.slice(tableStart + 2).filter(l => /^\|/.test(l) && l.trim() !== '');
const intro = lines.slice(0, tableStart).filter(l => !/^##\s+UI Design Specifications Flow/.test(l)).join('\n').trim();

const rows = [];
const screenshots = []; // {name, shotFile}
for (const line of dataLines) {
  const cells = line.split('|').map(c => c.trim()).filter(c => c !== '');
  const [no, uiDesign, specs, flow] = cells;
  const uiParts = uiDesign.split(/<br\s*\/?>/i).map(p => p.trim()).filter(Boolean);
  const title = uiParts[0] || '';
  const image = uiParts.find(p => p.includes('![')) || '';
  const shotSrc = (image.match(/\(([^)]+)\)/) || [,''])[1]; // e.g. screenshots/01-dashboard.png
  const fname = shotSrc.split('/').pop();
  const shotFile = { '03-tambah-pegawai.png':'03-form-tambah.png' }[fname] || fname;
  screenshots.push(shotFile);

  const specItems = specs.split(/<br\s*\/?>/i).map(p => p.trim()).filter(Boolean).map(p => p.replace(/^•\s*/,''));
  const flowItems = flow.split(/<br\s*\/?>/i).map(p => p.trim()).filter(Boolean).map(p => p.replace(/^\d+\.\s*/,''));
  rows.push({ no, title, shotFile, specItems, flowItems });
}

// 2) hapus attachment lama, upload baru
const existing = await api('GET', `/wiki/api/v2/pages/${PAGE_ID}/attachments`);
for (const a of (existing.json?.results||[])) await api('DELETE', `/wiki/rest/api/content/${a.id}`);
const map = {};
for (const f of [...new Set(screenshots)]) {
  const att = await upload(PAGE_ID, `shots/${f}`, f);
  map[f] = att;
}

// 3) bangun ADF
const introAdf = mdToADF(intro, { resolveImage: () => null });
const tableContent = [
  { type:'tableRow', content: ['No','UI Design','Specifications','Flow'].map(h => ({ type:'tableHeader', attrs:{}, content:[{ type:'paragraph', content:[{ type:'text', text:h, marks:[{type:'strong'}] }] }] })) },
];
for (const r of rows) {
  const att = map[r.shotFile];
  tableContent.push({ type:'tableRow', content: [
    { type:'tableCell', attrs:{}, content:[{ type:'paragraph', content:[{ type:'text', text:r.no }] }] },
    { type:'tableCell', attrs:{}, content:[
      { type:'paragraph', content: inline(r.title) },
      att ? mediaNode(att, IMG_W) : { type:'paragraph', content:[{ type:'text', text:'(gambar)' }] },
    ] },
    { type:'tableCell', attrs:{}, content:[{ type:'bulletList', content: r.specItems.map(it => ({ type:'listItem', content:[{ type:'paragraph', content: inline(it) }] })) }] },
    { type:'tableCell', attrs:{}, content:[{ type:'orderedList', attrs:{order:1}, content: r.flowItems.map(it => ({ type:'listItem', content:[{ type:'paragraph', content: inline(it) }] })) }] },
  ] });
}
const table = { type:'table', attrs:{ layout:'default' }, content: tableContent };

const adf = { version:1, type:'doc', content:[
  ...introAdf.content,
  { type:'heading', attrs:{level:2}, content:[{ type:'text', text:'UI Design Specifications Flow' }] },
  table,
] };

// 4) update
const cur = await api('GET', `/wiki/api/v2/pages/${PAGE_ID}`);
const ver = cur.json?.version?.number ?? 1;
const r = await api('PUT', `/wiki/api/v2/pages/${PAGE_ID}`, {
  id: PAGE_ID, status:'current', title:'DOCUMENT-SPEC — App Purnatugas', spaceId:'4849676',
  version:{number: ver+1}, body:{ representation:'atlas_doc_format', value: JSON.stringify(adf) },
});
console.log('update ->', r.status, '| versi', r.json?.version?.number);
if (r.status >= 300) { console.log(JSON.stringify(r.json).slice(0,800)); process.exit(1); }
console.log('OK:', `${CONFLUENCE_BASE_URL}/wiki/spaces/AT/pages/${PAGE_ID}`);
