import type { Metadata } from 'next';
import { HubPage, hubMetadata } from '@/components/HubPage';

export const metadata: Metadata = hubMetadata('dog-size-charts');

export default function Page() {
  return (
    <HubPage
      slug="dog-size-charts"
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
