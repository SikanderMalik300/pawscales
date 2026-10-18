import { MedicationPage, type MedicationContent } from '@/components/MedicationPage';
import { NoteBox } from '@/components/ui/NoteBox';
import { PEPCID, PEPCID_CHART_LB } from '@/lib/calc/pepcid';

const TABLE = 'https://www.merckvetmanual.com/multimedia/table/antiulcerative-drugs';
const ULCERS = 'https://www.merckvetmanual.com/pharmacology/systemic-pharmacotherapeutics-of-the-digestive-system/drugs-used-to-treat-gastrointestinal-ulcers-in-monogastric-animals';

const CONTENT: MedicationContent = {
  slug: 'pepcid-dosage-calculator',
  drugName: 'Pepcid',
  quickAnswer: (
    <>
      Pepcid is a brand name for famotidine, a medicine that lowers stomach acid. The
      published dog dose is <strong>0.5 to 1 mg/kg</strong> by mouth, {PEPCID.freq}{' '}
      (Merck Veterinary Manual), roughly 0.25 to 0.5 mg per pound. Enter your dog&rsquo;s
      weight for the amount and a tablet count. Use plain famotidine only, and ask your
      vet first, especially if your dog is vomiting or will not eat.
    </>
  ),
  reviewed:
    'Reviewed against the Merck Veterinary Manual antiulcerative drugs table and its gastrointestinal ulcer drug information, October 2026.',
  calc: {
    minMgKg: PEPCID.minMgKg,
    maxMgKg: PEPCID.maxMgKg,
    freq: PEPCID.freq,
    tablets: PEPCID.tablets,
    defaultTabletMg: PEPCID.defaultTabletMg,
    sourceNote: (
      <>
        Dose from the Merck Veterinary Manual antiulcerative table (famotidine 0.5 to
        1 mg/kg, {PEPCID.freq}). Plain famotidine only. Tablets split in halves.
      </>
    ),
    warning: (
      <>
        Use <strong>plain famotidine</strong> only, not &ldquo;Pepcid Complete&rdquo;.
        See the box below before you buy.
      </>
    ),
  },
  chartWeights: PEPCID_CHART_LB,
  chartSource: (
    <>
      Source: <a className="link" href={TABLE}>Merck Veterinary Manual, Antiulcerative
      Drugs table</a> (famotidine, dogs, 0.5&ndash;1 mg/kg, PO, q24h).
    </>
  ),
  doseIntro: (
    <>
      <h2 className="text-[22px] sm:text-[26px]">How much Pepcid can I give a dog?</h2>
      <p className="mt-2 text-[16px] text-ink">
        Pepcid (famotidine) lowers stomach acid by blocking the H2 receptors on the
        cells that produce it. The published dog dose is <strong>0.5 to 1 mg/kg</strong>{' '}
        by mouth, {PEPCID.freq} (Merck Veterinary Manual), which is roughly 0.25 to 0.5
        mg per pound. It comes as 10 mg and 20 mg tablets; pick the strength that divides
        most cleanly for your dog, in half-tablet steps. The calculator leads with the
        lower amount and shows the full range. Confirm the amount, and how many days to
        use it, with your vet.
      </p>
      <div className="mt-6">
        <NoteBox label="When it is not just an upset stomach" danger>
          Famotidine eases symptoms; it does not fix the underlying cause. Vomiting that
          will not stop, black or tarry stool, blood, a swollen belly, or a dog that will
          not eat needs a vet visit, not just an antacid. Do not use it to put off care
          for a dog that is unwell.
        </NoteBox>
      </div>
    </>
  ),
  productWarning: {
    label: 'Buy plain famotidine, not Pepcid Complete',
    body: (
      <>
        Use a product whose only active ingredient is <strong>famotidine</strong>, such
        as plain Pepcid AC (10 mg) or Maximum Strength (20 mg). Check the active
        ingredient panel, because some products are different:
        <ul className="mt-3 space-y-2">
          <li>
            <strong>&ldquo;Pepcid Complete&rdquo;</strong> also contains calcium
            carbonate and magnesium hydroxide (two antacids). Do not use it.
          </li>
          <li>
            Avoid any combination or flavoured product whose ingredients you cannot
            verify.
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
        to cats. Famotidine is used in cats, but at amounts we cannot confirm from a free,
        public reference, so we will not print a number. Ask your vet for a cat&rsquo;s
        dose.
      </>
    ),
  },
  whoShouldnt: (
    <>
      <p className="mt-2 text-[16px] text-ink">
        Famotidine is usually well tolerated. Talk to your vet before giving it if your
        dog:
      </p>
      <ul className="mt-3 space-y-2 text-[16px] text-ink">
        <li>has kidney or liver disease;</li>
        <li>has heart disease;</li>
        <li>is pregnant or nursing;</li>
        <li>is taking other medicines, which it can interact with;</li>
        <li>is very old, very young or unwell.</li>
      </ul>
      <p className="mt-3 text-[14px] text-muted">
        General precautions for H2 blockers; see the Merck Veterinary Manual{' '}
        <a className="link" href={ULCERS}>gastrointestinal ulcer drug information</a>.
        Famotidine is cleared by the kidneys, so your vet may adjust it for a dog with
        kidney disease.
      </p>
    </>
  ),
  overdose: (
    <>
      <p className="mt-2 text-[16px] text-ink">
        Famotidine has a wide margin, so a single extra tablet rarely causes serious
        harm. A large overdose could cause:
      </p>
      <ul className="mt-3 space-y-2 text-[16px] text-ink">
        <li>vomiting or restlessness;</li>
        <li>a fast or irregular heartbeat;</li>
        <li>pale gums or weakness from low blood pressure.</li>
      </ul>
      <p className="mt-3 text-[16px] text-ink">
        If your dog ate a lot of tablets, or you gave much more than the amounts above,
        call your vet or the ASPCA right away.
      </p>
    </>
  ),
  faq: [
    {
      q: 'How often can I give Pepcid to a dog?',
      a: 'The published dog dose is once a day (every 24 hours), per the Merck Veterinary Manual antiulcerative table. Some vets prescribe it every 12 hours for certain problems. Follow your vet’s instructions.',
    },
    {
      q: 'Should I use 10 mg or 20 mg tablets?',
      a: 'Both are plain famotidine. Pick the strength that divides most cleanly for your dog’s weight, in half-tablet steps. Small dogs usually use the 10 mg tablet; larger dogs may use 20 mg. The calculator shows both.',
    },
    {
      q: 'Can I use Pepcid Complete?',
      a: 'No. "Pepcid Complete" adds calcium carbonate and magnesium hydroxide. Use a product whose only active ingredient is famotidine, and read the box every time.',
    },
    {
      q: 'When should I see a vet instead?',
      a: 'Vomiting that will not stop, black or tarry stool, blood, a swollen belly, or a dog that will not eat needs a vet, not just an antacid. Famotidine eases symptoms; it does not fix the cause.',
    },
    {
      q: 'Can I give Pepcid to my cat?',
      a: 'Ask your vet. We do not show a cat dose here because our source does not give a cat-specific amount we can verify.',
    },
  ],
  sources: [
    <>
      <a className="link" href={TABLE}>Merck Veterinary Manual, Antiulcerative Drugs table</a>{' '}
      (famotidine, dogs, 0.5&ndash;1 mg/kg, PO or IV, q24h).
    </>,
    <>
      <a className="link" href={ULCERS}>Merck Veterinary Manual, Drugs Used to Treat Gastrointestinal Ulcers in Monogastric Animals</a>{' '}
      (famotidine lowers gastric acid; inferior to proton pump inhibitors).
    </>,
    <>
      <a className="link" href="https://www.aspca.org/pet-care/animal-poison-control">ASPCA Animal Poison Control Center</a>{' '}
      (888-426-4435).
    </>,
  ],
};

export function PepcidPage() {
  return <MedicationPage {...CONTENT} />;
}
