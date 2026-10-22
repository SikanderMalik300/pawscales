import type { Metadata } from 'next';
import Link from 'next/link';
import { TextPage } from '@/components/TextPage';

export const metadata: Metadata = {
  title: 'About PawScales',
  description:
    'PawScales is a set of free dog and cat calculators built from published veterinary research and open data, by Sikander Malik. Every number has a source.',
  alternates: { canonical: 'https://pawscales.com/about/' },
};

export default function Page() {
  return (
    <TextPage title="About PawScales" updated="October 10, 2026">
      <p>
        PawScales is a set of free calculators and charts for dog and cat owners.
        Each one is built from published veterinary research and open data, and each
        shows its formula and the sources behind it. Nothing is behind a login, and
        the maths runs in your browser.
      </p>
      <h2>Who runs it</h2>
      <p>
        PawScales is built by Sikander Malik. Here is why, in his words:
      </p>
      <blockquote className="rounded-[16px] border border-line bg-sand p-5 text-[16px] italic">
        “I grew up with Bravo, a Gull Dong. He was strong, loyal, protective and
        endlessly playful, and he was family, not just a pet. Looking after him
        taught me how many everyday questions owners have: how big will he get, how
        much should he eat, what does this number on the bag actually mean. PawScales
        is my attempt to answer those questions with real numbers and real sources.”
      </blockquote>
      <h2>How the tools are built</h2>
      <p>
        Every calculator is a small, tested piece of code. We take the formula or
        data from a named source, write it into the tool, and cover it with automated
        tests that check it against known examples. Each page lists its sources with
        links and the date we checked them. You can read the full method on the{' '}
        <Link className="link" href="/how-we-calculate/">how we calculate</Link> page.
      </p>
      <h2>What it does not do</h2>
      <p>
        PawScales gives estimates for general information. It is not veterinary
        advice, and it will never offer medication or dosage tools. For anything
        about your pet’s health, diet, breeding or weight, ask your vet, who knows
        your animal. See the{' '}
        <Link className="link" href="/disclaimer/">disclaimer</Link> for more.
      </p>
      <h2>Contact</h2>
      <p>
        Questions, corrections or ideas are welcome at{' '}
        <a className="link" href="mailto:hello@pawscales.com">hello@pawscales.com</a>,
        or through the <Link className="link" href="/contact/">contact form</Link>.
      </p>
    </TextPage>
  );
}
