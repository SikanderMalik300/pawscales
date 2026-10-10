import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { ToolPage, toolMetadata } from '@/components/ToolPage';
import { PregnancyCalculator } from '@/components/tools/PregnancyCalculator';

const tool = bySlug('dog-pregnancy-calculator')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage
      slug={tool.slug}
      quickAnswer={
        <>Dogs are pregnant about 63 days. From a breeding on November 1, 2026, the
        due date is around January 3, 2027, give or take a week. Enter the breeding
        date for the due date, the normal range, and a week-by-week timeline of what
        happens when.</>
      }
      calculator={<PregnancyCalculator />}
      howTo={[
        'Enter the date of the first breeding.',
        'If you had a progesterone test, tick the ovulation box to narrow the range.',
        'Read the due date, the normal range, and the week-by-week timeline.',
        'Note the dates to prepare the whelping box and start taking temperature.',
      ]}
      formula={
        <>
          <p>
            Dogs whelp about <strong>63 days from the first breeding</strong>, give
            or take 7 days, because sperm can wait a few days for ovulation. From a
            progesterone-confirmed ovulation date it is 63 days give or take 2. We
            add 63 days to your date for the due date and show the normal window
            around it.
          </p>
          <p><strong>Example 1.</strong> Bred November 1, 2026 gives due January 3, 2027 (normal December 27 to January 10).</p>
          <p><strong>Example 2.</strong> Bred March 15, 2027 gives due May 17, 2027 (normal May 10 to May 24).</p>
        </>
      }
      notCovered={[
        'Confirming pregnancy. Only a vet can, by ultrasound (from about day 25), a relaxin blood test, or X-ray.',
        'False pregnancy, which can mimic the signs.',
        'Problems during whelping, which are emergencies.',
        'Cats. Use a cat guide for feline pregnancy.',
      ]}
      seeVet={
        <ul>
          <li>More than 30–60 minutes of strong straining with no puppy, or more than 2 hours between puppies.</li>
          <li>Green or bloody discharge before the first puppy.</li>
          <li>No labor 24 hours after the temperature drops below 99°F.</li>
          <li>Pregnancy going past day 70.</li>
        </ul>
      }
      tips={[
        'Start taking her temperature twice a day from about day 57. A drop below 99°F usually means whelping within 24 hours.',
        'Have the whelping box ready and familiar by day 55 so she settles in before labor.',
        'Ask your vet about an X-ray after day 55 to count the puppies and plan.',
        'Normal temperature is 100–102.5°F, so learn her baseline before the pre-labor drop.',
      ]}
      faq={[
        { q: 'How long are dogs pregnant?', a: 'About 63 days from the first breeding, with a normal range of roughly 56 to 70 days. The spread comes from timing: sperm can survive several days, so the breeding date and the actual conception date can differ. From a progesterone-confirmed ovulation date, it is 63 days give or take 2.' },
        { q: 'How accurate is a dog due date?', a: 'From a breeding date, expect the due date within about a week either side. From a progesterone-confirmed ovulation date it tightens to about 2 days. The 63-day average is well established, but individual litters and large litters can arrive a little early.' },
        { q: 'How soon can you tell a dog is pregnant?', a: 'A vet can confirm pregnancy by ultrasound from about day 25, by a relaxin blood test from around day 28, and by X-ray after about day 45 once the puppies’ skeletons show. There is no reliable home test, so outward signs alone are not proof.' },
        { q: 'When can a vet count the puppies?', a: 'X-rays taken after about day 55 are the best way to count puppies, once their skeletons are visible. Knowing the number helps you tell whether whelping is finished and whether to expect trouble, so many breeders schedule an X-ray in the last week.' },
        { q: 'Can a dog give birth at 58 days?', a: 'Yes. Measured from breeding, anything from about day 56 is within the normal window, so a birth at 58 days is not unusual. Puppies born much before day 58 may be premature and need extra care, so have your vet’s number ready.' },
        { q: 'What is the temperature drop before labor?', a: 'In the 24 hours before whelping, a dog’s rectal temperature usually drops below 99°F from a normal 100–102.5°F. Taking her temperature twice a day from about day 57 lets you catch the drop and know labor is close.' },
        { q: 'Do small and large dogs have different pregnancy lengths?', a: 'The 63-day average holds across sizes. Large litters, common in bigger breeds, sometimes arrive a day or two early, and very small litters can run slightly late, but size itself does not change the roughly 9-week length.' },
      ]}
      sources={[
        { name: 'Cornell Riney Canine Health Center, Normal whelping process.', url: 'https://www.vet.cornell.edu/departments/riney-canine-health-center/canine-health-information/normal-whelping-process' },
        { name: 'Merck Veterinary Manual (owner), Management of reproduction in dogs.', url: 'https://www.merckvetmanual.com/dog-owners/reproductive-disorders-of-dogs/management-of-reproduction-in-dogs' },
      ]}
    />
  );
}
