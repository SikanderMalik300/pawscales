// Google Analytics 4 + Consent Mode v2 helpers (pawscales-day2-fixes.md Task 3).
// Kept framework-free so they can be unit-tested.

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
export const PROD_HOST = 'pawscales.com';
export const CONSENT_KEY = 'pawscales-consent';

export const isAnalyticsConfigured = (): boolean => !!GA_ID;

// EEA + UK + Switzerland ISO country codes (analytics denied by default here).
export const CONSENT_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES',
  'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
];

// Time zones where we must show the consent banner (Europe + nearby Atlantic).
const EUROPE_EXTRA_TZ = [
  'Atlantic/Reykjavik', 'Atlantic/Canary', 'Atlantic/Madeira', 'Atlantic/Azores',
];

export const isEuropeTimeZone = (tz: string | undefined): boolean =>
  !!tz && (tz.startsWith('Europe/') || EUROPE_EXTRA_TZ.includes(tz));

/** Inline gtag bootstrap. Consent defaults are emitted BEFORE `config`, so Google
 *  honours them: ad storage denied everywhere; analytics granted by default but
 *  denied for the EEA/UK/CH regions until the visitor accepts. */
export function consentInitScript(gaId: string): string {
  const deniedAds = "ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'";
  return [
    'window.dataLayer=window.dataLayer||[];',
    'function gtag(){dataLayer.push(arguments);}',
    `gtag('consent','default',{${deniedAds},analytics_storage:'granted'});`,
    `gtag('consent','default',{region:${JSON.stringify(CONSENT_REGIONS)},${deniedAds},analytics_storage:'denied'});`,
    `try{if(localStorage.getItem('${CONSENT_KEY}')==='granted'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}`,
    "gtag('js',new Date());",
    `gtag('config','${gaId}');`,
  ].join('');
}
