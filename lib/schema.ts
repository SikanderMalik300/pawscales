// JSON-LD builders (pawscales-build-spec.md A4). Never AggregateRating, Review,
// HowTo, MedicalWebPage or Product.
import { SITE } from '@/lib/registry';

const PERSON_ID = `${SITE.url}/authors/sikander-malik/#person`;

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url + '/',
    logo: `${SITE.url}/logo-square.png`,
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
}: {
  name: string;
  url: string;
  description: string;
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
    author: { '@id': PERSON_ID },
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
