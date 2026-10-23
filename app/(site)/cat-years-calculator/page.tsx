import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { ToolPage, toolMetadata } from '@/components/ToolPage';
import { CatYearsCalculator } from '@/components/tools/CatYearsCalculator';
import { DataTable } from '@/components/ui/Table';
import { catHumanYearsFromYears } from '@/lib/calc/catYears';

const tool = bySlug('cat-years-calculator')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage
      slug={tool.slug}
      quickAnswer={
        <>A cat's first year is about 15 human years, the second adds 9 more to
        reach 24, and every year after that is about 4 human years. So a 7-year-old
        cat is about 44, and a 6-month-old kitten is about 10. Enter your cat's age
        in this cat age calculator for the human-year equivalent.</>
      }
      calculator={<CatYearsCalculator />}
      howTo={[
        "Enter your cat's age, switching between years and months for kittens.",
        'Read the human-year equivalent and the life stage.',
        'Use months for cats under 2, where each month counts for a lot.',
      ]}
      formula={
        <>
          <p>
            We use International Cat Care's chart. The first year equals about 15
            human years and the second reaches 24 (so year two adds 9). From age 2,
            each cat year is about 4 human years, so the total is{' '}
            <strong>24 + 4 × (cat age − 2)</strong>. We interpolate between the early
            anchor points for kittens.
          </p>
          <p><strong>Example 1.</strong> A 7-year-old cat: 24 + 4 × (7 − 2) = 44 human years.</p>
          <p><strong>Example 2.</strong> A 6-month-old kitten is about 10 human years on the chart.</p>
        </>
      }
      notCovered={[
        'Breed differences in lifespan.',
        'Individual health, which matters more than age alone.',
        'The outdated “×7” rule, which does not fit how cats age.',
      ]}
      tables={
        <>
          <DataTable
            caption="Cat age in human years"
            tableCaption="Cat age in human years, from 1 month to 20 years"
            columns={[
              { key: 'cat', header: 'Cat age' },
              { key: 'human', header: 'Human years', numeric: true },
            ]}
            rows={[
              { cells: { cat: '1 month', human: '1' } },
              { cells: { cat: '3 months', human: '4' } },
              { cells: { cat: '6 months', human: '10' } },
              { cells: { cat: '1 year', human: '15' } },
              { cells: { cat: '18 months', human: '21' } },
              { cells: { cat: '2 years', human: '24' } },
              { cells: { cat: '3 years', human: '28' } },
              { cells: { cat: '5 years', human: '36' } },
              { cells: { cat: '10 years', human: '56' } },
              { cells: { cat: '15 years', human: '76' } },
              { cells: { cat: '20 years', human: '96' } },
            ]}
            source={<>Source: International Cat Care, cat age in human years.</>}
          />

          <section>
            <h2 className="text-[22px] sm:text-[26px]">Cat years to human years chart</h2>
            <p className="mt-2 text-[16px] text-ink">
              Every cat year from 1 to 20, in human years, from the same formula the
              calculator uses (15 at year 1, 24 at year 2, then about 4 human years a year).
            </p>
            <div className="mt-3">
              <DataTable
                caption="Cat years to human years (1 to 20)"
                tableCaption="Cat years to human years from 1 to 20 years"
                columns={[
                  { key: 'cat', header: 'Cat age (years)', numeric: true },
                  { key: 'human', header: 'Human years', numeric: true },
                ]}
                rows={Array.from({ length: 20 }, (_, i) => i + 1).map((y) => ({
                  cells: { cat: String(y), human: String(catHumanYearsFromYears(y)) },
                }))}
                source={<>Source: International Cat Care; from age 2, human years = 24 + 4 × (cat age − 2).</>}
              />
            </div>
          </section>
        </>
      }
      tips={[
        'For kittens, count in months. The jump from 3 to 6 months alone is like going from 4 to 10 human years.',
        'Indoor cats commonly live into their mid to late teens, so a 15-year-old cat (about 76 in human years) is not unusual.',
        'Watch for senior changes from about 10 years (56 human years): weight, thirst, and activity.',
      ]}
      faq={[
        { q: 'How old is a 1-year-old cat in human years?', a: 'About 15 human years. A cat’s first year packs in a huge amount of development, from newborn to full adolescence. The second year adds about 9 more to reach 24 by age 2, after which aging settles to roughly 4 human years per cat year.' },
        { q: 'How old is a 2-year-old cat in human years?', a: 'About 24 human years. By age two a cat has finished growing and is a young adult, like a person in their mid-twenties. From here each cat year adds about 4 human years.' },
        { q: 'How old is a 4-year-old cat in human years?', a: 'About 32 human years, a cat in its prime. On this chart a cat gains roughly 4 human years for every year after age two.' },
        { q: 'How old is a 10-year-old cat in human years?', a: 'About 56 human years. Around ten, cats are entering their senior years, so twice-yearly vet checks and attention to weight and kidneys help.' },
        { q: 'How old is a 12-year-old cat in human years?', a: 'About 64 human years, a senior cat. Many cats live well past this with good care; watch for changes in thirst, appetite and activity.' },
        { q: 'Do cats age faster than dogs?', a: 'Early on they age similarly, and both reach about 24 human years by age 2. After that, cats age at a fairly steady 4 human years per year, while large dogs age faster than small dogs. Small dogs and cats end up on a similar long-lived curve.' },
        { q: 'When is a cat a senior?', a: 'The 2021 feline life stage guidelines treat cats as mature adults from about 7 years and senior from about 10 to 11 years (roughly 56 to 60 in human years). Senior cats benefit from more frequent vet checks and attention to weight and kidney health.' },
        { q: 'How long do indoor cats live?', a: 'Many indoor cats live into their mid to late teens, and some reach their early 20s. A 20-year-old cat is about 96 in human years on this chart. Lifespan depends on genetics, weight, dental care and veterinary care.' },
        { q: 'How old is a 15-year-old cat?', a: 'About 76 human years. At this age a cat is a senior and may show changes in weight, appetite, thirst, grooming or activity. Twice-yearly vet visits help catch age-related conditions like kidney disease and arthritis early.' },
        { q: 'How do vets estimate a cat’s age?', a: 'For cats of unknown age, vets look at teeth (eruption and wear), eye clarity, coat condition and muscle tone. These give a range rather than an exact age. For kittens, body weight and development are the most useful clues.' },
      ]}
      sources={[
        { name: 'International Cat Care, how to tell your cat’s age in human years.', url: 'https://icatcare.org/advice/how-to-tell-your-cats-age-in-human-years/' },
        { name: 'AAHA/AAFP 2021 Feline Life Stage Guidelines.', url: 'https://www.aaha.org/aaha-guidelines/life-stage-feline-2021/feline-life-stage-home/' },
      ]}
    />
  );
}
