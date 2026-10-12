import { describe, it, expect } from 'vitest';
import { BREEDS, bandForSex } from '@/lib/data/breeds';
import { bandForKg, expectedByAge, TOTAL_DOGS } from '@/lib/calc/breedGrowth';
import { predictPuppyWeight } from '@/lib/calc/puppyWeight';
import { allPages, BREED_PAGES } from '@/lib/registry';
import { lbToKg, kgToLb } from '@/lib/units';
import { roundTo } from '@/lib/calc/round';

const golden = BREEDS['golden-retriever-weight-chart'];
const gsd = BREEDS['german-shepherd-weight-chart'];

describe('breed band selection', () => {
  it('bandForKg boundaries', () => {
    expect(bandForKg(6)).toBe('I');
    expect(bandForKg(10)).toBe('III');
    expect(bandForKg(20)).toBe('IV');
    expect(bandForKg(35)).toBe('V');
    expect(bandForKg(45)).toBe('V'); // >=40 giant -> band V
  });
  it('Golden: female -> band IV, male -> band V', () => {
    expect(bandForSex(golden.female)).toBe('IV');
    expect(bandForSex(golden.male)).toBe('V');
  });
  it('German Shepherd: female -> band IV, male -> band V', () => {
    expect(bandForSex(gsd.female)).toBe('IV');
    expect(bandForSex(gsd.male)).toBe('V');
  });
});

describe('Golden Retriever worked examples', () => {
  it('Ex1 female 16 wk 25 lb -> ~56.6 lb, inside 55-65', () => {
    const r = predictPuppyWeight({ ageWeeks: 16, weightKg: lbToKg(25), size: bandForSex(golden.female) });
    if (r.kind !== 'ok') throw new Error('expected ok');
    expect(roundTo(kgToLb(r.adultKg), 1)).toBe(56.6);
    expect(kgToLb(r.adultKg)).toBeGreaterThan(55);
    expect(kgToLb(r.adultKg)).toBeLessThan(65);
  });
  it('Ex2 male 6 mo (26.07 wk) 45 lb -> ~64.2 lb', () => {
    const r = predictPuppyWeight({ ageWeeks: 6 * (365.25 / 12 / 7), weightKg: lbToKg(45), size: bandForSex(golden.male) });
    if (r.kind !== 'ok') throw new Error('expected ok');
    expect(roundTo(kgToLb(r.adultKg), 1)).toBe(64.2);
    expect(Math.round(r.pctNow)).toBe(70);
  });
});

describe('German Shepherd worked examples', () => {
  it('Ex1 male 16 wk 30 lb -> ~69.9 lb, 43% now', () => {
    const r = predictPuppyWeight({ ageWeeks: 16, weightKg: lbToKg(30), size: bandForSex(gsd.male) });
    if (r.kind !== 'ok') throw new Error('expected ok');
    expect(roundTo(kgToLb(r.adultKg), 1)).toBe(69.9);
    expect(Math.round(r.pctNow)).toBe(43);
  });
  it('Ex2 female 8 mo (34.76 wk) 50 lb -> ~55.9 lb, 89% now', () => {
    const r = predictPuppyWeight({ ageWeeks: 8 * (365.25 / 12 / 7), weightKg: lbToKg(50), size: bandForSex(gsd.female) });
    if (r.kind !== 'ok') throw new Error('expected ok');
    expect(roundTo(kgToLb(r.adultKg), 1)).toBe(55.9);
    expect(Math.round(r.pctNow)).toBe(89);
  });
});

describe('expected-by-age tables', () => {
  it('typical weight at 24 months equals the adult midpoint', () => {
    const f = expectedByAge(golden.female.lowLb, golden.female.highLb, bandForSex(golden.female));
    const m = expectedByAge(golden.male.lowLb, golden.male.highLb, bandForSex(golden.male));
    expect(f[f.length - 1].typicalLb).toBe(60); // (55+65)/2
    expect(m[m.length - 1].typicalLb).toBe(70); // (65+75)/2
  });
  it('German Shepherd male crosses the giant note (>88 lb high)', () => {
    const m = expectedByAge(gsd.male.lowLb, gsd.male.highLb, bandForSex(gsd.male));
    expect(m.some((r) => r.giant)).toBe(true);
  });
  it('Golden males do not trip the giant note', () => {
    const m = expectedByAge(golden.male.lowLb, golden.male.highLb, bandForSex(golden.male));
    expect(m.every((r) => !r.giant)).toBe(true);
  });
  it('uses the real dog count', () => {
    expect(TOTAL_DOGS).toBe(60951);
  });
  it('no table row is below 12 weeks (data starts at 12 weeks)', () => {
    for (const breed of Object.values(BREEDS)) {
      for (const sex of ['male', 'female'] as const) {
        const rows = expectedByAge(breed[sex].lowLb, breed[sex].highLb, bandForSex(breed[sex]));
        expect(rows[0].months).toBe(3);
        expect(rows.every((r) => r.weeks >= 12)).toBe(true);
      }
    }
  });
  it('rows past the last observed bin are "estimated", not "interpolated"', () => {
    const rows = expectedByAge(golden.female.lowLb, golden.female.highLb, bandForSex(golden.female));
    expect(rows[rows.length - 1].months).toBe(24);
    expect(rows[rows.length - 1].kind).toBe('estimated'); // 24 mo ~104 wk > last observed (~100 wk)
  });
});

describe('registry guards (incl. breed pages)', () => {
  it('every title <= 60 and meta <= 155', () => {
    for (const p of allPages()) {
      expect(p.title.length, `${p.slug} title`).toBeLessThanOrEqual(60);
      expect(p.metaDescription.length, `${p.slug} meta`).toBeLessThanOrEqual(155);
    }
  });
  it('each breed page has an AKC source config', () => {
    for (const p of BREED_PAGES) {
      expect(BREEDS[p.slug], `${p.slug} breed config`).toBeTruthy();
      expect(BREEDS[p.slug].akcUrl).toMatch(/akc\.org/);
    }
  });
});
