import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { toolMetadata } from '@/lib/seo';
import { KittenFeedingPage } from '@/components/KittenFeedingPage';

const tool = bySlug('kitten-feeding-chart')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <KittenFeedingPage
      quickAnswer={
        <>A growing kitten&rsquo;s daily calories follow the <strong>NRC 2006 growth
        curve</strong>, which eases toward adult needs as the kitten fills out: around
        190 kcal at 2 months, levelling off near 280 to 320 kcal from about 6 months,
        split into three meals a day until six months and two after. Enter your
        kitten&rsquo;s weight, expected adult weight and your food label for cups or
        cans.</>
      }
      faq={[
        { q: 'How much should a 3 month old kitten eat?', a: 'A three-month-old kitten weighs about 3 to 4 pounds and needs roughly 235 to 260 calories a day by the NRC 2006 growth equation. Split that into three meals of about 80 to 85 calories each. Females are usually a little lighter than males, so weigh your kitten and check the chart. The exact cups or cans depend on the calories listed on your food.' },
        { q: 'How many times a day should I feed a kitten?', a: 'The Cornell Feline Health Center advises three meals a day until a kitten is six months old, then twice daily from six months to one year. The Merck Veterinary Manual notes kittens can also be fed free choice (food left out) while they are growing. Pick whichever keeps your kitten in good body condition.' },
        { q: 'How much should I feed my kitten by weight?', a: 'The calculator uses the NRC 2006 growth equation, which needs the kitten’s current weight and its expected adult weight, so the amount eases off as the kitten grows. As a rough guide for a cat heading toward about 9 pounds: a 2 pound kitten is about 190 calories a day, a 4 pound kitten about 260, and a 7 pound kitten about 300. Enter your own numbers for a tighter figure, and start low if unsure.' },
        { q: 'When do I switch a kitten to adult cat food?', a: 'Once your kitten reaches about 95% of its expected adult weight, or 12 months of age, feed it as an adult: about 1.2 times resting energy if neutered, 1.4 times if intact (Merck), which is below the growing-kitten peak. Energy needs drop after spaying or neutering, so watch the weight and cut back if your cat starts to gain.' },
        { q: 'Is wet or dry food better for a kitten?', a: 'Both can be complete for growth. Choose a food labelled for growth or all life stages (an AAFCO statement on the bag or can), and feed the amount that keeps your kitten lean and active. The calculator works out cups or cans for either, or a mix. Ask your vet if you are not sure which to use.' },
      ]}
    />
  );
}
