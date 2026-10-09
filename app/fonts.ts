import { Figtree } from 'next/font/google';

// design.md v2 section 4: ONE family for everything, Figtree variable.
export const sans = Figtree({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});
