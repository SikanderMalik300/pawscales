// Breed growth maths (pawscales-growth-pages-1.md section 1). Scales the Salt et
// al. 2017 normalized growth curves to a breed's sourced adult weight range.
import growth from '@/data/growth-ratios.json';
import { roundTo } from '@/lib/calc/round';
import type { Cat } from '@/lib/calc/puppyWeight';

const CATS = growth.categories as Record<string, {
  minKg: number; maxKg: number; dogs: number;
  points: { weeks: number; source: string; normP25: number; normMedianSmoothed: number; normP75: number }[];
}>;

const BOUNDS: [Cat, number, number][] = [
  ['I', 0, 6.5], ['II', 6.5, 9], ['III', 9, 15], ['IV', 15, 30], ['V', 30, 40],
];

/** Salt size band containing a weight in kg; 40 kg and up use band V (giant). */
export function bandForKg(kg: number): Cat {
  for (const [name, lo, hi] of BOUNDS) if (kg >= lo && kg < hi) return name;
  return 'V';
}

export const MONTH_WEEKS = 365.25 / 12 / 7; // ~4.345
export const TOTAL_DOGS = growth.totals.dogs; // 60,951
export const GIANT_LB = 88; // 40 kg

type NormField = 'normP25' | 'normMedianSmoothed' | 'normP75';

function interpNorm(band: Cat, weeks: number, field: NormField): number {
  const pts = CATS[band].points;
  const w = Math.max(pts[0].weeks, Math.min(weeks, pts[pts.length - 1].weeks));
  // Cap the fraction of adult weight at 1.0: the normalized Salt curve drifts a
  // little above 1.0 at the oldest ages, which would push a table value past the
  // column's adult weight (e.g. Goldendoodle Petite over GANA's "up to 25 lb").
  const cap = (v: number) => Math.min(1, v);
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    if (w >= a.weeks && w <= b.weeks) {
      const t = b.weeks === a.weeks ? 0 : (w - a.weeks) / (b.weeks - a.weeks);
      return cap(a[field] + t * (b[field] - a[field]));
    }
  }
  return cap(pts[pts.length - 1][field]);
}

export type AgeKind = 'observed' | 'interpolated' | 'estimated';

const observedWeeks = (band: Cat) =>
  CATS[band].points.filter((p) => p.source === 'observed').map((p) => p.weeks);

/** Classify a table age against the observed growth bins for a band:
 *  - estimated: before the first or after the last observed bin (extrapolated);
 *  - interpolated: inside the observed range but between bins;
 *  - observed: within ~2.5 weeks of an observed bin. */
export function ageKind(band: Cat, weeks: number): AgeKind {
  const obs = observedWeeks(band);
  const first = obs[0];
  const last = obs[obs.length - 1];
  if (weeks < first - 0.5 || weeks > last + 0.5) return 'estimated';
  if (obs.some((w) => Math.abs(w - weeks) <= 2.5)) return 'observed';
  return 'interpolated';
}

export interface BreedRow {
  months: number;
  weeks: number;
  lowLb: number;
  typicalLb: number;
  highLb: number;
  kind: AgeKind;
  giant: boolean;
}

// Start at 3 months: the growth data begins at 12 weeks (~2.76 months), so a
// 2-month row would be clamped/extrapolated.
export const TABLE_MONTHS = [3, 4, 5, 6, 8, 10, 12, 15, 18, 24];

/** Expected weight by age: low = adultLow x p25, typical = midpoint x median,
 *  high = adultHigh x p75, all on the normalized curve. */
export function expectedByAge(
  adultLowLb: number,
  adultHighLb: number,
  band: Cat,
  months: number[] = TABLE_MONTHS,
): BreedRow[] {
  const mid = (adultLowLb + adultHighLb) / 2;
  return months.map((m) => {
    const weeks = m * MONTH_WEEKS;
    const highLb = adultHighLb * interpNorm(band, weeks, 'normP75');
    return {
      months: m,
      weeks,
      lowLb: roundTo(adultLowLb * interpNorm(band, weeks, 'normP25'), 1),
      typicalLb: roundTo(mid * interpNorm(band, weeks, 'normMedianSmoothed'), 1),
      highLb: roundTo(highLb, 1),
      kind: ageKind(band, weeks),
      giant: highLb >= GIANT_LB,
    };
  });
}

/** Where a current weight sits vs the typical range at that age. */
export function positionForAge(
  rows: BreedRow[],
  weeks: number,
  weightLb: number,
): 'below' | 'inside' | 'above' {
  // nearest row by weeks
  const row = rows.reduce((best, r) =>
    Math.abs(r.weeks - weeks) < Math.abs(best.weeks - weeks) ? r : best,
  );
  if (weightLb < row.lowLb) return 'below';
  if (weightLb > row.highLb) return 'above';
  return 'inside';
}
