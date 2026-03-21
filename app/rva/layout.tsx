import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rich Valley Adventures | Guided Outdoor Experiences in Aspen, CO',
  description: 'Guided fly fishing, paddle boarding, mountain biking, hiking, and more in Aspen and the Roaring Fork Valley. Small groups, expert local guides, all gear included.',
  keywords: 'Aspen guided adventures, fly fishing Aspen, paddle boarding Roaring Fork, mountain biking Aspen, outdoor guide Aspen Colorado',
  openGraph: {
    title: 'Rich Valley Adventures | Guided Outdoor Experiences in Aspen',
    description: 'Expert-guided fly fishing, paddle boarding, mountain biking & more in the Roaring Fork Valley. Since 2012.',
    type: 'website', locale: 'en_US',
  },
}

export default function RVALayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
