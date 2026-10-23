import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { toolMetadata } from '@/lib/seo';
import { DoodlePage } from '@/components/DoodlePage';
import { GOLDENDOODLE } from '@/lib/data/doodles';

const tool = bySlug('goldendoodle-size-chart')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <DoodlePage
      breed={GOLDENDOODLE}
      quickAnswer={
        <>Goldendoodles come in four sizes set by the Goldendoodle Association of
        North America: Petite (up to 25 lb), Miniature (26–35 lb), Medium (36–50 lb)
        and Standard (51 lb and up). Height at the shoulder decides the size, not
        weight. Pick a size, or enter the parents&rsquo; weights, to estimate how big
        your puppy will get.</>
      }
      method={
        <>
          <p>
            The sizes are the official GANA categories, measured by height at the
            withers. To show weight by age, we take each size&rsquo;s representative
            adult weight and scale the Salt et al. (2017) growth curve (the median
            line) down to the puppy ages. A Goldendoodle is a Poodle cross, so treat
            these as a guide: height is the reliable marker, and weight varies with
            coat, build and generation. For the Labrador version of the same cross, see
            our <a className="link" href="/labradoodle-size-chart/">Labradoodle size chart</a>.
          </p>
          <p>
            <strong>Example 1.</strong> A Medium puppy at 20 weeks weighing 22 lb is
            about 57% of its adult weight, projecting to about 38.8 lb, inside the
            36–50 lb Medium range.
          </p>
          <p>
            <strong>Example 2.</strong> A litter from a 15 lb mother and a 65 lb father
            points to roughly 15–40 lb as adults, from the lighter parent up to the
            average of both. That spans the Petite to Medium sizes, which is normal for
            a cross.
          </p>
        </>
      }
      faq={[
        { q: 'What are the Goldendoodle sizes?', a: 'The Goldendoodle Association of North America (GANA) recognises four sizes by height at the withers: Petite (under 14 inches, up to about 25 pounds), Miniature (14 to 17 inches, about 26 to 35 pounds), Medium (17 to 21 inches, about 36 to 50 pounds) and Standard (over 21 inches, about 51 pounds and up). Height is the deciding factor because weight can fluctuate.' },
        { q: 'How big will my Goldendoodle get?', a: 'The best guide is the parents, especially the Poodle parent, since that is where most of the size variation comes from. A rough rule is that a puppy lands somewhere between the lighter parent and the average of both parents. Breeders estimate a puppy’s size from the litter and the parents, but GANA notes this is an educated guess, not a guarantee.' },
        { q: 'What is the difference between a Mini and a Medium Goldendoodle?', a: 'A Miniature Goldendoodle stands 14 to 17 inches and weighs about 26 to 35 pounds; a Medium stands 17 to 21 inches and weighs about 36 to 50 pounds, per GANA. The Medium is the step between the Miniature and the Standard, so it suits owners who want a mid-sized dog rather than a small or large one.' },
        { q: 'When is a Goldendoodle full grown?', a: 'Smaller Goldendoodles (Petite and Miniature) reach close to their adult weight by about 11 to 13 months. Medium and Standard dogs fill out a little longer, to roughly 15 to 18 months. Most of the height comes first, then the chest and build. If in doubt, track the trend rather than a single target weight.' },
        { q: 'How accurate is this size chart?', a: 'The size categories are exact, straight from GANA. The weight-by-age figures are a well-sourced estimate: each size’s representative adult weight scaled by growth data from more than 60,000 healthy dogs. Because the Goldendoodle is a mix, individual dogs vary more than a purebred would, so use the chart as a guide and weigh your own puppy.' },
      ]}
      sources={[
        { name: 'Goldendoodle Association of North America (GANA), Goldendoodle sizes (Petite, Miniature, Medium, Standard; height and weight ranges).', url: 'https://www.goldendoodleassociation.com/about-the-breed/sizes/' },
        { name: 'Salt C, Morris PJ, German AJ, et al. Growth standard charts for monitoring bodyweight in dogs. PLoS ONE 2017;12(9):e0182064.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5584974/' },
      ]}
      related={['bernedoodle-size-chart', 'puppy-weight-calculator', 'dog-crate-size-chart', 'dog-harness-size-chart']}
    />
  );
}
