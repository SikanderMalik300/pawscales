// Dramamine (dimenhydrinate) for dogs (pawscales-day9). Dogs only: the Merck
// "Motion Sickness in Animals" page states antihistamines are ineffective for
// motion sickness in cats, so no cat dose is given.
// Dose: 4-8 mg/kg PO q6-8h (Merck "Antiemetic Drugs" table).
export const DRAMAMINE = {
  minMgKg: 4,
  maxMgKg: 8,
  freq: 'every 6 to 8 hours',
  tablets: [
    { mg: 50, label: '50 mg tablet' },
    { mg: 25, label: '25 mg chewable' },
  ],
  defaultTabletMg: 50,
  source: 'Merck Veterinary Manual',
} as const;

export const DRAMAMINE_CHART_LB = [10, 20, 40, 60, 80, 100];
