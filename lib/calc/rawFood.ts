// Raw dog food calculator (A6.10). Energy-based grams per day.
import { rer, dogMer, type DogStage } from '@/lib/calc/energy';
import { roundTo } from '@/lib/calc/round';
import { OZ_TO_G } from '@/lib/units';

export interface RawFoodInput {
  weightKg: number;
  stage: DogStage;
  kcalPerKgFood: number; // energy density of the raw food, default 1400
}

export interface RawFoodResult {
  rer: number;
  mer: number;
  gramsPerDay: number;
  ozPerDay: number;
  pctBodyWeight: number;
}

export function rawFood({ weightKg, stage, kcalPerKgFood }: RawFoodInput): RawFoodResult | null {
  if (!(weightKg > 0) || !(kcalPerKgFood > 0)) return null;
  const mer = dogMer(weightKg, stage);
  const grams = (mer / kcalPerKgFood) * 1000;
  return {
    rer: Math.round(rer(weightKg)),
    mer: Math.round(mer),
    gramsPerDay: Math.round(grams),
    ozPerDay: roundTo(grams / OZ_TO_G, 1),
    pctBodyWeight: roundTo((grams / (weightKg * 1000)) * 100, 2),
  };
}
