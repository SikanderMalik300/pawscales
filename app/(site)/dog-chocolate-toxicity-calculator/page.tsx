import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { toolMetadata } from '@/lib/seo';
import { ChocolatePage } from '@/components/ChocolatePage';

const tool = bySlug('dog-chocolate-toxicity-calculator')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ChocolatePage
      quickAnswer={
        <>Whether chocolate is dangerous depends on the type, how much your dog ate and
        your dog&rsquo;s weight. Enter those three things to see the dose in mg/kg and
        which risk band it falls in. If your dog ate chocolate recently, don&rsquo;t
        wait: call your vet or the ASPCA Animal Poison Control Center at (888) 426-4435.</>
      }
      faq={[
        { q: 'How much chocolate is toxic to a dog?', a: 'It depends on the type and your dog&rsquo;s weight. Vets use the dose of theobromine plus caffeine per kilogram: mild signs appear around 20 mg/kg, heart effects around 40 to 50 mg/kg, and seizures at 60 mg/kg and up. Milk chocolate holds about 64 mg per ounce, dark far more, and baking chocolate and cocoa powder the most. The calculator works out the dose for you.' },
        { q: 'My dog ate a small piece of milk chocolate, is that an emergency?', a: 'Often a small amount of milk chocolate for a medium or large dog lands below the usual toxic dose, but this tool never calls it safe. Puppies, small dogs and dogs with heart conditions can react at lower amounts. Enter the details, and if you are unsure or your dog seems unwell, call your vet or the ASPCA.' },
        { q: 'How soon do symptoms show?', a: 'Signs usually start within 6 to 12 hours and can last a day or more because theobromine leaves a dog&rsquo;s body slowly. Early signs include restlessness, a racing heart, vomiting, diarrhoea and increased thirst; more serious signs are tremors and seizures. If it was eaten in the last 1 to 2 hours, call your vet now, as they may be able to make your dog vomit.' },
        { q: 'Should I make my dog throw up?', a: 'Not at home, unless a vet tells you to. Doing it the wrong way, or at the wrong time, can harm your dog. Call your vet or the ASPCA Animal Poison Control Center at (888) 426-4435 first; they will tell you whether to come in and what to do.' },
        { q: 'Is white chocolate safe for dogs?', a: 'White chocolate has very little theobromine, so it rarely reaches a toxic dose, but it is not a treat for dogs: it is high in fat and sugar, which can upset the stomach or trigger pancreatitis. And some sweets contain xylitol, which is very dangerous. When in doubt, ask your vet.' },
        { q: 'What about xylitol, raisins or nuts in the chocolate?', a: 'Those are dangerous on their own. Xylitol (in sugar-free chocolate) can cause a drop in blood sugar and liver damage, raisins can cause kidney failure, and macadamia nuts cause weakness and tremors. If the product contains any of them, call your vet or the ASPCA whatever the chocolate result says.' },
      ]}
    />
  );
}
