// Harness sizes by brand, from each brand's official size page (read 2026-10-10).
// Girth = chest measured at the widest point behind the front legs, in inches.
export interface HarnessBrand {
  brand: string;
  model: string;
  url: string;
  sizes: { size: string; girthMinIn: number; girthMaxIn: number }[];
}

export const HARNESS_BRANDS: HarnessBrand[] = [
  {
    brand: 'Ruffwear',
    model: 'Front Range',
    url: 'https://ruffwear.com/pages/front-range-harness-fit-guide',
    sizes: [
      { size: 'XXS', girthMinIn: 13, girthMaxIn: 17 },
      { size: 'XS', girthMinIn: 17, girthMaxIn: 22 },
      { size: 'S', girthMinIn: 22, girthMaxIn: 27 },
      { size: 'M', girthMinIn: 27, girthMaxIn: 32 },
      { size: 'L/XL', girthMinIn: 32, girthMaxIn: 42 },
    ],
  },
  {
    brand: 'Rabbitgoo',
    model: 'No-Pull (classic)',
    url: 'https://www.rabbitgoo.com/pages/dog-harness-size-wear-guide',
    sizes: [
      { size: 'XS', girthMinIn: 11.8, girthMaxIn: 18.5 },
      { size: 'S', girthMinIn: 13.8, girthMaxIn: 23.5 },
      { size: 'M', girthMinIn: 15, girthMaxIn: 27.8 },
      { size: 'L', girthMinIn: 17, girthMaxIn: 33.4 },
      { size: 'XL', girthMinIn: 21, girthMaxIn: 38 },
    ],
  },
  {
    brand: 'Kurgo',
    model: 'Tru-Fit Smart',
    url: 'https://www.kurgo.com/harnesses/tru-fit-smart-dog-walking-harness',
    sizes: [
      { size: 'XS', girthMinIn: 12, girthMaxIn: 18 },
      { size: 'S', girthMinIn: 16, girthMaxIn: 22 },
      { size: 'M', girthMinIn: 18, girthMaxIn: 28 },
      { size: 'L', girthMinIn: 24, girthMaxIn: 34 },
      { size: 'XL', girthMinIn: 28, girthMaxIn: 44 },
    ],
  },
];

export interface HarnessMatch {
  brand: string;
  model: string;
  url: string;
  size: string | null;
  between: boolean;
}

/** For a chest girth, find each brand's matching size, flagging "between sizes"
 *  when within 1 inch of a size boundary. */
export function matchHarness(girthIn: number): HarnessMatch[] {
  return HARNESS_BRANDS.map((b) => {
    const hit = b.sizes.find((s) => girthIn >= s.girthMinIn && girthIn <= s.girthMaxIn);
    const near = b.sizes.some(
      (s) => Math.abs(girthIn - s.girthMinIn) <= 1 || Math.abs(girthIn - s.girthMaxIn) <= 1,
    );
    return { brand: b.brand, model: b.model, url: b.url, size: hit?.size ?? null, between: !!hit && near };
  });
}
