// Typical adult weight by breed, taken from each breed's AKC breed page
// (akc.org/dog-breeds/<breed>/, breed facts "Weight", read 2026-10-10).
// Ranges are in pounds across males and females; individual dogs vary.
export interface BreedWeight {
  breed: string;
  range: string; // pounds, as an overall range faithful to the AKC page
  note?: string;
  url: string;
}

const akc = (slug: string) => `https://www.akc.org/dog-breeds/${slug}/`;

export const BREED_WEIGHTS: BreedWeight[] = [
  { breed: 'Chihuahua', range: 'Up to 6', url: akc('chihuahua') },
  { breed: 'Pomeranian', range: '3–7', url: akc('pomeranian') },
  { breed: 'Yorkshire Terrier', range: 'Up to 7', url: akc('yorkshire-terrier') },
  { breed: 'French Bulldog', range: 'Under 28', url: akc('french-bulldog') },
  { breed: 'Beagle', range: 'Up to 30', note: 'two size varieties', url: akc('beagle') },
  { breed: 'Cocker Spaniel', range: '20–30', url: akc('cocker-spaniel') },
  { breed: 'Border Collie', range: '30–55', url: akc('border-collie') },
  { breed: 'Australian Shepherd', range: '40–65', url: akc('australian-shepherd') },
  { breed: 'Labrador Retriever', range: '55–80', url: akc('labrador-retriever') },
  { breed: 'Golden Retriever', range: '55–75', url: akc('golden-retriever') },
  { breed: 'German Shepherd Dog', range: '50–90', url: akc('german-shepherd-dog') },
  { breed: 'Boxer', range: '50–80', url: akc('boxer') },
  { breed: 'Rottweiler', range: '80–135', url: akc('rottweiler') },
  { breed: 'Bernese Mountain Dog', range: '70–115', url: akc('bernese-mountain-dog') },
  { breed: 'Great Dane', range: '110–175', url: akc('great-dane') },
];
