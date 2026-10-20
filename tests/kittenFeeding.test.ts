import { describe, it, expect } from 'vitest';
import {
  kittenChart, kittenFeed, nrcGrowthKcal, adultKcal, mealsForMonth, portions,
  merckKittenKcal, MATURE_LB, ADULT_NEUTERED, ADULT_INTACT, ADULT_P, CHART_MONTHS,
} from '@/lib/calc/kittenFeeding';
import { rer } from '@/lib/calc/energy';
import { CAT_WEIGHT } from '@/lib/data/catWeight';
import { bySlug } from '@/lib/registry';
import { LB_TO_KG } from '@/lib/units';

const perKg = (kcal: number, lb: number) => kcal / (lb * LB_TO_KG);

describe('NRC 2006 growth equation', () => {
  it('matches 100 x BWa^0.67 x 6.7 x (e^-0.189p - 0.66)', () => {
    const bwa = 2, bwm = 4; // p = 0.5
    const expected = 100 * bwa ** 0.67 * 6.7 * (Math.exp(-0.189 * 0.5) - 0.66);
    expect(nrcGrowthKcal(bwa, bwm)).toBeCloseTo(expected, 6);
  });

  it('caps p at 1 (a kitten over mature weight uses p = 1, not more)', () => {
    const bwa = 5, bwm = 4; // real p = 1.25, must clamp to 1
    const atOne = 100 * bwa ** 0.67 * 6.7 * (Math.exp(-0.189 * 1) - 0.66);
    expect(nrcGrowthKcal(bwa, bwm)).toBeCloseTo(atOne, 6);
  });

  it('keeps Merck 2.5 x RER only as a cross-check constant', () => {
    expect(merckKittenKcal(2)).toBe(Math.round(rer(2) * 2.5));
  });
});

describe('feeding result edge cases', () => {
  it('p >= 1 (already at/above mature weight) returns the "over" message case', () => {
    expect(kittenFeed(4.2, 4, 8)!.kind).toBe('over');
    expect(kittenFeed(4, 4, 8)!.kind).toBe('over');
  });
  it('p >= 0.95 or age >= 12 months switches to adult (1.2x / 1.4x RER)', () => {
    const near = kittenFeed(3.9, 4, 8)!; // p = 0.975
    expect(near.kind).toBe('adult');
    if (near.kind === 'adult') {
      expect(near.neuteredKcal).toBe(Math.round(rer(3.9) * ADULT_NEUTERED));
      expect(near.intactKcal).toBe(Math.round(rer(3.9) * ADULT_INTACT));
      expect(near.intactKcal).toBeGreaterThan(near.neuteredKcal);
    }
    expect(kittenFeed(2, 4, 12)!.kind).toBe('adult'); // age hand-off even when small p
  });
  it('p < 0.95 and age < 12 uses the NRC growth curve', () => {
    expect(kittenFeed(2, 4, 4)!.kind).toBe('growth');
  });
  it('returns null for bad input', () => {
    expect(kittenFeed(0, 4, 4)).toBeNull();
    expect(kittenFeed(2, 0, 4)).toBeNull();
  });
});

describe('meals per day (Cornell)', () => {
  it('three until six months, two from six months to a year', () => {
    for (const m of [2, 3, 4, 5]) expect(mealsForMonth(m)).toBe(3);
    for (const m of [6, 8, 11]) expect(mealsForMonth(m)).toBe(2);
  });
});

describe('kitten feeding chart', () => {
  const chart = kittenChart();

  it('covers months 2 to 11', () => {
    expect(CHART_MONTHS).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(chart.map((r) => r.month)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it('calories per kg do NOT rise after six months (the cliff fix)', () => {
    for (const sex of ['F', 'M'] as const) {
      let prev = Infinity;
      for (const row of chart) {
        if (row.month < 6) continue;
        const pk = perKg(row.bySex[sex].kcal, row.bySex[sex].weightLb);
        expect(pk, `${sex} ${row.month}mo per-kg`).toBeLessThanOrEqual(prev + 1e-6);
        prev = pk;
      }
    }
  });

  it('the 11-month amount is within 1.5x of the 12-month adult amount', () => {
    for (const sex of ['F', 'M'] as const) {
      const k11 = chart.find((r) => r.month === 11)!.bySex[sex].kcal;
      const w12 = CAT_WEIGHT.main[sex].find((r) => r.month === 12)!.median * LB_TO_KG;
      const adult12 = adultKcal(w12, false);
      expect(k11 / adult12, `${sex} 11mo/adult`).toBeLessThanOrEqual(1.5);
    }
  });

  it('every chart cell equals the shared kittenFeed result (chart == calculator)', () => {
    for (const row of chart) {
      for (const sex of ['F', 'M'] as const) {
        const cell = row.bySex[sex];
        const feed = kittenFeed(cell.weightLb * LB_TO_KG, MATURE_LB[sex] * LB_TO_KG, row.month)!;
        const expected = feed.kind === 'growth' ? feed.kcal : feed.kind === 'adult' ? feed.neuteredKcal : 0;
        expect(cell.kcal, `${sex} ${row.month}mo`).toBe(expected);
        expect(cell.adult).toBe(feed.kind === 'adult');
        expect(cell.kcalPerMeal).toBe(Math.round(cell.kcal / cell.meals));
      }
    }
  });
});

describe('portions and defaults', () => {
  it('portions divide daily kcal by the label density', () => {
    expect(portions(450, 450)).toBe(1);
    expect(portions(225, 450)).toBe(0.5);
    expect(portions(100, 0)).toBe(0);
  });
  it('mature-weight defaults are the Salt 2023 adult medians', () => {
    expect(MATURE_LB.F).toBe(8.6);
    expect(MATURE_LB.M).toBe(10.4);
    expect(ADULT_P).toBe(0.95);
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
