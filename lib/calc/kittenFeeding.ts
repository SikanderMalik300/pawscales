// Kitten feeding model (pawscales-day10). Energy from the Merck Veterinary Manual
// "Daily Maintenance Energy Requirements for Dogs and Cats" table:
//   RER = 70 x kg^0.75; healthy kittens = 2.5 x RER (a single factor, no age
//   split); adult cats = 1.2 x RER neutered, 1.4 x RER intact.
// Meal frequency from the Cornell Feline Health Center: three meals a day until
// six months old, two a day between six months and one year. Expected weight by
// age is the same neutered Domestic Shorthair kitten dataset as the cat weight
// chart (Salt et al. 2023, Liverpool DataCat 1459, CC BY 3.0).
import { rer, catFactor } from '@/lib/calc/energy';
import { CAT_WEIGHT, type Sex } from '@/lib/data/catWeight';
import { LB_TO_KG } from '@/lib/units';

export const KITTEN_FACTOR = catFactor('growth'); // 2.5 x RER (Merck, healthy kittens)
export const ADULT_NEUTERED = catFactor('neuteredAdult'); // 1.2 x RER
export const ADULT_INTACT = catFactor('intactAdult'); // 1.4 x RER
export const ADULT_AGE_MONTHS = 12; // switch to adult maintenance at one year

/** Meals per day for a kitten of a given age (Cornell Feline Health Center):
 *  three a day until six months, two a day from six months to one year. */
export const mealsForMonth = (month: number): number => (month < 6 ? 3 : 2);

/** kcal/day for a growing kitten at a given body weight (2.5 x RER, Merck). */
export const kittenKcal = (kg: number): number => Math.round(rer(kg) * KITTEN_FACTOR);

/** Adult maintenance kcal/day, for the one-year hand-off (Merck 1.2x / 1.4x). */
export const adultKcal = (kg: number, intact: boolean): number =>
  Math.round(rer(kg) * (intact ? ADULT_INTACT : ADULT_NEUTERED));

/** Cups or cans per day from a kcal/day figure and the food label's kcal density
 *  (the cat food calculator's logic: amount = daily kcal / kcal per unit). */
export const portions = (kcal: number, kcalPerUnit: number): number =>
  kcalPerUnit > 0 ? Math.round((kcal / kcalPerUnit) * 100) / 100 : 0;

// Example food density for the worked example and the calculator default.
export const EXAMPLE_KCAL_PER_CUP = 450;

// ---- the by-age chart (every month, each sex) ----
// Kitten months from the cat weight dataset, from 2 months up to (not including)
// the one-year adult switch.
export const CHART_MONTHS = CAT_WEIGHT.main.F
  .map((r) => r.month)
  .filter((m) => m >= 2 && m < ADULT_AGE_MONTHS);

export interface KittenChartCell {
  weightLb: number; // median weight for that age and sex
  kcal: number; // kcal/day (2.5 x RER)
  meals: number; // meals/day (Cornell)
  kcalPerMeal: number; // kcal/day / meals
}

export interface KittenChartRow {
  month: number;
  bySex: Record<Sex, KittenChartCell>;
}

function cellFor(sex: Sex, month: number): KittenChartCell {
  const row = CAT_WEIGHT.main[sex].find((r) => r.month === month)!;
  const weightLb = row.median;
  const kcal = kittenKcal(weightLb * LB_TO_KG);
  const meals = mealsForMonth(month);
  return { weightLb, kcal, meals, kcalPerMeal: Math.round(kcal / meals) };
}

export function kittenChart(): KittenChartRow[] {
  return CHART_MONTHS.map((month) => ({
    month,
    bySex: { F: cellFor('F', month), M: cellFor('M', month) },
  }));
}
