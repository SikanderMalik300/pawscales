import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getPhoto } from '@/lib/data/photos';
import { Picture } from '@/components/ui/Picture';

/**
 * Photo tile (design.md v2 7.4): 1:1 image radius 4, label + arrow below
 * (16/500), one-line description in muted 14 on desktop. Whole tile links.
 * Hover: photo scales 1.02, label underlines.
 */
export function PhotoTile({
  href,
  photoId,
  label,
  description,
  sizes = '(min-width: 960px) 25vw, 50vw',
}: {
  href: string;
  photoId: string;
  label: string;
  description?: string;
  sizes?: string;
}) {
  const photo = getPhoto(photoId);
  return (
    <Link href={href} prefetch={false} className="group block">
      <div className="aspect-square overflow-hidden rounded-[4px] bg-sand">
        {photo ? (
          <Picture
            photo={photo}
            crop="sq"
            sizes={sizes}
            rounded="rounded-[4px]"
            className="tile-photo group-hover:scale-[1.02]"
          />
        ) : (
          <div className="h-full w-full" aria-hidden="true" />
        )}
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <span className="text-[16px] font-medium text-ink group-hover:underline">
          {label}
        </span>
        <ArrowRight size={16} strokeWidth={1.75} className="text-ink" aria-hidden="true" />
      </div>
      {description && (
        <p className="mt-0.5 hidden text-[14px] text-muted md:block">{description}</p>
      )}
    </Link>
  );
}
