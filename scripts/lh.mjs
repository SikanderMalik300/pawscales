// Lighthouse mobile scores against the static build.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { gzipSync } from 'node:zlib';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.svg', '.xml', '.txt']);

const OUT = join(process.cwd(), 'out');
const PORT = 4600;
const CHROME = join(process.env.HOME || process.env.USERPROFILE || '', 'AppData/Local/ms-playwright/chromium-1140/chrome-win/chrome.exe');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.txt': 'text/plain', '.xml': 'application/xml', '.ico': 'image/x-icon' };
const resolve = (url) => { let p = decodeURIComponent(url.split('?')[0]); let fp = join(OUT, p); if (p.endsWith('/')) fp = join(fp, 'index.html'); else if (!extname(fp)) { if (existsSync(fp + '.html')) fp += '.html'; else if (existsSync(join(fp, 'index.html'))) fp = join(fp, 'index.html'); } return fp; };
const server = createServer(async (req, res) => {
  try {
    const fp = resolve(req.url);
    const ext = extname(fp);
    let b = await readFile(fp);
    const headers = { 'content-type': TYPES[ext] ?? 'application/octet-stream' };
    if (COMPRESSIBLE.has(ext) && (req.headers['accept-encoding'] || '').includes('gzip')) {
      b = gzipSync(b); headers['content-encoding'] = 'gzip';
    }
    res.writeHead(200, headers); res.end(b);
  } catch { res.writeHead(404); res.end('404'); }
});
await new Promise((r) => server.listen(PORT, r));

const chrome = await chromeLauncher.launch({ chromePath: CHROME, chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'] });
const PAGES = [
  ['home', '/'],
  ['puppy-weight-calculator', '/puppy-weight-calculator/'],
  ['dog-pregnancy-calculator', '/dog-pregnancy-calculator/'],
  ['dog-years-calculator', '/dog-years-calculator/'],
  ['dog-food-calculator', '/dog-food-calculator/'],
  ['raw-dog-food-calculator', '/raw-dog-food-calculator/'],
  ['dog-heat-cycle-calculator', '/dog-heat-cycle-calculator/'],
  ['cat-years-calculator', '/cat-years-calculator/'],
  ['kitten-age-chart', '/kitten-age-chart/'],
  ['cat-food-calculator', '/cat-food-calculator/'],
  ['dog-crate-size-chart', '/dog-crate-size-chart/'],
  ['dog-collar-size-chart', '/dog-collar-size-chart/'],
  ['dog-harness-size-chart', '/dog-harness-size-chart/'],
  ['goldendoodle-size-chart', '/goldendoodle-size-chart/'],
  ['bernedoodle-size-chart', '/bernedoodle-size-chart/'],
  ['cavapoo-size-chart', '/cavapoo-size-chart/'],
  ['benadryl-dosage-calculator', '/benadryl-dosage-calculator/'],
  ['gabapentin-for-dogs-and-cats', '/gabapentin-for-dogs-and-cats/'],
  ['dog-chocolate-toxicity-calculator', '/dog-chocolate-toxicity-calculator/'],
  ['trazodone-for-dogs-and-cats', '/trazodone-for-dogs-and-cats/'],
  ['zyrtec-dosage-calculator', '/zyrtec-dosage-calculator/'],
  ['cat-weight-chart', '/cat-weight-chart/'],
  ['puppy-feeding-chart', '/puppy-feeding-chart/'],
];
const results = [];
for (const [name, path] of PAGES) {
  const r = await lighthouse(`http://localhost:${PORT}${path}`, {
    port: chrome.port, output: 'json', logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'mobile', screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75 },
  });
  const c = r.lhr.categories;
  const row = { name, perf: Math.round(c.performance.score * 100), a11y: Math.round(c.accessibility.score * 100), bp: Math.round(c['best-practices'].score * 100), seo: Math.round(c.seo.score * 100) };
  results.push(row);
  console.log(`${name.padEnd(28)} perf ${row.perf}  a11y ${row.a11y}  bp ${row.bp}  seo ${row.seo}`);
}
await chrome.kill();
server.close();
console.log('\nJSON:' + JSON.stringify(results));
