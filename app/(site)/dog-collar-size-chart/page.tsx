import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { COLLAR_SIZES, BREED_NECKS } from '@/lib/calc/collar';
import { ToolPage, toolMetadata } from '@/components/ToolPage';
import { CollarCalculator } from '@/components/tools/CollarCalculator';
import { DataTable } from '@/components/ui/Table';

const tool = bySlug('dog-collar-size-chart')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage
      slug={tool.slug}
      quickAnswer={
        <>Measure your dog's neck where the collar sits and add about 2 inches, so
        two fingers fit under the collar. A 14-inch neck needs a 16-inch collar.
        Enter the neck measurement for the collar length and the generic size band.</>
      }
      calculator={<CollarCalculator />}
      howTo={[
        'Measure around the neck where the collar normally sits, not up at the ears.',
        'Keep the tape snug but slip two fingers underneath.',
        'Enter the measurement in inches or centimeters.',
        'Read the collar length (neck + 2 in) and the size band it falls in.',
      ]}
      formula={
        <>
          <p>
            The rule is simple: <strong>collar length = neck + 2 inches</strong>, the
            two-finger rule. The extra room keeps the collar comfortable without
            slipping over the head. Sizes labelled XS to XXL vary between brands, so
            use the inches, not just the letter.
          </p>
          <p><strong>Example 1.</strong> A 14-inch neck needs a 16-inch collar.</p>
          <p><strong>Example 2.</strong> A 30 cm neck needs 30 + 5.08 = about a 35 cm collar.</p>
        </>
      }
      notCovered={[
        'Puppies, whose necks grow fast; re-measure every 2 weeks.',
        'Martingale and prong collars, which are fitted differently.',
        'Harness fit, which uses chest girth instead of neck.',
      ]}
      tables={
        <>
          <DataTable
            caption="Generic collar sizes by neck"
            columns={[{ key: 's', header: 'Size' }, { key: 'neck', header: 'Neck', numeric: true }]}
            rows={COLLAR_SIZES.map((s) => ({ cells: { s: s.size, neck: `${s.neckMinIn}–${s.neckMaxIn} in` } }))}
            source={<>Generic bands; sizes vary by brand, so check the brand’s own chart.</>}
          />
          <DataTable
            caption="Typical neck size by breed"
            columns={[{ key: 'breed', header: 'Breed' }, { key: 'neck', header: 'Neck (in)', numeric: true }]}
            rows={BREED_NECKS.map((b) => ({ cells: { breed: b.breed, neck: b.neck } }))}
            source={<>Typical adult neck ranges; always measure your own dog.</>}
          />
        </>
      }
      tips={[
        'Measure a bare neck, not over thick fur fluffed up, or the collar will end up loose.',
        'You should slide two fingers under a fitted collar. More than that and it can slip off.',
        'Re-check a puppy’s collar every couple of weeks; they outgrow them fast.',
        'For sighthounds and dogs whose head is narrower than their neck, consider a martingale.',
      ]}
      faq={[
        { q: 'What size collar does my dog need?', a: 'Measure around the neck where the collar sits and add 2 inches; that is the collar length to buy. The chart above maps neck size to a collar size from XS to XXL with breed examples, so a 14-inch neck is about a 16-inch collar, usually a Medium. Sizes vary by brand, so go by the inches rather than the label.' },
        { q: 'How do I measure my dog’s neck?', a: 'Wrap a soft tape around the neck where the collar sits, usually a little above the shoulders, and keep it snug while slipping two fingers underneath. Add 2 inches to that number for the collar length. A 14-inch neck means a 16-inch collar.' },
        { q: 'How tight should a collar be?', a: 'Snug enough that it will not slip over the head, loose enough to fit two fingers flat between the collar and the neck. Too tight rubs and restricts; too loose can catch or slide off. Re-check fit after grooming or weight changes.' },
        { q: 'What size collar for a puppy?', a: 'Measure the current neck and add 2 inches, but expect to resize often. Puppies outgrow collars every few weeks, so buy an adjustable one and check the fit regularly so it never gets tight as they grow.' },
        { q: 'Collar or harness?', a: 'A flat collar is fine for ID tags and relaxed walks. A harness takes pressure off the neck and suits dogs that pull, have breathing issues, or a narrow head. Many owners use a collar for tags and a harness for walks.' },
        { q: 'What size collar does a Lab need?', a: 'Most Labrador Retrievers have an 18 to 22-inch neck, so a collar around 20 to 24 inches fits, usually a Large. Always measure, since necks vary with build and coat. Add 2 inches to the measured neck for the collar length.' },
        { q: 'How do I know if a collar is too small?', a: 'If you cannot slip two fingers under it, or it leaves a mark, parts the fur in a line, or makes your dog cough, it is too tight. Loosen or size up. On puppies, check weekly because necks thicken quickly.' },
      ]}
      sources={[
        { name: 'American Kennel Club, how to measure your dog for a collar.', url: 'https://www.akc.org/expert-advice/lifestyle/how-to-measure-dog-collar-size/' },
      ]}
    />
  );
}
