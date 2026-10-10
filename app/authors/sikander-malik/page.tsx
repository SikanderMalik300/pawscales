import type { Metadata } from 'next';
import Link from 'next/link';
import { TextPage } from '@/components/TextPage';
import { JsonLd } from '@/components/JsonLd';
import { SITE } from '@/lib/registry';

const url = `${SITE.url}/authors/sikander-malik/`;

export const metadata: Metadata = {
  title: 'Sikander Malik — PawScales',
  description:
    'Sikander Malik builds and reviews PawScales, free dog and cat calculators built from veterinary research and open data.',
  alternates: { canonical: url },
};

export default function Page() {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        mainEntity: {
          '@type': 'Person',
          '@id': `${url}#person`,
          name: 'Sikander Malik',
          url,
          sameAs: [],
        },
      }} />
      <TextPage title="Sikander Malik" updated="October 10, 2026">
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-sage text-[22px] font-semibold text-brand">SM</span>
          <p className="text-[16px] text-muted">Founder and author, PawScales</p>
        </div>
        <p>
          Sikander Malik builds PawScales, a set of free calculators and charts for
          dog and cat owners. He turns published veterinary research and open data
          into simple tools, writes the explanations, and reviews every page before
          it goes live.
        </p>
        <h2>What he does on the site</h2>
        <p>
          Sikander chooses the sources, writes the formulas into tested code, checks
          each number against the cited source, and keeps the pages up to date. He
          uses AI tools to help draft and code, but every number is checked against
          its source and covered by automated tests.
        </p>
        <h2>About Bravo</h2>
        <p>
          He grew up with Bravo, a Gull Dong, which is where the interest in
          everyday owner questions started. He does not currently own a dog or cat.
        </p>
        <p>
          Reach him at{' '}
          <a className="link" href="mailto:hello@pawscales.com">hello@pawscales.com</a>.
          Read more about how the site works in the{' '}
          <Link className="link" href="/editorial-policy/">editorial policy</Link>.
        </p>
      </TextPage>
    </>
  );
}
