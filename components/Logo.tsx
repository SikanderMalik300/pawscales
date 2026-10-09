import { cn } from '@/lib/cn';

/**
 * Wordmark "PawScales" in Figtree 600, ink, letter-spacing -0.02em, with an
 * optional 24px brand square holding three white ticks of rising height (a
 * scale) (design.md v2 section 9). No paw clip art.
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
          className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] bg-brand"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="2" y="8" width="1.6" height="4" rx="0.4" fill="#fff" />
            <rect x="6.2" y="5" width="1.6" height="7" rx="0.4" fill="#fff" />
            <rect x="10.4" y="2.5" width="1.6" height="9.5" rx="0.4" fill="#fff" />
          </svg>
        </span>
      )}
      <span className="text-[20px] font-semibold leading-none tracking-[-0.02em] text-ink">
        PawScales
      </span>
    </span>
  );
}
