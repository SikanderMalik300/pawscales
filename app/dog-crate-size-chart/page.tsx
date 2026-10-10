import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { CRATES } from '@/lib/calc/crate';
import { ToolPage, toolMetadata } from '@/components/ToolPage';
import { CrateCalculator } from '@/components/tools/CrateCalculator';
import { DataTable } from '@/components/ui/Table';

const tool = bySlug('dog-crate-size-chart')!;
export const metadata: Metadata = toolMetadata(tool);

const BREED_CRATES: { breed: string; crate: string }[] = [
  { breed: 'Chihuahua', crate: '18–22 in' },
  { breed: 'Yorkshire Terrier', crate: '18–22 in' },
  { breed: 'French Bulldog', crate: '24–30 in' },
  { breed: 'Pug', crate: '24 in' },
  { breed: 'Beagle', crate: '30 in' },
  { breed: 'Cocker Spaniel', crate: '30 in' },
  { breed: 'Border Collie', crate: '36 in' },
  { breed: 'Australian Shepherd', crate: '36 in' },
  { breed: 'Labrador Retriever', crate: '42 in' },
  { breed: 'Golden Retriever', crate: '42 in' },
  { breed: 'German Shepherd', crate: '42–48 in' },
  { breed: 'Boxer', crate: '42 in' },
  { breed: 'Rottweiler', crate: '48 in' },
  { breed: 'Doberman', crate: '42–48 in' },
  { breed: 'Bernese Mountain Dog', crate: '48 in' },
  { breed: 'Great Dane', crate: '54 in' },
  { breed: 'Mastiff', crate: '54 in' },
  { breed: 'Dachshund', crate: '30 in (long body)' },
  { breed: 'Shih Tzu', crate: '24 in' },
  { breed: 'Siberian Husky', crate: '36–42 in' },
];

export default function Page() {
  return (
    <ToolPage
      slug={tool.slug}
      quickAnswer={
        <>Measure your dog nose to the base of the tail and add 2 to 4 inches. A
        dog that measures 28 inches needs about a 36-inch crate. Crates come in
        standard lengths from 18 to 54 inches. Enter your dog's length and height
        for the right size.</>
      }
      calculator={<CrateCalculator />}
      howTo={[
        'Measure from the nose to the base of the tail while your dog stands.',
        'Measure height from the floor to the top of the head (or ear tips if they stand up).',
        'Enter both. We add 4 inches to the length and pick the smallest standard crate that also fits the height.',
        'For a growing puppy, size for the adult and use a divider to shrink it for now.',
      ]}
      formula={
        <>
          <p>
            The method (AKC and MidWest): <strong>crate length = body length + 2 to
            4 inches</strong>, and height = standing height + 2 to 4 inches. We use
            +4 for comfort, then choose the smallest standard crate whose length and
            height both clear your dog. Too big is not better; dogs feel safest in a
            snug, den-like space.
          </p>
          <p><strong>Example 1.</strong> A dog measuring 28 in long and 22 in tall: ideal length 32 in, so a 36-inch crate (25 in tall) fits.</p>
          <p><strong>Example 2.</strong> A small dog 17 in long and 14 in tall: ideal length 21 in, so a 22-inch crate (16 in tall) fits.</p>
        </>
      }
      notCovered={[
        'Travel and airline crates, which follow IATA rules and are sized differently.',
        'Anxious dogs that may need a covered or heavier crate.',
        'Very long-bodied breeds like Dachshunds; measure them, do not go by weight.',
      ]}
      tables={
        <>
          <DataTable
            caption="Crate length, height and typical dog weight"
            columns={[
              { key: 'len', header: 'Length', numeric: true },
              { key: 'hgt', header: 'Height', numeric: true },
              { key: 'wt', header: 'Typical dog' },
            ]}
            rows={CRATES.map((c) => ({ cells: { len: `${c.length} in`, hgt: `${c.height} in`, wt: c.weight } }))}
            source={<>Source: MidWest Homes for Pets iCrate dimensions. Weights are typical; always measure.</>}
          />
          <DataTable
            caption="Typical crate size by breed"
            columns={[{ key: 'breed', header: 'Breed' }, { key: 'crate', header: 'Typical crate', numeric: true }]}
            rows={BREED_CRATES.map((b) => ({ cells: { breed: b.breed, crate: b.crate } }))}
            source={<>Typical sizes derived from breed heights and the MidWest chart. Measure your own dog to confirm.</>}
          />
        </>
      }
      tips={[
        'Buy one crate with a divider for a puppy, sized to the adult, and move the divider as they grow.',
        'A crate should let the dog stand without ducking, turn around, and lie flat on its side.',
        'For very long breeds like Dachshunds, length matters more than the weight band suggests.',
        'Wire crates feel open and ventilate well; plastic crates feel more den-like. Match the length either way.',
      ]}
      faq={[
        { q: 'How do I measure my dog for a crate?', a: 'Measure length from the tip of the nose to the base of the tail while standing, then height from the floor to the top of the head (or ear tips if erect). Add 2 to 4 inches to each. A dog measuring 28 inches long usually needs a 36-inch crate.' },
        { q: 'What size crate for a puppy?', a: 'Buy the crate your puppy will need as an adult, then use a divider to block off the extra space for now. A crate that is too roomy lets a puppy toilet in one corner and sleep in another, which slows house-training.' },
        { q: 'Can a crate be too big?', a: 'Yes. Dogs feel secure in a snug, den-like space, and a crate that is much too large undermines house-training and can feel less safe. Aim for enough room to stand, turn around and lie down fully, and no more.' },
        { q: 'What size crate for a Golden Retriever, French Bulldog or German Shepherd?', a: 'A Golden Retriever usually needs a 42-inch crate, a French Bulldog a 24 to 30-inch crate, and a German Shepherd a 42 to 48-inch crate. These are typical; measure your dog nose to tail base and add a few inches to confirm.' },
        { q: 'Wire vs plastic crate sizes?', a: 'The sizing method is the same for both: match the length and height to your dog plus a few inches. Wire crates ventilate and fold flat; plastic crates feel more enclosed and are often used for travel. Pick the style, then the size.' },
        { q: 'How much room should a dog have in a crate?', a: 'Just enough to stand up without ducking, turn around comfortably, and stretch out on its side to sleep. That usually means body length plus 2 to 4 inches and standing height plus 2 to 4 inches, which is what this tool works out.' },
      ]}
      sources={[
        { name: 'American Kennel Club, choosing the right size dog crate.', url: 'https://www.akc.org/expert-advice/training/choosing-the-right-size-crate/' },
        { name: 'MidWest Homes for Pets, iCrate size dimensions.', url: 'https://www.midwesthomes4pets.com/product/dogs/crates-carriers-kennels/icrate-dog-crate/' },
      ]}
    />
  );
}
