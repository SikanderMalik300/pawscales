import Link from 'next/link';
import { Logo } from '@/components/Logo';

/**
 * Compact footer (design.md v2 6.6): sand background, logo + one line, three
 * short link rows (Tools / Company / Legal). Does NOT list every tool. Mobile
 * height target under 420px.
 */
function Row({
  label,
  links,
}: {
  label: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          prefetch={false}
          className="text-[14px] text-muted hover:text-brand"
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-sand">
      <div className="container-page flex flex-col gap-3 py-8">
        <div>
          <Logo />
          <p className="mt-1.5 text-[14px] text-muted">
            Free dog and cat calculators, built on real data.
          </p>
        </div>
        <Row
          label="Tools"
          links={[
            { href: '/dog-calculators/', label: 'Dog tools' },
            { href: '/cat-calculators/', label: 'Cat tools' },
            { href: '/dog-size-charts/', label: 'Size charts' },
          ]}
        />
        <Row
          label="Company"
          links={[
            { href: '/about/', label: 'About' },
            { href: '/how-we-calculate/', label: 'How we calculate' },
            { href: '/editorial-policy/', label: 'Editorial policy' },
            { href: '/contact/', label: 'Contact' },
          ]}
        />
        <Row
          label="Legal"
          links={[
            { href: '/privacy-policy/', label: 'Privacy' },
            { href: '/terms/', label: 'Terms' },
            { href: '/disclaimer/', label: 'Disclaimer' },
            { href: '/affiliate-disclosure/', label: 'Affiliate disclosure' },
            { href: '/sitemap/', label: 'Sitemap' },
            { href: '/photo-credits/', label: 'Photo credits' },
          ]}
        />
        <p className="mt-1 border-t border-line pt-3 text-[13px] text-muted">
          © 2026 PawScales. Estimates only, not veterinary advice.
        </p>
      </div>
    </footer>
  );
}
