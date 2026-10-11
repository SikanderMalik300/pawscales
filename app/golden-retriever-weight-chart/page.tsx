import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { toolMetadata } from '@/lib/seo';
import { BREEDS } from '@/lib/data/breeds';
import { BreedGrowthPage } from '@/components/BreedGrowthPage';
import { NoteBox } from '@/components/ui/NoteBox';

const tool = bySlug('golden-retriever-weight-chart')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <BreedGrowthPage
      breed={BREEDS['golden-retriever-weight-chart']}
      quickAnswer={
        <>Adult Golden Retrievers weigh about 65–75 lb for males and 55–65 lb for
        females. By 6 months a female is around 43 lb and a male around 49 lb; both
        reach their adult weight close to 18 months. Enter your puppy&rsquo;s sex,
        age and weight to see where they sit.</>
      }
      method={
        <>
          <p>
            We take the Salt et al. (2017) growth curves, pick the size band that
            fits each sex (females land in the 15–30 kg band, males in the 30–40 kg
            band), and scale the curve to the AKC Golden Retriever weight range. Your
            puppy&rsquo;s projected adult weight = current weight ÷ the share of adult
            weight reached at that age.
          </p>
          <p>
            <strong>Example 1.</strong> A female at 16 weeks weighing 25 lb is about
            44% of her adult weight, so the estimate is about 56.6 lb, inside the
            typical 55–65 lb female range.
          </p>
          <p>
            <strong>Example 2.</strong> A male at 6 months weighing 45 lb is about 70%
            of his adult weight, projecting to about 64 lb, near the low end of the
            65–75 lb male range (range 57–74 lb).
          </p>
        </>
      }
      secondTable={
        <NoteBox label="Body condition, not just the scale">
          A healthy Golden has a visible waist from above and ribs you can feel with a
          light touch but not see. Weight within the chart can still be too much on a
          small frame, or too little on a large one. Use a 9-point body condition
          score (4–5 of 9 is ideal) and ask your vet. Over-feeding a growing Golden is
          linked to hip and elbow problems, so aim for lean growth, not fast growth.
          See the{' '}
          <a className="link" href="https://wsava.org/wp-content/uploads/2020/01/Body-Condition-Score-Dog.pdf">
            WSAVA body condition score chart
          </a>.
        </NoteBox>
      }
      faq={[
        { q: 'How much should a Golden Retriever weigh?', a: 'Adult males weigh about 65 to 75 pounds and females about 55 to 65 pounds, per the AKC breed standard. Golden Retrievers reach most of their adult weight by about 12 months and fill out to their final weight closer to 18 months. Individual dogs vary, so use body condition alongside the number.' },
        { q: 'How big is a 6-month-old Golden Retriever?', a: 'At 6 months a female Golden is typically around 43 pounds and a male around 49 pounds on our chart, which is roughly two thirds of adult weight. There is a wide normal range, so a 6-month-old anywhere from the high 30s to the high 50s can be perfectly healthy depending on frame.' },
        { q: 'When is a Golden Retriever full grown?', a: 'Goldens reach close to their adult weight by about 12 months, then keep filling out in the chest and build until roughly 18 to 24 months. Height is usually set by about a year; the later change is muscle and coat, not much more height.' },
        { q: 'Male vs female Golden Retriever size?', a: 'Males are larger: about 65 to 75 pounds and 23 to 24 inches tall, versus 55 to 65 pounds and 21.5 to 22.5 inches for females, per the AKC. That is roughly a 10-pound and one-to-two-inch difference on average, though individual dogs overlap.' },
        { q: 'My puppy is below the chart, should I worry?', a: 'Not necessarily. The chart shows a typical range, and healthy puppies sit above and below it. What matters more is a steady upward trend and good body condition: ribs easy to feel, a visible waist, and plenty of energy. If your puppy is losing weight, lethargic, or far off the curve, see your vet.' },
        { q: 'How accurate is this chart?', a: 'It is a well-sourced estimate, not a guarantee. The curves come from growth data on more than 60,000 healthy dogs, scaled to the AKC Golden Retriever range. Accuracy improves with age, and the typical range is wide on purpose. Use it as a guide and track your own puppy&rsquo;s trend.' },
      ]}
      sources={[
        { name: 'American Kennel Club, Golden Retriever breed standard (males 65–75 lb, 23–24 in; females 55–65 lb, 21.5–22.5 in).', url: 'https://www.akc.org/dog-breeds/golden-retriever/' },
        { name: 'Salt C, Morris PJ, German AJ, et al. Growth standard charts. PLoS ONE 2017;12(9):e0182064.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5584974/' },
        { name: 'WSAVA Body Condition Score chart for dogs.', url: 'https://wsava.org/wp-content/uploads/2020/01/Body-Condition-Score-Dog.pdf' },
      ]}
      related={['puppy-weight-calculator', 'dog-food-calculator', 'dog-crate-size-chart', 'german-shepherd-weight-chart']}
    />
  );
}
