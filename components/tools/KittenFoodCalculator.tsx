'use client';

import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import {
  ResultPanel, Overline, ResultNumber, SecondaryRow, ResultDivider,
} from '@/components/ui/ResultPanel';
import { ShowMath } from '@/components/ui/ShowMath';
import { rer } from '@/lib/calc/energy';
import {
  kittenFeed, merckKittenKcal, mealsForMonth, portions, MATURE_LB,
  EXAMPLE_KCAL_PER_CAN, EXAMPLE_KCAL_PER_CUP,
} from '@/lib/calc/kittenFeeding';
import type { Sex } from '@/lib/data/catWeight';
import { parseNum, lbToKg } from '@/lib/units';

// Portion tool for the kitten feeding chart. Works out the day's calories from
// the NRC 2006 growth equation (needs current weight, expected adult weight and
// age), then turns them into cups or cans from the kcal figure on the food label
// (the cat food calculator's logic). The full life-stage tool is /cat-food-calculator/.
export function KittenFoodCalculator() {
  const [sex, setSex] = useState<Sex>('F');
  const [weight, setWeight] = useState('4');
  const [wUnit, setWUnit] = useState<'lb' | 'kg'>('lb');
  const [adultWt, setAdultWt] = useState(String(MATURE_LB.F));
  const [age, setAge] = useState('4');
  const [pctWet, setPctWet] = useState<'100' | '50' | '0'>('50');
  const [kcalCan, setKcalCan] = useState(String(EXAMPLE_KCAL_PER_CAN));
  const [kcalCup, setKcalCup] = useState(String(EXAMPLE_KCAL_PER_CUP));

  const onSex = (s: Sex) => { setSex(s); setAdultWt(String(MATURE_LB[s])); };

  const toKg = (n: number) => (wUnit === 'lb' ? lbToKg(n) : n);
  const wNum = parseNum(weight);
  const aNum = parseNum(adultWt);
  const ageNum = parseNum(age);
  const weightKg = wNum == null ? NaN : toKg(wNum);
  const adultKg = aNum == null ? NaN : toKg(aNum);

  const feed = useMemo(() => kittenFeed(weightKg, adultKg, ageNum), [weightKg, adultKg, ageNum]);

  const w = Math.min(100, Math.max(0, Number(pctWet))) / 100;
  const canNum = parseNum(kcalCan) ?? NaN;
  const cupNum = parseNum(kcalCup) ?? NaN;
  const base = feed && feed.kind === 'growth' ? feed.kcal : feed && feed.kind === 'adult' ? feed.neuteredKcal : 0;
  const cans = portions(base * w, canNum);
  const cups = portions(base * (1 - w), cupNum);
  const meals = ageNum != null && ageNum > 0 ? mealsForMonth(ageNum) : null;

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
          <div>
            <p className="mb-1.5 text-[14px] font-medium text-ink">Sex</p>
            <Segmented label="Sex" className="w-full"
              options={[{ value: 'F', label: 'Female' }, { value: 'M', label: 'Male' }]}
              value={sex} onChange={onSex} />
          </div>
          <Field
            id="w" label="Kitten's weight" suffix={wUnit} value={weight}
            onChange={(e) => setWeight(e.target.value)}
            labelRight={
              <Segmented compact label="Weight unit"
                options={[{ value: 'lb', label: 'lb' }, { value: 'kg', label: 'kg' }]}
                value={wUnit} onChange={setWUnit} />
            }
          />
          <Field
            id="adult" label="Expected adult weight" suffix={wUnit} value={adultWt}
            onChange={(e) => setAdultWt(e.target.value)}
            helper="Salt 2023 median; most cats land near this"
          />
          <Field
            id="age" label="Age" suffix="months" value={age}
            onChange={(e) => setAge(e.target.value)}
            helper="For meals a day: 3 until 6 months, then 2"
          />
          <div>
            <p className="mb-1.5 text-[14px] font-medium text-ink">Wet vs dry</p>
            <Segmented scroll label="Wet vs dry" className="w-full"
              options={[
                { value: '100', label: 'All wet' },
                { value: '50', label: 'Half and half' },
                { value: '0', label: 'All dry' },
              ]}
              value={pctWet} onChange={setPctWet} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field id="can" label="Wet" suffix="kcal/can" value={kcalCan} onChange={(e) => setKcalCan(e.target.value)} helper="Example; use your label" />
            <Field id="cup" label="Dry" suffix="kcal/cup" value={kcalCup} onChange={(e) => setKcalCup(e.target.value)} helper="Example; use your label" />
          </div>
        </div>
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Daily kitten food">
            {!feed ? (
              <p className="text-[16px] text-ink">Enter your kitten&rsquo;s weight and expected adult weight.</p>
            ) : feed.kind === 'over' ? (
              <p className="text-[16px] text-ink">
                Your kitten is already at or above the expected adult weight. Ask your vet
                about adult feeding, or use the{' '}
                <a className="link" href="/cat-food-calculator/">cat food calculator</a>.
              </p>
            ) : feed.kind === 'adult' ? (
              <>
                <Overline>Feed as an adult now</Overline>
                <ResultNumber value={feed.neuteredKcal} unit="kcal/day (neutered)" />
                <p className="text-[16px] text-ink">
                  Or about {feed.intactKcal} kcal/day if not neutered.
                  {pctWet !== '0' && <> ≈ {cans} cans</>}
                  {pctWet === '50' && ' +'}
                  {pctWet !== '100' && <> ≈ {cups} cups</>} a day.
                </p>
                <p className="mt-2 text-[13px] text-muted">
                  Within 5% of the expected adult weight (or 12 months or older), so feed
                  as an adult. The{' '}
                  <a className="link" href="/cat-food-calculator/">cat food calculator</a>{' '}
                  covers adult life stages.
                </p>
              </>
            ) : (
              <>
                <Overline>Feed about</Overline>
                <ResultNumber value={feed.kcal} unit="kcal/day" />
                <p className="text-[16px] text-ink">
                  {pctWet !== '0' && <>≈ {cans} cans of wet food</>}
                  {pctWet === '50' && ' + '}
                  {pctWet !== '100' && <>≈ {cups} cups of dry food</>} a day.
                </p>
                {meals != null && (
                  <p className="mt-1 text-[16px] text-ink">
                    Split into <strong>{meals} meals a day</strong>, about {Math.round(feed.kcal / meals)} kcal each.
                  </p>
                )}
                <ResultDivider />
                <SecondaryRow label="Resting energy (RER)" value={`${Math.round(rer(weightKg))} kcal`} />
                <SecondaryRow label="Merck rule of thumb" value={`${merckKittenKcal(weightKg)} kcal (2.5 × RER)`} />
                <div className="mt-3">
                  <ShowMath>
                    NRC 2006 growth: ME = 100 × BW^0.67 × 6.7 × (e^(−0.189p) − 0.66),
                    p = weight ÷ adult weight. Cups = daily kcal ÷ kcal per cup; cans =
                    daily kcal ÷ kcal per can.
                  </ShowMath>
                </div>
                <p className="mt-3 text-[13px] text-muted">
                  A starting point only; adjust to keep your kitten in good body
                  condition, and ask your vet. Kittens can also be fed free choice (Merck).
                </p>
              </>
            )}
          </ResultPanel>
        </div>
      </div>
    </div>
  );
}
