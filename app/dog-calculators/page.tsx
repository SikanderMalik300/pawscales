import type { Metadata } from 'next';
import { HubPage, hubMetadata } from '@/components/HubPage';

export const metadata: Metadata = hubMetadata('dog-calculators');

export default function Page() {
  return (
    <HubPage
      slug="dog-calculators"
      intro={
        <>
          <p>
            This page gathers the free PawScales tools for dog owners in one place. You
            can predict how big a puppy will get from its age and current weight, convert
            a dog&rsquo;s age into human years by size, find a due date and a week-by-week
            timeline from a breeding, and work out how many calories and cups to feed at
            each life stage. There are tools for a raw diet by calories, for the next heat
            and fertile window, and, where owners often search, careful by-weight dosage
            calculators for common over-the-counter medicines, each one asking you to
            check with your vet first.
          </p>
          <p>
            Not sure which to open? If you have a growing puppy, start with the puppy
            weight calculator and the feeding chart. For an adult dog, the age and food
            calculators answer the everyday questions, and for breeding you can use the
            heat cycle and pregnancy tools together. Every calculator runs in your browser,
            shows the formula it uses, and links the research or veterinary source behind
            each number, with the date we checked it.
          </p>
        </>
      }
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
