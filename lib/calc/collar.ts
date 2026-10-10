// Dog collar sizing (A6.7). Collar length = neck + 2 in (two-finger rule, AKC).
import { IN_TO_CM } from '@/lib/units';

export const COLLAR_ADD_IN = 2;

export interface CollarSize {
  size: string;
  neckMinIn: number;
  neckMaxIn: number;
}

// Generic size bands; sizes vary by brand.
export const COLLAR_SIZES: CollarSize[] = [
  { size: 'XS', neckMinIn: 8, neckMaxIn: 12 },
  { size: 'S', neckMinIn: 10, neckMaxIn: 14 },
  { size: 'M', neckMinIn: 14, neckMaxIn: 20 },
  { size: 'L', neckMinIn: 18, neckMaxIn: 26 },
  { size: 'XL', neckMinIn: 24, neckMaxIn: 30 },
];

export interface CollarResult {
  collarIn: number;
  collarCm: number;
  genericSize: string | null;
}

export function sizeCollar(neckIn: number): CollarResult | null {
  if (!(neckIn > 0)) return null;
  const collarIn = neckIn + COLLAR_ADD_IN;
  const band = COLLAR_SIZES.find((s) => neckIn >= s.neckMinIn && neckIn <= s.neckMaxIn);
  return {
    collarIn: Math.round(collarIn * 10) / 10,
    collarCm: Math.round(collarIn * IN_TO_CM),
    genericSize: band?.size ?? null,
  };
}

// Typical adult neck ranges by breed (inches). General guidance; measure your dog.
export const BREED_NECKS: { breed: string; neck: string }[] = [
  { breed: 'Chihuahua', neck: '8–12' },
  { breed: 'Yorkshire Terrier', neck: '8–12' },
  { breed: 'Pomeranian', neck: '9–12' },
  { breed: 'Dachshund', neck: '10–14' },
  { breed: 'French Bulldog', neck: '12–16' },
  { breed: 'Pug', neck: '12–16' },
  { breed: 'Beagle', neck: '12–16' },
  { breed: 'Cocker Spaniel', neck: '12–16' },
  { breed: 'Border Collie', neck: '14–18' },
  { breed: 'Australian Shepherd', neck: '16–20' },
  { breed: 'Boxer', neck: '16–20' },
  { breed: 'Labrador Retriever', neck: '18–22' },
  { breed: 'Golden Retriever', neck: '18–22' },
  { breed: 'German Shepherd', neck: '18–24' },
  { breed: 'Rottweiler', neck: '20–26' },
  { breed: 'Doberman', neck: '18–24' },
  { breed: 'Great Dane', neck: '22–28' },
  { breed: 'Bernese Mountain Dog', neck: '20–26' },
  { breed: 'Siberian Husky', neck: '16–20' },
  { breed: 'Shih Tzu', neck: '10–14' },
];
