import type { Photo } from '@/lib/data/photos';

type Crop = 'sq' | 'ld' | 'hero';

const CROPS: Record<Crop, { widths: number[]; w: number; h: number }> = {
  sq: { widths: [300, 600], w: 600, h: 600 },
  ld: { widths: [560, 1120], w: 1120, h: 840 },
  hero: { widths: [720, 1440], w: 1440, h: 960 },
};

/**
 * Responsive <picture> (design.md v2 section 8): AVIF + WebP + JPEG fallback,
 * explicit width/height, object-position from the photo's focal point.
 * `priority` sets eager + high fetchpriority; otherwise lazy + low.
 */
export function Picture({
  photo,
  crop = 'ld',
  sizes = '100vw',
  priority = false,
  className,
  rounded = 'rounded-[16px]',
}: {
  photo: Photo;
  crop?: Crop;
  sizes?: string;
  priority?: boolean;
  className?: string;
  rounded?: string;
}) {
  const c = CROPS[crop];
  const base = `/photos/${photo.id}-${crop}`;
  const srcset = (fmt: string) =>
    c.widths.map((w) => `${base}-${w}.${fmt} ${w}w`).join(', ');

  return (
    <picture>
      <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
      <img
        src={`${base}-${c.widths[c.widths.length - 1]}.jpg`}
        srcSet={srcset('jpg')}
        sizes={sizes}
        width={c.w}
        height={c.h}
        alt={photo.alt}
        loading={priority ? 'eager' : 'lazy'}
        // @ts-expect-error fetchpriority is valid HTML, not yet in React types
        fetchpriority={priority ? 'high' : 'low'}
        decoding="async"
        className={`${rounded} h-full w-full object-cover ${className ?? ''}`}
        style={{ objectPosition: `${photo.focalX * 100}% ${photo.focalY * 100}%` }}
      />
    </picture>
  );
}
