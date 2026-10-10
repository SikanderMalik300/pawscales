// Kitten age estimator (A6.5). Combines weight and developmental signs
// (Alley Cat Allies "Determining a Kitten's Age").
import { OZ_TO_G } from '@/lib/units';

export interface KittenSigns {
  weightOz?: number | null;
  eyesOpen: boolean;
  earsUp: boolean;
  incisors: boolean;
  canines: boolean;
  premolars: boolean;
  walking: boolean;
}

// Age (weeks) at which each sign first appears (lower bound).
const SIGN_MIN: Record<keyof Omit<KittenSigns, 'weightOz'>, number> = {
  eyesOpen: 1, // eyes open 7-10 days
  earsUp: 3, // ears upright by about 3 weeks
  incisors: 2.5, // incisors begin 2.5-3.5 weeks
  canines: 3, // canines begin 3-4 weeks
  premolars: 5, // premolars 5-6 weeks
  walking: 4, // walking steadily by about 4 weeks
};
const SIGN_MAX: Record<keyof Omit<KittenSigns, 'weightOz'>, number> = {
  eyesOpen: 2.5,
  earsUp: 4,
  incisors: 4,
  canines: 5,
  premolars: 8,
  walking: 6,
};

export type KittenResult =
  | { kind: 'need-input' }
  | { kind: 'ok'; lowWeeks: number; highWeeks: number; drivers: string[] };

const floorHalf = (x: number) => Math.floor(x * 2) / 2;
const ceilHalf = (x: number) => Math.ceil(x * 2) / 2;

export function estimateKittenAge(s: KittenSigns): KittenResult {
  const present = (Object.keys(SIGN_MIN) as (keyof typeof SIGN_MIN)[]).filter(
    (k) => s[k],
  );
  const hasWeight = s.weightOz != null && s.weightOz > 0;
  if (!hasWeight && present.length === 0) return { kind: 'need-input' };

  const drivers: string[] = [];
  let low: number;
  let high: number;

  if (hasWeight) {
    const oz = s.weightOz!;
    if (oz >= 16) {
      // after 4 weeks: ~4-6 oz gained per week from 1 lb
      low = 4 + (oz - 16) / 6;
      high = 4 + (oz - 16) / 4;
    } else {
      // rough: 8 oz ~ 1 week, 16 oz ~ 4 weeks
      const w = 1 + (oz - 8) * (3 / 8);
      low = w - 0.5;
      high = w + 0.5;
    }
    drivers.push(`weight (${Math.round(oz)} oz)`);
  } else {
    low = Math.max(...present.map((k) => SIGN_MIN[k]));
    high = Math.max(...present.map((k) => SIGN_MAX[k]));
  }

  // Clamp by the lower bound implied by the most advanced present sign.
  if (present.length) {
    const signLow = Math.max(...present.map((k) => SIGN_MIN[k]));
    low = Math.max(low, signLow);
    if (high < low) high = low + 0.5;
    const labels: Record<string, string> = {
      eyesOpen: 'eyes open', earsUp: 'ears up', incisors: 'incisors',
      canines: 'canines', premolars: 'premolars', walking: 'walking',
    };
    drivers.push(...present.map((k) => labels[k]));
  }

  low = Math.max(0.25, floorHalf(low));
  high = Math.max(low, ceilHalf(high));
  return { kind: 'ok', lowWeeks: low, highWeeks: high, drivers };
}

export const gToOzInput = (g: number): number => g / OZ_TO_G;
