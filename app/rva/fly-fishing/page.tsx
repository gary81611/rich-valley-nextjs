import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/templates/ServicePageTemplate'
import {
  flyFishingPageTitle,
  flyFishingServiceContent,
} from '@/lib/rva-fly-fishing-content'
import { rvaServicePageRelatedBlogLinks } from '@/lib/rva-blog-pillars'

const pageUrl = 'https://www.richvalleyadventures.com/fly-fishing'

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
      '@type': ['LocalBusiness', 'TouristInformationCenter'],
      name: 'Rich Valley Adventures',
      url: 'https://www.richvalleyadventures.com',
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
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Book a Guided Fly Fishing Trip in Aspen, CO',
      description:
        'Book a guided fly fishing trip with Rich Valley Adventures on Gold Medal waters including the Roaring Fork River. All skill levels welcome. Equipment provided.',
      totalTime: 'PT4H',
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: '150-350',
      },
      step: [
        {
          '@type': 'HowToStep',
          name: 'Choose your trip type',
          text: 'Select a half-day (4 hours) or full-day (8 hours) guided fly fishing trip. Choose from the Roaring Fork River, Frying Pan River, or Crystal River.',
        },
        {
          '@type': 'HowToStep',
          name: 'Select your date and group size',
          text: 'Rich Valley Adventures runs small groups of 2–6 guests. Book in advance, especially for summer weekends.',
        },
        {
          '@type': 'HowToStep',
          name: 'Submit your booking request',
          text: 'Use the booking form at richvalleyadventures.com/contact or call 970-456-3666. No prior fly fishing experience required.',
        },
        {
          '@type': 'HowToStep',
          name: 'Prepare for your trip',
          text: 'All rods, reels, flies, waders, and boots are included. Bring sunscreen, layers, and snacks. A Colorado fishing license is required — your guide can help you obtain one.',
        },
      ],
      supply: [
        { '@type': 'HowToSupply', name: 'Colorado Fishing License' },
        { '@type': 'HowToSupply', name: 'Sunscreen and layers' },
      ],
      tool: [
        { '@type': 'HowToTool', name: 'Fly rod (provided)' },
        { '@type': 'HowToTool', name: 'Waders and wading boots (provided)' },
        { '@type': 'HowToTool', name: 'Flies and tackle (provided)' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SportsActivityLocation',
      name: 'Rich Valley Adventures — Guided Fly Fishing',
      description:
        'Expert-guided fly fishing on the Gold Medal Roaring Fork River, Frying Pan River, and Crystal River near Aspen, Colorado.',
      url: pageUrl,
      telephone: '+19704563666',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Aspen',
        addressLocality: 'Aspen',
        addressRegion: 'CO',
        postalCode: '81611',
        addressCountry: 'US',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 39.1911, longitude: -106.8175 },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '07:00',
          closes: '18:00',
        },
      ],
      priceRange: '$150–$350 per person',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '200',
        bestRating: '5',
        worstRating: '1',
      },
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
      <ServicePageTemplate
        site="rva"
        title={flyFishingPageTitle}
        content={content}
        relatedLinks={rvaServicePageRelatedBlogLinks('fly-fishing')}
      />
    </>
  )
}
