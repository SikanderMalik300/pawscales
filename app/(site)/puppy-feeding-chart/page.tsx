import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { toolMetadata } from '@/lib/seo';
import { PuppyFeedingPage } from '@/components/PuppyFeedingPage';

const tool = bySlug('puppy-feeding-chart')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <PuppyFeedingPage
      quickAnswer={
        <>How much to feed a puppy depends on its age and how big it will get. A puppy
        that will reach about 40 lb needs roughly 800 kcal a day at 3 months and about
        1,200 kcal by 6 months, then settles toward adult feeding by the end of the
        first year. Use the chart below by expected adult weight, or the calculator for
        your exact food.</>
      }
      faq={[
        { q: 'How much should I feed my puppy?', a: 'It depends on age and adult size. A puppy is fed for growth: roughly 3 times its resting calorie need while small, tapering to 2 times as it nears adult weight. On this chart, a puppy heading for 40 lb needs about 800 kcal a day at 3 months and about 1,200 by 6 months. Use the dog food calculator with your puppy&rsquo;s weight, its expected adult weight and your food&rsquo;s calories per cup for an exact amount.' },
        { q: 'How many times a day should a puppy eat?', a: 'Feed four small meals a day up to about 3 months, three meals from 3 to 6 months, and two meals a day from 6 months on. Toy and small breeds may need an extra meal to avoid low blood sugar. Splitting the daily amount into regular meals suits a growing puppy better than one large meal.' },
        { q: 'How much should a 3-month-old puppy eat?', a: 'That depends on how big it will get. On this chart a 3-month-old heading for 20 lb needs about 520 kcal a day, one heading for 40 lb about 820 kcal, and one heading for 80 lb about 1,340 kcal, split into three or four meals. Calories per cup vary by food, so check the bag and use the calculator for cups.' },
        { q: 'When do I switch a puppy to adult food?', a: 'Around the time it reaches its adult weight: about 10 to 12 months for small and medium dogs, and 12 to 18 months or more for large and giant breeds. Our chart feeds as an adult from about 80% of adult weight. Change foods gradually over a week, and ask your vet, especially for large breeds where growth rate matters.' },
        { q: 'Why do large-breed puppies need different feeding?', a: 'Large and giant breeds grow for longer and can develop joint problems if they grow too fast or carry extra weight while growing. Feed a large-breed puppy food, measure meals instead of free-feeding, keep the puppy lean, and let your vet check body condition. Steady growth is safer than fast growth.' },
        { q: 'How accurate is this chart?', a: 'It is a well-sourced estimate, not a prescription. It uses the standard vet calorie formula (RER times a growth factor) and growth data on more than 60,000 dogs, but individual puppies can vary by up to 50% from the predicted need. Weigh your puppy, watch body condition, and adjust with your vet rather than following a single number.' },
      ]}
    />
  );
}
