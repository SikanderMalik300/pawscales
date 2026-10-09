import { Newsreader, Public_Sans } from 'next/font/google';

// design.md section 4: exactly two variable families, one file each.
export const heading = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  axes: ['opsz'],
  variable: '--font-heading',
});

export const body = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});
