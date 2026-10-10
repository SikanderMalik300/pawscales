import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { DOG_YEARS } from '@/lib/constants';
import { ToolPage, toolMetadata } from '@/components/ToolPage';
import { DogYearsCalculator } from '@/components/tools/DogYearsCalculator';
import { DataTable } from '@/components/ui/Table';

const tool = bySlug('dog-years-calculator')!;
export const metadata: Metadata = toolMetadata(tool);

const chart = DOG_YEARS.chart;

export default function Page() {
  return (
    <ToolPage
      slug={tool.slug}
      quickAnswer={
        <>A 5-year-old medium dog is about 36 in human years; a 2020 DNA study puts
        it near 57. Dog aging is fast early then slows, and big dogs age quicker
        than small ones. Enter your dog's age and weight for a size-based number
        plus the DNA-based estimate.</>
      }
      calculator={<DogYearsCalculator />}
      howTo={[
        "Enter your dog's age in years.",
        "Enter the adult weight so we can set the size band (small ≤20 lb, medium 21–50, large 51–100, giant >100).",
        'Read the human-year age from the size chart, plus the DNA-based estimate.',
      ]}
      formula={
        <>
          <p>
            Method 1 is a size-based chart (AVMA-style): the first year counts for
            about 15 human years, the second adds about 9 more, and later years add
            4 to 11 depending on size. We interpolate between whole years. Method 2
            is the 2020 epigenetic formula <strong>human = 16 × ln(dog age) + 31</strong>,
            from DNA methylation in Labrador Retrievers, valid from age 1.
          </p>
          <p>
            <strong>Example 1.</strong> A 5-year-old, 40 lb (medium) dog is 36 human
            years on the chart. The DNA formula gives 16 × ln 5 + 31 = 56.75, about 57.
          </p>
          <p>
            <strong>Example 2.</strong> A 10-year-old, 75 lb (large) dog is 66 human
            years on the chart. The DNA formula gives 16 × ln 10 + 31 = 67.84, about 68.
          </p>
        </>
      }
      notCovered={[
        'Individual health, which matters more than any formula.',
        'Mixed-size dogs; use the adult weight to pick the band.',
        'The “7 years” rule, which is wrong: it overstates early years and understates old age.',
      ]}
      tables={
        <DataTable
          caption="Dog age in human years, by size"
          columns={[
            { key: 'age', header: 'Dog age (years)' },
            { key: 'small', header: 'Small', numeric: true },
            { key: 'medium', header: 'Medium', numeric: true },
            { key: 'large', header: 'Large', numeric: true },
            { key: 'giant', header: 'Giant', numeric: true },
          ]}
          rows={chart.small.map((_, i) => ({
            cells: {
              age: `${i + 1}`,
              small: `${chart.small[i]}`,
              medium: `${chart.medium[i]}`,
              large: `${chart.large[i]}`,
              giant: `${chart.giant[i]}`,
            },
          }))}
          source={
            <>Source: AVMA size-based dog age chart. Small ≤20 lb, medium 21–50, large 51–100, giant &gt;100 lb.</>
          }
        />
      }
      tips={[
        'Use adult weight, not current puppy weight, to pick the size band.',
        'Big dogs cross into “senior” earlier, often around 6 to 7 years, while small dogs may not until 9 or 10.',
        'The DNA formula was built on Labradors, so treat it as a second opinion next to the size chart.',
      ]}
      faq={[
        { q: 'Is one dog year really 7 human years?', a: 'No. The 7-year rule is a rough average that gets both ends wrong. A dog’s first year is closer to 15 human years, and the pace then slows and depends on size. Our chart and the DNA formula both show this curve instead of a flat multiplier.' },
        { q: 'How old is a 2-year-old dog in human years?', a: 'About 24 human years for most sizes. The first two years pack in the fastest aging: roughly 15 human years in year one and about 9 more in year two. After that, each dog year adds 4 to 11 human years depending on the dog’s size.' },
        { q: 'Why do big dogs age faster?', a: 'Large and giant breeds grow for longer and tend to have shorter lifespans, so they move through the aging curve more quickly. By 10 years a small dog is about 56 in human years, a large dog about 66, and a giant breed about 79 on the chart.' },
        { q: 'What is the new DNA formula?', a: 'In 2020, researchers compared DNA methylation in dogs and humans and produced human = 16 × ln(dog age) + 31. It fits the fast-early, slow-later pattern well and is valid from age 1. It was built mainly on Labrador Retrievers, so individual breeds vary.' },
        { q: 'At what age is a dog a senior?', a: 'It depends on size. Many large dogs are considered senior around 6 to 7 years, while small dogs often reach that stage closer to 9 or 10. Senior care is usually framed as the last quarter of a dog’s expected lifespan, which is shorter for bigger breeds.' },
        { q: 'Do dog years work for puppies?', a: 'Under a year, aging is extremely fast, so a single number is rough. The chart interpolates from birth to the one-year value (15 human years for most sizes, 12 for giants). The DNA formula only becomes meaningful at age 1 and above.' },
      ]}
      sources={[
        { name: 'AVMA, selecting and caring for a dog (size-based human-age chart).', url: 'https://www.avma.org/resources-tools/pet-owners/petcare/selecting-pet-dog' },
        { name: 'Wang T, et al. Quantitative translation of dog-to-human aging. Cell Systems 2020;11(2):176–185. DOI 10.1016/j.cels.2020.06.006.', url: 'https://doi.org/10.1016/j.cels.2020.06.006' },
        { name: 'AAHA 2019 Canine Life Stage Guidelines.', url: 'https://www.aaha.org/resources/life-stage-canine-2019/canine-life-stage-definitions/' },
      ]}
    />
  );
}
