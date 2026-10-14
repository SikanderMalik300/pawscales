import { describe, it, expect } from 'vitest';
import { fmt1 } from '@/lib/calc/round';
import { CAT_WEIGHT } from '@/lib/data/catWeight';
import { BREEDS, bandForSex } from '@/lib/data/breeds';
import { expectedByAge } from '@/lib/calc/breedGrowth';
import { GOLDENDOODLE, BERNEDOODLE, doodleTypicalByAge } from '@/lib/data/doodles';

const ONE_DP = /^\d+\.\d$/;

describe('fmt1 (one decimal everywhere)', () => {
  it('always shows exactly one decimal place', () => {
    expect(fmt1(6)).toBe('6.0');
    expect(fmt1(43)).toBe('43.0');
    expect(fmt1(7)).toBe('7.0');
    expect(fmt1(56.6)).toBe('56.6');
    expect(fmt1(8.04)).toBe('8.0');
    expect(fmt1(8.05)).toBe('8.1');
  });
});

describe('growth-table cells render with one decimal', () => {
  it('cat tables (both sexes, main and intact)', () => {
    for (const s of ['F', 'M'] as const) {
      for (const r of CAT_WEIGHT.main[s]) {
        for (const v of [r.p25, r.median, r.p75]) expect(fmt1(v)).toMatch(ONE_DP);
      }
      for (const r of CAT_WEIGHT.intactComparison[s]) expect(fmt1(r.median)).toMatch(ONE_DP);
    }
  });

  it('breed weight tables (low / typical / high)', () => {
    for (const breed of Object.values(BREEDS)) {
      for (const sex of ['male', 'female'] as const) {
        const rows = expectedByAge(breed[sex].lowLb, breed[sex].highLb, bandForSex(breed[sex]));
        for (const r of rows) {
          for (const v of [r.lowLb, r.typicalLb, r.highLb]) expect(fmt1(v)).toMatch(ONE_DP);
        }
      }
    }
  });

  it('doodle weight-by-age tables', () => {
    for (const d of [GOLDENDOODLE, BERNEDOODLE]) {
      for (const r of doodleTypicalByAge(d)) {
        for (const s of d.sizes) expect(fmt1(r.bySize[s.size])).toMatch(ONE_DP);
      }
    }
  });
});
