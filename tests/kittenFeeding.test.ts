import { describe, it, expect } from 'vitest';
import {
  kittenChart, kittenKcal, adultKcal, mealsForMonth, portions,
  KITTEN_FACTOR, ADULT_NEUTERED, ADULT_INTACT, CHART_MONTHS,
} from '@/lib/calc/kittenFeeding';
import { catFood } from '@/lib/calc/catFood';
import { rer } from '@/lib/calc/energy';
import { CAT_WEIGHT } from '@/lib/data/catWeight';
import { bySlug } from '@/lib/registry';
import { LB_TO_KG } from '@/lib/units';

describe('kitten energy factors (Merck DER table)', () => {
  it('kittens are 2.5 x RER; adults 1.2x neutered / 1.4x intact', () => {
    expect(KITTEN_FACTOR).toBe(2.5);
    expect(ADULT_NEUTERED).toBe(1.2);
    expect(ADULT_INTACT).toBe(1.4);
  });
  it('kittenKcal is 2.5 x RER, rounded', () => {
    for (const kg of [1, 1.5, 2, 3, 4]) {
      expect(kittenKcal(kg)).toBe(Math.round(rer(kg) * 2.5));
    }
  });
  it('adult maintenance drops below the kitten amount at the same weight', () => {
    const kg = 4;
    expect(adultKcal(kg, false)).toBeLessThan(kittenKcal(kg));
    expect(adultKcal(kg, true)).toBeLessThan(kittenKcal(kg));
    expect(adultKcal(kg, true)).toBeGreaterThan(adultKcal(kg, false)); // intact needs more
  });
});

describe('meals per day (Cornell Feline Health Center)', () => {
  it('three a day until six months, two a day from six months to one year', () => {
    for (const m of [2, 3, 4, 5]) expect(mealsForMonth(m), `${m}mo`).toBe(3);
    for (const m of [6, 7, 9, 11]) expect(mealsForMonth(m), `${m}mo`).toBe(2);
  });
});

describe('kitten feeding chart (by month, each sex)', () => {
  const chart = kittenChart();

  it('covers months 2 to 11 (kittenhood, before the one-year adult switch)', () => {
    expect(CHART_MONTHS).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(chart.map((r) => r.month)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it('each cell uses the Salt 2023 median weight and the 2.5 x RER / Cornell rules', () => {
    for (const row of chart) {
      for (const sex of ['F', 'M'] as const) {
        const cell = row.bySex[sex];
        const src = CAT_WEIGHT.main[sex].find((r) => r.month === row.month)!;
        expect(cell.weightLb).toBe(src.median);
        expect(cell.kcal).toBe(kittenKcal(src.median * LB_TO_KG));
        expect(cell.meals).toBe(mealsForMonth(row.month));
        expect(cell.kcalPerMeal).toBe(Math.round(cell.kcal / cell.meals));
      }
    }
  });

  it('daily calories never drop as the kitten gets older', () => {
    for (const sex of ['F', 'M'] as const) {
      let prev = -Infinity;
      for (const row of chart) {
        expect(row.bySex[sex].kcal, `${sex} ${row.month}mo`).toBeGreaterThanOrEqual(prev);
        prev = row.bySex[sex].kcal;
      }
    }
  });
});

describe('chart and the portion tool agree (cat food calculator logic)', () => {
  it('the growing-kitten calorie number matches catFood growth stage', () => {
    for (const row of kittenChart()) {
      for (const sex of ['F', 'M'] as const) {
        const kg = row.bySex[sex].weightLb * LB_TO_KG;
        const calc = catFood({ weightKg: kg, stage: 'growth', kcalPerCan: 85, kcalPerCup: 450, pctWet: 0 });
        expect(calc?.mer).toBe(row.bySex[sex].kcal);
      }
    }
  });

  it('portions divide daily kcal by the label density', () => {
    expect(portions(450, 450)).toBe(1);
    expect(portions(337, 450)).toBe(Math.round((337 / 450) * 100) / 100);
    expect(portions(100, 0)).toBe(0);
  });
});

describe('kitten feeding chart registry entry', () => {
  it('is registered with a compliant title and meta in the cat hub', () => {
    const e = bySlug('kitten-feeding-chart')!;
    expect(e).toBeTruthy();
    expect(e.title.length).toBeLessThanOrEqual(60);
    expect(e.metaDescription.length).toBeLessThanOrEqual(155);
    expect(e.category).toBe('cat-calculators');
  });
});
