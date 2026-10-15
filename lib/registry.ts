// Single source of truth for every tool/data page (pawscales-build-spec.md A2).
// Sitemap, hubs, related links, llms.txt and breadcrumbs all read from here.
// Expanded with full sources/notCovered/related in Step 3; this is the spine.

export type Category = 'dog-calculators' | 'cat-calculators' | 'dog-size-charts';

export interface Source {
  name: string;
  url: string;
  accessed: string; // YYYY-MM-DD
}

export interface ToolEntry {
  slug: string; // e.g. "puppy-weight-calculator"
  title: string; // <title>, <= 60 chars
  metaDescription: string; // <= 155 chars
  h1: string;
  shortName: string; // nav / list label
  oneLiner: string; // one-line description for hubs, home, related rows
  category: Category;
  related: string[]; // slugs
  lastUpdated: string; // YYYY-MM-DD, honest lastmod
  sources: Source[];
  fromOwner: string | null; // "From Sikander" note; null renders nothing
  notCovered: string[];
  thumb?: string; // photo id (lib/data/photos.ts)
  breedPage?: boolean; // breed/size growth chart, shown in its own hub section
}

export const HUBS: {
  slug: Category;
  title: string;
  shortName: string;
  h1: string;
  intro: string;
}[] = [
  {
    slug: 'dog-calculators',
    title: 'Dog Calculators: Weight, Age, Food, Breeding',
    shortName: 'Dog tools',
    h1: 'Dog calculators',
    intro:
      'Free calculators for dog owners, built from published veterinary research and open data. Work out a puppy’s adult weight, your dog’s age in human years, how much to feed, a due date, or a heat cycle. Every number has a source.',
  },
  {
    slug: 'cat-calculators',
    title: 'Cat Calculators: Age and Feeding',
    shortName: 'Cat tools',
    h1: 'Cat calculators',
    intro:
      'Free calculators for cat owners. Convert your cat’s age to human years, estimate a kitten’s age week by week, and work out daily calories and how much wet or dry food to feed. Each tool cites its source.',
  },
  {
    slug: 'dog-size-charts',
    title: 'Dog Size Charts: Crate, Collar, Harness',
    shortName: 'Size charts',
    h1: 'Dog size charts',
    intro:
      'Measure once, buy the right size. Size charts and finders for dog crates, collars and harnesses, with the measuring method and breed examples. Sizes vary by brand, so we show the ranges and cite them.',
  },
];

export const REGISTRY: ToolEntry[] = [
  {
    slug: 'puppy-weight-calculator',
    title: 'Puppy Weight Calculator: Predict Adult Size by Age',
    metaDescription:
      "Estimate your puppy's adult weight from age and current weight, using growth data from 199,000+ vet visits. Free, with a growth chart.",
    h1: 'Puppy Weight Calculator',
    shortName: 'Puppy weight calculator',
    oneLiner: 'Predict adult weight from your puppy’s age and weight.',
    category: 'dog-calculators',
    related: ['puppy-feeding-chart', 'dog-food-calculator', 'dog-crate-size-chart', 'dog-years-calculator', 'dog-harness-size-chart', 'dog-pregnancy-calculator', 'raw-dog-food-calculator'],
    lastUpdated: '2026-10-10',
    sources: [],
    fromOwner: null,
    notCovered: [],
  },
  {
    slug: 'dog-pregnancy-calculator',
    title: 'Dog Pregnancy Calculator: Due Date & Week-by-Week',
    metaDescription:
      "Find your dog's due date from the breeding date. Dogs whelp about 63 days after ovulation. See the full timeline, from day 1 to whelping.",
    h1: 'Dog Pregnancy Calculator',
    shortName: 'Dog pregnancy calculator',
    oneLiner: 'Due date and a week-by-week timeline from the breeding date.',
    category: 'dog-calculators',
    related: ['dog-heat-cycle-calculator', 'puppy-weight-calculator', 'dog-food-calculator'],
    lastUpdated: '2026-10-10',
    sources: [],
    fromOwner: null,
    notCovered: [],
  },
  {
    slug: 'dog-years-calculator',
    title: 'Dog Age Calculator: Dog Years to Human Years',
    metaDescription:
      "Convert your dog's age to human years by size, plus the 2020 DNA-based formula. Includes a full chart from 1 to 16 years.",
    h1: 'Dog Years Calculator',
    shortName: 'Dog years calculator',
    oneLiner: 'Your dog’s age in human years, by size.',
    category: 'dog-calculators',
    related: ['cat-years-calculator', 'puppy-weight-calculator', 'dog-food-calculator', 'dog-heat-cycle-calculator'],
    lastUpdated: '2026-10-10',
    sources: [],
    fromOwner: null,
    notCovered: [],
  },
  {
    slug: 'cat-years-calculator',
    title: 'Cat Years Calculator: Cat Age in Human Years',
    metaDescription:
      'Convert your cat’s age to human years. The first year equals about 15 human years, the second 9 more, then about 4 per year.',
    h1: 'Cat Years Calculator',
    shortName: 'Cat years calculator',
    oneLiner: 'Your cat’s age in human years.',
    category: 'cat-calculators',
    related: ['kitten-age-chart', 'cat-weight-chart', 'cat-food-calculator', 'dog-years-calculator'],
    lastUpdated: '2026-10-10',
    sources: [],
    fromOwner: null,
    notCovered: [],
  },
  {
    slug: 'kitten-age-chart',
    title: "Kitten Age Chart: Tell a Kitten's Age by Week",
    metaDescription:
      'Estimate a kitten’s age from weight, teeth, eyes and ears. Week-by-week chart from birth to 8 weeks, plus adult teeth timing.',
    h1: 'Kitten Age Chart',
    shortName: 'Kitten age chart',
    oneLiner: 'Estimate a kitten’s age from weight, teeth, eyes and ears.',
    category: 'cat-calculators',
    related: ['cat-weight-chart', 'cat-years-calculator', 'cat-food-calculator'],
    lastUpdated: '2026-10-10',
    sources: [],
    fromOwner: null,
    notCovered: [],
  },
  {
    slug: 'dog-crate-size-chart',
    title: 'Dog Crate Size Chart: Find the Right Crate by Size',
    metaDescription:
      'Measure your dog nose to tail base and add 2 to 4 inches. Use our crate size calculator and chart from 18 to 54 inches, with breed examples.',
    h1: 'Dog Crate Size Chart',
    shortName: 'Dog crate size chart',
    oneLiner: 'Find the right crate length from your dog’s measurements.',
    category: 'dog-size-charts',
    related: ['dog-harness-size-chart', 'dog-collar-size-chart', 'puppy-weight-calculator'],
    lastUpdated: '2026-10-10',
    sources: [],
    fromOwner: null,
    notCovered: [],
  },
  {
    slug: 'dog-collar-size-chart',
    title: 'Dog Collar Size Chart: Measure for a Perfect Fit',
    metaDescription:
      'Measure your dog’s neck and add 2 inches for a collar. Size chart from XS to XXL with neck sizes for 25 common breeds.',
    h1: 'Dog Collar Size Chart',
    shortName: 'Dog collar size chart',
    oneLiner: 'Neck measurement to collar size, with a breed chart.',
    category: 'dog-size-charts',
    related: ['dog-harness-size-chart', 'dog-crate-size-chart'],
    lastUpdated: '2026-10-10',
    sources: [],
    fromOwner: null,
    notCovered: [],
  },
  {
    slug: 'dog-harness-size-chart',
    title: 'Dog Harness Size Chart: Measure & Compare Brands',
    metaDescription:
      'Measure your dog’s chest girth and compare harness sizes across popular brands. Free size finder with a breed chart.',
    h1: 'Dog Harness Size Chart',
    shortName: 'Dog harness size chart',
    oneLiner: 'Compare harness sizes across brands from chest girth.',
    category: 'dog-size-charts',
    related: ['dog-collar-size-chart', 'dog-crate-size-chart'],
    lastUpdated: '2026-10-10',
    sources: [],
    fromOwner: null,
    notCovered: [],
  },
  {
    slug: 'dog-food-calculator',
    title: 'Dog Food Calculator: How Much to Feed Your Dog',
    metaDescription:
      'Work out your dog’s daily calories and cups of food from weight and life stage, using the standard vet formula RER = 70 × kg^0.75.',
    h1: 'Dog Food Calculator',
    shortName: 'Dog food calculator',
    oneLiner: 'Daily calories and cups from weight and life stage.',
    category: 'dog-calculators',
    related: ['puppy-feeding-chart', 'raw-dog-food-calculator', 'puppy-weight-calculator', 'cat-food-calculator', 'benadryl-dosage-calculator'],
    lastUpdated: '2026-10-15',
    sources: [],
    fromOwner: null,
    notCovered: [],
  },
  {
    slug: 'puppy-feeding-chart',
    title: 'Puppy Feeding Chart: How Much to Feed by Age',
    metaDescription:
      'How much to feed a puppy by age and adult size, in calories and cups per day. Built on the vet RER formula and growth data, with a meals-per-day guide.',
    h1: 'Puppy Feeding Chart',
    shortName: 'Puppy feeding chart',
    oneLiner: 'How much to feed a puppy by age and adult size.',
    category: 'dog-calculators',
    related: ['dog-food-calculator', 'puppy-weight-calculator', 'raw-dog-food-calculator', 'dog-crate-size-chart'],
    lastUpdated: '2026-10-15',
    sources: [],
    fromOwner: null,
    notCovered: [],
  },
  {
    slug: 'raw-dog-food-calculator',
    title: 'Raw Dog Food Calculator: Grams Per Day by Calories',
    metaDescription:
      'Calculate how much raw food to feed from your dog’s calorie needs and the food’s kcal per pound, plus the % of body weight it works out to.',
    h1: 'Raw Dog Food Calculator',
    shortName: 'Raw dog food calculator',
    oneLiner: 'Grams of raw food per day from calorie needs.',
    category: 'dog-calculators',
    related: ['dog-food-calculator', 'puppy-feeding-chart', 'puppy-weight-calculator'],
    lastUpdated: '2026-10-10',
    sources: [],
    fromOwner: null,
    notCovered: [],
  },
  {
    slug: 'dog-heat-cycle-calculator',
    title: 'Dog Heat Cycle Calculator: Next Heat & Fertile Days',
    metaDescription:
      'Predict your dog’s next heat and fertile window from the first day of her last heat. Dogs cycle about every 7 months, from 4 to 13.',
    h1: 'Dog Heat Cycle Calculator',
    shortName: 'Dog heat cycle calculator',
    oneLiner: 'Next heat and fertile window from the last heat date.',
    category: 'dog-calculators',
    related: ['dog-pregnancy-calculator', 'dog-years-calculator'],
    lastUpdated: '2026-10-10',
    sources: [],
    fromOwner: null,
    notCovered: [],
  },
  {
    slug: 'cat-food-calculator',
    title: 'Cat Food Calculator: How Much Wet & Dry Food',
    metaDescription:
      'Find your cat’s daily calories and how many cans or cups to feed, split between wet and dry food. Uses RER = 70 × kg^0.75.',
    h1: 'Cat Food Calculator',
    shortName: 'Cat food calculator',
    oneLiner: 'Daily calories and cans or cups, split wet and dry.',
    category: 'cat-calculators',
    related: ['cat-weight-chart', 'cat-years-calculator', 'kitten-age-chart', 'benadryl-dosage-calculator', 'dog-food-calculator'],
    lastUpdated: '2026-10-10',
    sources: [],
    fromOwner: null,
    notCovered: [],
  },
  {
    slug: 'benadryl-dosage-calculator',
    title: 'Benadryl Dosage Calculator for Dogs and Cats',
    metaDescription:
      'Work out a diphenhydramine (Benadryl) dose by weight for dogs and cats, from the Merck Veterinary Manual and AAHA guidelines. Ask your vet first.',
    h1: 'Benadryl Dosage Calculator for Dogs and Cats',
    shortName: 'Benadryl dosage calculator',
    oneLiner: 'Diphenhydramine dose by weight for dogs and cats.',
    category: 'dog-calculators',
    related: ['dog-food-calculator', 'cat-food-calculator', 'dog-years-calculator'],
    lastUpdated: '2026-10-16',
    sources: [],
    fromOwner: null,
    notCovered: [],
  },
];

// Breed / size growth-chart pages (grown one per day). Kept out of the main hub
// tiles and shown in a "Breed growth charts" section instead.
export const BREED_PAGES: ToolEntry[] = [
  {
    slug: 'golden-retriever-weight-chart',
    title: 'Golden Retriever Weight Chart: Puppy to Adult by Age',
    metaDescription:
      'See how much a Golden Retriever should weigh at every month, for males and females. Based on growth data from 60,951 dogs and the AKC breed standard.',
    h1: 'Golden Retriever Weight Chart',
    shortName: 'Golden Retriever weight chart',
    oneLiner: 'Golden Retriever weight by month, male and female.',
    category: 'dog-size-charts',
    related: ['puppy-weight-calculator', 'dog-food-calculator', 'dog-crate-size-chart', 'german-shepherd-weight-chart'],
    lastUpdated: '2026-10-14',
    sources: [],
    fromOwner: null,
    notCovered: [],
    breedPage: true,
  },
  {
    slug: 'german-shepherd-weight-chart',
    title: 'German Shepherd Weight Chart: Growth by Month',
    metaDescription:
      'How much should a German Shepherd weigh? Month-by-month weights for males and females, based on growth data from 60,951 dogs and the AKC standard.',
    h1: 'German Shepherd Weight Chart',
    shortName: 'German Shepherd weight chart',
    oneLiner: 'German Shepherd weight by month, male and female.',
    category: 'dog-size-charts',
    related: ['puppy-weight-calculator', 'golden-retriever-weight-chart', 'dog-crate-size-chart', 'dog-food-calculator'],
    lastUpdated: '2026-10-14',
    sources: [],
    fromOwner: null,
    notCovered: [],
    breedPage: true,
  },
  {
    slug: 'goldendoodle-size-chart',
    title: 'Goldendoodle Size Chart: Mini, Medium & Standard',
    metaDescription:
      'Goldendoodle sizes: Petite, Mini, Medium and Standard, with the official GANA height and weight ranges and expected weight by age. Free size estimator.',
    h1: 'Goldendoodle Size Chart',
    shortName: 'Goldendoodle size chart',
    oneLiner: 'Goldendoodle sizes and weight by age, from GANA.',
    category: 'dog-size-charts',
    related: ['bernedoodle-size-chart', 'puppy-weight-calculator', 'dog-crate-size-chart', 'dog-harness-size-chart'],
    lastUpdated: '2026-10-14',
    sources: [],
    fromOwner: null,
    notCovered: [],
    breedPage: true,
  },
  {
    slug: 'bernedoodle-size-chart',
    title: 'Bernedoodle Size Chart: Tiny, Mini & Standard',
    metaDescription:
      'Bernedoodle sizes: Tiny, Miniature, Medium and Standard, with SwissRidge height and weight ranges, expected weight by age, and a parent-breed comparison.',
    h1: 'Bernedoodle Size Chart',
    shortName: 'Bernedoodle size chart',
    oneLiner: 'Bernedoodle sizes and weight by age, with a parent comparison.',
    category: 'dog-size-charts',
    related: ['goldendoodle-size-chart', 'puppy-weight-calculator', 'dog-crate-size-chart', 'dog-harness-size-chart'],
    lastUpdated: '2026-10-14',
    sources: [],
    fromOwner: null,
    notCovered: [],
    breedPage: true,
  },
  {
    slug: 'cavapoo-size-chart',
    title: 'Cavapoo Size Chart: Toy & Miniature Weight by Age',
    metaDescription:
      'How big do Cavapoos get? Toy and Miniature sizes set by the Poodle parent, with AKC parent standards, weight by age, and a parents’-weight estimator.',
    h1: 'Cavapoo Size Chart',
    shortName: 'Cavapoo size chart',
    oneLiner: 'Cavapoo sizes by the Poodle parent, with a parents estimator.',
    category: 'dog-size-charts',
    related: ['goldendoodle-size-chart', 'bernedoodle-size-chart', 'puppy-weight-calculator', 'dog-crate-size-chart'],
    lastUpdated: '2026-10-15',
    sources: [],
    fromOwner: null,
    notCovered: [],
    breedPage: true,
  },
  {
    slug: 'cat-weight-chart',
    title: 'Cat Weight Chart: Kitten Weight by Month',
    metaDescription:
      'How much should a cat weigh? Month-by-month weights for neutered domestic shorthair kittens, male and female, from research data on 8,000+ cats.',
    h1: 'Cat Weight Chart',
    shortName: 'Cat weight chart',
    oneLiner: 'Kitten weight by month, male and female, from vet data.',
    category: 'cat-calculators',
    related: ['kitten-age-chart', 'cat-years-calculator', 'cat-food-calculator'],
    lastUpdated: '2026-10-15',
    sources: [],
    fromOwner: null,
    notCovered: [],
    breedPage: true,
  },
];

const ALL = [...REGISTRY, ...BREED_PAGES];

export const bySlug = (slug: string): ToolEntry | undefined =>
  ALL.find((t) => t.slug === slug);

export const byCategory = (cat: Category): ToolEntry[] =>
  REGISTRY.filter((t) => t.category === cat && !t.breedPage);

export const breedPages = (): ToolEntry[] => BREED_PAGES;

/** Other growth pages in the same category to cross-link (3-5 links). The cat
 *  weight chart sits in its own category, so it is not mixed with the dog pages. */
export const relatedGrowthPages = (slug: string): ToolEntry[] => {
  const self = BREED_PAGES.find((p) => p.slug === slug);
  return BREED_PAGES.filter(
    (p) => p.slug !== slug && (!self || p.category === self.category),
  ).slice(0, 5);
};

export const allPages = (): ToolEntry[] => ALL;

export const SITE = {
  name: 'PawScales',
  url: 'https://pawscales.com',
  email: 'hello@pawscales.com',
  author: 'Sikander Malik',
  authorId: 'https://pawscales.com/authors/sikander-malik/#person',
} as const;
