import { describe, it, expect } from 'vitest';
import { CAT_WEIGHT, trackKitten, MAIN_MONTHS } from '@/lib/data/catWeight';
import { bySlug } from '@/lib/registry';

describe('cat weight data', () => {
  it('covers months 2-12 and 18 for both sexes', () => {
    expect(MAIN_MONTHS).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18]);
    for (const s of ['F', 'M'] as const) {
      expect(CAT_WEIGHT.main[s].map((r) => r.month)).toEqual(MAIN_MONTHS);
    }
  });

  it('every column is non-decreasing with age (smoothed)', () => {
    for (const s of ['F', 'M'] as const) {
      for (const key of ['p25', 'median', 'p75'] as const) {
        const vals = CAT_WEIGHT.main[s].map((r) => r[key]);
        for (let i = 1; i < vals.length; i++) {
          expect(vals[i], `${s} ${key} at ${MAIN_MONTHS[i]}mo`).toBeGreaterThanOrEqual(vals[i - 1]);
        }
      }
    }
  });

  it('p25 <= median <= p75 in every cell', () => {
    for (const s of ['F', 'M'] as const) {
      for (const r of CAT_WEIGHT.main[s]) {
        expect(r.p25).toBeLessThanOrEqual(r.median);
        expect(r.median).toBeLessThanOrEqual(r.p75);
      }
    }
  });

  it('keeps raw values alongside smoothed ones (traceable)', () => {
    for (const s of ['F', 'M'] as const) {
      for (const r of CAT_WEIGHT.main[s]) {
        expect(typeof r.rawMedian).toBe('number');
      }
    }
  });

  it('males run heavier than females at 18 months', () => {
    expect(CAT_WEIGHT.adult.M.median).toBeGreaterThan(CAT_WEIGHT.adult.F.median);
  });

  it('is sourced to both Liverpool datasets under CC BY 3.0', () => {
    expect(CAT_WEIGHT.source.mainDataset).toMatch(/datacat\.liverpool\.ac\.uk\/1459/);
    expect(CAT_WEIGHT.source.intactDataset).toMatch(/datacat\.liverpool\.ac\.uk\/1456/);
    expect(CAT_WEIGHT.source.license).toBe('CC BY 3.0');
  });
});

describe('trackKitten (weight-only check)', () => {
  it('flags below / within / above against the 25th-75th band', () => {
    const r6 = CAT_WEIGHT.main.F.find((r) => r.month === 6)!;
    const below = trackKitten('F', 6, r6.p25 - 1);
    const within = trackKitten('F', 6, r6.median);
    const above = trackKitten('F', 6, r6.p75 + 1);
    if (below.kind !== 'ok' || within.kind !== 'ok' || above.kind !== 'ok') throw new Error('expected ok');
    expect(below.position).toBe('below');
    expect(within.position).toBe('within');
    expect(above.position).toBe('above');
  });

  it('interpolates between table months', () => {
    const r = trackKitten('M', 13.5, 10);
    if (r.kind !== 'ok') throw new Error('expected ok');
    // 13.5 months sits between the 12mo and 18mo rows
    const m12 = CAT_WEIGHT.main.M.find((x) => x.month === 12)!;
    const m18 = CAT_WEIGHT.main.M.find((x) => x.month === 18)!;
    expect(r.median).toBeGreaterThanOrEqual(m12.median);
    expect(r.median).toBeLessThanOrEqual(m18.median);
  });

  it('rejects non-positive input', () => {
    expect(trackKitten('F', 0, 5).kind).toBe('invalid');
    expect(trackKitten('F', 6, 0).kind).toBe('invalid');
  });
});

describe('cat weight registry entry', () => {
  it('is registered with a compliant title and meta', () => {
    const e = bySlug('cat-weight-chart');
    expect(e).toBeTruthy();
    expect(e!.title.length).toBeLessThanOrEqual(60);
    expect(e!.metaDescription.length).toBeLessThanOrEqual(155);
    expect(e!.category).toBe('cat-calculators');
  });
});
