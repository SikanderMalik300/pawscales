import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { HARNESS_BRANDS } from '@/lib/data/harnessSizes';
import { ToolPage, toolMetadata } from '@/components/ToolPage';
import { HarnessCalculator } from '@/components/tools/HarnessCalculator';
import { DataTable } from '@/components/ui/Table';

const tool = bySlug('dog-harness-size-chart')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage
      slug={tool.slug}
      quickAnswer={
        <>Measure your dog's chest girth at the widest point behind the front legs,
        then compare it with each brand's chart, because sizes differ. A 22-inch
        girth is a Ruffwear XS, a Rabbitgoo S, and a Kurgo S. Enter the girth to see
        your size in each brand.</>
      }
      calculator={<HarnessCalculator />}
      howTo={[
        'Measure the chest girth: wrap a soft tape around the widest part of the ribcage, just behind the front legs.',
        'Keep it snug but not tight.',
        'Enter the girth in inches or centimeters.',
        'Read the matching size for each brand, and watch for a "between sizes" flag.',
      ]}
      formula={
        <>
          <p>
            Harness sizing is by <strong>chest girth</strong>, not weight, because
            two dogs of the same weight can have very different chests. We compare
            your girth against each brand's published size ranges and flag when you
            are within an inch of a size boundary, where the next size up often fits
            better.
          </p>
          <p><strong>Example 1.</strong> A 22-inch girth: Ruffwear XS, Rabbitgoo S, Kurgo S.</p>
          <p><strong>Example 2.</strong> A 30-inch girth: Ruffwear M, Rabbitgoo L, Kurgo L.</p>
        </>
      }
      notCovered={[
        'Custom or made-to-measure harnesses.',
        'Medical, mobility or support harnesses, which are fitted by a professional.',
        'Cats.',
      ]}
      tables={
        <>
          {HARNESS_BRANDS.map((b) => (
            <DataTable
              key={b.brand}
              caption={`${b.brand} ${b.model}`}
              columns={[{ key: 's', header: 'Size' }, { key: 'g', header: 'Chest girth', numeric: true }]}
              rows={b.sizes.map((s) => ({ cells: { s: s.size, g: `${s.girthMinIn}–${s.girthMaxIn} in` } }))}
              source={<>Source: <a className="link" href={b.url}>{b.brand} official size guide</a>.</>}
            />
          ))}
        </>
      }
      tips={[
        'If you are between sizes, size up and tighten the straps. A too-small harness rubs behind the legs.',
        'Check the fit: two fingers should slide under any strap, and the harness should not shift when your dog moves.',
        'Re-measure growing puppies often, and after a big weight change.',
        'Some brands also use neck size. If a brand lists both, make sure both fit.',
      ]}
      faq={[
        { q: 'How do I measure a dog for a harness?', a: 'Measure the chest girth: wrap a soft tape around the widest part of the ribcage, just behind the front legs, and keep it snug. Some harnesses also use a neck measurement. Compare your numbers with the specific brand’s chart, since sizes differ a lot between makers.' },
        { q: 'What if my dog is between sizes?', a: 'Size up, then tighten the adjustment straps. A slightly larger harness with snug straps is more comfortable than a small one that digs in behind the legs. This tool flags when your girth is within an inch of a size boundary.' },
        { q: 'How tight should a harness be?', a: 'Snug but not restrictive. You should be able to slide two fingers flat under any strap, and the harness should not slip or rotate when your dog moves or pulls. Check especially behind the front legs, where a tight harness rubs.' },
        { q: 'Front-clip vs back-clip?', a: 'A back-clip is comfortable and easy for relaxed walkers. A front-clip gives more steering for dogs that pull, by turning them toward you. Many no-pull harnesses offer both rings. Fit matters more than clip position, so size correctly first.' },
        { q: 'What size harness for a puppy?', a: 'Measure the current chest girth and pick the brand size that fits now, not the adult size. Puppies grow fast, so expect to resize. An adjustable harness buys some time, but recheck the fit every couple of weeks.' },
        { q: 'Harness size by weight: does it work?', a: 'Weight is only a rough guide. Two 40-pound dogs can have very different chests, so a weight-based size often misses. Always measure chest girth and use the brand’s girth ranges, which is what this tool does.' },
      ]}
      sources={HARNESS_BRANDS.map((b) => ({ name: `${b.brand} ${b.model} official size guide.`, url: b.url }))}
    />
  );
}
