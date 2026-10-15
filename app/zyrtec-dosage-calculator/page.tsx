import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { toolMetadata } from '@/lib/seo';
import { ZyrtecPage } from '@/components/ZyrtecPage';

const tool = bySlug('zyrtec-dosage-calculator')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ZyrtecPage
      quickAnswer={
        <>Zyrtec is a brand of cetirizine. The dose for dogs is 1 to 2 mg/kg once a
        day, or 10 to 20 mg per dog, which is roughly 1 mg per pound. Most dogs get
        10 mg (one tablet) once a day, capped at 20 mg. Cats get a flat 5 mg per cat.
        Use only plain cetirizine, and ask your vet before giving any medicine.</>
      }
      faq={[
        { q: 'How much Zyrtec can I give my dog?', a: 'The published dose is 1 to 2 mg/kg once a day (AAHA 2023), or 10 to 20 mg per dog (Merck Veterinary Manual), which is about 1 mg per pound. A 10 to 20 lb dog is usually 5 to 10 mg once daily, and most larger dogs get 10 mg, up to 20 mg. We cap the result at 20 mg per dose. Check with your vet first.' },
        { q: 'How much Zyrtec for a cat?', a: 'Cats get a flat 5 mg per cat (half a 10 mg tablet) once a day, and vets may use up to 10 mg per cat (AAHA 2023, Table 8). This is a per-cat dose, not by weight. Be careful in older cats with kidney disease, and ask your vet before giving it.' },
        { q: 'Can I use Zyrtec-D?', a: 'No. Never give Zyrtec-D or any product with a decongestant (pseudoephedrine or phenylephrine), which can be dangerous for pets. Only use a product whose single active ingredient is cetirizine, and check liquids and children’s formulas for xylitol, which is toxic to dogs.' },
        { q: 'How often can I give it?', a: 'Once a day for both dogs and cats. Cetirizine is a once-daily antihistamine, so do not give it more often unless your vet tells you to. If it is not helping after a few days, ask your vet rather than increasing the dose.' },
        { q: 'What should I use Zyrtec for?', a: 'Vets sometimes suggest cetirizine for mild itching or seasonal allergies in dogs. It will not fix a serious allergic reaction. For facial swelling, hives, or trouble breathing, call your vet or an emergency clinic now rather than waiting on an antihistamine.' },
        { q: 'What if I gave too much?', a: 'A plain cetirizine overdose is usually mild, causing drowsiness or restlessness, but call your vet or the ASPCA Animal Poison Control Center at (888) 426-4435 to be sure. If you gave a Zyrtec-D product, which contains a decongestant, treat it as an emergency and call right away.' },
      ]}
    />
  );
}
