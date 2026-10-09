import { describe, it, expect } from 'vitest';
import {
  predictPuppyWeight,
  ratioAt,
  type PuppyResult,
} from '@/lib/calc/puppyWeight';
import { lbToKg, kgToLb } from '@/lib/units';
import { roundTo } from '@/lib/calc/round';

const ok = (r: PuppyResult) => {
  if (r.kind !== 'ok') throw new Error(`expected ok, got ${r.kind}`);
  return r;
};

describe('puppy weight calculator', () => {
  // Worked example 1: 16 weeks, 20 lb, "Not sure" -> band IV, 45.3 lb (39.7-51.9)
  const ex1 = ok(predictPuppyWeight({ ageWeeks: 16, weightKg: lbToKg(20), size: 'ns' }));
  it('example 1 chooses band IV', () => {
    expect(ex1.cat).toBe('IV');
  });
  it('example 1 adult weight is 45.3 lb', () => {
    expect(roundTo(kgToLb(ex1.adultKg), 1)).toBe(45.3);
  });
  it('example 1 range is 39.7 to 51.9 lb', () => {
    expect(roundTo(kgToLb(ex1.lowKg), 1)).toBe(39.7);
    expect(roundTo(kgToLb(ex1.highKg), 1)).toBe(51.9);
  });

  // Worked example 2: 24 weeks, 9 kg, Medium (cat III) -> 13.03 kg (11.33-15.47)
  const ex2 = ok(predictPuppyWeight({ ageWeeks: 24, weightKg: 9, size: 'III' }));
  it('example 2 adult weight is 13.03 kg (28.7 lb)', () => {
    expect(roundTo(ex2.adultKg, 2)).toBe(13.03);
    expect(roundTo(kgToLb(ex2.adultKg), 1)).toBe(28.7);
  });
  it('example 2 range is 11.33 to 15.47 kg', () => {
    expect(roundTo(ex2.lowKg, 2)).toBe(11.33);
    expect(roundTo(ex2.highKg, 2)).toBe(15.47);
  });

  // Unit equivalence: lb input converted to kg gives the same result object
  it('unit toggle does not change the maths', () => {
    const a = ok(predictPuppyWeight({ ageWeeks: 20, weightKg: lbToKg(15), size: 'II' }));
    const b = ok(predictPuppyWeight({ ageWeeks: 20, weightKg: lbToKg(15), size: 'II' }));
    expect(a.adultKg).toBe(b.adultKg);
    // 15 lb at 20 weeks, band II
    expect(roundTo(kgToLb(a.adultKg), 1)).toBe(roundTo(kgToLb(b.adultKg), 1));
  });

  it('% of adult weight now equals the normalized ratio', () => {
    const r = ok(predictPuppyWeight({ ageWeeks: 16, weightKg: 4, size: 'I' }));
    expect(roundTo(r.pctNow, 1)).toBe(roundTo(ratioAt('I', 16) * 100, 1));
  });

  // Reference table (% of adult weight at 2 years) from the normalized curve
  it('table: band I is 51.3% of adult weight at 16 weeks', () => {
    expect(roundTo(ratioAt('I', 16) * 100, 1)).toBe(51.3);
  });
  it('table: band IV is 67.6% of adult weight at 24 weeks', () => {
    expect(roundTo(ratioAt('IV', 24) * 100, 1)).toBe(67.6);
  });
  it('table: band V is 29.8% of adult weight at 12 weeks', () => {
    expect(roundTo(ratioAt('V', 12) * 100, 1)).toBe(29.8);
  });

  it('under 12 weeks is too young to predict', () => {
    expect(predictPuppyWeight({ ageWeeks: 8, weightKg: 2, size: 'ns' }).kind).toBe('too-young');
    expect(predictPuppyWeight({ ageWeeks: 11.9, weightKg: 2, size: 'ns' }).kind).toBe('too-young');
  });

  it('zero / negative / NaN inputs return invalid, never NaN', () => {
    expect(predictPuppyWeight({ ageWeeks: 16, weightKg: 0, size: 'ns' }).kind).toBe('invalid');
    expect(predictPuppyWeight({ ageWeeks: 16, weightKg: -3, size: 'ns' }).kind).toBe('invalid');
    expect(predictPuppyWeight({ ageWeeks: 0, weightKg: 5, size: 'ns' }).kind).toBe('invalid');
    expect(predictPuppyWeight({ ageWeeks: NaN, weightKg: 5, size: 'ns' }).kind).toBe('invalid');
  });

  it('a giant estimate is flagged and >= 40 kg', () => {
    const r = ok(predictPuppyWeight({ ageWeeks: 16, weightKg: lbToKg(40), size: 'V' }));
    expect(r.adultKg).toBeGreaterThanOrEqual(40);
    expect(r.giant).toBe(true);
  });

  it('weeks beyond the table clamp to the last point (no NaN)', () => {
    const r = ok(predictPuppyWeight({ ageWeeks: 200, weightKg: 10, size: 'III' }));
    expect(Number.isFinite(r.adultKg)).toBe(true);
    expect(roundTo(r.pctNow, 1)).toBe(roundTo(ratioAt('III', 104) * 100, 1));
  });

  it('"Not sure" picks a tiny toy band for a very small puppy', () => {
    const r = ok(predictPuppyWeight({ ageWeeks: 12, weightKg: lbToKg(1.5), size: 'ns' }));
    expect(r.cat).toBe('I');
  });

  it('ratioAt is monotonic non-decreasing within each band', () => {
    for (const c of ['I', 'II', 'III', 'IV', 'V'] as const) {
      for (let w = 12; w < 104; w += 4) {
        expect(ratioAt(c, w + 1)).toBeGreaterThanOrEqual(ratioAt(c, w) - 1e-9);
      }
    }
  });
});
