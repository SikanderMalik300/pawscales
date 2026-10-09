import Link from 'next/link';
import { byCategory } from '@/lib/registry';

/** Footer (design.md 6.7): surface-2, top border, four short columns. */
function Col({
  heading,
  links,
}: {
  heading: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="mb-2 text-[14px] font-semibold text-ink">{heading}</h2>
      <ul className="flex flex-col gap-1.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              prefetch={false}
              className="text-[14px] text-text hover:text-brand"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const toLinks = (cat: Parameters<typeof byCategory>[0]) =>
    byCategory(cat).map((t) => ({ href: `/${t.slug}/`, label: t.shortName }));

  return (
    <footer className="mt-12 border-t border-border bg-surface-2">
      <div className="container-page grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
        <Col heading="Dog tools" links={toLinks('dog-calculators')} />
        <Col heading="Cat tools" links={toLinks('cat-calculators')} />
        <Col heading="Size charts" links={toLinks('dog-size-charts')} />
        <Col
          heading="PawScales"
          links={[
            { href: '/about/', label: 'About' },
            { href: '/how-we-calculate/', label: 'How we calculate' },
            { href: '/editorial-policy/', label: 'Editorial policy' },
            { href: '/contact/', label: 'Contact' },
            { href: '/privacy-policy/', label: 'Privacy' },
            { href: '/terms/', label: 'Terms' },
            { href: '/disclaimer/', label: 'Disclaimer' },
            { href: '/affiliate-disclosure/', label: 'Affiliate disclosure' },
            { href: '/sitemap/', label: 'Sitemap' },
          ]}
        />
      </div>
      <div className="container-page flex flex-col gap-1 border-t border-border py-4 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 PawScales. Estimates only, not veterinary advice.</p>
        <Link href="/photo-credits/" prefetch={false} className="hover:text-brand">
          Photo credits
        </Link>
      </div>
    </footer>
  );
}
