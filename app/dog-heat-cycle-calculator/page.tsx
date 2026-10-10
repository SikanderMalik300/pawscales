import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { ToolPage, toolMetadata } from '@/components/ToolPage';
import { HeatCalculator } from '@/components/tools/HeatCalculator';
import { DataTable } from '@/components/ui/Table';

const tool = bySlug('dog-heat-cycle-calculator')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage
      slug={tool.slug}
      quickAnswer={
        <>Dogs come into heat about every 7 months, ranging from 4 to 13. From a
        heat that started October 1, the fertile window is roughly October 10–18
        and the next heat is likely around May 1. Enter the first day of her last
        heat to map the cycle.</>
      }
      calculator={<HeatCalculator />}
      howTo={[
        'Enter the first day of her last heat, the day bleeding started.',
        'If you know her usual interval, enter it in months (4–13). Otherwise we use the 7-month average.',
        'Read the proestrus and fertile windows, and the most likely next heat with its range.',
      ]}
      formula={
        <>
          <p>
            A heat has stages: <strong>proestrus</strong> (swelling and bleeding,
            about 9 days), then <strong>estrus</strong> (the fertile window, about 9
            more days), then diestrus. We mark proestrus as days 1–9 and the fertile
            window as days 10–18, and set the next heat at your interval, or 7 months
            by default, with a 4-to-13-month range.
          </p>
          <p><strong>Example 1.</strong> Heat started October 1, 2026 gives proestrus Oct 1–9, fertile window about Oct 10–18, next heat about May 1, 2027 (range Feb 1 to Nov 1).</p>
          <p><strong>Example 2.</strong> Started January 31, 2027 with a 6-month interval gives next heat July 31, 2027.</p>
        </>
      }
      notCovered={[
        'Preventing pregnancy. Keep an intact female away from intact males through the whole heat.',
        'Spaying timing; ask your vet and see the AAHA guidelines.',
        'Irregular or silent heats, which need a vet to track with progesterone tests.',
        'Cats, which cycle differently.',
      ]}
      tables={
        <DataTable
          caption="Stages of a heat cycle"
          columns={[
            { key: 'stage', header: 'Stage' },
            { key: 'length', header: 'Typical length' },
            { key: 'signs', header: 'What happens' },
          ]}
          rows={[
            { cells: { stage: 'Proestrus', length: 'About 9 days (2 days–3 weeks)', signs: 'Swollen vulva, bloody discharge; attracts males but not receptive' } },
            { cells: { stage: 'Estrus', length: 'About 9 days (3 days–3 weeks)', signs: 'Fertile and receptive; discharge lightens' } },
            { cells: { stage: 'Diestrus', length: 'About 2 months', signs: 'Cycle winds down, whether or not she is pregnant' } },
            { cells: { stage: 'Anestrus', length: 'Rest of the interval', signs: 'Quiet phase until the next heat' } },
          ]}
          source={<>Source: Merck Veterinary Manual (owner), Management of reproduction in dogs.</>}
        />
      }
      tips={[
        'Mark the first day of bleeding on a calendar each cycle. After two or three heats you will know her personal interval.',
        'The fertile window is only an average. For planned breeding, progesterone testing pinpoints ovulation.',
        'A bitch can still get pregnant late in estrus, so keep her separated until heat fully ends.',
      ]}
      faq={[
        { q: 'How long is a dog in heat?', a: 'The visible heat (proestrus plus estrus) lasts about 2 to 3 weeks. Proestrus, with swelling and bleeding, runs about 9 days, then the fertile estrus phase adds about 9 more. Both stages can range from a few days to 3 weeks, so watch the signs, not just the calendar.' },
        { q: 'How often do dogs go into heat?', a: 'About every 7 months on average, with a normal range of 4 to 13 months. Some large breeds, like Great Danes, cycle only every 9 to 12 months. Young dogs are often irregular at first and settle into a pattern after a few cycles.' },
        { q: 'When is a dog most fertile?', a: 'Usually during estrus, roughly days 10 to 18 after bleeding starts, but ovulation timing varies a lot between dogs. The only reliable way to pin down the fertile days is progesterone testing at the vet, which matters most for planned breeding.' },
        { q: 'What are the stages of a heat cycle?', a: 'Four stages: proestrus (about 9 days of swelling and bleeding), estrus (about 9 days, the fertile window), diestrus (about 2 months as the cycle winds down), and anestrus (the quiet phase until the next heat). The interval between heats averages 7 months.' },
        { q: 'At what age does a dog have her first heat?', a: 'Most dogs have a first heat between about 6 and 12 months, though small breeds can start earlier and large breeds later, sometimes up to 18–24 months. Early cycles are often irregular, so expect a settled pattern only after the first few.' },
        { q: 'Can a dog get pregnant outside the fertile window?', a: 'It is unlikely but not impossible. Because sperm can survive several days and ovulation timing varies, a mating late in proestrus or in estrus can still result in a pregnancy. Keep an intact female fully separated from intact males until the heat has clearly ended.' },
      ]}
      sources={[
        { name: 'Merck Veterinary Manual (owner), Management of reproduction in dogs.', url: 'https://www.merckvetmanual.com/dog-owners/reproductive-disorders-of-dogs/management-of-reproduction-in-dogs' },
      ]}
    />
  );
}
