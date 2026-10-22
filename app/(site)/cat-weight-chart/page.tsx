import type { Metadata } from 'next';
import { bySlug } from '@/lib/registry';
import { toolMetadata } from '@/lib/seo';
import { CatWeightPage } from '@/components/CatWeightPage';

const tool = bySlug('cat-weight-chart')!;
export const metadata: Metadata = toolMetadata(tool);

export default function Page() {
  return (
    <CatWeightPage
      quickAnswer={
        <>A healthy domestic shorthair kitten weighs roughly 1 lb per month of age
        for the first few months: about 2 lb at 2 months, 4&ndash;5 lb at 4 months
        and 6&ndash;7 lb at 6 months, with males a little heavier than females. Most
        reach their adult weight by about 10 to 12 months. Enter your kitten&rsquo;s
        sex, age and weight to see where it sits.</>
      }
      faq={[
        { q: 'How much should a cat weigh?', a: 'It depends on the cat. In a large study of neutered domestic shorthairs in good body condition, females weighed about 8 to 9 pounds and males about 10 to 11 pounds by 18 months, but a small-framed cat can be lean at less and a large cat healthy at more. Pedigree breeds differ. Body condition matters more than a single target weight, so ask your vet to score your cat.' },
        { q: 'How much should a kitten weigh at 3 months?', a: 'On our kitten weight chart, a neutered domestic shorthair at 3 months is typically about 3.3 pounds for a female and 3.6 pounds for a male, with a normal range of roughly 2.8 to 4.4 pounds. That fits the rough rule of about 1 pound per month of age in the early months. Use the trend over time rather than a single weight.' },
        { q: 'How much should a 6-month-old kitten weigh?', a: 'On our chart, a female domestic shorthair is typically around 5.7 pounds at 6 months and a male around 7.3 pounds, with a wide normal range. A rough rule of thumb is about 1 pound per month of age up to about 6 months. Kittens grow in spurts, so a single weight matters less than a steady upward trend.' },
        { q: 'When do cats stop growing?', a: 'Most domestic shorthair cats reach close to their adult weight by about 10 to 12 months, then fill out a little more into their second year. Some large cats and certain breeds keep growing for longer. After about a year, weight gain should be slow; a sharp rise in an adult usually means gaining fat, not growing.' },
        { q: 'Is my kitten underweight or overweight?', a: 'Our tool compares your kitten&rsquo;s weight with the typical 25th to 75th centile range for its age and sex, but that is weight only. Whether a cat is truly underweight or overweight is a body condition judgement a vet makes by feeling the ribs, waist and tummy. If your kitten is well outside the range, or losing weight, see your vet.' },
        { q: 'Do neutered cats weigh more?', a: 'They tend to. Neutering lowers energy needs and can increase appetite, so neutered cats often gain weight more readily, which is why our main chart uses neutered cats as the realistic case for most pets. The fix is not to avoid neutering but to adjust food after the procedure and keep an eye on body condition.' },
        { q: 'How accurate is this chart?', a: 'It is a well-sourced estimate, not a guarantee. The figures come from research on more than 8,000 neutered domestic shorthair cats in good body condition, measured at US vet clinics. The typical range is wide on purpose, accuracy is best up to 6 months where the data is densest, and pedigree breeds fall outside it. Track your own kitten&rsquo;s trend and body condition.' },
      ]}
    />
  );
}
