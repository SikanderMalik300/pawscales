import type { Metadata } from 'next';
import { HubPage, hubMetadata } from '@/components/HubPage';

export const metadata: Metadata = hubMetadata('cat-calculators');

export default function Page() {
  return (
    <HubPage
      slug="cat-calculators"
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
