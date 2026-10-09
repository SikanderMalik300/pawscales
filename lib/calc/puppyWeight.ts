// Puppy adult-weight prediction (pawscales-build-spec.md A6.1).
// Uses the normalized growth table: normMedianSmoothed = 1.0 at the 2-year
// plateau, so adult = weight / normMedianSmoothed(age) predicts weight at ~2y.
import growth from '@/data/growth-ratios.json';
import { LB_TO_KG } from '@/lib/units';

export type Cat = 'I' | 'II' | 'III' | 'IV' | 'V';
export const CATS: Cat[] = ['I', 'II', 'III', 'IV', 'V'];

// Toy/Small/Medium/Large/X-Large = categories I-V
export type SizeChoice = 'ns' | Cat;
export const SIZE_LABELS: Record<Cat, string> = {
  I: 'Toy',
  II: 'Small',
  III: 'Medium',
  IV: 'Large',
  V: 'X-Large',
};

interface Point {
  weeks: number;
  normP25: number;
  normMedianSmoothed: number;
  normP75: number;
}
interface CatData {
  minKg: number;
  maxKg: number;
  points: Point[];
}

const CATEGORIES = growth.categories as unknown as Record<Cat, CatData>;
export const MIN_WEEKS = 12;
export const MAX_WEEKS = 104;
const GIANT_KG = 40;

/** Linear interpolation of a normalized field, clamped to the table range. */
function interp(cat: Cat, weeks: number, field: keyof Point): number {
  const pts = CATEGORIES[cat].points;
  const w = Math.max(pts[0].weeks, Math.min(weeks, pts[pts.length - 1].weeks));
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    if (w >= a.weeks && w <= b.weeks) {
      const t = b.weeks === a.weeks ? 0 : (w - a.weeks) / (b.weeks - a.weeks);
      return (a[field] as number) + t * ((b[field] as number) - (a[field] as number));
    }
  }
  return pts[pts.length - 1][field] as number;
}

export const ratioAt = (cat: Cat, weeks: number): number =>
  interp(cat, weeks, 'normMedianSmoothed');

export const bandLabelKg = (cat: Cat): string => {
  const c = CATEGORIES[cat];
  return c.minKg === 0 ? `up to ${c.maxKg} kg` : `${c.minKg}–${c.maxKg} kg`;
};

export interface PuppyInput {
  ageWeeks: number;
  weightKg: number;
  size: SizeChoice;
}

export type PuppyResult =
  | { kind: 'too-young' }
  | { kind: 'invalid' }
  | {
      kind: 'ok';
      cat: Cat;
      adultKg: number;
      lowKg: number;
      highKg: number;
      pctNow: number; // % of adult (2-year) weight now
      giant: boolean;
      /** median curve for the chart, scaled to adultKg (kg) */
      curveKg: { weeks: number; low: number; mid: number; high: number }[];
    };

/** Pick the "Not sure" category whose kg band contains its own estimate. */
function chooseCat(weightKg: number, weeks: number): Cat {
  const est: Record<Cat, number> = {} as Record<Cat, number>;
  for (const c of CATS) est[c] = weightKg / ratioAt(c, weeks);

  const qualifies = CATS.filter(
    (c) => est[c] >= CATEGORIES[c].minKg && est[c] < CATEGORIES[c].maxKg,
  );
  if (qualifies.length === 1) return qualifies[0];
  if (qualifies.length > 1) {
    return qualifies.reduce((best, c) => {
      const mid = (CATEGORIES[c].minKg + CATEGORIES[c].maxKg) / 2;
      const bmid = (CATEGORIES[best].minKg + CATEGORIES[best].maxKg) / 2;
      return Math.abs(est[c] - mid) < Math.abs(est[best] - bmid) ? c : best;
    });
  }
  // none qualify: nearest band edge
  return CATS.reduce((best, c) => {
    const d = Math.min(
      Math.abs(est[c] - CATEGORIES[c].minKg),
      Math.abs(est[c] - CATEGORIES[c].maxKg),
    );
    const bd = Math.min(
      Math.abs(est[best] - CATEGORIES[best].minKg),
      Math.abs(est[best] - CATEGORIES[best].maxKg),
    );
    return d < bd ? c : best;
  });
}

export function predictPuppyWeight(input: PuppyInput): PuppyResult {
  const { ageWeeks, weightKg, size } = input;
  if (
    !Number.isFinite(ageWeeks) ||
    !Number.isFinite(weightKg) ||
    ageWeeks <= 0 ||
    weightKg <= 0
  ) {
    return { kind: 'invalid' };
  }
  if (ageWeeks < MIN_WEEKS) return { kind: 'too-young' };

  const cat = size === 'ns' ? chooseCat(weightKg, ageWeeks) : size;
  const mid = ratioAt(cat, ageWeeks);
  const p25 = interp(cat, ageWeeks, 'normP25');
  const p75 = interp(cat, ageWeeks, 'normP75');

  const adultKg = weightKg / mid;
  const lowKg = weightKg / p75;
  const highKg = weightKg / p25;
  const pctNow = mid * 100;

  const curveKg = CATEGORIES[cat].points.map((p) => ({
    weeks: p.weeks,
    low: p.normP25 * adultKg,
    mid: p.normMedianSmoothed * adultKg,
    high: p.normP75 * adultKg,
  }));

  return {
    kind: 'ok',
    cat,
    adultKg,
    lowKg,
    highKg,
    pctNow,
    giant: adultKg >= GIANT_KG,
    curveKg,
  };
}

export const GIANT_LB = Math.round(GIANT_KG / LB_TO_KG); // 88
