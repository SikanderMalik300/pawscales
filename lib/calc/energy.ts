// Shared energy model for the feeding calculators (A6.9, A6.10, A6.12).
// RER = 70 * kg^0.75 (Pet Nutrition Alliance). MER = factor * RER.
import { ENERGY, DOG_MER, CAT_MER } from '@/lib/constants';

export const rer = (kg: number): number =>
  ENERGY.rerCoefficient.value * kg ** ENERGY.rerExponent.value;

export type DogStage =
  | 'neuteredAdult'
  | 'intactAdult'
  | 'inactive'
  | 'weightLoss'
  | 'growthUnder4mo'
  | 'growth4moToAdult';

export type CatStage =
  | 'neuteredAdult'
  | 'intactAdult'
  | 'inactive'
  | 'weightLoss'
  | 'growth';

export const dogFactor = (s: DogStage): number => DOG_MER[s].value;
export const catFactor = (s: CatStage): number => CAT_MER[s].value;

export const dogMer = (kg: number, s: DogStage): number => rer(kg) * dogFactor(s);
export const catMer = (kg: number, s: CatStage): number => rer(kg) * catFactor(s);

export const treatsBudget = (merKcal: number): number =>
  merKcal * (ENERGY.treatsPct.value / 100);
