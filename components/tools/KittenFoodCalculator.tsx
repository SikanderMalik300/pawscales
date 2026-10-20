'use client';

import { useMemo, useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Segmented } from '@/components/ui/Segmented';
import {
  ResultPanel, Overline, ResultNumber, SecondaryRow, ResultDivider,
} from '@/components/ui/ResultPanel';
import { ShowMath } from '@/components/ui/ShowMath';
import { catFood } from '@/lib/calc/catFood';
import { mealsForMonth } from '@/lib/calc/kittenFeeding';
import { parseNum, lbToKg } from '@/lib/units';

// A focused portion tool for the kitten feeding chart: it takes the kitten's
// weight and age, works out the day's calories (2.5 x RER, the cat food
// calculator's growth stage) and turns that into cups or cans from the kcal
// number on the food label. The full life-stage tool stays at /cat-food-calculator/.
export function KittenFoodCalculator() {
  const [weight, setWeight] = useState('4');
  const [wUnit, setWUnit] = useState<'lb' | 'kg'>('lb');
  const [age, setAge] = useState('4');
  const [pctWet, setPctWet] = useState<'100' | '50' | '0'>('50');
  const [kcalCan, setKcalCan] = useState('100');
  const [kcalCup, setKcalCup] = useState('450');

  const weightNum = parseNum(weight);
  const weightKg = weightNum == null ? NaN : wUnit === 'lb' ? lbToKg(weightNum) : weightNum;
  const ageNum = parseNum(age);
  const r = useMemo(
    () => catFood({
      weightKg, stage: 'growth',
      kcalPerCan: parseNum(kcalCan) ?? NaN,
      kcalPerCup: parseNum(kcalCup) ?? NaN,
      pctWet: Number(pctWet),
    }),
    [weightKg, kcalCan, kcalCup, pctWet],
  );
  const meals = ageNum != null && ageNum > 0 ? mealsForMonth(ageNum) : null;
  const kcalPerMeal = r && meals ? Math.round(r.mer / meals) : null;

  return (
    <div className="rounded-[16px] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-5">
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
            <Field id="can" label="Wet" suffix="kcal/can" value={kcalCan} onChange={(e) => setKcalCan(e.target.value)} helper="From the label" />
            <Field id="cup" label="Dry" suffix="kcal/cup" value={kcalCup} onChange={(e) => setKcalCup(e.target.value)} helper="From the label" />
          </div>
        </div>
        <div className="min-w-0 md:col-span-7">
          <ResultPanel ariaLabel="Daily kitten food">
            {!r ? (
              <p className="text-[16px] text-ink">Enter your kitten&rsquo;s weight to see an estimate.</p>
            ) : (
              <>
                <Overline>Feed about</Overline>
                <ResultNumber value={r.mer} unit="kcal/day" />
                <p className="text-[16px] text-ink">
                  {pctWet !== '0' && <>≈ {r.cansPerDay} cans of wet food</>}
                  {pctWet === '50' && ' + '}
                  {pctWet !== '100' && <>≈ {r.cupsPerDay} cups of dry food</>} a day.
                </p>
                {meals && kcalPerMeal != null && (
                  <p className="mt-1 text-[16px] text-ink">
                    Split into <strong>{meals} meals a day</strong>, about {kcalPerMeal} kcal each.
                  </p>
                )}
                <ResultDivider />
                <SecondaryRow label="Resting energy (RER)" value={`${r.rer} kcal`} />
                <SecondaryRow label="Growth need" value="2.5 × RER (Merck)" />
                <div className="mt-3">
                  <ShowMath>
                    RER = 70 × kg^0.75; kitten kcal = 2.5 × RER. Cups = daily kcal ÷ kcal
                    per cup; cans = daily kcal ÷ kcal per can.
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
