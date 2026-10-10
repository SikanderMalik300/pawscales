import { describe, it, expect } from 'vitest';
import {
  isAnalyticsConfigured,
  isEuropeTimeZone,
  consentInitScript,
  CONSENT_REGIONS,
} from '@/lib/ga';

describe('GA4 consent helpers', () => {
  it('analytics is not configured without NEXT_PUBLIC_GA_ID (so nothing renders)', () => {
    // In the test environment the env var is unset, so GA is off.
    expect(process.env.NEXT_PUBLIC_GA_ID).toBeUndefined();
    expect(isAnalyticsConfigured()).toBe(false);
  });

  it('consent defaults are emitted before gtag config', () => {
    const s = consentInitScript('G-FLH62BEG4Q');
    const firstConsent = s.indexOf("gtag('consent','default'");
    const config = s.indexOf("gtag('config'");
    expect(firstConsent).toBeGreaterThan(-1);
    expect(config).toBeGreaterThan(firstConsent);
  });

  it('ad storage is denied in both consent defaults; analytics denied only by region', () => {
    const s = consentInitScript('G-X');
    expect(s).toContain("ad_storage:'denied'");
    expect(s).toContain("ad_user_data:'denied'");
    expect(s).toContain("ad_personalization:'denied'");
    // global default grants analytics, region default denies it
    expect(s).toContain("analytics_storage:'granted'");
    expect(s).toContain("analytics_storage:'denied'");
    expect(s).toContain('"GB"');
    expect(s).toContain('"CH"');
  });

  it('config uses the given measurement id', () => {
    expect(consentInitScript('G-ABC123')).toContain("gtag('config','G-ABC123')");
  });

  it('EEA/UK/CH region list has 32 codes incl. UK and Switzerland', () => {
    expect(CONSENT_REGIONS).toHaveLength(32);
    expect(CONSENT_REGIONS).toContain('GB');
    expect(CONSENT_REGIONS).toContain('CH');
    expect(CONSENT_REGIONS).toContain('DE');
  });

  it('europe time zones trigger the banner; others do not', () => {
    expect(isEuropeTimeZone('Europe/London')).toBe(true);
    expect(isEuropeTimeZone('Europe/Berlin')).toBe(true);
    expect(isEuropeTimeZone('Atlantic/Reykjavik')).toBe(true);
    expect(isEuropeTimeZone('Atlantic/Azores')).toBe(true);
    expect(isEuropeTimeZone('America/New_York')).toBe(false);
    expect(isEuropeTimeZone('Asia/Tokyo')).toBe(false);
    expect(isEuropeTimeZone(undefined)).toBe(false);
  });
});
