// Dog crate sizing (A6.6). Standard MidWest iCrate lengths with typical height
// and weight bands. Method: measure nose to tail base, add 2-4 in (AKC/MidWest).
export interface Crate {
  length: number; // inches
  height: number; // inches
  weight: string; // typical dog weight
}

export const CRATES: Crate[] = [
  { length: 18, height: 14, weight: 'up to 10 lb' },
  { length: 22, height: 16, weight: 'up to 25 lb' },
  { length: 24, height: 19, weight: '26–30 lb' },
  { length: 30, height: 21, weight: '31–40 lb' },
  { length: 36, height: 25, weight: '41–70 lb' },
  { length: 42, height: 30, weight: '71–90 lb' },
  { length: 48, height: 33, weight: '91–110 lb' },
  { length: 54, height: 45, weight: '110 lb and up' },
];

export interface CrateResult {
  crate: Crate;
  minLength: number;
  idealLength: number;
}

/** Recommend the smallest standard crate whose length >= dogLength+4 and whose
 *  height >= dogHeight+2. Step up if height fails. */
export function recommendCrate(dogLengthIn: number, dogHeightIn: number): CrateResult | null {
  if (!(dogLengthIn > 0)) return null;
  const minLength = dogLengthIn + 2;
  const idealLength = dogLengthIn + 4;
  const needHeight = dogHeightIn > 0 ? dogHeightIn + 2 : 0;
  const fit =
    CRATES.find((c) => c.length >= idealLength && c.height >= needHeight) ??
    CRATES[CRATES.length - 1];
  return { crate: fit, minLength, idealLength };
}
