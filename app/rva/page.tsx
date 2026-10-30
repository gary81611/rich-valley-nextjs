import type { Metadata } from 'next'
import RVAHomeClient from './RVAHomeClient'
import { loadFishingReportFeed } from '@/lib/fishing-report-feed'

/** Kids callout, featured trips, and the fishing-report feed render per request. */
export const dynamic = 'force-dynamic'
export const revalidate = 0

const RVA_URL = 'https://www.richvalleyadventures.com'

/** Speakable targets use stable class hooks in `RVAHomeClient` (not Squarespace selectors). */
const speakableSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Outdoor Adventures in Aspen, CO | Guided Fly Fishing, Hiking & More | Rich Valley Adventures',
  url: RVA_URL,
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['.rva-speak-hero-intro', 'h1.rva-speak-hero', '.rva-speak-services-intro'],
  },
}

export const metadata: Metadata = {
  title: 'Outdoor Adventures in Aspen, CO | Guided Fly Fishing, Hiking & More | Rich Valley Adventures',
  description:
    'Rich Valley Adventures guides outdoor adventures in Aspen and the Roaring Fork Valley. Fly fishing, hiking, and more, since 2012.',
  alternates: {
    canonical: RVA_URL,
  },
  openGraph: {
    title: 'Outdoor Adventures in Aspen, CO | Guided Fly Fishing, Hiking & More | Rich Valley Adventures',
    description:
      'Guided fly fishing, hiking, and more in Aspen and the Roaring Fork Valley. Since 2012.',
    url: RVA_URL,
    images: [
      {
        url: `${RVA_URL}/images/og/rva-home-maroon-bells-alpine-lake.webp`,
        width: 1200,
        height: 630,
        alt: 'Alpine lake and Maroon Bells peaks near Aspen, Colorado',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`${RVA_URL}/images/og/rva-home-maroon-bells-alpine-lake.webp`],
  },
}

export default async function RVAPage() {
  const feed = await loadFishingReportFeed(1)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      <RVAHomeClient featuredReport={feed[0] ?? null} />
    </>
  )
}
