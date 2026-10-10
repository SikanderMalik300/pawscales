import { describe, it, expect } from 'vitest';
import { dogFood } from '@/lib/calc/dogFood';
import { rawFood } from '@/lib/calc/rawFood';
import { catFood } from '@/lib/calc/catFood';
import { rer } from '@/lib/calc/energy';
import { lbToKg } from '@/lib/units';
import { roundTo } from '@/lib/calc/round';

describe('dog food calculator', () => {
  // Ex1: 20 kg neutered adult, 380 kcal/cup -> RER 662, MER 1059, 2.79 cups
  const e1 = dogFood({ weightKg: 20, stage: 'neuteredAdult', kcalPerCup: 380 })!;
  it('ex1 RER 662', () => expect(e1.rer).toBe(662));
  it('ex1 MER 1059', () => expect(e1.mer).toBe(1059));
  it('ex1 cups 2.79', () => expect(e1.cupsPerDay).toBe(2.79));

  // Ex2: 40 lb (18.14 kg) intact adult, 350 kcal/cup -> RER 615, MER 1108, 3.16 cups
  const e2 = dogFood({ weightKg: lbToKg(40), stage: 'intactAdult', kcalPerCup: 350 })!;
  it('ex2 RER 615', () => expect(e2.rer).toBe(615));
  it('ex2 MER 1108', () => expect(e2.mer).toBe(1108));
  it('ex2 cups 3.16', () => expect(e2.cupsPerDay).toBe(3.16));

  it('treats budget is 10% of MER', () => expect(e1.treatsKcal).toBe(Math.round(e1.mer * 0.1)));
  it('per-meal split halves and thirds the cups', () => {
    expect(e1.perMeal2).toBeCloseTo(e1.cupsPerDay / 2, 1);
    expect(e1.perMeal3).toBeCloseTo(e1.cupsPerDay / 3, 1);
  });
  it('zero weight or zero kcal returns null (no NaN)', () => {
    expect(dogFood({ weightKg: 0, stage: 'neuteredAdult', kcalPerCup: 380 })).toBeNull();
    expect(dogFood({ weightKg: 20, stage: 'neuteredAdult', kcalPerCup: 0 })).toBeNull();
  });
  it('RER equals 70 * kg^0.75', () => {
    expect(Math.round(rer(20))).toBe(662);
  });
});

describe('raw dog food calculator', () => {
  // Ex1: 20 kg neutered, 1400 kcal/kg -> 1059 kcal -> 757 g (26.7 oz), 3.78% BW
  const e1 = rawFood({ weightKg: 20, stage: 'neuteredAdult', kcalPerKgFood: 1400 })!;
  it('ex1 MER 1059', () => expect(e1.mer).toBe(1059));
  it('ex1 grams 757', () => expect(e1.gramsPerDay).toBe(757));
  it('ex1 ounces 26.7', () => expect(e1.ozPerDay).toBe(26.7));
  it('ex1 3.78% of body weight', () => expect(e1.pctBodyWeight).toBe(3.78));

  // Ex2: 60 lb (27.22 kg) intact, 1800 kcal/kg -> 1501 kcal -> 834 g (29.4 oz), 3.06%
  const e2 = rawFood({ weightKg: lbToKg(60), stage: 'intactAdult', kcalPerKgFood: 1800 })!;
  it('ex2 MER 1501', () => expect(e2.mer).toBe(1501));
  it('ex2 grams 834', () => expect(e2.gramsPerDay).toBe(834));
  it('ex2 ounces 29.4', () => expect(e2.ozPerDay).toBe(29.4));
  it('ex2 3.06% of body weight', () => expect(e2.pctBodyWeight).toBe(3.06));

  it('invalid input returns null', () => {
    expect(rawFood({ weightKg: -1, stage: 'neuteredAdult', kcalPerKgFood: 1400 })).toBeNull();
  });
  it('ounces equal grams divided by 28.35', () => {
    expect(e1.ozPerDay).toBe(roundTo(e1.gramsPerDay / 28.349523125, 1));
  });
  it('a denser food means fewer grams for the same dog', () => {
    const dense = rawFood({ weightKg: 20, stage: 'neuteredAdult', kcalPerKgFood: 2000 })!;
    expect(dense.gramsPerDay).toBeLessThan(e1.gramsPerDay);
  });
});

describe('cat food calculator', () => {
  // Ex1: 4.5 kg neutered, all wet 85 kcal/can -> RER 216, MER 260, 3.05 cans
  const e1 = catFood({ weightKg: 4.5, stage: 'neuteredAdult', kcalPerCan: 85, kcalPerCup: 400, pctWet: 100 })!;
  it('ex1 RER 216', () => expect(e1.rer).toBe(216));
  it('ex1 MER 260', () => expect(e1.mer).toBe(260));
  it('ex1 cans 3.05', () => expect(e1.cansPerDay).toBe(3.05));

  // Ex2: 10 lb (4.54 kg) intact, all dry 400 kcal/cup -> RER 218, MER 305, 0.76 cups
  const e2 = catFood({ weightKg: lbToKg(10), stage: 'intactAdult', kcalPerCan: 85, kcalPerCup: 400, pctWet: 0 })!;
  it('ex2 RER 218', () => expect(e2.rer).toBe(218));
  it('ex2 MER 305', () => expect(e2.mer).toBe(305));
  it('ex2 cups 0.76', () => expect(e2.cupsPerDay).toBe(0.76));

  it('50/50 split halves the energy to each food', () => {
    const r = catFood({ weightKg: 4.5, stage: 'neuteredAdult', kcalPerCan: 85, kcalPerCup: 400, pctWet: 50 })!;
    expect(r.wetKcal + r.dryKcal).toBe(r.mer);
    expect(Math.abs(r.wetKcal - r.dryKcal)).toBeLessThanOrEqual(1);
  });
  it('invalid weight returns null', () => {
    expect(catFood({ weightKg: 0, stage: 'neuteredAdult', kcalPerCan: 85, kcalPerCup: 400, pctWet: 100 })).toBeNull();
  });
  it('pctWet is clamped to 0..100', () => {
    const over = catFood({ weightKg: 4.5, stage: 'neuteredAdult', kcalPerCan: 85, kcalPerCup: 400, pctWet: 150 })!;
    expect(over.dryKcal).toBe(0);
    expect(over.wetKcal).toBe(over.mer);
  });
  it('an inactive cat needs fewer calories than a neutered adult', () => {
    const inactive = catFood({ weightKg: 4.5, stage: 'inactive', kcalPerCan: 85, kcalPerCup: 400, pctWet: 100 })!;
    expect(inactive.mer).toBeLessThan(e1.mer);
  });
});
