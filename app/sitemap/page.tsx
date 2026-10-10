import type { Metadata } from 'next';
import Link from 'next/link';
import { TextPage } from '@/components/TextPage';
import { HUBS, byCategory } from '@/lib/registry';

export const metadata: Metadata = {
  title: 'Sitemap — PawScales',
  description: 'All PawScales pages: calculators, charts, hubs and company pages, with one-line descriptions.',
  alternates: { canonical: 'https://pawscales.com/sitemap/' },
};

const COMPANY = [
  { href: '/about/', label: 'About', d: 'What PawScales is and who runs it.' },
  { href: '/how-we-calculate/', label: 'How we calculate', d: 'Every constant, with its source.' },
  { href: '/editorial-policy/', label: 'Editorial policy', d: 'How pages are written, sourced and tested.' },
  { href: '/authors/sikander-malik/', label: 'Sikander Malik', d: 'The author and founder.' },
  { href: '/contact/', label: 'Contact', d: 'Send a message or report a correction.' },
  { href: '/privacy-policy/', label: 'Privacy policy', d: 'How we handle data.' },
  { href: '/terms/', label: 'Terms of use', d: 'The terms for using the site.' },
  { href: '/disclaimer/', label: 'Disclaimer', d: 'Estimates only, not veterinary advice.' },
  { href: '/affiliate-disclosure/', label: 'Affiliate disclosure', d: 'No ads or affiliates at launch.' },
  { href: '/photo-credits/', label: 'Photo credits', d: 'Every photo and photographer.' },
];

function Group({ heading, items }: { heading: string; items: { href: string; label: string; d: string }[] }) {
  return (
    <section>
      <h2>{heading}</h2>
      <ul>
        {items.map((i) => (
          <li key={i.href}>
            <Link className="link" href={i.href}>{i.label}</Link>
            <span className="block text-[14px] text-muted">{i.d}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Page() {
  return (
    <TextPage title="Sitemap">
      {HUBS.map((h) => (
        <Group
          key={h.slug}
          heading={h.h1}
          items={[
            { href: `/${h.slug}/`, label: `${h.shortName} overview`, d: h.intro.split('.')[0] + '.' },
            ...byCategory(h.slug).map((t) => ({ href: `/${t.slug}/`, label: t.shortName, d: t.oneLiner })),
          ]}
        />
      ))}
      <Group heading="Company" items={COMPANY} />
    </TextPage>
  );
}
