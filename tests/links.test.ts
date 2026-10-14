import { describe, it, expect } from 'vitest';
import {
  allPages, byCategory, breedPages, relatedGrowthPages, HUBS,
} from '@/lib/registry';

const pages = allPages();
const hubSlugs = new Set(HUBS.map((h) => h.slug));

/** Does this page appear on its category hub? Non-breed pages render in the tool
 *  grid (byCategory); breed/growth pages render in the hub's growth section. */
function hubLinked(p: (typeof pages)[number]): boolean {
  if (!p.breedPage) return byCategory(p.category).some((x) => x.slug === p.slug);
  return breedPages().some((x) => x.slug === p.slug && x.category === p.category);
}

/** Distinct other content pages that link to this one, via either the related-
 *  tools block (related) or the Related size charts block (relatedGrowthPages). */
function inboundLinkers(slug: string): Set<string> {
  const set = new Set<string>();
  for (const q of pages) {
    if (q.slug === slug) continue;
    if (q.related.includes(slug)) set.add(q.slug);
    if (q.breedPage && relatedGrowthPages(q.slug).some((x) => x.slug === slug)) set.add(q.slug);
  }
  return set;
}

describe('internal linking', () => {
  it('every content page has a hub to belong to', () => {
    for (const p of pages) {
      expect(hubSlugs.has(p.category), `${p.slug} category hub exists`).toBe(true);
    }
  });

  it('every content page is linked from its hub', () => {
    for (const p of pages) {
      expect(hubLinked(p), `${p.slug} shown on /${p.category}/`).toBe(true);
    }
  });

  it('every content page is linked from at least 2 other content pages', () => {
    for (const p of pages) {
      const inbound = inboundLinkers(p.slug);
      expect(inbound.size, `${p.slug} inbound links: ${[...inbound].join(', ') || 'none'}`).toBeGreaterThanOrEqual(2);
    }
  });

  it('the cat weight chart is linked from the cat pages (regression)', () => {
    const inbound = inboundLinkers('cat-weight-chart');
    expect(inbound.has('kitten-age-chart')).toBe(true);
    expect(inbound.has('cat-food-calculator')).toBe(true);
    expect(inbound.has('cat-years-calculator')).toBe(true);
  });

  it('related slugs all resolve to real pages', () => {
    const slugs = new Set(pages.map((p) => p.slug));
    for (const p of pages) {
      for (const r of p.related) {
        expect(slugs.has(r), `${p.slug} -> ${r}`).toBe(true);
      }
    }
  });
});
