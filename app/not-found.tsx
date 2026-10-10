import type { Metadata } from 'next';
import Link from 'next/link';
import { HUBS } from '@/lib/registry';

export const metadata: Metadata = {
  title: 'Page not found — PawScales',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="container-page max-w-reading py-16">
      <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-muted">404</p>
      <h1 className="mt-2 text-[30px] sm:text-[40px]">We couldn’t find that page</h1>
      <p className="mt-3 text-[16px] text-ink">
        The page may have moved or never existed. Try one of our calculator hubs, or
        head back to the home page.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/" className="inline-flex h-11 items-center rounded-full bg-ink px-[22px] text-[15px] font-medium text-white hover:bg-[#2A2E2C]">
          Go home
        </Link>
        {HUBS.map((h) => (
          <Link key={h.slug} href={`/${h.slug}/`}
            className="inline-flex h-11 items-center rounded-full border border-ink px-[22px] text-[15px] font-medium text-ink hover:bg-sand">
            {h.shortName}
          </Link>
        ))}
      </div>
    </div>
  );
}
