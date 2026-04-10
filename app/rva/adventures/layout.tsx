import type { Metadata } from 'next'

const canonical = 'https://www.richvalleyadventures.com/adventures'

export const metadata: Metadata = {
  title: 'Guided Adventures | Rich Valley Adventures — Aspen & Roaring Fork Valley',
  description:
    'Browse guided outdoor adventures in Aspen — fly fishing, mountain biking, paddle boarding, winter trips, and more. Small groups, local guides since 2012.',
  alternates: { canonical },
  openGraph: {
    title: 'Guided Adventures | Rich Valley Adventures',
    description:
      'Browse guided outdoor adventures in Aspen and the Roaring Fork Valley — fly fishing, biking, paddling, and winter experiences.',
    url: canonical,
    siteName: 'Rich Valley Adventures',
    type: 'website',
  },
}

export default function AdventuresLayout({ children }: { children: React.ReactNode }) {
  return children
}
