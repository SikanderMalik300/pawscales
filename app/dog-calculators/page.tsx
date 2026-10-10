import type { Metadata } from 'next';
import { HubPage, hubMetadata } from '@/components/HubPage';

export const metadata: Metadata = hubMetadata('dog-calculators');

export default function Page() {
  return (
    <HubPage
      slug="dog-calculators"
      whichTool={[
        { need: 'Predict how big a puppy will get', tool: 'puppy-weight-calculator' },
        { need: 'Find a due date and timeline', tool: 'dog-pregnancy-calculator' },
        { need: 'Know your dog’s age in human years', tool: 'dog-years-calculator' },
        { need: 'Work out daily food and cups', tool: 'dog-food-calculator' },
        { need: 'Feed a raw diet by calories', tool: 'raw-dog-food-calculator' },
        { need: 'Predict the next heat', tool: 'dog-heat-cycle-calculator' },
      ]}
      faq={[
        { q: 'Are these dog calculators free?', a: 'Yes, every tool on PawScales is free, with no login. Each one shows its formula and the sources behind it, and runs entirely in your browser, so nothing you enter is sent anywhere.' },
        { q: 'Where do the numbers come from?', a: 'From published veterinary research, open datasets and official sources like Cornell, Merck, the Pet Nutrition Alliance and the AKC. Every page lists its sources with links and the date we checked them.' },
        { q: 'Is this veterinary advice?', a: 'No. These are estimates for general information, built from reputable sources and tested against known examples. For anything about your dog’s health, diet, breeding or weight, ask your vet, who knows your dog.' },
      ]}
    />
  );
}
