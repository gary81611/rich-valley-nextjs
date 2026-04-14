import type { Metadata } from 'next'
import RVAHomeClient from './RVAHomeClient'

const RVA_URL = 'https://www.richvalleyadventures.com'

/** Speakable targets use stable class hooks in `RVAHomeClient` (not Squarespace selectors). */
const speakableSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Rich Valley Adventures | Guided Outdoor Experiences in Aspen, CO',
  url: RVA_URL,
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['.rva-speak-hero-intro', 'h1.rva-speak-hero', '.rva-speak-services-intro'],
  },
}

export const metadata: Metadata = {
  alternates: {
    canonical: RVA_URL,
  },
}

export default function RVAPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      <RVAHomeClient />
    </>
  )
}
