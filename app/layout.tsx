import type { Metadata } from 'next';
import { sans } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://pawscales.com'),
  title: {
    default: 'PawScales: Free dog and cat calculators, built on real data',
    template: '%s',
  },
  description:
    'Free calculators and charts for dog and cat owners, built from published veterinary research and open data. Every number has a source.',
  alternates: { canonical: 'https://pawscales.com/' },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    other: [{ rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#1F5C45' }],
  },
  openGraph: {
    type: 'website',
    siteName: 'PawScales',
    url: 'https://pawscales.com/',
    images: [{ url: '/og/default.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: ['/og/default.png'] },
};

export const viewport = {
  themeColor: '#1F5C45',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sans.variable}>
      <body>{children}</body>
    </html>
  );
}
