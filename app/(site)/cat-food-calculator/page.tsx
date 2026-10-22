import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { ToolPage, toolMetadata } from '@/components/ToolPage';
import { CatFoodCalculator } from '@/components/tools/CatFoodCalculator';

const tool = bySlug('cat-food-calculator')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage
      slug={tool.slug}
      quickAnswer={
        <>A 10 lb (4.5 kg) neutered indoor cat needs about 260 kcal a day. That is
        roughly 3 cans of a typical 85-kcal wet food, or about ⅔ cup of a 400-kcal
        dry food. Enter your cat's weight and how you split wet and dry to get cans
        and cups, using RER = 70 × kg^0.75.</>
      }
      calculator={<CatFoodCalculator />}
      howTo={[
        "Enter your cat's weight in pounds or kilograms.",
        'Pick the life stage: neutered, intact, indoor/inactive, on a diet, or a growing kitten.',
        'Choose how you feed: all wet, half and half, or all dry.',
        'Enter the calories per can and per cup from your labels, then read the cans and cups per day.',
      ]}
      formula={
        <>
          <p>
            We use the vet formula: resting energy <strong>RER = 70 × (weight in
            kg)^0.75</strong>, then daily calories (MER) = a life-stage factor ×
            RER. A neutered adult cat factor is 1.2; an intact adult is 1.4. Cans per
            day = wet calories ÷ calories per can; cups per day = dry calories ÷
            calories per cup.
          </p>
          <p>
            <strong>Example 1.</strong> A 4.5 kg (9.9 lb) neutered adult fed all wet
            at 85 kcal/can: RER = 216 kcal, MER = 1.2 × 216 = 260 kcal, which is 3.05
            cans a day.
          </p>
          <p>
            <strong>Example 2.</strong> A 10 lb (4.54 kg) intact adult fed all dry at
            400 kcal/cup: RER = 218 kcal, MER = 1.4 × 218 = 305 kcal, which is 0.76
            cups a day.
          </p>
        </>
      }
      notCovered={[
        'Kidney, diabetic or other prescription diets.',
        'Kittens under 8 weeks, who need queen’s milk or a milk replacer.',
        'Full weight-loss plans, which should be vet-supervised.',
        'Pregnant or nursing cats beyond the range shown.',
      ]}
      seeVet={
        <ul>
          <li>Your cat is losing or gaining weight on the amount shown.</li>
          <li>Your cat is overweight, diabetic, or has kidney disease.</li>
          <li>A cat stops eating for more than a day, which can be an emergency in cats.</li>
        </ul>
      }
      tips={[
        'Cats do well with wet food for its water content, which supports urinary and kidney health.',
        'Feed to a lean body condition: you should feel the ribs with a light touch and see a slight waist.',
        'Use the calories on your labels. Wet cans range from about 70 to 110 kcal, and dry cups from 300 to 500 kcal.',
        'Measure dry food with a scale or a proper measuring cup. Free-feeding dry food is a common cause of weight gain.',
      ]}
      faq={[
        { q: 'How much wet food should I feed my cat?', a: 'It depends on weight and the can’s calories. A 4.5 kg (10 lb) neutered adult needs about 260 kcal a day, which is roughly 3 cans of an 85-kcal wet food. Larger or intact cats need more. Check the calories on your can, since they range from about 70 to 110 kcal, and enter them above for your cat’s exact number.' },
        { q: 'How much dry food per day?', a: 'Work out daily calories, then divide by the calories per cup. A 4.5 kg neutered adult eating all dry at 400 kcal/cup needs about ⅔ to ¾ cup a day. Dry food is calorie-dense, so small differences in scooping add up quickly.' },
        { q: 'How many calories does a cat need?', a: 'A resting cat needs RER = 70 × kg^0.75 kcal. Most neutered indoor cats need about 1.2 times that. A 4.5 kg cat lands near 260 kcal a day. Intact or very active cats need more, up to about 1.4 times resting energy.' },
        { q: 'Wet or dry?', a: 'Both can be complete and balanced. Wet food adds water, which many cats do not drink enough of, and tends to be lower in calories per gram, which helps with weight. Dry food is convenient and good for puzzle feeders. Many owners feed a mix.' },
        { q: 'How much should a kitten eat?', a: 'Kittens need about 2 to 3 times resting energy because they are growing, so they eat far more per kg than an adult. Feed a complete kitten food in several small meals a day, and weigh your kitten weekly. Kittens under 8 weeks need milk, not solid food alone.' },
        { q: 'Is my cat overweight?', a: 'Check body condition rather than the scale alone. You should feel the ribs with light pressure and see a slight waist from above. A rounded belly and no waist suggest extra weight. If so, trim the daily amount by about 10% and recheck with your vet.' },
      ]}
      sources={[
        { name: 'Pet Nutrition Alliance, Calculating Calories Based on Pet Needs (cat MER factors).', url: 'https://petnutritionalliance.org/wp-content/uploads/2023/03/MER.RER_.PNA_.pdf' },
        { name: 'AAHA/AAFP 2021 Feline Life Stage Guidelines.', url: 'https://www.aaha.org/aaha-guidelines/life-stage-feline-2021/feline-life-stage-home/' },
      ]}
    />
  );
}
