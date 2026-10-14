import { describe, it, expect } from 'vitest';
import {
  feedingChart, puppyKcal, pctAdultAtAge, growthFactor,
  CHART_ADULTS_LB, CHART_HANDOFF, CHART_KCAL_PER_CUP, PEAK_EASE,
} from '@/lib/calc/puppyFeeding';
import { dogFood } from '@/lib/calc/dogFood';
import { bySlug } from '@/lib/registry';
import { LB_TO_KG } from '@/lib/units';

describe('puppy growth taper', () => {
  it('factors step down by % of adult weight', () => {
    expect(growthFactor(0.3)).toBe(3.0);
    expect(growthFactor(0.6)).toBe(2.5);
    expect(growthFactor(0.85)).toBe(2.0);
    expect(growthFactor(0.95)).toBeNull(); // adult switch
    expect(growthFactor(0.99)).toBeNull();
  });
});

describe('feeding chart', () => {
  const chart = feedingChart();

  it('kcal never drops before 80% of adult weight (catches the old 4-month cliff)', () => {
    for (const row of chart) {
      const adultKg = row.adultLb * LB_TO_KG;
      let prev = -Infinity;
      for (const cell of row.cells) {
        if (cell.handoff) continue;
        const pct = pctAdultAtAge(adultKg, cell.months);
        if (pct < PEAK_EASE) {
          expect(cell.kcal!, `${row.adultLb}lb at ${cell.months}mo`).toBeGreaterThanOrEqual(prev);
        }
        prev = cell.kcal!;
      }
    }
  });

  it('hands off to the calculator only at >= 95% of adult weight', () => {
    for (const row of chart) {
      const adultKg = row.adultLb * LB_TO_KG;
      for (const cell of row.cells) {
        const pct = pctAdultAtAge(adultKg, cell.months);
        expect(cell.handoff).toBe(pct >= CHART_HANDOFF);
      }
    }
  });

  it('shows numbers through 12 months (no cell reaches 95% that early)', () => {
    for (const row of chart) {
      expect(row.cells.every((c) => !c.handoff), `${row.adultLb}lb`).toBe(true);
    }
  });

  it('cups use the stated example density', () => {
    for (const row of chart) {
      for (const cell of row.cells) {
        if (cell.handoff) continue;
        expect(cell.cups).toBe(Math.round((cell.kcal! / CHART_KCAL_PER_CUP) * 10) / 10);
      }
    }
  });
});

describe('chart and calculator agree', () => {
  it('give the same kcal for the same inputs (every numeric chart cell)', () => {
    for (const adultLb of CHART_ADULTS_LB) {
      const adultKg = adultLb * LB_TO_KG;
      const row = feedingChart().find((r) => r.adultLb === adultLb)!;
      for (const cell of row.cells) {
        if (cell.handoff) continue;
        const pct = pctAdultAtAge(adultKg, cell.months);
        const currentKg = adultKg * pct;
        // the shared puppyKcal used by the chart
        const direct = puppyKcal(currentKg, adultKg);
        if (direct.kind !== 'ok') throw new Error('expected ok');
        expect(direct.kcal).toBe(cell.kcal);
        // the dog food calculator, growth stage, same inputs
        const calc = dogFood({ weightKg: currentKg, stage: 'growth', adultKg, kcalPerCup: 400 });
        expect(calc?.mer).toBe(cell.kcal);
      }
    }
  });

  it('the calculator flags near-adult puppies (>= 95%)', () => {
    const adultKg = 40 * LB_TO_KG;
    const r = dogFood({ weightKg: adultKg * 0.97, stage: 'growth', adultKg, kcalPerCup: 400 });
    expect(r?.nearAdult).toBe(true);
  });
});

describe('puppy feeding chart registry entry', () => {
  it('is registered with a compliant title and meta', () => {
    const e = bySlug('puppy-feeding-chart')!;
    expect(e).toBeTruthy();
    expect(e.title.length).toBeLessThanOrEqual(60);
    expect(e.metaDescription.length).toBeLessThanOrEqual(155);
    expect(e.category).toBe('dog-calculators');
  });
});
