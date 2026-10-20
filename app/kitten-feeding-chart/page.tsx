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
        <>A growing kitten needs about <strong>2.5 times its resting energy</strong> in
        calories a day (RER = 70 × weight in kg to the power 0.75), from the Merck
        Veterinary Manual. That is roughly 170 kcal at 2 months, rising to 400 kcal or
        more by 10 to 12 months, split into three meals a day until six months and two
        after. Enter your kitten&rsquo;s weight and your food&rsquo;s label for cups or
        cans.</>
      }
      faq={[
        { q: 'How much should a 3 month old kitten eat?', a: 'A three-month-old kitten weighs about 3 to 4 pounds and needs roughly 235 to 255 calories a day, which is about 2.5 times its resting energy. Split that into three meals of around 80 calories each. Females are usually a little lighter than males, so weigh your kitten and check the chart. The exact cups or cans depend on the calories listed on your food.' },
        { q: 'How many times a day should I feed a kitten?', a: 'The Cornell Feline Health Center advises three meals a day until a kitten is six months old, then twice daily from six months to one year. The Merck Veterinary Manual notes kittens can also be fed free choice (food left out) while they are growing. Pick whichever keeps your kitten in good body condition.' },
        { q: 'How much should I feed my kitten by weight?', a: 'Work out resting energy as 70 times the kitten’s weight in kilograms to the power 0.75, then multiply by 2.5 (Merck). A 2 pound kitten is about 170 calories a day, a 4 pound kitten about 290, and a 7 pound kitten about 420. Use the calculator to turn that into cups or cans from your food label, and start low if unsure.' },
        { q: 'When do I switch a kitten to adult cat food?', a: 'Around one year of age. From 12 months, feed your cat as an adult: about 1.2 times resting energy if neutered, 1.4 times if intact (Merck), which is well below the growing-kitten amount. Energy needs drop after spaying or neutering, so watch the weight and cut back if your cat starts to gain.' },
        { q: 'Is wet or dry food better for a kitten?', a: 'Both can be complete for growth. Choose a food labelled for growth or all life stages (an AAFCO statement on the bag or can), and feed the amount that keeps your kitten lean and active. The calculator works out cups or cans for either, or a mix. Ask your vet if you are not sure which to use.' },
      ]}
    />
  );
}
