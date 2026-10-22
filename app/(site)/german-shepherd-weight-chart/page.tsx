import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { toolMetadata } from '@/lib/seo';
import { BREEDS } from '@/lib/data/breeds';
import { BreedGrowthPage } from '@/components/BreedGrowthPage';
import { NoteBox } from '@/components/ui/NoteBox';

const tool = bySlug('german-shepherd-weight-chart')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <BreedGrowthPage
      breed={BREEDS['german-shepherd-weight-chart']}
      quickAnswer={
        <>Adult German Shepherds weigh about 65–90 lb for males and 50–70 lb for
        females. By 4 months a male is around 37 lb and a female around 29 lb, and
        most keep filling out until close to 2 years. Enter your puppy&rsquo;s sex,
        age and weight to see where they sit.</>
      }
      method={
        <>
          <p>
            We take the Salt et al. (2017) growth curves, choose the size band that
            fits each sex (females land in the 15–30 kg band, males in the 30–40 kg
            band), and scale the curve to the AKC German Shepherd weight range. Your
            puppy&rsquo;s projected adult weight = current weight ÷ the share of adult
            weight reached at that age. Because males top out above 40 kg, the male
            table marks weights over 88 lb (†): large males keep growing past 2 years,
            so treat those as a minimum.
          </p>
          <p>
            <strong>Example 1.</strong> A male at 16 weeks weighing 30 lb is about 43%
            of his adult weight, projecting to about 70 lb, inside the typical
            65–90 lb male range (range 62–80 lb).
          </p>
          <p>
            <strong>Example 2.</strong> A female at 8 months weighing 50 lb is about
            89% of her adult weight, projecting to about 56 lb, in the middle of the
            50–70 lb female range.
          </p>
        </>
      }
      secondTable={
        <NoteBox label="Body condition, not just the scale">
          A healthy German Shepherd has a visible waist from above and ribs you can
          feel with a light touch but not see. The breed is lean and athletic, so a
          number inside the chart can still be too much on a fine frame. Use a 9-point
          body condition score (4–5 of 9 is ideal) and ask your vet. Growing large
          breeds too fast is linked to joint problems, so aim for steady, lean growth.
          See the{' '}
          <a className="link" href="https://wsava.org/wp-content/uploads/2020/01/Body-Condition-Score-Dog.pdf">
            WSAVA body condition score chart
          </a>.
        </NoteBox>
      }
      faq={[
        { q: 'How much should a German Shepherd weigh?', a: 'Adult males weigh about 65 to 90 pounds and females about 50 to 70 pounds, per the AKC breed standard. German Shepherds are a large, slow-maturing breed and often do not reach their full weight until close to 2 years old. Lean, athletic condition matters more than hitting a specific number.' },
        { q: 'How big is a 4-month-old German Shepherd?', a: 'At 4 months a male is typically around 37 pounds and a female around 29 pounds on our chart, with a wide normal range. That is roughly a third to a half of adult weight. Puppies grow in spurts, so a 4-month-old that looks leggy and lean is usually normal.' },
        { q: 'When do German Shepherds stop growing?', a: 'They reach most of their height by about 12 months, then keep adding muscle and chest until roughly 18 to 24 months, and large males can fill out a little beyond that. Expect the fast weight gain to slow after about 8 to 10 months and taper into the second year.' },
        { q: 'Male vs female German Shepherd size?', a: 'Males are noticeably larger: about 65 to 90 pounds and 24 to 26 inches tall, versus 50 to 70 pounds and 22 to 24 inches for females, per the AKC. That is often a 15-pound and two-inch difference, though individual dogs overlap. Our chart keeps the two sexes separate for this reason.' },
        { q: 'Why is my German Shepherd puppy skinny?', a: 'Many German Shepherd puppies look lanky and lean while they grow, especially between 6 and 12 months, because height comes before muscle. That is usually normal. If your puppy is below the chart and also low-energy, has a dull coat, or is not gaining over time, or you see worms, see your vet to rule out parasites or diet problems.' },
        { q: 'How accurate is this chart?', a: 'It is a well-sourced estimate, not a guarantee. The curves come from growth data on more than 60,000 healthy dogs, scaled to the AKC German Shepherd range. Accuracy improves with age, and the typical range is wide on purpose. Track your own puppy&rsquo;s trend and body condition rather than a single target number.' },
      ]}
      sources={[
        { name: 'American Kennel Club, German Shepherd Dog breed standard (males 65–90 lb, 24–26 in; females 50–70 lb, 22–24 in).', url: 'https://www.akc.org/dog-breeds/german-shepherd-dog/' },
        { name: 'Salt C, Morris PJ, German AJ, et al. Growth standard charts. PLoS ONE 2017;12(9):e0182064.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5584974/' },
        { name: 'WSAVA Body Condition Score chart for dogs.', url: 'https://wsava.org/wp-content/uploads/2020/01/Body-Condition-Score-Dog.pdf' },
      ]}
      related={['puppy-weight-calculator', 'golden-retriever-weight-chart', 'dog-crate-size-chart', 'dog-food-calculator']}
    />
  );
}
