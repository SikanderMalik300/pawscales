// Cat weight-by-age data (pawscales-day5 page 5). Built one-off by
// scripts/build_cat_growth_table.py from the open Salt et al. 2022/2023 DSH
// kitten datasets (Liverpool DataCat 1456 & 1459, CC BY 3.0). Values are lightly
// isotonic-smoothed so each column never decreases with age; raw values kept.
import data from '@/data/cat-weight.json';

export type Sex = 'F' | 'M';

export interface CatRow {
  month: number;
  n: number;
  rawP25?: number;
  rawMedian?: number;
  rawP75?: number;
  p25: number;
  median: number;
  p75: number;
}

export const CAT_WEIGHT = data as unknown as {
  source: Record<string, string>;
  generatedAt: string;
  units: string;
  method: string;
  mainLabel: string;
  mainCounts: Record<Sex, Record<string, number>>;
  main: Record<Sex, CatRow[]>;
  intactComparison: Record<Sex, CatRow[]>;
  adult: Record<Sex, { p25: number; median: number; p75: number }>;
};

export const SEX_LABEL: Record<Sex, string> = { F: 'Female', M: 'Male' };
export const MAIN_MONTHS = CAT_WEIGHT.main.F.map((r) => r.month);
export const MIN_MONTH = MAIN_MONTHS[0];
export const MAX_MONTH = MAIN_MONTHS[MAIN_MONTHS.length - 1];

/** Linear interpolation of a field across the main table rows for one sex. */
function interpField(sex: Sex, month: number, field: 'p25' | 'median' | 'p75'): number {
  const rows = CAT_WEIGHT.main[sex];
  const m = Math.max(rows[0].month, Math.min(month, rows[rows.length - 1].month));
  for (let i = 0; i < rows.length - 1; i++) {
    const a = rows[i];
    const b = rows[i + 1];
    if (m >= a.month && m <= b.month) {
      const t = b.month === a.month ? 0 : (m - a.month) / (b.month - a.month);
      return a[field] + t * (b[field] - a[field]);
    }
  }
  return rows[rows.length - 1][field];
}

export type TrackResult =
  | { kind: 'invalid' }
  | {
      kind: 'ok';
      position: 'below' | 'within' | 'above';
      p25: number;
      median: number;
      p75: number;
    };

/** Compare a kitten's weight (lb) to the 25th-75th centile band for its age and
 *  sex. Weight only: never labels a cat overweight/underweight. */
export function trackKitten(sex: Sex, ageMonths: number, weightLb: number): TrackResult {
  if (!Number.isFinite(ageMonths) || !Number.isFinite(weightLb) || ageMonths <= 0 || weightLb <= 0) {
    return { kind: 'invalid' };
  }
  const p25 = round1(interpField(sex, ageMonths, 'p25'));
  const median = round1(interpField(sex, ageMonths, 'median'));
  const p75 = round1(interpField(sex, ageMonths, 'p75'));
  const position = weightLb < p25 ? 'below' : weightLb > p75 ? 'above' : 'within';
  return { kind: 'ok', position, p25, median, p75 };
}

const round1 = (n: number) => Math.round(n * 10) / 10;
