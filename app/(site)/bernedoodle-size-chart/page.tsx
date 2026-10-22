import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { toolMetadata } from '@/lib/seo';
import { DoodlePage } from '@/components/DoodlePage';
import { BERNEDOODLE } from '@/lib/data/doodles';
import { DataTable } from '@/components/ui/Table';

const tool = bySlug('bernedoodle-size-chart')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <DoodlePage
      breed={BERNEDOODLE}
      quickAnswer={
        <>Bernedoodles come in four sizes from SwissRidge Kennels, the breeder that
        created the Bernedoodle: Tiny (10–25 lb), Miniature (26–45 lb), Medium
        (46–65 lb) and Standard (66 lb and up). Height at the shoulder sets the size.
        Pick a size, or enter the parents&rsquo; weights, to estimate how big your
        puppy will get.</>
      }
      method={
        <>
          <p>
            The sizes are the SwissRidge Kennels categories, measured by height at the
            shoulder. To show weight by age, we take each size&rsquo;s representative
            adult weight and scale the Salt et al. (2017) median growth curve down to
            the puppy ages, capped at the adult weight. A Bernedoodle is a Bernese
            Mountain Dog crossed with a Poodle, so size depends heavily on the Poodle
            parent (Toy, Miniature or Standard). Treat the numbers as a guide and go by
            the parents.
          </p>
          <p>
            <strong>Example 1.</strong> A Miniature puppy at 20 weeks weighing 18 lb is
            about 57% of its adult weight, projecting to about 31.8 lb, inside the
            26–45 lb Miniature range.
          </p>
          <p>
            <strong>Example 2.</strong> A litter from a 30 lb mother and a 50 lb father
            points to roughly 30–40 lb as adults, from the lighter parent up to the
            average of both. That spans the Miniature to Medium sizes, which is normal
            for a cross.
          </p>
        </>
      }
      comparison={
        <>
          <h2 className="text-[22px] sm:text-[26px]">Size comparison: Bernedoodle vs its parents</h2>
          <p className="mt-2 text-[16px] text-ink">
            A Standard Bernedoodle sits between its two parent breeds. The Bernese
            Mountain Dog is a large, heavy breed; the Standard Poodle is tall but
            lighter. Smaller Bernedoodles come from using a Miniature or Toy Poodle.
          </p>
          <div className="mt-4">
            <DataTable
              caption="Bernedoodle Standard vs parent breeds"
              columns={[
                { key: 'breed', header: 'Breed' },
                { key: 'height', header: 'Height at the shoulder' },
                { key: 'weight', header: 'Adult weight', numeric: true },
              ]}
              rows={[
                { cells: { breed: 'Bernese Mountain Dog (male)', height: '25–27.5 in', weight: '80–115 lb' } },
                { cells: { breed: 'Bernese Mountain Dog (female)', height: '23–26 in', weight: '70–95 lb' } },
                { cells: { breed: 'Standard Poodle (male)', height: 'over 15 in', weight: '60–70 lb' } },
                { cells: { breed: 'Standard Poodle (female)', height: 'over 15 in', weight: '40–50 lb' } },
                { cells: { breed: 'Standard Bernedoodle', height: '22–29 in', weight: '66 lb and up' } },
              ]}
              footnote={
                <>
                  The Standard Poodle standard is set by height (over 15 in at the
                  shoulder); the weights are the AKC breed figures. Bernedoodle figures
                  are SwissRidge Kennels.
                </>
              }
              source={
                <>
                  Sources: <a className="link" href="https://www.akc.org/dog-breeds/bernese-mountain-dog/">AKC Bernese Mountain Dog</a>,{' '}
                  <a className="link" href="https://www.akc.org/dog-breeds/poodle-standard/">AKC Standard Poodle</a>,{' '}
                  <a className="link" href="https://swissridgekennels.com/swissridge/qa/">SwissRidge Kennels</a>.
                </>
              }
            />
          </div>
          <p className="mt-3 text-[16px] text-ink">
            Within the Bernedoodle, the four sizes step up evenly: Tiny (10–13 in),
            Miniature (14–17 in), Medium (18–21 in) and Standard (22–29 in). Tiny and
            Miniature dogs finish growing by about 11–13 months; Medium and Standard
            dogs fill out to roughly 14–24 months.
          </p>
        </>
      }
      faq={[
        { q: 'What are the Bernedoodle sizes?', a: 'SwissRidge Kennels, the breeder that created the Bernedoodle, lists four sizes by height at the shoulder: Tiny (10 to 13 inches, about 10 to 25 pounds), Miniature (14 to 17 inches, about 26 to 45 pounds), Medium (18 to 21 inches, about 46 to 65 pounds) and Standard (22 to 29 inches, about 66 pounds and up). The size depends mostly on the Poodle parent.' },
        { q: 'How big does a mini Bernedoodle get?', a: 'A Miniature Bernedoodle stands about 14 to 17 inches at the shoulder and weighs roughly 26 to 45 pounds as an adult, per SwissRidge Kennels. Minis are made by crossing a Miniature Poodle with a Bernese Mountain Dog or a smaller doodle, and most reach their adult size by about 11 to 13 months.' },
        { q: 'How big is a full size (Standard) Bernedoodle?', a: 'A Standard Bernedoodle stands 22 to 29 inches at the shoulder and weighs 66 pounds and up, with many reaching 70 to 90 pounds or more. That is between the two parent breeds: the Bernese Mountain Dog (up to 115 pounds) and the Standard Poodle (around 60 to 70 pounds). Standards keep filling out until roughly 18 to 24 months.' },
        { q: 'When is a Bernedoodle full grown?', a: 'Smaller Bernedoodles (Tiny and Miniature) reach close to their adult weight by about 11 to 13 months. Medium and Standard dogs take longer, to roughly 14 to 24 months, because larger dogs mature more slowly. Most of the height comes first, then the chest and build fill out.' },
        { q: 'How accurate is this size chart?', a: 'The size categories come straight from SwissRidge Kennels, who created the breed. The weight-by-age figures are a well-sourced estimate: each size’s representative adult weight scaled by growth data from more than 60,000 healthy dogs, capped at the adult weight. Because the Bernedoodle is a mix, individual dogs vary more than a purebred, so weigh your own puppy and go by the parents.' },
      ]}
      sources={[
        { name: 'SwissRidge Kennels (originator of the Bernedoodle), Bernedoodle sizes (Tiny, Miniature, Medium, Standard; height and weight ranges).', url: 'https://swissridgekennels.com/swissridge/qa/' },
        { name: 'American Kennel Club, Bernese Mountain Dog breed standard (males 80–115 lb, 25–27.5 in; females 70–95 lb, 23–26 in).', url: 'https://www.akc.org/dog-breeds/bernese-mountain-dog/' },
        { name: 'American Kennel Club, Poodle (Standard) breed standard (over 15 in; males ~60–70 lb, females ~40–50 lb).', url: 'https://www.akc.org/dog-breeds/poodle-standard/' },
        { name: 'Salt C, Morris PJ, German AJ, et al. Growth standard charts for monitoring bodyweight in dogs. PLoS ONE 2017;12(9):e0182064.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5584974/' },
      ]}
      related={['goldendoodle-size-chart', 'puppy-weight-calculator', 'dog-crate-size-chart', 'dog-harness-size-chart']}
    />
  );
}
