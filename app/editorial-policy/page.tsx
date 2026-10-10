import type { Metadata } from 'next';
import Link from 'next/link';
import { TextPage } from '@/components/TextPage';
import { DataTable } from '@/components/ui/Table';

export const metadata: Metadata = {
  title: 'Editorial Policy — PawScales',
  description:
    'How PawScales is written, sourced and tested: who writes it, which sources we accept, how we use AI, our update policy and corrections log.',
  alternates: { canonical: 'https://pawscales.com/editorial-policy/' },
};

export default function Page() {
  return (
    <TextPage title="Editorial policy" updated="October 10, 2026">
      <h2>Who writes PawScales</h2>
      <p>
        Every page is written and reviewed by{' '}
        <Link className="link" href="/authors/sikander-malik/">Sikander Malik</Link>,
        who runs the site. He is not a veterinarian, and PawScales does not claim
        that a vet wrote or reviewed any page.
      </p>
      <h2>How tools are built and tested</h2>
      <p>
        Each calculator takes its formula or data from a named source. We write it
        into code and cover it with automated tests that check the result against
        known worked examples. A build only ships when every test passes. Each page
        shows its formula and two worked examples so you can follow the maths.
      </p>
      <h2>Sources we accept</h2>
      <ul>
        <li>Veterinary schools and teaching hospitals (for example, Cornell).</li>
        <li>Veterinary associations and guideline bodies (AVMA, AAHA, WSAVA, Pet Nutrition Alliance).</li>
        <li>Peer-reviewed research papers.</li>
        <li>Official breed and manufacturer charts (AKC, and named harness and crate makers).</li>
      </ul>
      <p>We avoid unsourced blog posts, and we never invent a statistic, study or quote.</p>
      <h2>How we use AI</h2>
      <p>
        We use AI tools to help draft and code. Every number is checked against the
        cited source and covered by automated tests, and every page is reviewed by
        Sikander before publishing. We never use AI-generated images.
      </p>
      <h2>Update policy</h2>
      <p>
        We re-check sources when we update a tool and record the date on each page.
        If a source changes a number, we update the tool, its examples and its tests,
        and note the change.
      </p>
      <h2>Corrections</h2>
      <p>
        Spotted something wrong? Email{' '}
        <a className="link" href="mailto:hello@pawscales.com">hello@pawscales.com</a>.
        Public corrections will be logged here.
      </p>
      <DataTable
        columns={[{ key: 'date', header: 'Date' }, { key: 'page', header: 'Page' }, { key: 'change', header: 'Change' }]}
        rows={[]}
      />
      <p className="text-[14px] text-muted">No corrections yet.</p>
      <h2>Ads and affiliates</h2>
      <p>
        PawScales has no ads or affiliate links at launch. If that changes, we will
        label them clearly and keep them out of the calculators. See the{' '}
        <Link className="link" href="/affiliate-disclosure/">affiliate disclosure</Link>.
      </p>
    </TextPage>
  );
}
