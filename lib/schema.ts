// JSON-LD builders (pawscales-build-spec.md A4). Never AggregateRating, Review,
// HowTo, MedicalWebPage or Product.
import { SITE } from '@/lib/registry';

const PERSON_ID = `${SITE.url}/authors/sikander-malik/#person`;
const AUTHOR_URL = `${SITE.url}/authors/sikander-malik/`;

/** The site author as a Person node, for author fields on page schema. */
const authorPerson = () => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  name: SITE.author,
  url: AUTHOR_URL,
});

/** WebPage node for a content page, with author and publish/modify dates (and,
 *  for medication/health pages, lastReviewed). datePublished and dateModified
 *  both use the registry lastUpdated, the one date we track per page. */
export function webPageSchema({
  name,
  url,
  description,
  lastUpdated,
  reviewed = false,
}: {
  name: string;
  url: string;
  description?: string;
  lastUpdated: string; // YYYY-MM-DD
  reviewed?: boolean;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    url,
    ...(description ? { description } : {}),
    datePublished: lastUpdated,
    dateModified: lastUpdated,
    ...(reviewed ? { lastReviewed: lastUpdated } : {}),
    author: authorPerson(),
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url + '/',
    logo: `${SITE.url}/logo-square-512.png`,
    email: SITE.email,
    founder: { '@id': PERSON_ID },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url + '/',
  };
}

export function breadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      ...(it.url ? { item: it.url } : {}),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

export function webApplicationSchema({
  name,
  url,
  description,
  lastUpdated,
}: {
  name: string;
  url: string;
  description: string;
  lastUpdated?: string; // YYYY-MM-DD
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    url,
    description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
    ...(lastUpdated ? { datePublished: lastUpdated, dateModified: lastUpdated } : {}),
    author: authorPerson(),
  };
}

export function datasetSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Canine growth standard ratios by size category',
    description:
      'Weight-for-age ratios for dogs by adult-size category, derived from growth data on healthy, lean-as-adult dogs seen at US primary-care veterinary clinics.',
    creator: {
      '@type': 'Organization',
      name: 'Salt C, Morris PJ, German AJ, et al. (University of Liverpool / WALTHAM)',
    },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isBasedOn: 'https://datacat.liverpool.ac.uk/377/',
  };
}

export function catDatasetSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Domestic shorthair cat weight by age and sex',
    description:
      'Median and 25th-75th centile bodyweight by month for neutered and intact domestic shorthair cats in optimal body condition, from US primary-care veterinary records.',
    creator: {
      '@type': 'Organization',
      name: 'Salt C, German AJ, Butterwick RF, et al. (University of Liverpool / WALTHAM)',
    },
    license: 'https://creativecommons.org/licenses/by/3.0/',
    isBasedOn: [
      'https://datacat.liverpool.ac.uk/1459/',
      'https://datacat.liverpool.ac.uk/1456/',
    ],
  };
}
