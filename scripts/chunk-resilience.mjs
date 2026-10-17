// pawscales-day8 Task 1 test: a missing/broken JS chunk must never blank a page.
// Serves out/, then for a set of pages renders them while forcing their
// _next/static chunks to fail (first a 404, then served as HTML to cause a
// SyntaxError), and asserts the H1, the main article text and the <link
// rel="canonical"> all survive and no "Application error" screen appears.
// Run after `next build`: `node scripts/chunk-resilience.mjs`.
import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const OUT = join(process.cwd(), 'out');
const PORT = 4788;
const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif',
};
const resolve = (u) => {
  let p = decodeURIComponent(u.split('?')[0]);
  let fp = join(OUT, p);
  if (p.endsWith('/')) fp = join(fp, 'index.html');
  else if (!extname(fp)) {
    if (existsSync(fp + '.html')) fp += '.html';
    else if (existsSync(join(fp, 'index.html'))) fp = join(fp, 'index.html');
  }
  return fp;
};
const html404 = await readFile(join(OUT, '404.html'), 'utf8').catch(() => '<!doctype html><html><body>404</body></html>');
const server = createServer(async (req, res) => {
  try {
    const fp = resolve(req.url);
    const buf = await readFile(fp);
    res.writeHead(200, { 'content-type': TYPES[extname(fp)] ?? 'application/octet-stream' });
    res.end(buf);
  } catch { res.writeHead(404); res.end('404'); }
});
await new Promise((r) => server.listen(PORT, r));

// [path, a phrase that must remain visible in the rendered body]
const PAGES = [
  ['/gabapentin-for-dogs-and-cats/', 'Follow your vet'],
  ['/cavapoo-size-chart/', 'commonly used breeder categories'],
  ['/dog-chocolate-toxicity-calculator/', 'theobromine'],
];
const MODES = [
  ['404', (route) => route.fulfill({ status: 404, body: 'x' })],
  ['served-as-HTML', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: html404 })],
];

const browser = await chromium.launch();
const failures = [];

for (const [path, phrase] of PAGES) {
  for (const [mode, handler] of MODES) {
    const page = await browser.newPage();
    await page.route('**/_next/static/chunks/**', handler); // break EVERY chunk
    await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(1200);
    const st = await page.evaluate((ph) => ({
      h1: !!document.querySelector('h1'),
      canonical: !!document.querySelector('link[rel="canonical"]'),
      hasPhrase: document.body.innerText.includes(ph),
      appError: /application error|client-side exception/i.test(document.body.innerText),
    }), phrase);
    const ok = st.h1 && st.canonical && st.hasPhrase && !st.appError;
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${path} [all chunks ${mode}]  h1=${st.h1} canonical=${st.canonical} content=${st.hasPhrase} appError=${st.appError}`);
    if (!ok) failures.push(`${path} (${mode})`);
    await page.close();
  }
}

await browser.close();
server.close();

if (failures.length) {
  console.log(`\nFAILED: ${failures.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log('\nAll pages keep their H1, content and canonical with every chunk broken.');
}
