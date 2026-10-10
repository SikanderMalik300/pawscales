'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import {
  GA_ID, PROD_HOST, CONSENT_KEY, isEuropeTimeZone, consentInitScript,
} from '@/lib/ga';
import { cn } from '@/lib/cn';

// Minimal gtag typing on window.
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * GA4 with Consent Mode v2. Only loads on the production host, so previews and
 * localhost send no hits. Ad storage stays denied everywhere; analytics is
 * granted by default except in the EEA/UK/CH, where a banner asks first.
 */
export function Analytics() {
  const [enabled, setEnabled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!GA_ID || window.location.hostname !== PROD_HOST) return;
    setEnabled(true);
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!stored && isEuropeTimeZone(tz)) setShowBanner(true);
    } catch {
      /* storage/Intl blocked; leave banner hidden */
    }
    const reopen = () => setShowBanner(true);
    window.addEventListener('pawscales:cookies', reopen);
    return () => window.removeEventListener('pawscales:cookies', reopen);
  }, []);

  if (!GA_ID || !enabled) return null;

  const choose = (granted: boolean) => {
    try {
      localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied');
    } catch {
      /* ignore */
    }
    window.gtag?.('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
    });
    setShowBanner(false);
  };

  return (
    <>
      <Script id="ga-consent" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: consentInitScript(GA_ID) }} />
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />

      {showBanner && (
        <div
          role="dialog"
          aria-label="Cookie choices"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white p-4 shadow-card"
        >
          <div className="container-page flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-prose text-[14px] text-ink">
              We use privacy-friendly analytics to see which tools help most. No ads,
              no cross-site tracking. Accept analytics cookies?
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => choose(false)}
                className={cn('inline-flex h-10 items-center rounded-full border border-ink bg-white px-5 text-[14px] font-medium text-ink hover:bg-sand')}
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => choose(true)}
                className={cn('inline-flex h-10 items-center rounded-full bg-brand px-5 text-[14px] font-medium text-white hover:bg-brand-hover')}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
