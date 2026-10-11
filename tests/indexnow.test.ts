import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pickUrls, dateWindow, KEY } from '@/scripts/indexnow.mjs';

const SITEMAP = `<?xml version="1.0"?>
<urlset>
  <url><loc>https://pawscales.com/</loc><lastmod>2026-10-11</lastmod></url>
  <url><loc>https://pawscales.com/puppy-weight-calculator/</loc><lastmod>2026-10-11</lastmod></url>
  <url><loc>https://pawscales.com/dog-food-calculator/</loc><lastmod>2026-10-10</lastmod></url>
  <url><loc>https://pawscales.com/about/</loc><lastmod>2026-09-01</lastmod></url>
</urlset>`;

describe('indexnow URL picker', () => {
  it('single-day window returns only URLs whose lastmod is that day', () => {
    const urls = pickUrls(SITEMAP, { all: false, days: ['2026-10-11'] });
    expect(urls).toEqual([
      'https://pawscales.com/',
      'https://pawscales.com/puppy-weight-calculator/',
    ]);
  });

  it('all mode returns every URL', () => {
    const urls = pickUrls(SITEMAP, { all: true, days: ['2026-10-11'] });
    expect(urls).toHaveLength(4);
    expect(urls).toContain('https://pawscales.com/about/');
  });

  it('empty case: nothing in the window returns an empty list', () => {
    expect(pickUrls(SITEMAP, { all: false, days: ['2026-10-20'] })).toEqual([]);
  });

  it('handles lastmod with a time component', () => {
    const xml = '<urlset><url><loc>https://pawscales.com/x/</loc><lastmod>2026-10-11T00:00:00Z</lastmod></url></urlset>';
    expect(pickUrls(xml, { all: false, days: ['2026-10-11'] })).toEqual(['https://pawscales.com/x/']);
  });

  it('the +/-1 day UTC window spans yesterday, today and tomorrow', () => {
    // Push made in Pakistan at 03:00 local = 2026-10-11T22:00Z; the page's
    // lastmod is the owner's local date, 2026-10-12. It must still be picked.
    const days = dateWindow(new Date('2026-10-11T22:00:00Z'));
    expect(days).toEqual(['2026-10-10', '2026-10-11', '2026-10-12']);
    const urls = pickUrls(SITEMAP, { all: false, days });
    expect(urls).toContain('https://pawscales.com/'); // 2026-10-11
    expect(urls).toContain('https://pawscales.com/puppy-weight-calculator/'); // 2026-10-11
    expect(urls).toContain('https://pawscales.com/dog-food-calculator/'); // 2026-10-10
  });

  it('UTC boundary: a 2026-10-12 page is picked when now is 2026-10-11T22:00Z', () => {
    const xml = '<urlset><url><loc>https://pawscales.com/golden-retriever-weight-chart/</loc><lastmod>2026-10-12</lastmod></url></urlset>';
    const days = dateWindow(new Date('2026-10-11T22:00:00Z'));
    expect(pickUrls(xml, { all: false, days })).toEqual(['https://pawscales.com/golden-retriever-weight-chart/']);
  });
});

describe('indexnow key file', () => {
  it('exists and its contents match the key in the script', () => {
    const file = join(__dirname, '..', 'public', `${KEY}.txt`);
    const contents = readFileSync(file, 'utf8');
    expect(contents).toBe(KEY);
    expect(KEY).toMatch(/^[0-9a-f]{32}$/);
  });
});
