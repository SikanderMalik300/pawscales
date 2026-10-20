// Kitten feeding model (pawscales-day10, revised day-11 to the NRC growth curve).
// Daily energy for a growing kitten uses the NRC 2006 growth equation, which
// falls naturally toward adult needs as the kitten nears mature weight (instead
// of the flat 2.5 x RER, which overfed 6 to 11 month kittens):
//
//   ME (kcal/day) = 100 x BWa^0.67 x 6.7 x (e^(-0.189 x p) - 0.66),  p = BWa / BWm
//
// BWa = current body weight (kg), BWm = expected mature weight (kg); p is capped
// at 1. Source: NRC 2006, Nutrient Requirements of Dogs and Cats; the equation is
// reproduced free in Packer RA, dvm360 (2021). Merck's simpler 2.5 x RER rule of
// thumb is kept only as a cross-check. Meal frequency: Cornell Feline Health
// Center (3 a day until 6 months, 2 from 6 months to a year). Weight by age is the
// neutered DSH kitten dataset behind the cat weight chart (Salt et al. 2023,
// Liverpool DataCat 1459, CC BY 3.0).
import { rer, catFactor } from '@/lib/calc/energy';
import { CAT_WEIGHT, type Sex } from '@/lib/data/catWeight';
import { LB_TO_KG } from '@/lib/units';

export const ADULT_NEUTERED = catFactor('neuteredAdult'); // 1.2 x RER
export const ADULT_INTACT = catFactor('intactAdult'); // 1.4 x RER
export const MERCK_KITTEN_FACTOR = catFactor('growth'); // 2.5 x RER (cross-check only)
export const ADULT_AGE_MONTHS = 12; // one year: feed as an adult
export const ADULT_P = 0.95; // within 5% of mature weight: feed as an adult

/** Default expected mature weight (lb) = the Salt 2023 adult median, by sex. */
export const MATURE_LB: Record<Sex, number> = {
  F: CAT_WEIGHT.adult.F.median, // 8.6
  M: CAT_WEIGHT.adult.M.median, // 10.4
};

/** NRC 2006 growth metabolizable energy (kcal/day). p = BWa/BWm, capped at 1. */
export function nrcGrowthKcal(bwaKg: number, bwmKg: number): number {
  const p = Math.min(1, bwaKg / bwmKg);
  return 100 * bwaKg ** 0.67 * 6.7 * (Math.exp(-0.189 * p) - 0.66);
}

/** Merck rule-of-thumb cross-check: 2.5 x RER. */
export const merckKittenKcal = (kg: number): number => Math.round(rer(kg) * MERCK_KITTEN_FACTOR);

/** Adult maintenance kcal/day (Merck: 1.2x neutered, 1.4x intact). */
export const adultKcal = (kg: number, intact: boolean): number =>
  Math.round(rer(kg) * (intact ? ADULT_INTACT : ADULT_NEUTERED));

/** Meals per day (Cornell): 3 until 6 months, 2 from 6 months to one year. */
export const mealsForMonth = (month: number): number => (month < 6 ? 3 : 2);

export type FeedResult =
  | { kind: 'over' } // already at/above expected adult weight (p >= 1)
  | { kind: 'adult'; neuteredKcal: number; intactKcal: number } // p >= 0.95 or age >= 12mo
  | { kind: 'growth'; kcal: number; p: number }; // NRC growth curve

/** Shared feeding result used by BOTH the chart and the calculator, so they agree.
 *  ageMonths may be null (calculator with no age); the weight rules still apply. */
export function kittenFeed(currentKg: number, adultKg: number, ageMonths: number | null): FeedResult | null {
  if (!(currentKg > 0) || !(adultKg > 0)) return null;
  const p = currentKg / adultKg;
  if (p >= 1) return { kind: 'over' };
  if (p >= ADULT_P || (ageMonths != null && ageMonths >= ADULT_AGE_MONTHS)) {
    return { kind: 'adult', neuteredKcal: adultKcal(currentKg, false), intactKcal: adultKcal(currentKg, true) };
  }
  return { kind: 'growth', kcal: Math.round(nrcGrowthKcal(currentKg, adultKg)), p };
}

/** Cups or cans per day from a kcal/day figure and the food label's kcal density
 *  (the cat food calculator's logic: amount = daily kcal / kcal per unit). */
export const portions = (kcal: number, kcalPerUnit: number): number =>
  kcalPerUnit > 0 ? Math.round((kcal / kcalPerUnit) * 100) / 100 : 0;

// Example food densities for the calculator defaults (shown as example values).
export const EXAMPLE_KCAL_PER_CAN = 100;
export const EXAMPLE_KCAL_PER_CUP = 450;

// ---- the by-age chart (every month, each sex) ----
export const CHART_MONTHS = CAT_WEIGHT.main.F
  .map((r) => r.month)
  .filter((m) => m >= 2 && m < ADULT_AGE_MONTHS);

export interface KittenChartCell {
  weightLb: number; // median weight for that age and sex
  meals: number; // meals/day (Cornell)
  adult: boolean; // true when the kitten is already fed as an adult (p >= 0.95)
  kcal: number; // kcal/day shown (growth, or neutered-adult maintenance)
  kcalPerMeal: number;
}

export interface KittenChartRow {
  month: number;
  bySex: Record<Sex, KittenChartCell>;
}

function cellFor(sex: Sex, month: number): KittenChartCell {
  const row = CAT_WEIGHT.main[sex].find((r) => r.month === month)!;
  const weightLb = row.median;
  const feed = kittenFeed(weightLb * LB_TO_KG, MATURE_LB[sex] * LB_TO_KG, month)!;
  const meals = mealsForMonth(month);
  const kcal = feed.kind === 'growth' ? feed.kcal : feed.kind === 'adult' ? feed.neuteredKcal : 0;
  return { weightLb, meals, adult: feed.kind === 'adult', kcal, kcalPerMeal: Math.round(kcal / meals) };
}

export function kittenChart(): KittenChartRow[] {
  return CHART_MONTHS.map((month) => ({
    month,
    bySex: { F: cellFor('F', month), M: cellFor('M', month) },
  }));
}
