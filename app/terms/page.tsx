import type { Metadata } from 'next';
import Link from 'next/link';
import { TextPage } from '@/components/TextPage';

export const metadata: Metadata = {
  title: 'Terms of Use — PawScales',
  description: 'The terms for using PawScales, a free set of dog and cat calculators.',
  alternates: { canonical: 'https://pawscales.com/terms/' },
};

export default function Page() {
  return (
    <TextPage title="Terms of use" updated="October 10, 2026">
      <p>
        By using PawScales you agree to these terms. If you do not agree, please do
        not use the site.
      </p>
      <h2>Use of the tools</h2>
      <p>
        PawScales offers free calculators and charts for general information. You may
        use them for personal, non-commercial purposes. The results are estimates,
        not professional advice; see the{' '}
        <Link className="link" href="/disclaimer/">disclaimer</Link>.
      </p>
      <h2>No warranty</h2>
      <p>
        The site is provided “as is”. We work hard to keep it accurate and available,
        but we do not warrant that it is error-free or uninterrupted, and we are not
        liable for any loss arising from its use.
      </p>
      <h2>Content</h2>
      <p>
        Text and tools are owned by PawScales. Photographs are licensed from their
        photographers and credited on the{' '}
        <Link className="link" href="/photo-credits/">photo credits</Link> page; their
        licenses govern reuse. Source data belongs to the cited owners under their own
        licenses.
      </p>
      <h2>Changes</h2>
      <p>
        We may update these terms. The “last updated” date above shows when they last
        changed.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about these terms:{' '}
        <a className="link" href="mailto:hello@pawscales.com">hello@pawscales.com</a>.
      </p>
    </TextPage>
  );
}
