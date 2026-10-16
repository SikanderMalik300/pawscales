'use client';

import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import {
  ResultPanel, Overline, ResultNumber, SecondaryRow, ResultDivider,
} from '@/components/ui/ResultPanel';
import { chocolateDose, CHOC_TYPES, THRESHOLDS, type ChocKey, type Band } from '@/lib/calc/chocolate';
import { parseNum } from '@/lib/units';

const HEADLINE: Record<Band, string> = {
  low: 'Below the usual toxic dose',
  upset: 'Enough for stomach upset',
  cardiac: 'Emergency: heart effects possible',
  seizure: 'Emergency: seizure risk',
};

const DETAIL: Record<Band, string> = {
  low: 'Below the usual toxic dose. Puppies, small dogs and dogs with heart problems can react at lower amounts, so call your vet or the ASPCA to confirm.',
  upset: 'Enough to cause stomach upset such as vomiting, diarrhoea and restlessness. Call your vet or the ASPCA now.',
  cardiac: 'Enough for heart effects such as a racing heart or an abnormal rhythm. This is an emergency. Call your vet or the ASPCA now.',
  seizure: 'Enough to cause seizures and be life-threatening. Go to an emergency vet now, and call the ASPCA on the way.',
};

export function ChocolateCalculator() {
  const [typeKey, setTypeKey] = useState<ChocKey>('milk');
  const [amount, setAmount] = useState('2');
  const [amountUnit, setAmountUnit] = useState<'oz' | 'g'>('oz');
  const [weight, setWeight] = useState('20');
  const [weightUnit, setWeightUnit] = useState<'lb' | 'kg'>('lb');

  const amt = parseNum(amount);
  const wt = parseNum(weight);
  const r = useMemo(
    () => (amt != null && wt != null
      ? chocolateDose({ typeKey, amount: amt, amountUnit, weight: wt, weightUnit })
      : null),
    [typeKey, amt, amountUnit, wt, weightUnit],
  );
  const serious = r != null && r.mgPerKg >= THRESHOLDS.upset;

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
          <div>
            <p className="mb-1.5 text-[14px] font-medium text-ink">Type of chocolate</p>
            <select aria-label="Type of chocolate" value={typeKey}
              onChange={(e) => setTypeKey(e.target.value as ChocKey)}
              className="h-12 w-full rounded-[12px] border border-field bg-white px-3 text-[16px] text-ink">
              {CHOC_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
            </select>
            <p className="mt-1.5 text-[13px] text-muted">
              For very dark chocolate (70% cacao or more), choose Very dark, or
              Unsweetened if you&rsquo;re not sure.
            </p>
          </div>
          <Field id="amt" label="Amount eaten" suffix={amountUnit} value={amount}
            onChange={(e) => setAmount(e.target.value)}
            labelRight={
              <Segmented compact label="Amount unit"
                options={[{ value: 'oz', label: 'oz' }, { value: 'g', label: 'g' }]}
                value={amountUnit} onChange={setAmountUnit} />
            } />
          <Field id="wt" label="Dog's weight" suffix={weightUnit} value={weight}
            onChange={(e) => setWeight(e.target.value)}
            labelRight={
              <Segmented compact label="Weight unit"
                options={[{ value: 'lb', label: 'lb' }, { value: 'kg', label: 'kg' }]}
                value={weightUnit} onChange={setWeightUnit} />
            } />
        </div>
        <div className="min-w-0 md:col-span-7">
          <div className="mb-3 rounded-[12px] bg-sand px-3 py-2 text-[14px] text-ink">
            If the product also has <strong>xylitol</strong> (sugar-free),{' '}
            <strong>raisins</strong> or <strong>macadamia nuts</strong>, call your vet or
            the ASPCA now, whatever this result says. Those are dangerous on their own.
          </div>
          <ResultPanel ariaLabel="Chocolate toxicity result">
            {!r ? (
              <p className="text-[16px] text-ink">Enter the type, amount and your dog&rsquo;s weight.</p>
            ) : (
              <>
                <Overline>Estimated dose</Overline>
                <ResultNumber value={String(r.mgPerKg)} unit="mg/kg of theobromine + caffeine" />
                <p className="text-[18px] font-semibold text-ink">{HEADLINE[r.band]}</p>
                <p className="mt-1 text-[15px] text-ink">{DETAIL[r.band]}</p>
                <ResultDivider />
                <SecondaryRow label="Chocolate eaten" value={`${r.grams} g (${r.mg} mg total)`} />
                <SecondaryRow label="Thresholds (mg/kg)" value={`upset ${THRESHOLDS.upset}, heart ${THRESHOLDS.cardiac}, seizures ${THRESHOLDS.seizure}`} />
                {serious && (
                  <p className="mt-3 text-[14px] text-ink">
                    If it was eaten in the last 1 to 2 hours, call now. Your vet may be
                    able to make your dog vomit before it is absorbed.
                  </p>
                )}
                <p className="mt-2 text-[14px] font-medium text-ink">
                  Call your vet or the ASPCA Animal Poison Control Center at
                  (888) 426-4435 (a consultation fee may apply).
                </p>
                <p className="mt-2 text-[13px] text-muted">
                  Don&rsquo;t make your dog vomit at home unless a vet tells you to.
                </p>
              </>
            )}
          </ResultPanel>
        </div>
      </div>
    </div>
  );
}
