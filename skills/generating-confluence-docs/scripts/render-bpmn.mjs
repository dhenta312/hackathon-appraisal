// render-bpmn.mjs — render 3 diagram BPMN jadi PNG via Playwright + docs/bpmn/viewer.html.
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('/Users/nukiarii/Documents/Belajar_VS_Code/App_Purnatugas/frontend/node_modules/playwright');

const ROOT = '/Users/nukiarii/Documents/Belajar_VS_Code/App_Purnatugas';
const OUT_DIR = join(ROOT, '.confluence-upload', 'rendered-bpmn');
mkdirSync(OUT_DIR, { recursive: true });

const TABS = [
  { key: 'pendataan', file: 'bpmn-01-pendataan-pegawai.png' },
  { key: 'pencarian', file: 'bpmn-02-pencarian-ekspor.png' },
  { key: 'ubahhapus', file: 'bpmn-03-perubahan-penghapusan.png' },
];

// Tunggu sampai canvas-host aktif berisi SVG diagram utama (lebar > 300px)
const waitMainDiagram = () =>
  page.waitForFunction(() => {
    const hosts = [...document.querySelectorAll('.canvas-host')];
    const active = hosts.find((h) => h.style.display !== 'none') || hosts[0];
    if (!active) return false;
    const svgs = [...active.querySelectorAll('svg')];
    return svgs.some((s) => s.getBoundingClientRect().width > 300);
  }, { timeout: 30000 });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.log('  [pageerror]', e.message));

await page.goto(`file://${ROOT}/docs/bpmn/viewer.html`, { waitUntil: 'load' });

// Latar putih bersih + sembunyikan hint overlay
await page.addStyleTag({ content: '#stage { background: #ffffff !important; } .hint { display: none !important; }' });

// Tunggu diagram pertama
await waitMainDiagram();
await page.waitForTimeout(600);

for (const tab of TABS) {
  await page.click(`.tab[data-key="${tab.key}"]`);
  await waitMainDiagram();
  await page.waitForTimeout(600); // biar fit-viewport selesai
  await page.locator('#stage').screenshot({ path: join(OUT_DIR, tab.file) });
  console.log('rendered:', tab.file);
}

await browser.close();
console.log('OK ->', OUT_DIR);
