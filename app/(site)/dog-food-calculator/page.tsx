import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { ToolPage, toolMetadata } from '@/components/ToolPage';
import { DogFoodCalculator } from '@/components/tools/DogFoodCalculator';

const tool = bySlug('dog-food-calculator')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage
      slug={tool.slug}
      updated="October 15, 2026"
      quickAnswer={
        <>A healthy 44 lb (20 kg) neutered adult dog needs about 1,059 kcal a day,
        or roughly 2.8 cups of a 380-kcal-per-cup food. Enter your dog's weight,
        life stage and the calories on the bag, and this dog feeding calculator
        gives cups per day, using the vet formula RER = 70 × kg^0.75.</>
      }
      calculator={<DogFoodCalculator />}
      howTo={[
        "Enter your dog's weight and switch between pounds and kilograms.",
        'Pick the life stage or activity that fits: neutered, intact, prone to weight gain, on a diet, or growing. For a growing puppy, also enter its expected adult weight.',
        "Enter the food's calories per cup (on the bag as kcal/cup or ME). The default is 380.",
        'Read the daily calories and cups, then split them across two or three meals.',
      ]}
      formula={
        <>
          <p>
            We use the Pet Nutrition Alliance method. First the resting energy
            requirement: <strong>RER = 70 × (weight in kg)^0.75</strong>. Then daily
            calories (MER) = a life-stage factor × RER. A neutered adult factor is
            1.6; an intact adult is 1.8. Cups per day = daily calories ÷ calories per cup.
          </p>
          <p>
            <strong>Example 1.</strong> A 20 kg (44.1 lb) neutered adult: RER = 70 ×
            20^0.75 = 662 kcal. MER = 1.6 × 662 = 1,059 kcal. At 380 kcal/cup that is
            2.79 cups a day.
          </p>
          <p>
            <strong>Example 2.</strong> A 40 lb (18.14 kg) intact adult: RER = 615
            kcal, MER = 1.8 × 615 = 1,108 kcal. At 350 kcal/cup that is 3.16 cups a day.
          </p>
          <p>
            <strong>Updated October 2026:</strong> the growing-puppy option now tapers
            the growth factor by how close the puppy is to its adult weight (3× under
            50%, 2.5× to 80%, 2× to 95%, then adult maintenance), matching the{' '}
            <a className="link" href="/puppy-feeding-chart/">puppy feeding chart</a>.
            Enter the puppy&rsquo;s expected adult weight so it can set the stage.
          </p>
        </>
      }
      notCovered={[
        'Medical or prescription diets.',
        'Pregnant or nursing dogs beyond the range shown.',
        'Dogs that are sick or recovering.',
        'Full weight-loss plans. For those, see the AAHA weight management guidelines and your vet.',
      ]}
      seeVet={
        <ul>
          <li>Your dog is losing or gaining weight on the amount shown.</li>
          <li>You can't easily feel the ribs, or the waist has disappeared.</li>
          <li>Your dog is pregnant, nursing, very young, or has a health condition.</li>
        </ul>
      }
      tips={[
        'Weigh the food instead of scooping. A "cup" of kibble varies a lot by shape and size.',
        'The bag’s guide is usually generous. Start with the calculated amount and adjust to keep a visible waist and easy-to-feel ribs.',
        'Count treats. They should be no more than 10% of daily calories.',
        'Re-check the amount after any weight change, and when switching foods with a different calorie density.',
      ]}
      faq={[
        { q: 'How many cups of food should my dog eat a day?', a: 'It depends on weight, life stage and the food. A 20 kg (44 lb) neutered adult on a 380-kcal-per-cup food needs about 2.8 cups a day. A smaller 10 kg dog needs roughly 1.6 cups, a larger 30 kg dog about 3.8 cups. Always match the number to the calories printed on your bag.' },
        { q: 'How much should a puppy eat?', a: 'Puppies need more energy than adults, scaled to how close they are to their adult weight: about 3 times their resting need while under half of adult weight, 2.5 times from half to 80%, and 2 times from 80% to full size, then adult feeding. Pick the growing stage and enter the expected adult weight, or see the puppy feeding chart. Feed 3 to 4 smaller meals a day and weigh weekly.' },
        { q: 'Why does the bag say a different amount?', a: 'Bag charts are built around broad weight bands and often assume an active, intact dog, so they tend to read high. This tool uses your dog’s exact weight, neuter status and the food’s real calories. Treat either number as a starting point and adjust to body condition.' },
        { q: 'How many calories does a dog need?', a: 'A resting dog needs RER = 70 × kg^0.75 kcal. Most pet dogs need 1.2 to 1.8 times that once activity is included. A 20 kg neutered adult lands near 1,059 kcal a day. Individual needs vary by up to 50%, so use the number as a start and watch body condition.' },
        { q: 'How do I know if I’m overfeeding?', a: 'Check body condition, not the bowl. You should feel the ribs easily with light pressure and see a waist from above. If the ribs are hard to find or the back is broadening, cut the daily amount by about 10% and recheck in a few weeks.' },
        { q: 'Should I feed once or twice a day?', a: 'Twice a day suits most adult dogs and keeps hunger steady. Puppies do better on 3 to 4 meals. Once-a-day feeding is linked to a higher bloat risk in large deep-chested breeds, so splitting meals is the safer default.' },
        { q: 'How many treats are OK?', a: 'Keep treats to no more than 10% of daily calories. For a dog eating 1,000 kcal a day that is about 100 kcal of treats. Subtract treat calories from meals so the daily total stays the same, and use part of the kibble ration for training.' },
      ]}
      sources={[
        { name: 'Puppy calories now taper by percent of adult weight (WSAVA/PNA), October 2026.', url: 'https://wsava.org/global-guidelines/global-nutrition-guidelines/' },
        { name: 'Pet Nutrition Alliance, Calculating Calories Based on Pet Needs (RER and MER factors).', url: 'https://petnutritionalliance.org/wp-content/uploads/2023/03/MER.RER_.PNA_.pdf' },
        { name: 'WSAVA Global Nutrition Guidelines (treats under 10% of calories).', url: 'https://wsava.org/global-guidelines/global-nutrition-guidelines/' },
        { name: 'AAHA Weight Management Guidelines for Dogs and Cats.', url: 'https://www.aaha.org/aaha-guidelines/weight-management/weight-management-home/' },
      ]}
    />
  );
}
