import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { ToolPage, toolMetadata } from '@/components/ToolPage';
import { HeatCalculator } from '@/components/tools/HeatCalculator';
import { DataTable } from '@/components/ui/Table';
import { SIZE_BANDS } from '@/lib/calc/heatCycle';

const tool = bySlug('dog-heat-cycle-calculator')!;
export const metadata: Metadata = toolMetadata(tool);

const MERCK_REPRO = 'https://www.merckvetmanual.com/dog-owners/reproductive-disorders-of-dogs/management-of-reproduction-in-dogs';
const MERCK_FEMALE = 'https://www.merckvetmanual.com/dog-owners/reproductive-disorders-of-dogs/reproductive-disorders-of-female-dogs';
const AKC_HEAT = 'https://www.akc.org/expert-advice/dog-breeding/dogs-in-heat/';

export default function Page() {
  return (
    <ToolPage
      slug={tool.slug}
      quickAnswer={
        <>A dog&rsquo;s heat cycle has four stages and the visible, bloody part lasts
        about 2 to 3 weeks. Most dogs come into heat about every 7 months, with 4 to 13
        months all normal. Pick her size and the first day of her last heat for a dated
        timeline of this cycle and a window for the next one.</>
      }
      calculator={<HeatCalculator />}
      howTo={[
        'Pick her size. It sets the typical age of a first heat and how often she cycles.',
        'Choose whether she has had a heat yet.',
        'If she has, enter the first day of her last heat, when bleeding or swelling started.',
        'Read the dated, stage-by-stage timeline and the window for her next heat.',
      ]}
      formula={
        <>
          <p>
            We lay out the four stages from the first day of the last heat using the
            average lengths in the Merck Veterinary Manual: <strong>proestrus</strong>{' '}
            about 9 days, <strong>estrus</strong> about 9 days, <strong>diestrus</strong>{' '}
            about 2 months, then <strong>anestrus</strong> until the next heat. The next
            heat is set at the typical interval for her size (about 7 months for most
            dogs, 9 to 12 for giant breeds), inside a normal 4-to-13-month window. Stages
            are shown as date ranges, not single days.
          </p>
          <p>
            <strong>Example 1.</strong> A medium dog whose last heat started September 15,
            2026: proestrus Sep 15 to 24, estrus Sep 24 to Oct 3, diestrus to early
            December, next heat most likely around April 15, 2027.
          </p>
          <p>
            <strong>Example 2.</strong> A giant-breed dog from the same date: the next
            heat window runs roughly June to September 2027, since giant breeds often go
            9 to 12 months between heats.
          </p>
        </>
      }
      notCovered={[
        'Preventing pregnancy. Keep an intact female away from intact males through the whole heat.',
        'Pinpointing the fertile days, which only a vet progesterone test can do.',
        'Irregular, silent or split heats, which need a vet to track.',
        'Spaying timing; ask your vet.',
        'Cats, which cycle differently.',
      ]}
      seeVet={
        <>
          Bleeding or discharge lasts <strong>more than about 3 weeks</strong>, she{' '}
          <strong>seems unwell</strong> (lethargy, poor appetite, drinking or urinating
          more, or vomiting), or there is a <strong>cloudy or bloody discharge between
          heats</strong>, especially 4 to 6 weeks after a heat. These can mean pyometra, a
          uterine infection that is an emergency and needs a vet straight away ({' '}
          <a className="link" href={MERCK_FEMALE}>Merck Veterinary Manual</a>).
        </>
      }
      tables={
        <>
          <section>
            <h2 className="text-[22px] sm:text-[26px]">The 4 stages of a dog&rsquo;s heat cycle</h2>
            <div className="mt-3">
              <DataTable
                caption="The four stages, with lengths and signs"
                tableCaption="Stages of a dog heat cycle: typical length, range and signs"
                columns={[
                  { key: 'stage', header: 'Stage' },
                  { key: 'typ', header: 'Typical' },
                  { key: 'range', header: 'Range' },
                  { key: 'signs', header: 'Signs' },
                ]}
                rows={[
                  { cells: { stage: 'Proestrus', typ: 'About 9 days', range: '2 days to 3 weeks', signs: 'Swollen vulva, bloody discharge; males interested, she is not receptive' } },
                  { cells: { stage: 'Estrus', typ: 'About 9 days', range: '3 days to 3 weeks', signs: 'Fertile and receptive; discharge often lightens' } },
                  { cells: { stage: 'Diestrus', typ: 'About 2 months', range: '(non-pregnant)', signs: 'Cycle winds down; no longer receptive' } },
                  { cells: { stage: 'Anestrus', typ: '1 to 6 months', range: 'to the next heat', signs: 'Reproductive rest; no signs' } },
                ]}
                source={<>Source: <a className="link" href={MERCK_REPRO}>Merck Veterinary Manual (owner), Management of Reproduction in Dogs</a>.</>}
              />
            </div>
          </section>

          <section>
            <h2 className="text-[22px] sm:text-[26px]">How long is a dog&rsquo;s heat cycle?</h2>
            <p className="mt-2 text-[16px] text-ink">
              The visible heat, proestrus plus estrus, lasts about <strong>2 to 3
              weeks</strong>. Proestrus (swelling and bleeding) runs about 9 days, and the
              fertile estrus phase adds about 9 more; each can range from a few days to 3
              weeks (Merck Veterinary Manual). The full cycle, through diestrus and
              anestrus, spans the whole interval between heats, which averages about 7
              months.
            </p>
          </section>

          <section>
            <h2 className="text-[22px] sm:text-[26px]">How often do dogs go into heat?</h2>
            <p className="mt-2 text-[16px] text-ink">
              Most dogs cycle about <strong>every 7 months</strong>, and anywhere from{' '}
              <strong>4 to 13 months</strong> is normal (Merck Veterinary Manual). Some
              large and giant breeds, such as Great Danes, cycle only every 9 to 12 months.
              Young dogs are often irregular at first and settle into their own pattern
              after a few cycles, so marking each heat on a calendar is the best guide.
            </p>
          </section>

          <section>
            <h2 className="text-[22px] sm:text-[26px]">When does a puppy have her first heat?</h2>
            <p className="mt-2 text-[16px] text-ink">
              First heat comes earlier in small dogs and later in large and giant breeds.
              Some dogs start as early as 4 months, and a few giant breeds not until they
              are over 2 years old (AKC).
            </p>
            <div className="mt-3">
              <DataTable
                caption="Typical age at first heat by size"
                tableCaption="Age at first heat and cycle interval by dog size"
                columns={[
                  { key: 'size', header: 'Size' },
                  { key: 'first', header: 'First heat' },
                  { key: 'interval', header: 'How often after that' },
                ]}
                rows={SIZE_BANDS.map((s) => ({
                  cells: {
                    size: s.label,
                    first: s.firstHeat.replace(/^about /, ''),
                    interval: s.value === 'giant' ? '9 to 12 months' : s.value === 'large' ? 'about 7 months (some 9 to 12)' : 'about 7 months',
                  },
                }))}
                source={
                  <>
                    First heat: <a className="link" href={AKC_HEAT}>AKC, How Often Do Dogs Go Into Heat?</a>{' '}
                    Interval: <a className="link" href={MERCK_REPRO}>Merck Veterinary Manual</a> (4 to 13 months, average 7; large breeds 9 to 12).
                  </>
                }
              />
            </div>
          </section>

          <section>
            <h2 className="text-[22px] sm:text-[26px]">Signs your dog is in heat</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[16px] text-ink">
              <li>A swollen vulva, often the first thing owners notice.</li>
              <li>A bloody or straw-coloured discharge (she may keep herself clean).</li>
              <li>More licking of the area, and more frequent urination or marking.</li>
              <li>Male dogs showing a lot of interest.</li>
              <li>Behaviour changes: clingy or restless, and &ldquo;flagging&rdquo; (moving the tail aside) once she is receptive.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[22px] sm:text-[26px]">Heat vs. a human period</h2>
            <p className="mt-2 text-[16px] text-ink">
              A dog&rsquo;s heat is not the same as a human period. In people, bleeding
              happens when the lining of the uterus is shed because there was no pregnancy.
              In dogs, the bleeding comes at the <strong>start</strong> of the cycle, during
              proestrus, and leads up to ovulation and the fertile window, so it is closer
              to the fertile part of a human cycle than to a period. Dogs do not menstruate
              monthly; they cycle about twice a year. So &ldquo;dog period&rdquo; usually
              means a heat.
            </p>
          </section>
        </>
      }
      tips={[
        'Mark the first day of bleeding on a calendar each cycle. After two or three heats you will know her personal interval.',
        'The fertile window is only an average. For planned breeding, progesterone testing at the vet pinpoints ovulation.',
        'A bitch can still get pregnant late in estrus, so keep her fully separated from intact males until the heat has clearly ended.',
        'If she was bred, our dog pregnancy calculator maps the due date from the mating.',
      ]}
      faq={[
        { q: 'How long is a dog in heat?', a: 'The visible heat (proestrus plus estrus) lasts about 2 to 3 weeks. Proestrus, with swelling and bleeding, runs about 9 days, then the fertile estrus phase adds about 9 more. Both stages can range from a few days to 3 weeks, so watch the signs, not just the calendar.' },
        { q: 'How often do dogs go into heat?', a: 'About every 7 months on average, with a normal range of 4 to 13 months (Merck Veterinary Manual). Some large and giant breeds, like Great Danes, cycle only every 9 to 12 months. Young dogs are often irregular at first and settle into a pattern after a few cycles.' },
        { q: 'At what age does a dog have her first heat?', a: 'It depends on size (AKC): small dogs around 6 to 7 months, medium dogs 7 to 9 months, and large breeds 12 to 16 months. Some dogs start as early as 4 months, and a few giant breeds not until they are over 2 years old. Early cycles are often irregular.' },
        { q: 'What are the stages of a dog heat cycle?', a: 'Four stages: proestrus (about 9 days of swelling and bleeding), estrus (about 9 days, the fertile window), diestrus (about 2 months as the cycle winds down), and anestrus (reproductive rest, 1 to 6 months, until the next heat).' },
        { q: 'When is a dog most fertile?', a: 'Usually during estrus, roughly the second week after bleeding starts, but ovulation timing varies a lot between dogs. Dates alone cannot pinpoint it; the reliable way is progesterone testing at the vet, which matters most for planned breeding.' },
        { q: 'Do dogs have periods?', a: 'Not in the human sense. The bleeding in a dog comes at the start of her heat, during proestrus, leading up to ovulation, rather than from shedding the uterine lining after no pregnancy. Dogs cycle about twice a year, not monthly, so a "dog period" is really a heat.' },
      ]}
      sources={[
        { name: 'Merck Veterinary Manual (owner), Management of Reproduction in Dogs (stage lengths; interval 4 to 13 months, average 7; large breeds 9 to 12; anestrus 1 to 6 months).', url: MERCK_REPRO },
        { name: 'Merck Veterinary Manual (owner), Reproductive Disorders of Female Dogs (pyometra signs and timing).', url: MERCK_FEMALE },
        { name: 'American Kennel Club, How Often Do Dogs Go Into Heat? (age at first heat by size).', url: AKC_HEAT },
      ]}
    />
  );
}
