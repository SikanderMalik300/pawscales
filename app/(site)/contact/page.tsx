import type { Metadata } from 'next';
import { TextPage } from '@/components/TextPage';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact | PawScales',
  description: 'Questions, corrections or ideas for PawScales? Send a message or email hello@pawscales.com.',
  alternates: { canonical: 'https://pawscales.com/contact/' },
};

export default function Page() {
  return (
    <TextPage title="Contact" updated="October 10, 2026">
      <p>
        Questions, corrections or ideas are always welcome. Use the form below, or
        email{' '}
        <a className="link" href="mailto:hello@pawscales.com">hello@pawscales.com</a>.
        If you are reporting a number that looks wrong, tell us which page and what
        you expected, and we’ll check it against the source.
      </p>
      <ContactForm />
    </TextPage>
  );
}
