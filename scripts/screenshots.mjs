// Visual QA (design.md section 13): serve out/, screenshot pages at 360/768/1280,
// and report any console errors, 404s or page errors. Screenshots are gitignored.
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { chromium } from '@playwright/test';

const OUT = join(process.cwd(), 'out');
const SHOTS = join(process.cwd(), 'qa', 'screenshots');
const PORT = 4321;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

function resolvePath(url) {
  let p = decodeURIComponent(url.split('?')[0]);
  let fp = join(OUT, p);
  if (p.endsWith('/')) fp = join(fp, 'index.html');
  else if (!extname(fp)) {
    if (existsSync(fp + '.html')) fp += '.html';
    else if (existsSync(join(fp, 'index.html'))) fp = join(fp, 'index.html');
  }
  return fp;
}

const server = createServer(async (req, res) => {
  try {
    const fp = resolvePath(req.url);
    const buf = await readFile(fp);
    res.writeHead(200, { 'content-type': TYPES[extname(fp)] ?? 'application/octet-stream' });
    res.end(buf);
  } catch {
    try {
      const buf = await readFile(join(OUT, '404.html'));
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      res.end(buf);
    } catch {
      res.writeHead(404);
      res.end('404');
    }
  }
});

const WIDTHS = [360, 768, 1280];
const PAGES = [
  { name: 'home', path: '/' },
  { name: 'puppy', path: '/puppy-weight-calculator/' },
  { name: 'design', path: '/design/' },
];

await mkdir(SHOTS, { recursive: true });
await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch();
const problems = [];
const shots = [];

for (const pg of PAGES) {
  for (const width of WIDTHS) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    const issues = [];
    page.on('console', (m) => {
      if (m.type() === 'error') issues.push(`console.error: ${m.text()}`);
    });
    page.on('pageerror', (e) => issues.push(`pageerror: ${e.message}`));
    page.on('requestfailed', (r) =>
      issues.push(`requestfailed: ${r.url()} ${r.failure()?.errorText ?? ''}`),
    );
    page.on('response', (r) => {
      if (r.status() >= 400) issues.push(`http ${r.status()}: ${r.url()}`);
    });

    const url = `http://localhost:${PORT}${pg.path}`;
    await page.goto(url, { waitUntil: 'networkidle' });
    // Scroll through the page to trigger lazy-loaded images, then return to top.
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300);
    const file = join(SHOTS, `${pg.name}-${width}.png`);
    await page.screenshot({ path: file, fullPage: true });
    shots.push(`qa/screenshots/${pg.name}-${width}.png`);
    if (issues.length) problems.push({ page: pg.name, width, issues });
    await context.close();
  }
}

await browser.close();
server.close();

console.log('\nScreenshots written:');
shots.forEach((s) => console.log('  ' + s));
if (problems.length) {
  console.log('\nConsole / network problems:');
  for (const p of problems) {
    console.log(`  [${p.page} @ ${p.width}]`);
    p.issues.forEach((i) => console.log('    - ' + i));
  }
  process.exitCode = 1;
} else {
  console.log('\nNo console errors, 404s, or page errors.');
}
