// Dog chocolate toxicity (pawscales-dosage-calculators-plan.md). This is a
// triage tool: it estimates the methylxanthine (theobromine + caffeine) dose a
// dog ate and flags the risk band. It never says "safe" and always points to a
// vet / ASPCA Animal Poison Control.
//
// Methylxanthine content (Merck Veterinary Manual, "Chocolate Toxicosis in
// Animals"), using the HIGH end of each range so the tool errs toward caution.
// Very dark (70%+) is from USDA FoodData Central (theobromine 802 + caffeine 80
// = 882 mg / 100 g = 8.82 mg/g).
// Thresholds in dogs (Merck / ASPCA APCC): >=20 mg/kg mild (GI) signs; 40-50
// cardiac; >=60 seizures; LD50 100-200 mg/kg.
import { LB_TO_KG, OZ_TO_G } from '@/lib/units';

export type ChocKey = 'white' | 'milk' | 'semisweet' | 'verydark' | 'baker' | 'cocoa';

export interface ChocType {
  key: ChocKey;
  label: string;
  mgPerOz: number; // methylxanthine mg per ounce
  mgPerG: number; // methylxanthine mg per gram
  source: string;
}

// Ordered mildest -> strongest for the select.
export const CHOC_TYPES: ChocType[] = [
  { key: 'white', label: 'White chocolate', mgPerOz: 1.1, mgPerG: 0.04, source: 'Merck' },
  { key: 'milk', label: 'Milk chocolate', mgPerOz: 64, mgPerG: 2.3, source: 'Merck' },
  { key: 'semisweet', label: 'Semisweet / sweet dark', mgPerOz: 160, mgPerG: 5.6, source: 'Merck (high end)' },
  { key: 'verydark', label: 'Very dark (70%+ cacao)', mgPerOz: 250, mgPerG: 8.82, source: 'USDA' },
  { key: 'baker', label: "Unsweetened (baker's)", mgPerOz: 440, mgPerG: 15.5, source: 'Merck' },
  { key: 'cocoa', label: 'Cocoa powder', mgPerOz: 807, mgPerG: 28.5, source: 'Merck' },
];

export const chocType = (key: ChocKey): ChocType => CHOC_TYPES.find((t) => t.key === key)!;

// mg/kg thresholds (inclusive lower bound).
export const THRESHOLDS = { upset: 20, cardiac: 40, seizure: 60 } as const;

export type Band = 'low' | 'upset' | 'cardiac' | 'seizure';

/** Risk band for a methylxanthine dose in mg/kg (thresholds inclusive). */
export function classifyDose(mgPerKg: number): Band {
  if (mgPerKg >= THRESHOLDS.seizure) return 'seizure';
  if (mgPerKg >= THRESHOLDS.cardiac) return 'cardiac';
  if (mgPerKg >= THRESHOLDS.upset) return 'upset';
  return 'low';
}

/** Ounces of a chocolate (mg of methylxanthine per oz) needed to reach a mg/kg
 *  level for a dog of weightLb. Rounded DOWN to one decimal so the displayed
 *  amount is never ABOVE the exact trigger (mgKg x weightKg / mgPerOz); erring
 *  toward caution matters on a toxicity chart. */
export function ozForLevel(mgPerOz: number, weightLb: number, mgKg: number): number {
  if (!(mgPerOz > 0) || !(weightLb > 0)) return 0;
  const exact = (mgKg * weightLb * LB_TO_KG) / mgPerOz;
  return Math.floor(exact * 10) / 10;
}

export interface ChocInput {
  typeKey: ChocKey;
  amount: number;
  amountUnit: 'oz' | 'g';
  weight: number;
  weightUnit: 'lb' | 'kg';
}

export interface ChocResult {
  mg: number; // methylxanthine eaten
  mgPerKg: number;
  band: Band;
  weightKg: number;
  grams: number; // amount in grams (for display)
}

export function chocolateDose(i: ChocInput): ChocResult | null {
  if (!(i.amount > 0) || !(i.weight > 0)) return null;
  const t = chocType(i.typeKey);
  const mg = i.amountUnit === 'oz' ? i.amount * t.mgPerOz : i.amount * t.mgPerG;
  const weightKg = i.weightUnit === 'lb' ? i.weight * LB_TO_KG : i.weight;
  const grams = i.amountUnit === 'oz' ? i.amount * OZ_TO_G : i.amount;
  const mgPerKg = mg / weightKg;
  return {
    mg: Math.round(mg),
    mgPerKg: Math.round(mgPerKg * 10) / 10,
    band: classifyDose(mgPerKg),
    weightKg,
    grams: Math.round(grams),
  };
}
