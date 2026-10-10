// IndexNow submitter (pawscales-day2-fixes.md Task 1). No dependencies.
// Reads the locally built out/sitemap.xml, picks URLs changed today (or all),
// and POSTs them to the IndexNow API. Called from .github/workflows/indexnow.yml.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';

export const KEY = '75e98a1ac5c3cb5382566ade98c2bf00';
export const HOST = 'pawscales.com';
export const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
export const ENDPOINT = 'https://api.indexnow.org/indexnow';
const BATCH = 10000;

/** Pick URLs from a sitemap XML string. In `all` mode, every URL; otherwise only
 *  those whose <lastmod> date equals `today` (YYYY-MM-DD, UTC). */
export function pickUrls(sitemapXml, { all = false, today } = {}) {
  const entries = [...sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
    .map((m) => ({
      loc: (m[1].match(/<loc>(.*?)<\/loc>/) || [])[1],
      lastmod: (m[1].match(/<lastmod>(.*?)<\/lastmod>/) || [])[1] || '',
    }))
    .filter((e) => e.loc);
  if (all) return entries.map((e) => e.loc);
  return entries.filter((e) => e.lastmod.slice(0, 10) === today).map((e) => e.loc);
}

async function submit(urls) {
  for (let i = 0; i < urls.length; i += BATCH) {
    const urlList = urls.slice(i, i + BATCH);
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'PawScales-IndexNow/1.0',
      },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
    });
    const body = await res.text();
    if (res.status !== 200 && res.status !== 202) {
      console.error(`IndexNow failed: HTTP ${res.status}\n${body}`);
      process.exit(1);
    }
    console.log(`IndexNow responded HTTP ${res.status} for ${urlList.length} URL(s).`);
  }
}

async function main() {
  const all = process.argv.includes('--all') || process.env.INDEXNOW_ALL === 'true';
  const today = new Date().toISOString().slice(0, 10);
  const xml = await readFile(new URL('../out/sitemap.xml', import.meta.url), 'utf8');
  const urls = pickUrls(xml, { all, today });

  if (urls.length === 0) {
    console.log('Nothing changed');
    process.exit(0);
  }

  console.log(`Submitting ${urls.length} URL(s) to IndexNow (all=${all}, today=${today}):`);
  urls.forEach((u) => console.log('  ' + u));

  if (process.env.INDEXNOW_DRYRUN === 'true') {
    console.log('(dry run: not posting)');
    return;
  }

  // Let Cloudflare Pages finish deploying the pushed commit before pinging.
  const waitMs = process.env.INDEXNOW_SLEEP != null ? Number(process.env.INDEXNOW_SLEEP) : 120000;
  if (waitMs > 0) {
    console.log(`Waiting ${Math.round(waitMs / 1000)}s for deployment...`);
    await sleep(waitMs);
  }
  await submit(urls);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
