import type { Metadata } from 'next';
import { TextPage } from '@/components/TextPage';
import { DataTable } from '@/components/ui/Table';
import { PHOTOS } from '@/lib/data/photos';

export const metadata: Metadata = {
  title: 'Photo Credits — PawScales',
  description: 'Every photo on PawScales, with its photographer, source and license.',
  alternates: { canonical: 'https://pawscales.com/photo-credits/' },
};

export default function Page() {
  return (
    <TextPage title="Photo credits" updated="October 10, 2026">
      <p>
        Every photograph on PawScales is a real photo licensed from Unsplash or
        Pexels. We do not use AI-generated images. Thank you to the photographers
        below.
      </p>
      <DataTable
        columns={[
          { key: 'photo', header: 'Photo' },
          { key: 'by', header: 'Photographer' },
          { key: 'src', header: 'Source' },
        ]}
        rows={PHOTOS.map((p) => ({
          cells: {
            photo: <a className="link" href={p.sourceUrl}>{p.alt}</a>,
            by: <a className="link" href={p.photographerUrl}>{p.photographer}</a>,
            src: <a className="link" href={p.license}>{p.source}</a>,
          },
        }))}
      />
    </TextPage>
  );
}
