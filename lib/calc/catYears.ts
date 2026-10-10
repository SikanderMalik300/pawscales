// Cat age in human years (A6.4), International Cat Care chart.
import { CAT_YEARS } from '@/lib/constants';

// Anchor points as [catMonths, humanYears], plus (0,0) for interpolation below 1 month.
const ANCHORS: [number, number][] = [[0, 0], ...CAT_YEARS.anchors];
const PER_YEAR = CAT_YEARS.perYearAfter2.value; // 4

/** Human-equivalent age. Linear interpolation between anchors to 24 months,
 *  then +4 human years per cat year after age 2. */
export function catHumanYears(catMonths: number): number {
  if (catMonths <= 0) return 0;
  if (catMonths >= 24) {
    const catYears = catMonths / 12;
    return Math.round(24 + PER_YEAR * (catYears - 2));
  }
  for (let i = 0; i < ANCHORS.length - 1; i++) {
    const [m0, h0] = ANCHORS[i];
    const [m1, h1] = ANCHORS[i + 1];
    if (catMonths >= m0 && catMonths <= m1) {
      const t = m1 === m0 ? 0 : (catMonths - m0) / (m1 - m0);
      return Math.round(h0 + t * (h1 - h0));
    }
  }
  return 24;
}

export const catHumanYearsFromYears = (years: number): number =>
  catHumanYears(years * 12);
