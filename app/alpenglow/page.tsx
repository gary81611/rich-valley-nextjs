import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import AlpenglowHomeClient from './ALPHomeClient'
import { AAL_OG_IMAGE } from '@/lib/aal-vehicles'
import { buildHomeFares, loadAalPublishedRoutes } from '@/lib/aal-published-rates'

const aalInter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-aal-inter',
})

const aalCormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-aal-cormorant',
})

/** Fleet paragraph must render from this file, not a stale edge prerender. */
export const dynamic = 'force-dynamic'

const ALP_URL = 'https://aspenalpenglowlimousine.com'

const speakableSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Aspen Car Service & Limousine',
  url: ALP_URL,
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1.alp-speak-hero', '.alp-speak-intro', '.alp-speak-services-overview'],
  },
}

export const metadata: Metadata = {
  title: 'Aspen Car Service & Limousine',
  description:
    'Aspen car service and limousine: private SUV and Transit transfers to ASE, Eagle (EGE) and Denver (DEN). 24/7 since 2012. CO PUC permit LL-04725.',
  alternates: {
    canonical: ALP_URL,
  },
  openGraph: {
    title: 'Aspen Car Service & Limousine',
    description:
      'Private car and limousine service in Aspen and Snowmass. Available 24/7 since 2012.',
    url: ALP_URL,
    type: 'website',
    images: [AAL_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aspen Car Service & Limousine',
    images: [AAL_OG_IMAGE.url],
  },
}

export default async function AlpenglowPage() {
  const fares = buildHomeFares(await loadAalPublishedRoutes())
  return (
    <div className={`${aalInter.variable} ${aalCormorant.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      <AlpenglowHomeClient fares={fares} />
    </div>
  )
}
