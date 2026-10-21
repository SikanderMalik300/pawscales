import type { Metadata } from 'next';
import { HubPage, hubMetadata } from '@/components/HubPage';

export const metadata: Metadata = hubMetadata('dog-size-charts');

export default function Page() {
  return (
    <HubPage
      slug="dog-size-charts"
      intro={
        <>
          <p>
            This page helps you buy the right size for your dog the first time. There are
            finders for a crate, a collar and a harness, each with the exact way to measure
            and what to add, plus the size in several brands&rsquo; own charts where there
            is no industry standard. Alongside them are breed growth charts, from Golden
            Retrievers and German Shepherds to the popular doodles, that show expected
            weight by age so you can see where a puppy sits on its curve.
          </p>
          <p>
            Which one do you need? For a crate, measure your dog nose to tail base and use
            the crate chart. For walking gear, measure the neck for a collar and the chest
            girth for a harness, then compare across brands. If you have a puppy and want
            to plan ahead, open its breed growth chart or the puppy weight calculator to
            estimate the adult size before you buy the final crate or harness. Sizes vary
            by maker, so we always show the measurement in inches, not just a label.
          </p>
        </>
      }
      whichTool={[
        { need: 'Pick the right crate size', tool: 'dog-crate-size-chart' },
        { need: 'Size a collar from the neck', tool: 'dog-collar-size-chart' },
        { need: 'Compare harness sizes across brands', tool: 'dog-harness-size-chart' },
      ]}
      faq={[
        { q: 'How do I measure my dog?', a: 'For a crate, measure nose to tail base and floor to head. For a collar, measure around the neck where it sits. For a harness, measure the chest girth behind the front legs. Each tool explains the exact method and what to add.' },
        { q: 'Why do sizes differ between brands?', a: 'There is no industry standard, so a “Medium” varies from maker to maker. That is why we show the measurement in inches and, for harnesses, the size in each brand’s own chart rather than a single label.' },
        { q: 'Should I size up if my dog is between sizes?', a: 'For crates and harnesses, yes, then adjust. A slightly larger harness with snug straps is more comfortable than a tight one, and a divider shrinks a crate for a growing puppy.' },
      ]}
    />
  );
}
