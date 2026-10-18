// Shared rounding helpers (pawscales-build-spec.md A11). Use these everywhere so
// counts round consistently and floating-point noise never flips a boundary.

/** Round up to a whole count, after trimming float noise to 6 decimals. */
export const ceilCount = (x: number): number =>
  Math.ceil(Math.round(x * 1e6) / 1e6);

/** Round to `d` decimal places, half-up, with float-noise guard. */
export const roundTo = (x: number, d: number): number => {
  const f = 10 ** d;
  return Math.round((x + Number.EPSILON) * f) / f;
};

/** Format a weight for a growth table: always one decimal (6 -> "6.0"). */
export const fmt1 = (x: number): string => roundTo(x, 1).toFixed(1);

/** Display mg window endpoints. The low end rounds UP and the high end rounds
 *  DOWN to whole mg (like the gabapentin 5 mg rounding), so the shown range and
 *  the "never exceed" value always stay inside [min x kg, max x kg] and never
 *  suggest going over the maximum. Float noise is trimmed first. */
export const mgCeil = (x: number): number => Math.ceil(roundTo(x, 6));
export const mgFloor = (x: number): number => Math.floor(roundTo(x, 6));
