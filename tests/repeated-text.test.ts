import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
// @ts-expect-error - plain ESM helper shared with scripts/repeated-text.mjs
import { loadOutPages, findRepeats, MIN_WORDS, MIN_PAGES } from '@/scripts/repeated-text.mjs';

// Day-15 Task 3: no paragraph of 25+ words may repeat (identically or almost) on
// 3+ indexable content pages, excluding site chrome, the author box, the disclaimer
// lines and the (verbatim) source citations. "Almost identical" = sharing at least
// half of the shorter paragraph's 10-word phrases. Needs a prior `next build`.
const OUT = join(__dirname, '..', 'out');

// Pages excluded from the content set: chrome-free embeds, the dev /design/ page,
// and the 6 medication pages (noindexed, so not part of the indexable content).
const MED = [
  'benadryl-dosage-calculator', 'zyrtec-dosage-calculator', 'gabapentin-for-dogs-and-cats',
  'trazodone-for-dogs-and-cats', 'dramamine-dosage-calculator', 'pepcid-dosage-calculator',
];
const EXCLUDE = ['/embed/', '/design/', ...MED.map((s) => `/${s}/`)];

describe('no repeated template paragraphs across content pages', () => {
  it(`no ${MIN_WORDS}+ word paragraph repeats on ${MIN_PAGES}+ pages`, () => {
    if (!existsSync(OUT)) {
      console.warn('repeated-text: out/ not found — run `npm run build` to scan rendered HTML.');
      return;
    }
    const pages = loadOutPages(OUT, { exclude: EXCLUDE });
    expect(pages.length, 'built pages to scan').toBeGreaterThan(10);
    const repeats = findRepeats(pages);
    const report = repeats
      .map((r: any) => `  ${r.count} pages (${r.pages.join(', ')}):\n    ${r.sample}`)
      .join('\n');
    expect(repeats, `repeated paragraphs found:\n${report}`).toEqual([]);
  });
});
