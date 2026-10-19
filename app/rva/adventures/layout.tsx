import type { Metadata } from 'next'

const canonical = 'https://www.richvalleyadventures.com/adventures'

export const metadata: Metadata = {
  title: 'Outdoor Adventures in Aspen & Roaring Fork Valley | Rich Valley Adventures',
  description:
    'Fly fishing, whitewater rafting, guided hikes, and elevated camping in the Colorado Rockies. Paddleboarding is a rental from $100, not a guided trip.',
  alternates: { canonical },
  openGraph: {
    title: 'Outdoor Adventures in Aspen & Roaring Fork Valley | Rich Valley Adventures',
    description:
      'Guided outdoor experiences in Aspen and the Roaring Fork Valley — fly fishing, hiking, and elevated camping. Paddleboard rentals from $100.',
    url: canonical,
    siteName: 'Rich Valley Adventures',
    type: 'website',
  },
}

export default function AdventuresLayout({ children }: { children: React.ReactNode }) {
  return children
}
