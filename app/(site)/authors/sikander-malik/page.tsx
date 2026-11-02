import type { Metadata } from 'next';
import Link from 'next/link';
import { TextPage } from '@/components/TextPage';
import { JsonLd } from '@/components/JsonLd';
import { SITE } from '@/lib/registry';

const url = `${SITE.url}/authors/sikander-malik/`;

export const metadata: Metadata = {
  title: 'Sikander Malik | PawScales',
  description:
    'Sikander Malik is the founder of PawScales. He is not a veterinarian. He turns named veterinary sources and open data into free, tested dog and cat calculators.',
  alternates: { canonical: url },
};

// Real external profiles only (day-15 Task 2).
const sameAs: string[] = [
  'https://www.pinterest.com/pawscales/',
  'https://app.qwoted.com/sources/sikander-malik',
];

// "Why I built PawScales" stays in the code but is hidden until Sikander sends his
// own sentences; flip to true and drop them in then (no visible placeholder for now).
const SHOW_WHY_I_BUILT = false;

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
          jobTitle: 'Founder, PawScales',
          worksFor: { '@type': 'Organization', name: 'PawScales', url: `${SITE.url}/` },
          ...(sameAs.length ? { sameAs } : {}),
        },
      }} />
      <TextPage title="Sikander Malik, Founder of PawScales" updated="November 3, 2026">
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-sage text-[22px] font-semibold text-brand">SM</span>
          <p className="text-[16px] text-muted">Founder, PawScales</p>
        </div>
        <p>
          I am Sikander Malik, the founder of PawScales. I build the calculators, write
          the pages, and keep them up to date. I am not a veterinarian and I do not have
          any veterinary qualifications. What I do is take numbers that are already
          published by veterinary sources and turn them into free tools that are quicker
          to use than reading a table, and I show my working on every page.
        </p>

        {SHOW_WHY_I_BUILT && (
          <>
            <h2>Why I built PawScales</h2>
            {/* Replace with Sikander's own 2 to 3 sentences, then set SHOW_WHY_I_BUILT = true. */}
            <p>[Sikander&rsquo;s own words go here.]</p>
          </>
        )}

        <h2>About Bravo</h2>
        <p>
          I had a dog, Bravo, who has since died. I do not have a dog or cat now, so you
          will not find a &lsquo;my pets&rsquo; photo on the site.
        </p>

        <h2>How every page is made</h2>
        <p>
          Every number on PawScales comes from a named reference, not from a blog or a
          guess. The main ones are the Merck Veterinary Manual, the National Research
          Council&rsquo;s <em>Nutrient Requirements of Dogs and Cats</em> (NRC 2006),
          AAHA and AKC guidance, and the Salt growth studies for dog and cat weight by
          age. Each page lists the exact sources it used.
        </p>
        <p>
          Before a page goes live, I check every figure against the source it cites. The
          calculators are then covered by automated tests that stop a result going past
          the published limits, so a dose or a weight cannot drift above what the source
          actually allows. A build only ships when those tests pass.
        </p>
        <p>
          When something is wrong, I fix it and record it. The{' '}
          <Link className="link" href="/editorial-policy/">editorial policy</Link>{' '}
          explains in full how the site is sourced and tested, and the{' '}
          <Link className="link" href="/contact/">contact page</Link> is the place to
          flag an error or a number that looks off.
        </p>

        <h2>Not a veterinary practice</h2>
        <p>
          PawScales is not a veterinary practice, and I am not a veterinarian. The tools
          are a starting point to help you ask better questions, not a diagnosis or a
          treatment plan. For anything about your own pet&rsquo;s health, see your vet,
          and in an emergency call your vet or an emergency clinic straight away.
        </p>

        <h2>Corrections</h2>
        <p>
          Real fixes made since launch, with dates. This is here so you can see the site
          is maintained, not left to drift.
        </p>
        <ul>
          <li>
            <strong>October 19, 2026 &middot; Pepcid (famotidine):</strong> corrected the
            tablet rounding so the dose shown never goes over the published mg/kg range.
          </li>
          <li>
            <strong>October 20, 2026 &middot; Kitten feeding:</strong> replaced a flat
            multiplier with the NRC growth equation, which was overfeeding older kittens.
          </li>
          <li>
            <strong>October 27, 2026 &middot; Chocolate toxicity chart:</strong> made
            every ounce value round down, so the amount shown is never above the exact
            toxic trigger.
          </li>
        </ul>

        <p>
          Reach me at{' '}
          <a className="link" href="mailto:hello@pawscales.com">hello@pawscales.com</a>.
        </p>
      </TextPage>
    </>
  );
}
