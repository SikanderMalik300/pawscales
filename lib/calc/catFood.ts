// Cat food calculator (A6.12). Splits daily calories between wet and dry.
import { rer, catMer, type CatStage } from '@/lib/calc/energy';
import { roundTo } from '@/lib/calc/round';

export interface CatFoodInput {
  weightKg: number;
  stage: CatStage;
  kcalPerCan: number; // wet, default 85 per 3 oz can
  kcalPerCup: number; // dry, default 400
  pctWet: number; // 0..100
}

export interface CatFoodResult {
  rer: number;
  mer: number;
  cansPerDay: number;
  cupsPerDay: number;
  wetKcal: number;
  dryKcal: number;
}

export function catFood({
  weightKg,
  stage,
  kcalPerCan,
  kcalPerCup,
  pctWet,
}: CatFoodInput): CatFoodResult | null {
  if (!(weightKg > 0)) return null;
  const mer = catMer(weightKg, stage);
  const w = Math.min(100, Math.max(0, pctWet)) / 100;
  const wetKcal = mer * w;
  const dryKcal = mer * (1 - w);
  return {
    rer: Math.round(rer(weightKg)),
    mer: Math.round(mer),
    cansPerDay: kcalPerCan > 0 ? roundTo(wetKcal / kcalPerCan, 2) : 0,
    cupsPerDay: kcalPerCup > 0 ? roundTo(dryKcal / kcalPerCup, 2) : 0,
    wetKcal: Math.round(wetKcal),
    dryKcal: Math.round(dryKcal),
  };
}
