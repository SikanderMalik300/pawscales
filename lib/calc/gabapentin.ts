// Gabapentin reference ranges for dogs and cats (pawscales-dosage-calculators-
// plan.md rule 4: prescription medicine, reference-only, ranges not a dose).
// Sourced:
//   Dogs, ongoing (pain/seizures): 5-30 mg/kg PO q8h (Merck Veterinary Manual,
//     "Common Drugs Used to Treat Behavior Problems in Dogs").
//   Dogs, situational (before a stressor): 20-50 mg/kg (same Merck table) -
//     stated in prose only, no per-weight numbers.
//   Cats, pain: 3-10 mg/kg PO q8-12h (Merck, "Selected Analgesics for Use in
//     Cats").
//   Cats, pre-visit anxiety: 50-100 mg per cat, ~90 min before (van Haaften
//     2017 / Today's Veterinary Practice) - a flat per-cat dose.
import { LB_TO_KG } from '@/lib/units';

export interface DoseRange {
  minMgKg: number;
  maxMgKg: number;
  freq: string;
}

export const DOG_ONGOING: DoseRange = { minMgKg: 5, maxMgKg: 30, freq: 'every 8 hours' };
export const CAT_PAIN: DoseRange = { minMgKg: 3, maxMgKg: 10, freq: 'every 8 to 12 hours' };

// Stated in prose only (no per-weight table), per the agreed build.
export const DOG_SITUATIONAL = { minMgKg: 20, maxMgKg: 50 };
// Flat per-cat dose, shown in its own labeled box.
export const CAT_PREVISIT = { lowMg: 50, highMg: 100 };

export const DOG_WEIGHTS_LB = [10, 20, 40, 60, 80, 100];
export const CAT_WEIGHTS_LB = [6, 8, 10, 12, 15];

// Keep the shown range inside the published range: round the low end UP and the
// high end DOWN to the nearest 5 mg, so no value falls below min x kg or above
// max x kg (same two-way rule as the Benadryl/Zyrtec tablet rounding).
export const roundUp5 = (mg: number): number => Math.ceil(mg / 5) * 5;
export const roundDown5 = (mg: number): number => Math.floor(mg / 5) * 5;

export interface RefRow {
  lb: number;
  lowMg: number; // roundUp5(minMgKg x kg): at least min x kg
  highMg: number; // roundDown5(maxMgKg x kg): at most max x kg
}

/** A by-weight reference row: the mg range for a weight, kept inside the
 *  published mg/kg range and rounded to 5 mg. */
export function refRow(range: DoseRange, lb: number): RefRow {
  const kg = lb * LB_TO_KG;
  return { lb, lowMg: roundUp5(range.minMgKg * kg), highMg: roundDown5(range.maxMgKg * kg) };
}

export const dogOngoingTable = (): RefRow[] => DOG_WEIGHTS_LB.map((lb) => refRow(DOG_ONGOING, lb));
export const catPainTable = (): RefRow[] => CAT_WEIGHTS_LB.map((lb) => refRow(CAT_PAIN, lb));
