// Trazodone reference ranges for dogs and cats (pawscales-dosage-calculators-
// plan.md rule 4: prescription medicine, reference-only, ranges not a dose).
// Sourced:
//   Dogs: 2-7.5 mg/kg PO q8-24h as needed, up to 19.5 mg/kg in any 24 h (Merck
//     Veterinary Manual, "Common Drugs Used to Treat Behavior Problems in
//     Dogs"). One range covers situational and ongoing use. No cited absolute
//     per-dog mg ceiling (Merck and Clinician's Brief cap by mg/kg only).
//   Cats: 50 mg per cat, ~1 h before a stressor (Stevens et al. 2016, JAVMA),
//     titrated up to 100 mg (Orlando et al. 2016, JFMS) - a flat per-cat dose.
import { LB_TO_KG } from '@/lib/units';

export interface DoseRange {
  minMgKg: number;
  maxMgKg: number;
  freq: string;
}

export const DOG: DoseRange = { minMgKg: 2, maxMgKg: 7.5, freq: 'every 8 to 24 hours' };
export const DOG_DAILY_MAX_MGKG = 19.5; // Merck: up to 19.5 mg/kg in any 24-h period
export const CAT_FLAT = { lowMg: 50, highMg: 100 }; // per cat, ~1 h before

export const DOG_WEIGHTS_LB = [10, 20, 40, 60, 80, 100];

// Keep the shown range inside the published range: low rounds UP, high rounds
// DOWN to the nearest 5 mg (same rule as the gabapentin reference table).
export const roundUp5 = (mg: number): number => Math.ceil(mg / 5) * 5;
export const roundDown5 = (mg: number): number => Math.floor(mg / 5) * 5;

export interface RefRow {
  lb: number;
  lowMg: number; // roundUp5(minMgKg x kg): at least min x kg
  highMg: number; // roundDown5(maxMgKg x kg): at most max x kg
}

export function refRow(range: DoseRange, lb: number): RefRow {
  const kg = lb * LB_TO_KG;
  return { lb, lowMg: roundUp5(range.minMgKg * kg), highMg: roundDown5(range.maxMgKg * kg) };
}

export const dogTable = (): RefRow[] => DOG_WEIGHTS_LB.map((lb) => refRow(DOG, lb));
