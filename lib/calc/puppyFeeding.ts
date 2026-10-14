// Puppy feeding model (pawscales-day6 page 6). Shared by the puppy feeding chart
// and the dog food calculator (puppy mode) so the two always agree.
//
// Energy: RER = 70 x kg^0.75 (PNA). Growth factor tapers by % of expected adult
// weight (WSAVA/AAHA, anchored to PNA's 3x->2x RER range):
//   < 50% adult weight -> 3.0 x RER
//   50-80%             -> 2.5 x RER
//   80-95%             -> 2.0 x RER
//   >= 95%             -> adult maintenance (1.6 neutered / 1.8 intact, PNA)
// Current weight for a given age comes from the Salt et al. 2017 median growth
// curve (the puppy weight calculator's data), so the chart is keyed by age x
// expected adult weight.
import { rer } from '@/lib/calc/energy';
import { ratioAt, type Cat } from '@/lib/calc/puppyWeight';
import { bandForKg, MONTH_WEEKS } from '@/lib/calc/breedGrowth';
import { DOG_GROWTH_TAPER, DOG_MER } from '@/lib/constants';
import { LB_TO_KG } from '@/lib/units';

export const ADULT_SWITCH = 0.95; // calculator: >= 95% adult weight -> adult
export const CHART_HANDOFF = 0.8; // chart: >= 80% adult weight -> see calculator

/** Growth factor for a puppy at fraction `p` of expected adult weight. Returns
 *  null at/above the adult switch (feed as an adult instead). */
export function growthFactor(p: number): number | null {
  if (p >= ADULT_SWITCH) return null;
  if (p < 0.5) return DOG_GROWTH_TAPER.under50.value;
  if (p < 0.8) return DOG_GROWTH_TAPER.to80.value;
  return DOG_GROWTH_TAPER.to95.value;
}

/** Fraction of expected adult weight reached at an age, from the median curve. */
export function pctAdultAtAge(adultKg: number, months: number): number {
  const band: Cat = bandForKg(adultKg);
  return Math.min(1, ratioAt(band, months * MONTH_WEEKS));
}

export type PuppyFeed =
  | { kind: 'adult' } // >= 95% adult weight: use adult maintenance
  | { kind: 'ok'; currentKg: number; pct: number; factor: number; kcal: number };

/** kcal/day for a growing puppy from its current weight and expected adult
 *  weight. Both the chart and the calculator call this. */
export function puppyKcal(currentKg: number, adultKg: number): PuppyFeed {
  const pct = currentKg / adultKg;
  const factor = growthFactor(pct);
  if (factor == null) return { kind: 'adult' };
  return { kind: 'ok', currentKg, pct, factor, kcal: Math.round(rer(currentKg) * factor) };
}

/** Adult maintenance kcal/day (for the >=95% hand-off and the calculator). */
export const adultKcal = (kg: number, intact: boolean): number =>
  Math.round(rer(kg) * (intact ? DOG_MER.intactAdult.value : DOG_MER.neuteredAdult.value));

// ---- the chart: age x expected adult weight ----
export const CHART_ADULTS_LB = [10, 20, 40, 60, 80];
export const CHART_AGES = [2, 3, 4, 6, 8, 10, 12];
export const CHART_KCAL_PER_CUP = 400; // stated example density for cups/day

export interface ChartCell {
  months: number;
  handoff: boolean; // >= 80% adult weight: show "see the calculator"
  kcal?: number;
  cups?: number; // at CHART_KCAL_PER_CUP
}

export interface ChartRow {
  adultLb: number;
  cells: ChartCell[];
}

export function feedingChart(): ChartRow[] {
  return CHART_ADULTS_LB.map((adultLb) => {
    const adultKg = adultLb * LB_TO_KG;
    const cells = CHART_AGES.map((months): ChartCell => {
      const pct = pctAdultAtAge(adultKg, months);
      if (pct >= CHART_HANDOFF) return { months, handoff: true };
      const res = puppyKcal(adultKg * pct, adultKg);
      if (res.kind !== 'ok') return { months, handoff: true };
      return {
        months,
        handoff: false,
        kcal: res.kcal,
        cups: Math.round((res.kcal / CHART_KCAL_PER_CUP) * 10) / 10,
      };
    });
    return { adultLb, cells };
  });
}
