import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { toolMetadata } from '@/lib/seo';
import { GabapentinPage } from '@/components/GabapentinPage';

const tool = bySlug('gabapentin-for-dogs-and-cats')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <GabapentinPage
      quickAnswer={
        <>Gabapentin is a prescription medicine used for pain, seizures and anxiety in
        dogs and cats. For ongoing pain the Merck Veterinary Manual lists about 5 to 30
        mg/kg every 8 hours for dogs and 3 to 10 mg/kg for cats. This page is a
        reference only; your vet sets the exact dose for your pet.</>
      }
      faq={[
        { q: 'How much gabapentin can I give my dog?', a: 'Only the amount your vet prescribes. For reference, the Merck Veterinary Manual lists about 5 to 30 mg/kg every 8 hours for ongoing pain or seizures, and 20 to 50 mg/kg as a one-off about 90 minutes before a stressful event. The range is wide, so vets usually start low and adjust. Never start or change gabapentin without your vet.' },
        { q: 'How much gabapentin for a cat?', a: 'For pain, the Merck Veterinary Manual lists about 3 to 10 mg/kg every 8 to 12 hours for cats, so a 10 lb cat is roughly 15 to 45 mg per dose. For a calmer vet visit, cats are often given a single 50 to 100 mg dose about 90 minutes before. Your vet decides the amount, especially for older cats or those with kidney disease.' },
        { q: 'How much gabapentin for a cat before a vet visit?', a: 'A common, well-studied approach is a single dose of 50 to 100 mg per cat, by mouth, about 90 minutes before you leave for the appointment (van Haaften et al., 2017). It is a flat per-cat dose, not by weight. Older cats and cats with kidney disease are often given less, so ask your vet for the right amount for your cat.' },
        { q: 'What are the side effects of gabapentin?', a: 'The most common are sedation and wobbliness (ataxia), which are dose-related and wear off. Keep your pet off stairs and furniture until steady. Some pets are more sleepy than others. If your pet is very hard to rouse, collapses, or seems unwell, call your vet.' },
        { q: 'Can I stop gabapentin suddenly?', a: 'No, not after long-term use. Stopping abruptly can cause rebound pain, and in pets taking it for seizures it can trigger breakthrough seizures. Your vet will taper the dose down over time. Always follow your vet on starting, changing or stopping it.' },
        { q: 'How long does gabapentin take to work?', a: 'It is usually given to take effect in about 1 to 2 hours, which is why the pre-visit dose for cats is given roughly 90 minutes ahead. Effects generally last several hours. Timing and dose depend on the use and the individual pet, so follow your vet&rsquo;s instructions.' },
      ]}
    />
  );
}
