import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { ToolPage, toolMetadata } from '@/components/ToolPage';
import { RawFoodCalculator } from '@/components/tools/RawFoodCalculator';
import { NoteBox } from '@/components/ui/NoteBox';

const tool = bySlug('raw-dog-food-calculator')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage
      slug={tool.slug}
      quickAnswer={
        <>A 44 lb (20 kg) neutered adult dog needs about 1,059 kcal a day. On a
        typical raw food at 1,400 kcal/kg that is about 757 g (26.7 oz) a day,
        which works out to 3.8% of body weight. This raw food calculator for dogs
        uses calories, not a flat percentage, because raw foods differ in energy
        density.</>
      }
      calculator={<RawFoodCalculator />}
      howTo={[
        "Enter your dog's weight in pounds or kilograms.",
        'Pick the life stage or activity.',
        "Enter the food's energy in kcal per kg (or per lb) from the label. The default is 1,400 kcal/kg.",
        'Read the grams per day and the percentage of body weight it works out to.',
      ]}
      formula={
        <>
          <p>
            We find daily calories the same way as the regular food calculator
            (RER = 70 × kg^0.75, then × a life-stage factor), then convert to
            weight of food: <strong>grams/day = daily kcal ÷ kcal per kg of food ×
            1000</strong>. The common "2–3% of body weight" rule ignores how many
            calories the food actually has, so we show the percentage your result
            equals instead of starting from it.
          </p>
          <p>
            <strong>Example 1.</strong> A 20 kg neutered adult needs 1,059 kcal. On
            1,400 kcal/kg food that is 757 g (26.7 oz) a day, or 3.78% of body weight.
          </p>
          <p>
            <strong>Example 2.</strong> A 60 lb (27.22 kg) intact adult needs 1,501
            kcal. On 1,800 kcal/kg food that is 834 g (29.4 oz) a day, or 3.06% of
            body weight.
          </p>
          <NoteBox label="Raw feeding safety" danger>
            Raw diets can carry Salmonella and Listeria that make pets and people
            sick, and home recipes are often not balanced. The FDA warns raw pet
            food is more likely to be contaminated, and the AVMA discourages feeding
            raw or undercooked animal-source protein. Handle it like raw meat for
            people, and ask a vet or veterinary nutritionist before switching.
          </NoteBox>
        </>
      }
      notCovered={[
        'Recipe balancing (calcium-to-phosphorus ratio, vitamins and minerals).',
        'Puppies’ mineral needs, which need a veterinary nutritionist.',
        'Cats.',
        'Medical diets or dogs with health conditions.',
      ]}
      seeVet={
        <ul>
          <li>You are feeding a puppy, a pregnant or nursing dog, or a dog with any illness.</li>
          <li>Your dog loses or gains weight on the amount shown.</li>
          <li>You are building a home recipe rather than a complete commercial raw food.</li>
        </ul>
      }
      tips={[
        'Weigh portions on a kitchen scale. Raw food varies in density, so grams beat eyeballing.',
        'If you only know the percentage rule, remember a very rich food means fewer grams than 2–3%, and a lean food means more.',
        'Split the daily grams across two meals, and keep raw food cold and clean.',
        'Count any treats or chews toward the daily calories.',
      ]}
      faq={[
        { q: 'How much raw food should I feed my dog?', a: 'Start from calories, not a flat percentage. A 20 kg neutered adult needs about 1,059 kcal a day, which is roughly 757 g of a 1,400-kcal-per-kg raw food. Heavier or more active dogs need more. Weigh portions and adjust to keep an easy-to-feel ribcage and a visible waist.' },
        { q: 'Is 2–3% of body weight right?', a: 'It is only a rough guide. The rule ignores energy density, so a rich food fed at 3% can overfeed while a lean food can underfeed. In our examples the calorie-based amount lands near 3 to 4% of body weight, but the exact figure depends on your food’s calories per kg.' },
        { q: 'How much raw food for a puppy?', a: 'Growing puppies need about 2 to 3 times resting energy, most under 4 months. That roughly doubles an adult portion for the same weight. Puppy raw diets also need careful calcium and phosphorus balance, so use a complete puppy formula and check amounts with your vet.' },
        { q: 'Is raw food safe?', a: 'Raw diets carry a real risk of Salmonella and Listeria for both pets and the people handling them, and the FDA and AVMA both flag these concerns. If you feed raw, handle it like raw meat for people, clean surfaces well, and talk to your vet, especially in homes with young children or anyone immunocompromised.' },
        { q: 'Can I mix raw and kibble?', a: 'Yes, many owners feed part raw and part kibble. Work out total daily calories, then split them between the two foods by their calories per serving so the total stays the same. Mixing does not cancel the food-safety steps raw meat needs.' },
        { q: 'How do I find the calories in raw food?', a: 'Commercial raw foods list calories as kcal/kg or kcal/lb on the label or website. If only a percentage guide is given, ask the maker for the calorie content. Without it, a typical raw food is around 1,400 kcal/kg, but this varies a lot by fat content.' },
      ]}
      sources={[
        { name: 'Pet Nutrition Alliance, Calculating Calories Based on Pet Needs.', url: 'https://petnutritionalliance.org/wp-content/uploads/2023/03/MER.RER_.PNA_.pdf' },
        { name: 'FDA, Get the Facts! Raw Pet Food Diets can be Dangerous to You and Your Pet.', url: 'https://www.fda.gov/animal-veterinary/animal-health-literacy/get-facts-raw-pet-food-diets-can-be-dangerous-you-and-your-pet' },
        { name: 'AVMA policy, Raw or undercooked animal-source protein in cat and dog diets.', url: 'https://www.avma.org/resources-tools/avma-policies/raw-or-undercooked-animal-source-protein-cat-and-dog-diets' },
      ]}
    />
  );
}
