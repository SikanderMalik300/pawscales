import { cn } from '@/lib/cn';

/**
 * Wordmark "PawScales" in Newsreader 600, "Scales" in brand green, with an
 * optional small brand square holding three white ruler ticks (design.md 9).
 * No paw-print clip art, no animal silhouette.
 */
export function Logo({
  className,
  withMark = true,
}: {
  className?: string;
  withMark?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      {withMark && (
        <span
          aria-hidden="true"
          className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] bg-brand"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2.5" y="7" width="1.6" height="6" rx="0.4" fill="#fff" />
            <rect x="7.2" y="3.5" width="1.6" height="9.5" rx="0.4" fill="#fff" />
            <rect x="11.9" y="5.5" width="1.6" height="7.5" rx="0.4" fill="#fff" />
          </svg>
        </span>
      )}
      <span className="font-heading text-[20px] font-semibold leading-none text-ink">
        Paw<span className="text-brand">Scales</span>
      </span>
    </span>
  );
}
