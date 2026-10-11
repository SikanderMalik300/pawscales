// Breed growth-chart config (pawscales-growth-pages-1.md section 1). Adult weight
// and height ranges are read from each breed's AKC breed page (akc.org, 2026-10-12).
import { LB_TO_KG } from '@/lib/units';
import { bandForKg } from '@/lib/calc/breedGrowth';
import type { Cat } from '@/lib/calc/puppyWeight';

export interface SexSpec {
  lowLb: number;
  highLb: number;
  heightIn: string;
}

export interface Breed {
  slug: string;
  name: string;
  male: SexSpec;
  female: SexSpec;
  akcUrl: string;
  photoId: string;
}

export const BREEDS: Record<string, Breed> = {
  'golden-retriever-weight-chart': {
    slug: 'golden-retriever-weight-chart',
    name: 'Golden Retriever',
    male: { lowLb: 65, highLb: 75, heightIn: '23–24' },
    female: { lowLb: 55, highLb: 65, heightIn: '21.5–22.5' },
    akcUrl: 'https://www.akc.org/dog-breeds/golden-retriever/',
    photoId: 'golden-retriever-weight-chart',
  },
  'german-shepherd-weight-chart': {
    slug: 'german-shepherd-weight-chart',
    name: 'German Shepherd',
    male: { lowLb: 65, highLb: 90, heightIn: '24–26' },
    female: { lowLb: 50, highLb: 70, heightIn: '22–24' },
    akcUrl: 'https://www.akc.org/dog-breeds/german-shepherd-dog/',
    photoId: 'german-shepherd-weight-chart',
  },
};

export const bandForSex = (s: SexSpec): Cat =>
  bandForKg(((s.lowLb + s.highLb) / 2) * LB_TO_KG);
