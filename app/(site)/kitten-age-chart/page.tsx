import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { ToolPage, toolMetadata } from '@/components/ToolPage';
import { KittenCalculator } from '@/components/tools/KittenCalculator';
import { DataTable } from '@/components/ui/Table';

const tool = bySlug('kitten-age-chart')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage
      slug={tool.slug}
      quickAnswer={
        <>You can estimate a kitten's age from weight, eyes, ears and teeth. A
        newborn weighs 3–4 oz, eyes open at 7–10 days, ears stand up by about 3
        weeks, and a kitten reaches about 1 lb at 4 weeks. Tick what you can see
        for an age range in weeks.</>
      }
      calculator={<KittenCalculator />}
      howTo={[
        'Weigh the kitten if you can (ounces or grams). It helps most after 4 weeks.',
        'Tick the signs you can see: eyes open, ears up, which teeth are through, and whether it walks steadily.',
        'Read the age range in weeks and which signs drove it.',
      ]}
      formula={
        <>
          <p>
            We combine Alley Cat Allies' milestones. Each sign has an age it first
            appears, and weight after 4 weeks follows about 4–6 oz gained per week
            from 1 lb: <strong>weeks ≈ 4 + (weight in oz − 16) ÷ 5</strong>, shown as
            a range using 4 and 6 oz/week. Signs set the lower bound; weight sets the
            estimate once a kitten passes 4 weeks. Past 8 weeks, see the{' '}
            <a className="link" href="/cat-weight-chart/">cat weight chart</a> for
            typical weight by month.
          </p>
          <p>
            <strong>Example 1.</strong> A 24 oz kitten with eyes open, ears up, and
            incisors and canines through: weight gives 4 + 8/6 to 4 + 8/4, about 5.3
            to 6.0 weeks, and the teeth agree, so about 5 to 6 weeks.
          </p>
          <p>
            <strong>Example 2.</strong> An 8 oz kitten with eyes just opening and no
            teeth is about 1 to 1½ weeks.
          </p>
        </>
      }
      notCovered={[
        'Health checks; a kitten that seems sick needs a vet now.',
        'Orphan kitten feeding amounts; follow a sourced bottle-feeding guide.',
        'Kittens older than about 6 months, where adult teeth are all in.',
      ]}
      tables={
        <>
          <DataTable
            caption="Kitten age, week by week"
            columns={[
              { key: 'age', header: 'Age' },
              { key: 'weight', header: 'Weight', numeric: true },
              { key: 'signs', header: 'What you see' },
            ]}
            rows={[
              { cells: { age: 'Under 12 hours', weight: '3–4 oz', signs: 'Umbilical cord still wet' } },
              { cells: { age: '1–5 days', weight: '3–5 oz', signs: 'Cord dried and dropping off' } },
              { cells: { age: '1 week', weight: '≈8 oz', signs: 'Eyes start to open (7–10 days)' } },
              { cells: { age: '2–3 weeks', weight: '9–12 oz', signs: 'Incisors come in (2½–3½ weeks)' } },
              { cells: { age: '3 weeks', weight: '12–14 oz', signs: 'Ears upright; canines come in (3–4 weeks)' } },
              { cells: { age: '4 weeks', weight: '≈1 lb', signs: 'Walking, tail up; starts to explore' } },
              { cells: { age: '5–8 weeks', weight: '1–2 lb', signs: 'Premolars in; all baby teeth by 8 weeks' } },
            ]}
            footnote="After 4 weeks, kittens gain about 4–6 oz per week. Weight alone isn’t accurate before 2–3 weeks."
            source={<>Source: Alley Cat Allies, Determining a Kitten’s Age.</>}
          />
          <DataTable
            caption="When adult teeth come in"
            columns={[
              { key: 'tooth', header: 'Teeth' },
              { key: 'age', header: 'Age', numeric: true },
            ]}
            rows={[
              { cells: { tooth: 'Incisors', age: '3–3½ months' } },
              { cells: { tooth: 'Canines', age: '3–4 months' } },
              { cells: { tooth: 'Premolars', age: '4½–6 months' } },
              { cells: { tooth: 'Molars', age: '5–6 months' } },
              { cells: { tooth: 'All adult teeth in', age: 'By 6 months' } },
            ]}
            source={<>Source: Alley Cat Allies, Determining a Kitten’s Age.</>}
          />
        </>
      }
      tips={[
        'If weight and teeth disagree, trust the teeth. Growth varies with nutrition, especially in orphans.',
        'Weigh daily for orphan kittens; steady gain (about ½ oz a day early on) is a good sign.',
        'Eyes are blue and ears are folded in the first couple of weeks, then both change around 3 weeks.',
      ]}
      faq={[
        { q: 'How can you tell how old a kitten is?', a: 'Use weight, eyes, ears and teeth together. Newborns weigh 3–4 oz with closed eyes; eyes open at 7–10 days; ears stand up by about 3 weeks; a kitten hits about 1 lb at 4 weeks. Teeth are the most reliable clue once they start coming in around 2½ weeks.' },
        { q: 'How much should a 4-week-old kitten weigh?', a: 'About 1 pound (around 14 to 16 oz). From there, kittens gain roughly 4 to 6 oz a week, so a 5-week-old is often 18 to 22 oz. Use weight alongside teeth and behavior, since individual kittens vary.' },
        { q: 'When do kittens open their eyes?', a: 'Between 7 and 10 days old. The eyes are blue at first and change to their adult color over the following weeks. If a kitten’s eyes are open, it is at least a week old, which helps narrow down a young kitten’s age.' },
        { q: 'When do kittens get their teeth?', a: 'Baby incisors come in around 2½ to 3½ weeks, canines (fangs) at 3 to 4 weeks, and premolars from about 5 weeks. All baby teeth are usually in by 8 weeks. Adult teeth then replace them between about 3 and 6 months.' },
        { q: 'When can kittens leave their mother?', a: 'Not before 8 weeks, and many shelters wait until 10 to 12 weeks. Kittens need this time to wean, learn from their mother and littermates, and build social skills. Early separation is linked to behavior problems later.' },
        { q: 'When do kittens lose baby teeth?', a: 'Baby teeth start falling out around 3 to 4 months as the adult set pushes through. Incisors go first, then canines and premolars, with all 30 adult teeth usually in by about 6 months. You may find tiny teeth or none at all, as many are swallowed.' },
      ]}
      sources={[
        { name: 'Alley Cat Allies, Determining a Kitten’s Age.', url: 'https://www.alleycat.org/resources/how-to-determine-a-kittens-age/' },
      ]}
    />
  );
}
