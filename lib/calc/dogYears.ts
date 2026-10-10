// Dog age in human years (A6.3): size-based chart + 2020 DNA formula.
import { DOG_YEARS } from '@/lib/constants';
import { roundTo } from '@/lib/calc/round';

export type DogSize = 'small' | 'medium' | 'large' | 'giant';

export const sizeFromLb = (lb: number): DogSize =>
  lb <= 20 ? 'small' : lb <= 50 ? 'medium' : lb <= 100 ? 'large' : 'giant';

export const SIZE_LABEL: Record<DogSize, string> = {
  small: 'Small (≤20 lb)',
  medium: 'Medium (21–50 lb)',
  large: 'Large (51–100 lb)',
  giant: 'Giant (>100 lb)',
};

/** Human-equivalent years from the size chart, with interpolation. */
export function humanYearsBySize(ageYears: number, size: DogSize): number {
  const chart = DOG_YEARS.chart[size]; // index 0 = age 1 ... index 15 = age 16
  const first = chart[0];
  if (ageYears <= 0) return 0;
  if (ageYears < 1) return roundTo(first * ageYears, 0); // 0 -> 0, 1 -> first
  if (ageYears >= 16) {
    const step = chart[15] - chart[14];
    return Math.round(chart[15] + (ageYears - 16) * step);
  }
  const lo = Math.floor(ageYears);
  const hi = Math.ceil(ageYears);
  if (lo === hi) return chart[lo - 1];
  const t = ageYears - lo;
  return Math.round(chart[lo - 1] + t * (chart[hi - 1] - chart[lo - 1]));
}

/** DNA/epigenetic estimate (Wang 2020), meaningful for dogs >= 1 year. */
export const dnaHumanYears = (ageYears: number): number | null =>
  ageYears >= 1 ? Math.round(16 * Math.log(ageYears) + 31) : null;

export const dnaHumanYearsExact = (ageYears: number): number =>
  16 * Math.log(ageYears) + 31;

export const isBeyondChart = (ageYears: number): boolean => ageYears > 16;
