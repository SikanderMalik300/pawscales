// Full visual QA (design.md v2 section 13): serve out/, sweep every route for
// console errors / 404s / 360px overflow, and screenshot the representative set.
import { createServer } from 'node:http';
import { readFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { chromium } from '@playwright/test';

const OUT = join(process.cwd(), 'out');
const SHOTS = join(process.cwd(), 'qa', 'screenshots');
const PORT = 4500;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
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
  } catch {
    try { const b = await readFile(join(OUT, '404.html')); res.writeHead(404, { 'content-type': 'text/html' }); res.end(b); }
    catch { res.writeHead(404); res.end('404'); }
  }
});

// Discover every route from out/ (directories with index.html)
async function routes(dir = OUT, base = '/') {
  const out = [];
  for (const name of await readdir(dir, { withFileTypes: true })) {
    if (name.isDirectory()) {
      if (['_next', 'photos', 'og'].includes(name.name)) continue;
      const sub = join(dir, name.name);
      if (existsSync(join(sub, 'index.html'))) out.push(base + name.name + '/');
      out.push(...(await routes(sub, base + name.name + '/')));
    }
  }
  return out;
}

const SHOT_PAGES = [
  { name: 'home', path: '/' },
  { name: 'puppy', path: '/puppy-weight-calculator/' },
  { name: 'cat-years', path: '/cat-years-calculator/' },
  { name: 'crate', path: '/dog-crate-size-chart/' },
  { name: 'kitten', path: '/kitten-age-chart/' },
  { name: 'dog-hub', path: '/dog-calculators/' },
  { name: 'about', path: '/about/' },
  { name: 'design', path: '/design/' },
];
const WIDTHS = [360, 768, 1280];

await mkdir(SHOTS, { recursive: true });
await new Promise((r) => server.listen(PORT, r));
const browser = await chromium.launch();
const allRoutes = ['/', ...(await routes())].filter((v, i, a) => a.indexOf(v) === i).sort();
const problems = [];

// Sweep every route at 360 for console errors + overflow
const ctx = await browser.newContext({ viewport: { width: 360, height: 800 } });
for (const path of allRoutes) {
  const page = await ctx.newPage();
  const issues = [];
  page.on('console', (m) => { if (m.type() === 'error') issues.push(`console: ${m.text()}`); });
  page.on('pageerror', (e) => issues.push(`pageerror: ${e.message}`));
  page.on('response', (r) => { if (r.status() >= 400 && !r.url().includes('favicon')) issues.push(`http ${r.status()}: ${r.url()}`); });
  await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'networkidle' });
  const ov = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  if (ov.sw > ov.cw + 1) issues.push(`OVERFLOW ${ov.sw}>${ov.cw}`);
  if (issues.length) problems.push({ path, issues });
  await page.close();
}
await ctx.close();

// Screenshots for the representative set
for (const pg of SHOT_PAGES) {
  for (const width of WIDTHS) {
    const c = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
    const page = await c.newPage();
    await page.goto(`http://localhost:${PORT}${pg.path}`, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(250);
    await page.screenshot({ path: join(SHOTS, `${pg.name}-${width}.png`), fullPage: true });
    await c.close();
  }
}
await browser.close();
server.close();

console.log(`Swept ${allRoutes.length} routes.`);
if (problems.length) {
  console.log('PROBLEMS:');
  for (const p of problems) { console.log('  ' + p.path); p.issues.forEach((i) => console.log('    - ' + i)); }
  process.exitCode = 1;
} else {
  console.log('All routes clean: no console errors, 404s, or 360px overflow.');
}
