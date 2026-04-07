import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/templates/ServicePageTemplate'
import {
  flyFishingPageTitle,
  flyFishingServiceContent,
} from '@/lib/rva-fly-fishing-content'

const pageUrl = 'https://www.richvalleyadventures.com/rva/fly-fishing'

export const metadata: Metadata = {
  title: 'Guided Fly Fishing Aspen CO | Roaring Fork River | Rich Valley Adventures',
  description:
    'Expert-guided fly fishing on the Roaring Fork, Frying Pan, Colorado, and Gunnison Rivers, plus private water near Aspen, CO. All skill levels. Equipment provided.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Guided Fly Fishing in Aspen | Rich Valley Adventures',
    description:
      'Gold Medal waters, Gunnison River floats, and exclusive private water — guided by local experts since 2012.',
    type: 'website',
    url: pageUrl,
  },
}

export default function FlyFishingPage() {
  const content = flyFishingServiceContent
  const faqs = content.faqs ?? []

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.richvalleyadventures.com/rva' },
        { '@type': 'ListItem', position: 2, name: flyFishingPageTitle, item: pageUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': ['LocalBusiness', 'TouristInformationCenter'],
      name: 'Rich Valley Adventures',
      url: 'https://www.richvalleyadventures.com/rva',
      telephone: '+19704563666',
      email: 'kit@richvalleyadventures.com',
      description:
        'Expert-guided fly fishing, hiking, mountain biking, paddle boarding, hunting, and elevated camping in Aspen, Colorado and the Roaring Fork Valley since 2012.',
      priceRange: '$$$$',
      openingHours: 'Mo-Su 00:00-23:59',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '',
        addressLocality: 'Aspen',
        addressRegion: 'CO',
        postalCode: '81611',
        addressCountry: 'US',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 39.1911, longitude: -106.8175 },
      sameAs: [
        'https://www.facebook.com/richvalleyadventures',
        'https://www.instagram.com/richvalleyadventures',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: flyFishingPageTitle,
      description: content.intro.slice(0, 320),
      url: pageUrl,
      provider: {
        '@type': 'LocalBusiness',
        name: 'Rich Valley Adventures',
        telephone: '+19704563666',
        address: { '@type': 'PostalAddress', addressLocality: 'Aspen', addressRegion: 'CO', addressCountry: 'US' },
      },
      areaServed: { '@type': 'City', name: 'Aspen', containedInPlace: { '@type': 'State', name: 'Colorado' } },
    },
  ]

  if (faqs.length > 0) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    })
  }

  return (
    <>
      <div className="h-[86px]" />
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ServicePageTemplate site="rva" title={flyFishingPageTitle} content={content} />
    </>
  )
}
