'use client';

/** Footer link that reopens the cookie consent banner (Analytics listens). */
export function CookieSettings() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('pawscales:cookies'))}
      className="text-[14px] text-muted hover:text-brand"
    >
      Cookie settings
    </button>
  );
}
