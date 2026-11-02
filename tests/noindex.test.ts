import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { REGISTRY, BREED_PAGES, bySlug, SITE } from '@/lib/registry';
import { toolMetadata } from '@/lib/seo';
import sitemap from '@/app/sitemap';

// Task 1 (day-15): the 6 medication dosing pages are noindexed and kept out of the
// sitemap (and so out of IndexNow, which reads the sitemap) until a vet reviews
// them. The chocolate toxicity tool is a poisoning-triage page and stays indexed.
const MED_PAGES = [
  'benadryl-dosage-calculator',
  'zyrtec-dosage-calculator',
  'gabapentin-for-dogs-and-cats',
  'trazodone-for-dogs-and-cats',
  'dramamine-dosage-calculator',
  'pepcid-dosage-calculator',
];

const ALL = [...REGISTRY, ...BREED_PAGES];
const OTHER = ALL.filter((e) => !MED_PAGES.includes(e.slug));

describe('medication pages: noindex flag and metadata', () => {
  it('exactly the 6 medication pages carry medicalIndexable:false', () => {
    const flagged = ALL.filter((e) => e.medicalIndexable === false).map((e) => e.slug).sort();
    expect(flagged).toEqual([...MED_PAGES].sort());
  });

  it('chocolate toxicity stays indexable', () => {
    expect(bySlug('dog-chocolate-toxicity-calculator')!.medicalIndexable).not.toBe(false);
  });

  it('each medication page emits robots noindex, follow', () => {
    for (const slug of MED_PAGES) {
      const meta = toolMetadata(bySlug(slug)!);
      expect(meta.robots, slug).toEqual({ index: false, follow: true });
    }
  });

  it('every other content page has no robots directive (stays indexable)', () => {
    for (const e of OTHER) {
      expect(toolMetadata(e).robots, e.slug).toBeUndefined();
    }
  });
});

describe('medication pages: out of the sitemap', () => {
  const urls = sitemap().map((e) => e.url);

  it('none of the 6 medication URLs are in the sitemap', () => {
    for (const slug of MED_PAGES) {
      expect(urls, slug).not.toContain(`${SITE.url}/${slug}/`);
    }
  });

  it('every other content page is still in the sitemap, chocolate included', () => {
    for (const e of OTHER) {
      expect(urls, e.slug).toContain(`${SITE.url}/${e.slug}/`);
    }
  });
});

// Rendered-HTML check (needs a prior `next build`): the meta tag is really present
// on the medication pages and really absent on the rest.
describe('medication pages: rendered noindex (built HTML)', () => {
  const OUT = join(__dirname, '..', 'out');
  it('medication pages show noindex; other content pages do not', () => {
    if (!existsSync(OUT)) {
      console.warn('noindex: out/ not found — run `npm run build` to scan rendered HTML.');
      return;
    }
    for (const slug of MED_PAGES) {
      const f = join(OUT, slug, 'index.html');
      expect(existsSync(f), `${slug} built`).toBe(true);
      expect(readFileSync(f, 'utf8'), `${slug} noindex`).toMatch(/name="robots" content="noindex/);
    }
    for (const e of OTHER) {
      const f = join(OUT, e.slug, 'index.html');
      if (!existsSync(f)) continue;
      expect(readFileSync(f, 'utf8'), `${e.slug} indexable`).not.toMatch(/name="robots" content="noindex/);
    }
  });
});
