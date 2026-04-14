import type { Metadata } from 'next'
import AlpenglowHomeClient from './ALPHomeClient'

const ALP_URL = 'https://aspenalpenglowlimousine.com'

const speakableSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Aspen Alpenglow Limousine | Luxury Transportation in Aspen, CO',
  url: ALP_URL,
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1.alp-speak-hero', '.alp-speak-intro', '.alp-speak-services-overview'],
  },
}

export const metadata: Metadata = {
  alternates: {
    canonical: ALP_URL,
  },
}

export default function AlpenglowPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      <AlpenglowHomeClient />
    </>
  )
}
