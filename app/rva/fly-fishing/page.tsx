import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/templates/ServicePageTemplate'
import {
  flyFishingPageTitle,
  flyFishingServiceContent,
} from '@/lib/rva-fly-fishing-content'
import { rvaServicePageRelatedBlogLinks } from '@/lib/rva-blog-pillars'
import { RVA_FLOAT_PHOTO } from '@/lib/rva-kit-photos'
import { RVA_LICENSES_LINE } from '@/lib/rva-confirmed'

/** The prerendered HTML was stuck on the Vercel edge as STALE after the copy change. Render each request from this file. */
export const dynamic = 'force-dynamic'

const pageUrl = 'https://www.richvalleyadventures.com/fly-fishing'

export const metadata: Metadata = {
  title: 'Aspen Fly Fishing Guides | Roaring Fork, Fryingpan & Private Water | Rich Valley Adventures',
  description:
    'Expert-guided fly fishing on the Roaring Fork, Frying Pan, Colorado, and Gunnison Rivers, plus private water near Aspen, CO. All skill levels. Equipment provided.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Aspen Fly Fishing Guides | Roaring Fork, Fryingpan & Private Water | Rich Valley Adventures',
    description:
      'Gold Medal waters, Gunnison River floats, and private water — guided by local experts since 2012.',
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
        'Expert-guided fly fishing, hiking, mountain biking, paddleboard rentals, hunting from $250 per person, and elevated camping in Aspen, Colorado and the Roaring Fork Valley since 2012.',
      priceRange: '$$$$',
      openingHours: 'Mo-Su 00:00-23:59',
      address: {
        '@type': 'PostalAddress',
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
      offers: [
        {
          '@type': 'Offer',
          name: 'Full-day float trip',
          price: '1400',
          priceCurrency: 'USD',
          description:
            'From $1,400 for 2 people (1 boat, 1 captain). Additional adults $375 each, kids $175. An 8–12 mile stretch of the Roaring Fork or Colorado River. Lunch, gear, and luxury door-to-door transportation included.',
        },
        {
          '@type': 'Offer',
          name: 'Private ranch and picnic package at Spring Creek Ranch, Carbondale, CO',
          price: '800',
          priceCurrency: 'USD',
          description:
            'From $800 per adult, $250 per child (ages 3+). Ponds, creeks, and a private section of the Roaring Fork River.',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Book a Guided Fly Fishing Trip in Aspen, CO',
      description:
        'Book a guided fly fishing trip with Rich Valley Adventures on Gold Medal waters including the Roaring Fork River. All skill levels welcome. Equipment provided.',
      totalTime: 'PT8H',
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: '1400',
        description: 'Full-day float from $1,400 for 2 people',
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
          text: 'Book at least 2 days in advance. A 50% deposit is due at booking. Cancellations within 72 hours are billed in full.',
        },
        {
          '@type': 'HowToStep',
          name: 'Submit your booking request',
          text: 'Use the booking form at richvalleyadventures.com/contact or call 970-456-3666. No prior fly fishing experience required.',
        },
        {
          '@type': 'HowToStep',
          name: 'Prepare for your trip',
          text: 'On a full-day float, lunch, gear, and luxury door-to-door transportation are included. A Colorado Parks and Wildlife fishing license is required for ages 16 and up.',
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
      priceRange: 'Full-day float from $1400 for 2 people',
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
        content={{
          ...content,
          intro: `${content.intro}\n\n${RVA_LICENSES_LINE}`,
          h2_sections: [
            {
              title: 'On the river',
              content: 'Full-day float trip: $1,400 for 2. Fishing is guided in-house.',
              image: RVA_FLOAT_PHOTO.src,
              imageAlt: RVA_FLOAT_PHOTO.alt,
            },
            ...(content.h2_sections || []),
          ],
        }}
        relatedLinks={rvaServicePageRelatedBlogLinks('fly-fishing')}
      />
    </>
  )
}
