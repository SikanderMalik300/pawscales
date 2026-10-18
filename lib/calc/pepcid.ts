// Pepcid (famotidine) for dogs (pawscales-day9). Dogs only for now: the Merck
// "Antiulcerative Drugs" table lists famotidine for dogs (and horses) but not
// cats, and every number we show must come from a source we can verify.
// Dose: 0.5-1 mg/kg PO q24h (Merck "Antiulcerative Drugs" table).
export const PEPCID = {
  minMgKg: 0.5,
  maxMgKg: 1,
  freq: 'every 24 hours',
  tablets: [
    { mg: 10, label: '10 mg tablet' },
    { mg: 20, label: '20 mg tablet' },
  ],
  defaultTabletMg: 10,
  source: 'Merck Veterinary Manual',
} as const;

// 10 lb shows the no-tablet message (half of a 10 mg tablet is over the dose);
// 12 lb is the first weight a half tablet fits.
export const PEPCID_CHART_LB = [10, 12, 20, 40, 60, 80, 100];
