import type { Metadata } from 'next'

const canonical = 'https://www.richvalleyadventures.com/adventures'

export const metadata: Metadata = {
  title: 'Outdoor Adventures in Aspen & Roaring Fork Valley | Rich Valley Adventures',
  description:
    'Fly fishing, whitewater rafting, guided hikes, paddle boarding, and elevated camping in the Colorado Rockies. Small groups, all skill levels, all gear included.',
  alternates: { canonical },
  openGraph: {
    title: 'Outdoor Adventures in Aspen & Roaring Fork Valley | Rich Valley Adventures',
    description:
      'Guided outdoor experiences in Aspen and the Roaring Fork Valley — from fly fishing and hiking to paddle boarding and elevated camping.',
    url: canonical,
    siteName: 'Rich Valley Adventures',
    type: 'website',
  },
}

export default function AdventuresLayout({ children }: { children: React.ReactNode }) {
  return children
}
