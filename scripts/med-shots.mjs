// Capture the dog medication calculator result at specific weights, for the
// day-9 report: Dramamine at 10 and 50 lb; Pepcid at 10, 12 and 50 lb.
// Serves out/ and screenshots the calculator card after setting the weight.
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { chromium } from '@playwright/test';

const OUT = join(process.cwd(), 'out');
const SHOTS = join(process.cwd(), 'qa', 'med-shots');
const PORT = 4733;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
};
const resolve = (url) => {
  let p = decodeURIComponent(url.split('?')[0]);
  let fp = join(OUT, p);
  if (p.endsWith('/')) fp = join(fp, 'index.html');
  else if (!extname(fp)) {
    if (existsSync(fp + '.html')) fp += '.html';
    else if (existsSync(join(fp, 'index.html'))) fp = join(fp, 'index.html');
  }
  return fp;
};
const server = createServer(async (req, res) => {
  try {
    const fp = resolve(req.url);
    const buf = await readFile(fp);
    res.writeHead(200, { 'content-type': TYPES[extname(fp)] ?? 'application/octet-stream' });
    res.end(buf);
  } catch { res.writeHead(404); res.end('404'); }
});
await new Promise((r) => server.listen(PORT, r));

const SHOTS_LIST = [
  ['dramamine-dosage-calculator', [10, 50]],
  ['pepcid-dosage-calculator', [10, 12, 50]],
];

await mkdir(SHOTS, { recursive: true });
const browser = await chromium.launch();
const written = [];
for (const [slug, weights] of SHOTS_LIST) {
  for (const lb of weights) {
    const ctx = await browser.newContext({ viewport: { width: 900, height: 1100 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${PORT}/${slug}/`, { waitUntil: 'networkidle' });
    const input = page.locator('#w');
    await input.fill(String(lb));
    await input.dispatchEvent('input');
    await page.waitForTimeout(400);
    const card = page.locator('div.shadow-card').first();
    const file = join(SHOTS, `${slug}-${lb}lb.png`);
    await card.screenshot({ path: file });
    written.push(`qa/med-shots/${slug}-${lb}lb.png`);
    await ctx.close();
  }
}
await browser.close();
server.close();
console.log('Wrote:\n' + written.map((s) => '  ' + s).join('\n'));
