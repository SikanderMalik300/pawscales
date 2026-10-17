'use client';

import { useEffect } from 'react';

// Defensive fallback (pawscales-day8). Our pages are statically pre-rendered, so
// a failed JS chunk after a new deploy leaves the server HTML (content + canonical)
// in place rather than wiping it (confirmed by scripts/chunk-resilience.mjs). This
// boundary only renders if the root ever throws on the client; if it does, keep a
// self-referencing canonical and a reload prompt instead of a bare error screen.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.querySelector('link[rel="canonical"]')) {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = window.location.origin + window.location.pathname;
      document.head.appendChild(link);
    }
  }, []);

  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 640, margin: '12vh auto', padding: '0 24px', color: '#111312' }}>
        <h1 style={{ fontSize: 28, fontWeight: 600 }}>Something did not load</h1>
        <p style={{ fontSize: 16, lineHeight: 1.6 }}>
          The page did not finish loading, usually a brief network hiccup. The
          information is still here. Reload to see it.
        </p>
        <button
          type="button"
          onClick={() => (typeof window !== 'undefined' ? window.location.reload() : reset())}
          style={{ height: 44, padding: '0 22px', borderRadius: 999, background: '#111312', color: '#fff', border: 0, fontSize: 15, cursor: 'pointer' }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
