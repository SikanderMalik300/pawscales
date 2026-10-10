import type { Metadata } from 'next';
import { TextPage } from '@/components/TextPage';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure — PawScales',
  description: 'PawScales has no affiliate links or ads at launch. If that changes, we will label them clearly.',
  alternates: { canonical: 'https://pawscales.com/affiliate-disclosure/' },
};

export default function Page() {
  return (
    <TextPage title="Affiliate disclosure" updated="October 10, 2026">
      <p>
        PawScales has no affiliate links and no ads at launch. The tools do not
        recommend specific products to buy.
      </p>
      <p>
        If we add affiliate links in the future, we will disclose it clearly on any
        page that uses them. An affiliate link means we may earn a small commission if
        you buy through it, at no extra cost to you. We would only ever link to
        products that fit the measurement or need shown, and we would keep such links
        out of the calculators themselves.
      </p>
      <p>
        Any future advertising will be labelled “Advertisement”, kept out of the
        space between a calculator’s inputs and its result, and never placed above the
        tool on mobile.
      </p>
      <p>
        Recommendations, when we make them, will always be based on fit and sources,
        not on commission.
      </p>
    </TextPage>
  );
}
