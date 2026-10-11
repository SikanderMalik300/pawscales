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
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    if (w >= a.weeks && w <= b.weeks) {
      const t = b.weeks === a.weeks ? 0 : (w - a.weeks) / (b.weeks - a.weeks);
      return a[field] + t * (b[field] - a[field]);
    }
  }
  return pts[pts.length - 1][field];
}

/** An age is "interpolated" when no observed growth bin sits within ~2.5 weeks. */
export function isInterpolatedAge(band: Cat, weeks: number): boolean {
  return !CATS[band].points.some(
    (p) => p.source === 'observed' && Math.abs(p.weeks - weeks) <= 2.5,
  );
}

export interface BreedRow {
  months: number;
  weeks: number;
  lowLb: number;
  typicalLb: number;
  highLb: number;
  interpolated: boolean;
  giant: boolean;
}

export const TABLE_MONTHS = [2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 24];

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
      interpolated: isInterpolatedAge(band, weeks),
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
