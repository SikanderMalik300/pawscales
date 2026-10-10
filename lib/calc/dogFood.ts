// Dog food calculator (A6.9).
import { rer, dogMer, treatsBudget, type DogStage } from '@/lib/calc/energy';
import { roundTo } from '@/lib/calc/round';

export interface DogFoodInput {
  weightKg: number;
  stage: DogStage;
  kcalPerCup: number; // from the bag, default 380
}

export interface DogFoodResult {
  rer: number;
  mer: number;
  cupsPerDay: number;
  perMeal2: number;
  perMeal3: number;
  treatsKcal: number;
}

export function dogFood({ weightKg, stage, kcalPerCup }: DogFoodInput): DogFoodResult | null {
  if (!(weightKg > 0) || !(kcalPerCup > 0)) return null;
  const r = rer(weightKg);
  const mer = dogMer(weightKg, stage);
  const cups = mer / kcalPerCup;
  return {
    rer: Math.round(r),
    mer: Math.round(mer),
    cupsPerDay: roundTo(cups, 2),
    perMeal2: roundTo(cups / 2, 2),
    perMeal3: roundTo(cups / 3, 2),
    treatsKcal: Math.round(treatsBudget(mer)),
  };
}
