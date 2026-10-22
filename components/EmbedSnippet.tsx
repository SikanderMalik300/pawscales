'use client';

import { useState } from 'react';

/** Read-only embed-code box with a Copy button. No external libraries. */
export function EmbedSnippet({ code, rows = 3 }: { code: string; rows?: number }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked; the box is selectable as a fallback */
    }
  };
  return (
    <div className="overflow-hidden rounded-[12px] border border-line bg-sand">
      <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
        <span className="text-[13px] font-medium text-muted">Embed code</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-8 items-center rounded-full bg-ink px-3 text-[13px] font-medium text-white hover:bg-[#2A2E2C]"
        >
          {copied ? 'Copied' : 'Copy code'}
        </button>
      </div>
      <textarea
        readOnly
        rows={rows}
        value={code}
        aria-label="Embed code"
        onFocus={(e) => e.currentTarget.select()}
        className="block w-full resize-none bg-transparent px-3 py-2 font-mono text-[12px] leading-relaxed text-ink focus:outline-none"
      />
    </div>
  );
}
