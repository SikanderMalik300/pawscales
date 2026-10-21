import type { Metadata } from 'next';
import { HubPage, hubMetadata } from '@/components/HubPage';

export const metadata: Metadata = hubMetadata('cat-calculators');

export default function Page() {
  return (
    <HubPage
      slug="cat-calculators"
      intro={
        <>
          <p>
            Here are the free PawScales tools for cat owners, built the same way as the
            dog calculators: from published research and open data, with the source shown
            on every page. You can convert your cat&rsquo;s age into human years, estimate
            a young kitten&rsquo;s age week by week from its weight and teeth, check a
            kitten&rsquo;s weight against vet-clinic growth data month by month, and work
            out daily calories split between wet and dry food. There is also a kitten
            feeding chart that uses the NRC growth equation to show how much to feed as a
            kitten grows.
          </p>
          <p>
            To choose: if you have just taken in a kitten, the kitten age chart and the
            kitten feeding chart answer the first questions, and the cat weight chart lets
            you track growth. For an adult cat, the age and food calculators cover daily
            care. Cats hide illness well, so these numbers are a starting point, not a
            diagnosis; for anything about health or weight loss, your vet, who can feel
            body condition, matters more than any figure here.
          </p>
        </>
      }
      extraTools={['benadryl-dosage-calculator', 'gabapentin-for-dogs-and-cats', 'trazodone-for-dogs-and-cats']}
      whichTool={[
        { need: 'Convert your cat’s age to human years', tool: 'cat-years-calculator' },
        { need: 'Estimate a kitten’s age week by week', tool: 'kitten-age-chart' },
        { need: 'Check a kitten’s weight by month', tool: 'cat-weight-chart' },
        { need: 'Work out daily calories and cans or cups', tool: 'cat-food-calculator' },
      ]}
      faq={[
        { q: 'Are these cat calculators free?', a: 'Yes. Every tool is free and runs in your browser, with no account needed. Each one shows the formula and the source it uses, so you can check the working yourself.' },
        { q: 'Where do the numbers come from?', a: 'From sources like International Cat Care, the AAHA/AAFP feline life stage guidelines and the Pet Nutrition Alliance. Each page links its sources and the date we checked them.' },
        { q: 'Is this veterinary advice?', a: 'No. These tools give estimates for general information. Cats hide illness well, so for anything about your cat’s health, weight or diet, ask your vet.' },
      ]}
    />
  );
}
