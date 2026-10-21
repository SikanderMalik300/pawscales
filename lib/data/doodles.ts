// Doodle size-chart data (pawscales-growth-pages-1.md section 2). Categories come
// from the breed's source table (shown as the source states them); the growth
// curves are the Salt et al. 2017 data scaled to each category's bound.
import type { Cat } from '@/lib/calc/puppyWeight';
import { bandForKg, expectedByAge, MONTH_WEEKS, type AgeKind } from '@/lib/calc/breedGrowth';
import { LB_TO_KG } from '@/lib/units';
import { roundTo } from '@/lib/calc/round';

export interface DoodleSize {
  size: string;
  weightLabel: string; // adult weight, worded as the source states it
  heightLabel: string; // height at the withers, as the source states it
  lowLb: number | null; // bounded low (null when the source is open-ended)
  highLb: number | null; // bounded high
  repLb: number; // representative adult weight used for the growth curve
  bound: 'up to' | 'range' | 'at least';
  crateIn: string; // typical crate length (from our crate chart, by weight)
  lowIn?: number; // height band low (in), for breeds whose standard is height-first
  highIn?: number; // height band high (in), exclusive upper bound for classification
}

export interface DoodleBreed {
  slug: string;
  name: string;
  sizes: DoodleSize[];
  sourceName: string;
  sourceUrl: string;
  sourceNote: string; // plain line about what the source is
  photoId: string;
  giantNote?: string; // shown under the by-age table (e.g. Standard reaching giant size)
  parentsFirst?: boolean; // default the size estimator to "by parents" (no breed standard)
  heightFirst?: boolean; // default the size estimator to "by height" (standard is height-based)
  defaultParents?: { motherLb: number; fatherLb: number }; // sensible starting weights
  // Extra weight-by-age columns that are NOT breed-standard sizes (e.g. an F1
  // first-cross projection). Shown only in the weight-by-age table, not the sizes
  // table, crate table or size finder.
  extraCurves?: { name: string; repLb: number; foot: string }[];
}

export const GOLDENDOODLE: DoodleBreed = {
  slug: 'goldendoodle-size-chart',
  name: 'Goldendoodle',
  sourceName: 'Goldendoodle Association of North America (GANA)',
  sourceUrl: 'https://www.goldendoodleassociation.com/about-the-breed/sizes/',
  sourceNote:
    'Sizes are the official GANA categories, measured by height at the withers. GANA notes that weight can fluctuate, so height is the deciding factor, and a breeder’s size estimate for a puppy is an educated guess.',
  photoId: 'goldendoodle-size-chart',
  sizes: [
    { size: 'Petite', weightLabel: 'Up to 25 lb', heightLabel: 'Under 14 in', lowLb: null, highLb: 25, repLb: 25, bound: 'up to', crateIn: '22–24' },
    { size: 'Miniature', weightLabel: '26–35 lb', heightLabel: '14–17 in', lowLb: 26, highLb: 35, repLb: 30.5, bound: 'range', crateIn: '30' },
    { size: 'Medium', weightLabel: '36–50 lb', heightLabel: '17–21 in', lowLb: 36, highLb: 50, repLb: 43, bound: 'range', crateIn: '36' },
    { size: 'Standard', weightLabel: '51 lb and up', heightLabel: 'Over 21 in', lowLb: 51, highLb: null, repLb: 51, bound: 'at least', crateIn: '42' },
  ],
};

// SwissRidge Kennels (Sherry Rupke created the first Bernedoodle in 2003)
// publishes a four-size chart by height at the shoulder. Standard is open-ended.
export const BERNEDOODLE: DoodleBreed = {
  slug: 'bernedoodle-size-chart',
  name: 'Bernedoodle',
  sourceName: 'SwissRidge Kennels (originator of the Bernedoodle)',
  sourceUrl: 'https://swissridgekennels.com/swissridge/qa/',
  sourceNote:
    'Sizes are the SwissRidge Kennels categories, measured by height at the shoulder. SwissRidge created the first Bernedoodle, and notes these ranges are averages, so a pup can fall a little outside its size.',
  photoId: 'bernedoodle-size-chart',
  giantNote:
    'Standard Bernedoodles are open-ended at 66 lb and up, and many reach 70–90 lb or more, past the 88 lb (40 kg) giant mark. Giant-size dogs keep filling out beyond 2 years, so treat the Standard column as a minimum.',
  sizes: [
    { size: 'Tiny', weightLabel: '10–25 lb', heightLabel: '10–13 in', lowLb: 10, highLb: 25, repLb: 17.5, bound: 'range', crateIn: '18–22' },
    { size: 'Miniature', weightLabel: '26–45 lb', heightLabel: '14–17 in', lowLb: 26, highLb: 45, repLb: 35.5, bound: 'range', crateIn: '30' },
    { size: 'Medium', weightLabel: '46–65 lb', heightLabel: '18–21 in', lowLb: 46, highLb: 65, repLb: 55.5, bound: 'range', crateIn: '36' },
    { size: 'Standard', weightLabel: '66 lb and up', heightLabel: '22–29 in', lowLb: 66, highLb: null, repLb: 66, bound: 'at least', crateIn: '42' },
  ],
};

// Cavapoo (Cavalier King Charles Spaniel x Poodle). There is no Cavapoo breed
// association or size standard; size is set by the Poodle parent (AKC-standard).
// Toy and Miniature are commonly used breeder categories; the overall range is
// from Wikipedia. The parents'-weight estimator is the main tool.
export const CAVAPOO: DoodleBreed = {
  slug: 'cavapoo-size-chart',
  name: 'Cavapoo',
  sourceName: 'Wikipedia (Cavapoo) and the AKC parent-breed standards',
  sourceUrl: 'https://en.wikipedia.org/wiki/Cavapoo',
  sourceNote:
    'There is no Cavapoo breed association or size standard. Size is set by the Poodle parent, which is AKC-standardised. Toy and Miniature are commonly used breeder categories, not a breed standard; the overall Cavapoo range is about 9–22 lb and 9–13 in (Wikipedia).',
  photoId: 'cavapoo-size-chart',
  parentsFirst: true,
  defaultParents: { motherLb: 7, fatherLb: 16 }, // Toy/Mini Poodle x Cavalier
  sizes: [
    { size: 'Toy', weightLabel: 'About 7–13 lb', heightLabel: 'About 9–12 in', lowLb: 7, highLb: 13, repLb: 10, bound: 'range', crateIn: '18–22' },
    { size: 'Miniature', weightLabel: 'About 12–25 lb', heightLabel: 'About 12–16 in', lowLb: 12, highLb: 25, repLb: 18.5, bound: 'range', crateIn: '24' },
  ],
};

// Labradoodle (Labrador Retriever x Poodle). The Australian Labradoodle has a
// breed association, the ALAA, which sets three sizes by HEIGHT at the wither.
// The ALAA standard gives only an overall 15-65 lb and no weight per size, so
// the per-size weights are a PawScales estimate inside that band (height, not
// weight, is the ALAA definition; the finder asks for height first).
export const LABRADOODLE: DoodleBreed = {
  slug: 'labradoodle-size-chart',
  name: 'Labradoodle',
  sourceName: 'Australian Labradoodle Association of America (ALAA)',
  sourceUrl: 'https://alaa-labradoodles.com/for-breeders/breed-standard/',
  sourceNote:
    'The Australian Labradoodle Association of America (ALAA) sets three sizes by height at the wither. Its standard gives only an overall 15 to 65 lb, with no weight per size, so the weights here are a PawScales estimate within that band: ALAA sets height, not weight. Other associations use slightly different height bands.',
  photoId: 'labradoodle-size-chart',
  heightFirst: true,
  defaultParents: { motherLb: 45, fatherLb: 70 }, // Standard Poodle x Labrador
  extraCurves: [
    {
      name: 'F1',
      repLb: 61.5, // midpoint of the 48-75 lb F1 range (Labrador x Standard Poodle)
      foot: 'F1 is a first-cross (Labrador × Standard Poodle) estimate, about 48 to 75 lb, not an ALAA size; first-cross dogs often run large.',
    },
  ],
  sizes: [
    { size: 'Miniature', weightLabel: '15–30 lb', heightLabel: '14–16 in', lowLb: 15, highLb: 30, repLb: 22.5, bound: 'range', crateIn: '24', lowIn: 14, highIn: 17 },
    { size: 'Medium', weightLabel: '30–50 lb', heightLabel: '17–20 in', lowLb: 30, highLb: 50, repLb: 40, bound: 'range', crateIn: '36', lowIn: 17, highIn: 21 },
    { size: 'Standard', weightLabel: '50–65 lb', heightLabel: '21–24 in', lowLb: 50, highLb: 65, repLb: 57.5, bound: 'range', crateIn: '42', lowIn: 21, highIn: 25 },
  ],
};

export const sizeBand = (s: DoodleSize): Cat => bandForKg(s.repLb * LB_TO_KG);

/** Classify a height at the shoulder (inches) into a size band, for a breed whose
 *  standard is height-based (ALAA). Below the first band -> smallest; above the
 *  last -> largest. Returns null for non-positive input or a non-height breed. */
export function sizeForHeightIn(breed: DoodleBreed, inches: number): DoodleSize | null {
  const sized = breed.sizes.filter((s) => s.lowIn != null && s.highIn != null);
  if (!sized.length || !(inches > 0)) return null;
  for (const s of sized) if (inches < s.highIn!) return s;
  return sized[sized.length - 1];
}

export interface DoodleAgeRow {
  months: number;
  weeks: number;
  bySize: Record<string, number>; // size name -> representative weight (lb) at that age
  kind: AgeKind;
}

/** Representative weight by age for each size: the size's representative adult
 *  weight x the median growth ratio for its band. Open-ended sizes show the
 *  stated bound ("up to 25" uses 25; "51 and up" uses 51). */
export function doodleTypicalByAge(breed: DoodleBreed): DoodleAgeRow[] {
  const first = expectedByAge(1, 1, sizeBand(breed.sizes[0])); // for the month list + kind
  return first.map((row, i) => {
    const bySize: Record<string, number> = {};
    for (const s of breed.sizes) {
      const r = expectedByAge(s.repLb, s.repLb, sizeBand(s))[i];
      bySize[s.size] = roundTo(r.typicalLb, 1);
    }
    for (const c of breed.extraCurves ?? []) {
      const r = expectedByAge(c.repLb, c.repLb, bandForKg(c.repLb * LB_TO_KG))[i];
      bySize[c.name] = roundTo(r.typicalLb, 1);
    }
    return { months: row.months, weeks: row.weeks, bySize, kind: row.kind };
  });
}

/** Parents' weights -> expected adult range: from the lighter parent to the
 *  average of both. Presented as a rough range, not a formula claim. */
export function parentsRange(motherLb: number, fatherLb: number) {
  const low = Math.min(motherLb, fatherLb);
  const high = (motherLb + fatherLb) / 2;
  return { lowLb: roundTo(low, 0), highLb: roundTo(high, 0) };
}

export { MONTH_WEEKS };
