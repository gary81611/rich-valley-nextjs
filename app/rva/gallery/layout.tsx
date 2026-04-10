import type { Metadata } from 'next'

const canonical = 'https://www.richvalleyadventures.com/gallery'

export const metadata: Metadata = {
  title: 'Photo Gallery | Rich Valley Adventures — Aspen Outdoor Experiences',
  description:
    'Photos from guided fly fishing, hiking, biking, and adventures with Rich Valley Adventures in Aspen and the Roaring Fork Valley.',
  alternates: { canonical },
  openGraph: {
    title: 'Photo Gallery | Rich Valley Adventures',
    description: 'Moments from guided adventures with Rich Valley Adventures in Aspen, Colorado.',
    url: canonical,
    siteName: 'Rich Valley Adventures',
    type: 'website',
  },
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children
}
