// upload-atlas.mjs — upload semua dokumen ke Confluence memakai format editor baru (atlas_doc_format).
import { readFileSync, writeFileSync } from 'node:fs';
import { mdToADF } from './convert.mjs';

function loadEnv(p){const o={};for(const l of readFileSync(p,'utf8').split('\n')){const t=l.trim();if(!t||t.startsWith('#'))continue;const i=t.indexOf('=');if(i===-1)continue;o[t.slice(0,i).trim()]=t.slice(i+1).trim();}return o;}
const { CONFLUENCE_BASE_URL, CONFLUENCE_EMAIL, CONFLUENCE_TOKEN } = loadEnv('../.env.confluence');
const SPACE_ID='4849676', PARENT_ID='165675013';
const auth = 'Basic ' + Buffer.from(`${CONFLUENCE_EMAIL}:${CONFLUENCE_TOKEN}`).toString('base64');
const REPR = 'atlas_doc_format';

async function api(method,path,body,extra={}){const r=await fetch(`${CONFLUENCE_BASE_URL}${path}`,{method,headers:{Accept:'application/json',Authorization:auth,...extra,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,json:await r.json().catch(()=>null)};}
async function del(id){const r=await api('DELETE',`/wiki/api/v2/pages/${id}`);console.log('  delete',id,'->',r.status);}
async function create(title,adf){const r=await api('POST','/wiki/api/v2/pages',{spaceId:SPACE_ID,parentId:PARENT_ID,title,body:{representation:REPR,value:JSON.stringify(adf)}});if(r.status>=300)throw new Error(`create ${title}: ${r.status} ${JSON.stringify(r.json)}`);return r.json;}
async function update(id,title,version,adf){const r=await api('PUT',`/wiki/api/v2/pages/${id}`,{id,status:'current',title,spaceId:SPACE_ID,version:{number:version},body:{representation:REPR,value:JSON.stringify(adf)}});if(r.status>=300)throw new Error(`update ${title}: ${r.status} ${JSON.stringify(r.json)}`);return r.json;}

// Upload attachment (v1) lalu ambil fileId (UUID) via v2.
async function uploadAttachment(pageId, filePath, filename) {
  const buf = readFileSync(filePath);
  const fd = new FormData();
  fd.append('file', new Blob([buf], { type: 'image/png' }), filename);
  const r = await fetch(`${CONFLUENCE_BASE_URL}/wiki/rest/api/content/${pageId}/child/attachment`, { method:'POST', headers:{Authorization:auth,'X-Atlassian-Token':'no-check'}, body:fd });
  const j = await r.json().catch(()=>null);
  if (r.status >= 300) throw new Error(`upload ${filename}: ${r.status}`);
  const attId = j.results?.[0]?.id;
  const v2 = await api('GET', `/wiki/api/v2/attachments/${attId}`);
  const fileId = v2.json?.fileId;
  if (!fileId) throw new Error(`fileId tidak ditemukan untuk ${filename}`);
  return { fileId, collection: pageId };
}

function mediaNode(att, maxW) {
  return {
    type: 'mediaSingle',
    attrs: { layout: 'center' },
    content: [{ type: 'media', attrs: { type: 'file', id: att.fileId, collection: att.collection, width: maxW } }],
  };
}

const MINIMAL = { version:1, type:'doc', content:[{ type:'paragraph', content:[{ type:'text', text:'…' }] }] };
const results = [];

// 1) bersihkan halaman lama + test
const OLD = ['1405026408','1404993688','1405059178','1404731480','1405059208','1404797027','1405059229','1405255720'];
console.log('== hapus halaman lama & test ==');
for (const id of OLD) await del(id);

// 2) PRD (tanpa gambar)
{
  const adf = mdToADF(readFileSync('../docs/PRD.md','utf8'), { resolveImage: () => null });
  const p = await create('PRD — App Purnatugas', adf);
  results.push({ title:'PRD — App Purnatugas', id:p.id });
  console.log('PRD ok:', p.id);
}

// 3) SPEC (3 BPMN)
{
  const adf = mdToADF(readFileSync('../docs/SPEC.md','utf8'), { resolveImage: () => null });
  const p = await create('SPEC — App Purnatugas', MINIMAL);
  const BPMN = [
    { file:'bpmn-01-pendataan-pegawai.png', path:'rendered-bpmn/bpmn-01-pendataan-pegawai.png', label:'1. Pendataan Pegawai Purnatugas' },
    { file:'bpmn-02-pencarian-ekspor.png', path:'rendered-bpmn/bpmn-02-pencarian-ekspor.png', label:'2. Pencarian & Ekspor Data' },
    { file:'bpmn-03-perubahan-penghapusan.png', path:'rendered-bpmn/bpmn-03-perubahan-penghapusan.png', label:'3. Perubahan & Penghapusan Data' },
  ];
  adf.content.push({ type:'rule' });
  adf.content.push({ type:'heading', attrs:{level:2}, content:[{ type:'text', text:'Diagram BPMN (Proses Bisnis)' }] });
  for (const b of BPMN) {
    const att = await uploadAttachment(p.id, b.path, b.file);
    adf.content.push({ type:'heading', attrs:{level:3}, content:[{ type:'text', text:b.label }] });
    adf.content.push(mediaNode(att, 800));
  }
  await update(p.id, 'SPEC — App Purnatugas', p.version.number + 1, adf);
  results.push({ title:'SPEC — App Purnatugas', id:p.id });
  console.log('SPEC ok:', p.id);
}

// 4) SPEC-UI-UX (tanpa gambar)
{
  const adf = mdToADF(readFileSync('../docs/SPEC-UI-UX.md','utf8'), { resolveImage: () => null });
  const p = await create('SPEC-UI-UX — App Purnatugas', adf);
  results.push({ title:'SPEC-UI-UX — App Purnatugas', id:p.id });
  console.log('SPEC-UI-UX ok:', p.id);
}

// 5) DOCUMENT-SPEC (12 screenshot)
{
  const md = readFileSync('../docs/DOCUMENT-SPEC.md','utf8');
  const p = await create('DOCUMENT-SPEC — App Purnatugas', MINIMAL);
  const map = {};
  for (const s of ['01-dashboard.png','02-daftar-pegawai.png','03-tambah-pegawai.png','04-edit-pegawai.png','05-detail-pegawai.png','06-dialog-hapus.png','07-lookup-nik.png','08-lookup-sk.png','09-upload.png','10-export.png','11-data-keluarga.png','12-dialog-riwayat.png']) {
    const src = `screenshots/${s}`;
    map[src] = await uploadAttachment(p.id, `../docs/${src}`, s);
  }
  const adf = mdToADF(md, { resolveImage: (src) => (map[src] ? mediaNode(map[src], 480) : null) });
  await update(p.id, 'DOCUMENT-SPEC — App Purnatugas', p.version.number + 1, adf);
  results.push({ title:'DOCUMENT-SPEC — App Purnatugas', id:p.id });
  console.log('DOCUMENT-SPEC ok:', p.id);
}

writeFileSync('_results.json', JSON.stringify(results, null, 2));
console.log('\n===== SELESAI =====');
results.forEach(r => console.log(`- ${r.title}: ${CONFLUENCE_BASE_URL}/wiki/spaces/AT/pages/${r.id}`));
