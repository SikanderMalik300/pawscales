// IndexNow submitter (pawscales-day2-fixes.md Task 1). No dependencies.
// Reads the locally built out/sitemap.xml, picks URLs changed today (or all),
// and POSTs them to the IndexNow API. Called from .github/workflows/indexnow.yml.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';

export const KEY = 'cd83e80597b0e0a9d1e5fab58329ab09';
export const HOST = 'pawscales.com';
export const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
export const ENDPOINT = 'https://api.indexnow.org/indexnow';
const BATCH = 10000;

/** The accepted lastmod dates: yesterday, today and tomorrow in UTC. The window
 *  avoids missing a page whose lastmod uses a local date ahead of UTC (a push
 *  made in Pakistan before 05:00 can still be on "tomorrow" relative to UTC).
 *  Re-sending a URL to IndexNow is harmless. */
export function dateWindow(now = new Date()) {
  const iso = (offsetDays) =>
    new Date(now.getTime() + offsetDays * 86400000).toISOString().slice(0, 10);
  return [iso(-1), iso(0), iso(1)];
}

/** Pick URLs from a sitemap XML string. In `all` mode, every URL; otherwise those
 *  whose <lastmod> date is within `days` (a set of YYYY-MM-DD, UTC). */
export function pickUrls(sitemapXml, { all = false, days = [] } = {}) {
  const entries = [...sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
    .map((m) => ({
      loc: (m[1].match(/<loc>(.*?)<\/loc>/) || [])[1],
      lastmod: (m[1].match(/<lastmod>(.*?)<\/lastmod>/) || [])[1] || '',
    }))
    .filter((e) => e.loc);
  if (all) return entries.map((e) => e.loc);
  const set = new Set(days);
  return entries.filter((e) => set.has(e.lastmod.slice(0, 10))).map((e) => e.loc);
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
    if (res.status === 200 || res.status === 202) {
      console.log(`IndexNow responded HTTP ${res.status} for ${urlList.length} URL(s).`);
    } else if (res.status === 403) {
      // Bing can take a while to accept a new key (it was previously owned by
      // Cloudflare Crawler Hints). Warn, don't fail the push.
      console.warn(`::warning::IndexNow returned HTTP 403 (key not yet accepted). Body: ${body}`);
    } else {
      console.error(`IndexNow failed: HTTP ${res.status}\n${body}`);
      process.exit(1);
    }
  }
}

async function main() {
  const all = process.argv.includes('--all') || process.env.INDEXNOW_ALL === 'true';
  const days = dateWindow();
  const xml = await readFile(new URL('../out/sitemap.xml', import.meta.url), 'utf8');
  const urls = pickUrls(xml, { all, days });

  if (urls.length === 0) {
    console.log('Nothing changed');
    process.exit(0);
  }

  console.log(`Submitting ${urls.length} URL(s) to IndexNow (all=${all}, window=${days.join(',')}):`);
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
