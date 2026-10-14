// Dog food calculator (A6.9). Adult stages use MER = factor x RER; the puppy
// (growing) stage uses the shared taper by % of expected adult weight, so the
// calculator and the puppy feeding chart always agree.
import { rer, dogMer, treatsBudget, type DogStage } from '@/lib/calc/energy';
import { puppyKcal } from '@/lib/calc/puppyFeeding';
import { DOG_MER } from '@/lib/constants';
import { roundTo } from '@/lib/calc/round';

export type AdultStage = Exclude<DogStage, 'growthUnder4mo' | 'growth4moToAdult'>;
export type DogFoodStage = AdultStage | 'growth';

export interface DogFoodInput {
  weightKg: number;
  stage: DogFoodStage;
  kcalPerCup: number;
  adultKg?: number; // required when stage === 'growth'
}

export interface DogFoodResult {
  rer: number;
  mer: number;
  cupsPerDay: number;
  perMeal2: number;
  perMeal3: number;
  treatsKcal: number;
  nearAdult: boolean; // growing dog already >= 95% of adult weight
  growthPct: number | null; // fraction of adult weight, when stage === 'growth'
}

export function dogFood({ weightKg, stage, kcalPerCup, adultKg }: DogFoodInput): DogFoodResult | null {
  if (!(weightKg > 0) || !(kcalPerCup > 0)) return null;
  const r = rer(weightKg);

  let mer: number;
  let nearAdult = false;
  let growthPct: number | null = null;

  if (stage === 'growth') {
    if (!(adultKg && adultKg > 0) || adultKg < weightKg) return null;
    growthPct = weightKg / adultKg;
    const pf = puppyKcal(weightKg, adultKg);
    if (pf.kind === 'adult') {
      nearAdult = true;
      mer = Math.round(r * DOG_MER.neuteredAdult.value); // near adult: maintenance
    } else {
      mer = pf.kcal;
    }
  } else {
    mer = dogMer(weightKg, stage);
  }

  const cups = mer / kcalPerCup;
  return {
    rer: Math.round(r),
    mer: Math.round(mer),
    cupsPerDay: roundTo(cups, 2),
    perMeal2: roundTo(cups / 2, 2),
    perMeal3: roundTo(cups / 3, 2),
    treatsKcal: Math.round(treatsBudget(mer)),
    nearAdult,
    growthPct,
  };
}
