// Unit conversion constants (pawscales-build-spec.md A0 #4). The metric toggle
// never changes the maths, only input/output conversion.
export const LB_TO_KG = 0.45359237;
export const IN_TO_CM = 2.54;
export const OZ_TO_G = 28.349523125;

export const lbToKg = (lb: number): number => lb * LB_TO_KG;
export const kgToLb = (kg: number): number => kg / LB_TO_KG;
export const inToCm = (inch: number): number => inch * IN_TO_CM;
export const cmToIn = (cm: number): number => cm / IN_TO_CM;
export const ozToG = (oz: number): number => oz * OZ_TO_G;
export const gToOz = (g: number): number => g / OZ_TO_G;

/** Parse a user-typed number: accept comma or dot decimals, ignore spaces. */
export const parseNum = (raw: string): number | null => {
  const cleaned = raw.replace(/\s+/g, '').replace(',', '.');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};
