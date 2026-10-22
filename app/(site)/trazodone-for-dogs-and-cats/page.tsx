import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { toolMetadata } from '@/lib/seo';
import { TrazodonePage } from '@/components/TrazodonePage';

const tool = bySlug('trazodone-for-dogs-and-cats')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <TrazodonePage
      quickAnswer={
        <>Trazodone is a prescription calming medicine for anxiety in dogs and cats,
        often used before vet visits, storms or travel, or for rest after surgery. For
        dogs the Merck Veterinary Manual lists about 2 to 7.5 mg/kg every 8 to 24 hours.
        This page is a reference only; your vet sets the exact dose.</>
      }
      faq={[
        { q: 'How much trazodone can I give my dog?', a: 'Only the amount your vet prescribes. For reference, the Merck Veterinary Manual lists 2 to 7.5 mg/kg every 8 to 24 hours, not to exceed 19.5 mg/kg in any 24 hours. On the chart, a 40 lb dog falls around 40 to 135 mg per dose. Vets usually start low and adjust, so never start or change trazodone without your vet.' },
        { q: 'How much trazodone for a cat?', a: 'For a calmer vet visit, cats are often given a single 50 mg dose by mouth about an hour before leaving (Stevens et al., 2016), titrated up to 100 mg if needed (Orlando et al., 2016). It is a flat per-cat dose, not by weight. Older cats and those with liver, kidney or heart disease are often given less, so ask your vet.' },
        { q: 'How long does trazodone take to work and last?', a: 'It usually begins to work within about 1 to 2 hours, which is why the pre-visit dose is given roughly an hour ahead, and effects commonly last several hours. Timing and dose depend on the pet and the situation, so follow your vet&rsquo;s instructions on when and how often to give it.' },
        { q: 'Can trazodone be given with other medicines?', a: 'Tell your vet about every medicine and supplement first. Trazodone raises serotonin, so combining it with other serotonergic drugs such as fluoxetine, clomipramine, tramadol or selegiline can cause serotonin syndrome, which is dangerous. Your vet will check for interactions before combining anything.' },
        { q: 'What are the side effects of trazodone?', a: 'The most common are sedation and wobbliness, which wear off. Occasionally it causes the opposite effect, with restlessness or agitation. Liver injury, a fast heart rate, and in male dogs a persistent erection (priapism) have been reported; priapism is an emergency. Call your vet if your pet seems unwell.' },
        { q: 'Can I stop trazodone suddenly?', a: 'Not after long-term use. Stopping abruptly can cause problems, so your vet will taper the dose down over time. For occasional situational use, follow your vet&rsquo;s plan. Always check with your vet before starting, changing or stopping it.' },
      ]}
    />
  );
}
