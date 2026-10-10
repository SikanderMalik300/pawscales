import type { Metadata } from 'next';
import { TextPage } from '@/components/TextPage';

export const metadata: Metadata = {
  title: 'Privacy Policy — PawScales',
  description: 'How PawScales handles data: calculators run in your browser, and we name every processor we use.',
  alternates: { canonical: 'https://pawscales.com/privacy-policy/' },
};

export default function Page() {
  return (
    <TextPage title="Privacy policy" updated="October 10, 2026">
      <p>
        PawScales is built to need as little of your data as possible. The
        calculators run entirely in your browser, so the ages, weights and dates you
        type are not sent to us or stored on a server.
      </p>
      <h2>Who processes data for us</h2>
      <ul>
        <li><strong>Cloudflare</strong> hosts the site and provides privacy-friendly Web Analytics (aggregate page views, no cookies, no cross-site tracking).</li>
        <li><strong>Google Analytics 4</strong> is used only if enabled, to understand which tools are useful. When active, it respects the consent choice described below.</li>
        <li><strong>Web3Forms</strong> delivers the contact form. If you email us through the form, your name, email and message are sent so we can reply.</li>
      </ul>
      <h2>Cookies and consent</h2>
      <p>
        We use no advertising cookies. If analytics with consent is active, visitors
        in the EEA, the UK and Switzerland see a short banner and analytics stays off
        until you accept. Elsewhere, privacy-friendly analytics may run by default.
        You can clear cookies at any time in your browser.
      </p>
      <h2>Ads and affiliates</h2>
      <p>
        There are no ads or affiliate links at launch. If we add them, this section
        and the affiliate disclosure will be updated before they go live, and any
        advertising partner’s data use will be named here.
      </p>
      <h2>Your rights and contact</h2>
      <p>
        You can ask what data we hold and request deletion by emailing{' '}
        <a className="link" href="mailto:hello@pawscales.com">hello@pawscales.com</a>.
        Because the tools run in your browser, we usually hold nothing beyond any
        message you have sent us.
      </p>
    </TextPage>
  );
}
