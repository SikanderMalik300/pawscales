import type { Metadata } from 'next';
import { TextPage } from '@/components/TextPage';

export const metadata: Metadata = {
  title: 'Disclaimer — PawScales',
  description: 'PawScales provides estimates for general information. It is not veterinary advice.',
  alternates: { canonical: 'https://pawscales.com/disclaimer/' },
};

export default function Page() {
  return (
    <TextPage title="Disclaimer" updated="October 10, 2026">
      <p>
        PawScales provides estimates for general information. It is not veterinary
        advice. Always ask your vet about your pet’s health, diet, breeding or weight.
      </p>
      <p>
        Our calculators are built from published research and reputable sources, and
        tested against known examples, but every animal is different. Results are
        starting points, not diagnoses or prescriptions. We never provide medication
        or dosage tools.
      </p>
      <p>
        If your pet is unwell, losing or gaining weight unexpectedly, or you are
        unsure about any result, contact your veterinarian. In an emergency, contact
        your vet or an emergency animal hospital straight away.
      </p>
      <p>
        We work to keep numbers accurate and current, but we make no warranty that
        every figure is error-free, and we are not liable for decisions made from
        these estimates.
      </p>
    </TextPage>
  );
}
