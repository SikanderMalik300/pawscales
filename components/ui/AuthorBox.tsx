import Link from 'next/link';

/**
 * Author box (design.md v2 7.9): white card, 1px --line, radius 16, padding 20.
 * 48px circle monogram "SM" (--sage bg, --brand text, 18/600). No stock photo.
 */
export function AuthorBox({ updated }: { updated?: string }) {
  return (
    <aside className="rounded-[16px] border border-line bg-white p-5">
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage text-[18px] font-semibold text-brand"
        >
          SM
        </span>
        <div>
          <p className="text-[16px] font-semibold text-ink">By Sikander Malik</p>
          <p className="mt-1 text-[16px] leading-[1.6] text-ink">
            Sikander builds PawScales from published veterinary research and open
            data, and reviews every page before it goes live. He grew up with
            Bravo, a Gull Dong.
          </p>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[14px]">
            <Link href="/authors/sikander-malik/" prefetch={false} className="link">
              About Sikander
            </Link>
            <Link href="/editorial-policy/" prefetch={false} className="link">
              Editorial policy
            </Link>
          </p>
          {updated && (
            <p className="mt-2 text-[13px] text-muted">Last updated: {updated}</p>
          )}
        </div>
      </div>
    </aside>
  );
}
