import type { Metadata } from 'next';

// Internal showcase: noindex, excluded from sitemap and nav (spec A7, design.md 12).
export const metadata: Metadata = {
  title: 'Design system — PawScales (internal)',
  robots: { index: false, follow: false },
};

export default function DesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
