import { MedicationPage, type MedicationContent } from '@/components/MedicationPage';
import { DRAMAMINE, DRAMAMINE_CHART_LB } from '@/lib/calc/dramamine';

const ANTIEMETIC = 'https://www.merckvetmanual.com/multimedia/table/antiemetic-drugs';
const MOTION = 'https://www.merckvetmanual.com/nervous-system/motion-sickness/motion-sickness-in-animals';
const ANTIHIST = 'https://www.merckvetmanual.com/pharmacology/systemic-pharmacotherapeutics-of-the-integumentary-system/antihistamines-for-integumentary-disease-in-animals';

const CONTENT: MedicationContent = {
  slug: 'dramamine-dosage-calculator',
  drugName: 'Dramamine',
  quickAnswer: (
    <>
      Dramamine is a brand name for dimenhydrinate, an antihistamine used mainly
      for motion sickness. The published dog dose is <strong>4 to 8 mg/kg</strong> by
      mouth, {DRAMAMINE.freq} (Merck Veterinary Manual), given about an hour before
      travel. Enter your dog&rsquo;s weight for the amount and a tablet count. Ask
      your vet first, especially for small dogs.
    </>
  ),
  reviewed:
    'Reviewed against the Merck Veterinary Manual antiemetic drugs table, its Motion Sickness in Animals chapter, and its antihistamine pharmacology notes, October 2026.',
  calc: {
    minMgKg: DRAMAMINE.minMgKg,
    maxMgKg: DRAMAMINE.maxMgKg,
    freq: DRAMAMINE.freq,
    tablets: DRAMAMINE.tablets,
    defaultTabletMg: DRAMAMINE.defaultTabletMg,
    sourceNote: (
      <>
        Dose from the Merck Veterinary Manual antiemetic table (dimenhydrinate 4 to
        8 mg/kg, {DRAMAMINE.freq}). For motion sickness in dogs. Give about 1 hour
        before travel.
      </>
    ),
    warning: (
      <>
        Use <strong>Dramamine Original</strong> only (dimenhydrinate). &ldquo;Less
        Drowsy&rdquo; is a different drug. See the box below before you buy.
      </>
    ),
  },
  chartWeights: DRAMAMINE_CHART_LB,
  chartSource: (
    <>
      Source: <a className="link" href={ANTIEMETIC}>Merck Veterinary Manual, Antiemetic
      Drugs table</a> (dimenhydrinate 4&ndash;8 mg/kg, PO, q6&ndash;8h).
    </>
  ),
  doseIntro: (
    <>
      <h2 className="text-[22px] sm:text-[26px]">How much Dramamine can I give a dog?</h2>
      <p className="mt-2 text-[16px] text-ink">
        Dramamine (dimenhydrinate) is used mainly to prevent motion sickness, drooling
        and nausea on car or plane trips. The published dog dose is <strong>4 to 8
        mg/kg</strong> by mouth, {DRAMAMINE.freq} (Merck Veterinary Manual), which works
        out to roughly 2 to 4 mg per pound. For travel, the Merck{' '}
        <a className="link" href={MOTION}>Motion Sickness in Animals</a> chapter suggests
        giving it about an hour before you set off, so it has time to take effect. The
        calculator leads with the lower, cautious amount and shows the full range.
        Confirm the amount with your vet first, especially for small dogs.
      </p>
    </>
  ),
  productWarning: {
    label: 'Buy the right Dramamine: Original formula only',
    body: (
      <>
        Only <strong>Dramamine Original</strong> contains dimenhydrinate, the drug our
        numbers are for. Check the active ingredient on the box, because the other
        Dramamine products are different medicines:
        <ul className="mt-3 space-y-2">
          <li>
            <strong>&ldquo;Less Drowsy&rdquo;</strong> (and &ldquo;All Day Less
            Drowsy&rdquo;) is <strong>meclizine</strong>, a different antihistamine with
            a different dose. Do not use our numbers for it.
          </li>
          <li>
            <strong>&ldquo;Non-Drowsy Naturals&rdquo;</strong> is <strong>ginger</strong>,
            not an antihistamine at all.
          </li>
          <li>
            Avoid any combination product, such as one that also lists a decongestant.
          </li>
        </ul>
      </>
    ),
  },
  catNote: {
    label: 'Cats: ask your vet, no dose here',
    body: (
      <>
        We don&rsquo;t list a cat dose because our source doesn&rsquo;t give one specific
        to cats. The Merck Veterinary Manual{' '}
        <a className="link" href={MOTION}>Motion Sickness in Animals</a> chapter notes
        that antihistamines like dimenhydrinate are generally ineffective for motion
        sickness in cats, because cats lack the histamine receptors involved. Ask your
        vet about options for a cat.
      </>
    ),
  },
  whoShouldnt: (
    <>
      <p className="mt-2 text-[16px] text-ink">
        Talk to your vet before giving dimenhydrinate if your dog:
      </p>
      <ul className="mt-3 space-y-2 text-[16px] text-ink">
        <li>has glaucoma;</li>
        <li>has trouble urinating or an enlarged prostate;</li>
        <li>has significant heart disease;</li>
        <li>is elderly or frail;</li>
        <li>is pregnant or nursing;</li>
        <li>is already on another sedative, antihistamine or similar medicine.</li>
      </ul>
      <p className="mt-3 text-[16px] text-ink">
        It commonly causes drowsiness, and can cause a dry mouth or an upset stomach.
      </p>
      <p className="mt-3 text-[14px] text-muted">
        From the first-generation antihistamine cautions in the Merck Veterinary Manual{' '}
        <a className="link" href={ANTIHIST}>antihistamines for integumentary disease</a>{' '}
        chapter.
      </p>
    </>
  ),
  overdose: (
    <>
      <p className="mt-2 text-[16px] text-ink">Too much dimenhydrinate can cause:</p>
      <ul className="mt-3 space-y-2 text-[16px] text-ink">
        <li>heavy drowsiness or, in some dogs, agitation and restlessness;</li>
        <li>a fast heartbeat and dilated pupils;</li>
        <li>a dry mouth, retching or trouble urinating;</li>
        <li>in severe cases, tremors or seizures.</li>
      </ul>
      <p className="mt-3 text-[16px] text-ink">
        The Merck Veterinary Manual notes that a large antihistamine overdose can cause
        central nervous system over-excitement that may be fatal. If you gave more than
        the amounts above, or see any of these signs, call your vet or the ASPCA right
        away.
      </p>
    </>
  ),
  faq: [
    {
      q: 'How long before a trip should I give Dramamine?',
      a: 'The Merck Veterinary Manual Motion Sickness in Animals chapter suggests giving dimenhydrinate about an hour before travel, so it has time to take effect. Follow your vet’s timing.',
    },
    {
      q: 'Can I use Dramamine Less Drowsy?',
      a: 'No, not with our numbers. "Dramamine Less Drowsy" is meclizine, a different antihistamine with a different dose, and "Non-Drowsy Naturals" is ginger. Our calculator is only for Dramamine Original, whose active ingredient is dimenhydrinate. Always read the box.',
    },
    {
      q: 'How often can I give it?',
      a: 'The published range is every 6 to 8 hours (Merck Veterinary Manual). Do not exceed the per-dose maximum the calculator shows (8 mg/kg), and ask your vet before using it for more than a day or two.',
    },
    {
      q: 'Will it make my dog sleepy?',
      a: 'Often, yes. Drowsiness is the most common effect of dimenhydrinate. Some dogs get restless instead. Try a dose at home before you rely on it for a trip.',
    },
    {
      q: 'Can I give Dramamine to my cat?',
      a: 'Ask your vet. We do not show a cat dose: our source does not give one for cats, and the Merck Veterinary Manual notes antihistamines are generally ineffective for motion sickness in cats.',
    },
  ],
  sources: [
    <>
      <a className="link" href={ANTIEMETIC}>Merck Veterinary Manual, Antiemetic Drugs table</a>{' '}
      (dimenhydrinate 4&ndash;8 mg/kg, PO, q6&ndash;8h).
    </>,
    <>
      <a className="link" href={MOTION}>Merck Veterinary Manual, Motion Sickness in Animals</a>{' '}
      (give about 1 hour before travel; antihistamines ineffective in cats).
    </>,
    <>
      <a className="link" href={ANTIHIST}>Merck Veterinary Manual, Antihistamines for Integumentary Disease in Animals</a>{' '}
      (first-generation antihistamine cautions and overdose signs).
    </>,
    <>
      <a className="link" href="https://www.aspca.org/pet-care/animal-poison-control">ASPCA Animal Poison Control Center</a>{' '}
      (888-426-4435).
    </>,
  ],
};

export function DramaminePage() {
  return <MedicationPage {...CONTENT} />;
}
