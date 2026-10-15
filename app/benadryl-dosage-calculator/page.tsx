import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { toolMetadata } from '@/lib/seo';
import { BenadrylPage } from '@/components/BenadrylPage';

const tool = bySlug('benadryl-dosage-calculator')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <BenadrylPage
      quickAnswer={
        <>Benadryl is a brand of diphenhydramine. The published dose is about 1 mg per
        pound (2 mg/kg), up to 4 mg/kg for dogs and 3 mg/kg for cats. A 25 lb dog works
        out to about 25 mg, or one 25 mg tablet. Use only plain diphenhydramine, and
        ask your vet before giving any medicine.</>
      }
      faq={[
        { q: 'How much Benadryl can I give my dog?', a: 'The Merck Veterinary Manual lists 2 to 4 mg/kg of diphenhydramine for dogs, every 8 to 12 hours, which is roughly 1 mg per pound. A 25 lb dog is about 25 mg (one standard tablet) and a 50 lb dog about 50 mg. Start at the lower end, never exceed 4 mg/kg, and check with your vet first, especially for small dogs.' },
        { q: 'How much Benadryl can I give my cat?', a: 'The AAHA 2023 guidelines list 2 to 3 mg/kg of diphenhydramine for cats, every 12 hours. For many cats that is about half of a 25 mg tablet (12.5 mg), but the window is narrow, so a liquid or a vet-measured amount is often better. Ask your vet before giving a cat any medicine, and never exceed 3 mg/kg.' },
        { q: 'How often can I give it?', a: 'For dogs, every 8 to 12 hours and no more than three times in 24 hours. For cats, every 12 hours. Do not give more often than this, and stop and call your vet if it is not helping or your pet seems unwell.' },
        { q: 'Can I use Benadryl-D or children’s Benadryl?', a: 'No, not Benadryl-D or any product with a decongestant (pseudoephedrine or phenylephrine), which can be dangerous for pets. Children’s liquids and chewables can contain xylitol, which is toxic to dogs. Only use a product whose single active ingredient is diphenhydramine, and check the label every time.' },
        { q: 'What should I use Benadryl for?', a: 'Vets sometimes suggest diphenhydramine for mild itching, a bug bite, or car-sickness. It is not a reliable treatment for anxiety, and it will not fix a serious allergic reaction. For facial swelling, hives, trouble breathing, or any emergency, call your vet or go to an emergency clinic now rather than waiting on an antihistamine.' },
        { q: 'What if I gave too much?', a: 'Call your vet or the ASPCA Animal Poison Control Center at (888) 426-4435 (a fee may apply), or go to your nearest emergency vet. Signs of too much include agitation, a racing heart, dilated pupils, tremors or seizures, or heavy drowsiness. Act quickly rather than waiting to see what happens.' },
      ]}
    />
  );
}
