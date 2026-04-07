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
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.richvalleyadventures.com' },
        { '@type': 'ListItem', position: 2, name: flyFishingPageTitle, item: pageUrl },
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
