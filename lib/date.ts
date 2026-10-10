// UTC date-only helpers for the pregnancy and heat-cycle calculators (A6.2, A6.11).
// No time zones: parse and format as YYYY-MM-DD in UTC.

export const parseISO = (s: string): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const y = +m[1];
  const mo = +m[2];
  const d = +m[3];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) {
    return null;
  }
  return dt;
};

export const addDays = (d: Date, n: number): Date =>
  new Date(d.getTime() + n * 86400000);

/** Add calendar months, clamping to the last valid day of the target month. */
export const addMonths = (d: Date, n: number): Date => {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const day = d.getUTCDate();
  const target = new Date(Date.UTC(y, m + n, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  return new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), Math.min(day, lastDay)));
};

export const daysBetween = (a: Date, b: Date): number =>
  Math.round((b.getTime() - a.getTime()) / 86400000);

export const toISO = (d: Date): string => d.toISOString().slice(0, 10);

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
export const fmtLong = (d: Date): string =>
  `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;

export const fmtShort = (d: Date): string =>
  `${MONTHS[d.getUTCMonth()].slice(0, 3)} ${d.getUTCDate()}`;
