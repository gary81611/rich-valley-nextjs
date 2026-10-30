import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/templates/ServicePageTemplate'
import { rvaServicePageRelatedBlogLinks } from '@/lib/rva-blog-pillars'
import {
  privateRanchFishingPageTitle,
  privateRanchFishingServiceContent,
} from '@/lib/rva-private-ranch-fishing-content'
import { seoAlt } from '@/lib/seo/alt-text'

/** Render each request from this file so the landing is not stuck on a stale prerender. */
export const dynamic = 'force-dynamic'

const pageUrl = 'https://www.richvalleyadventures.com/private-ranch-fishing'
const heroImage = '/images/adventures/fishing-catch-1440.webp'
const ogImage = '/images/adventures/fishing-catch.jpeg'
const ogImageAbsolute = `https://www.richvalleyadventures.com${ogImage}`

const metaDescription =
  'Private ranch trout fishing and family fishing at a historic ranch: Spring Creek Ranch in Carbondale, near Aspen. Ponds, creeks, and a private Roaring Fork section. From $800 per adult and $250 per child (ages 3+).'

export const metadata: Metadata = {
  title: 'Private Ranch Fly Fishing near Aspen & Carbondale | Rich Valley Adventures',
  description: metaDescription,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Private Ranch Fly Fishing near Aspen & Carbondale | Rich Valley Adventures',
    description: metaDescription,
    type: 'website',
    url: pageUrl,
    images: [{ url: ogImageAbsolute }],
  },
}

export default function PrivateRanchFishingPage() {
  const content = privateRanchFishingServiceContent
  const faqs = content.faqs ?? []

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.richvalleyadventures.com' },
        { '@type': 'ListItem', position: 2, name: 'Private Ranch Fishing', item: pageUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: privateRanchFishingPageTitle,
      description: content.intro.replace(/\n+/g, ' ').slice(0, 500),
      url: pageUrl,
      image: ogImageAbsolute,
      provider: {
        '@type': 'LocalBusiness',
        name: 'Rich Valley Adventures',
        telephone: '+19704563666',
        address: { '@type': 'PostalAddress', addressLocality: 'Aspen', addressRegion: 'CO', addressCountry: 'US' },
      },
      areaServed: [
        { '@type': 'City', name: 'Carbondale', containedInPlace: { '@type': 'State', name: 'Colorado' } },
        { '@type': 'City', name: 'Aspen', containedInPlace: { '@type': 'State', name: 'Colorado' } },
      ],
      offers: [
        {
          '@type': 'Offer',
          name: 'Private ranch and picnic — adult',
          price: '800',
          priceCurrency: 'USD',
          url: pageUrl,
          description: 'From $800 per adult at Spring Creek Ranch, Carbondale, Colorado.',
        },
        {
          '@type': 'Offer',
          name: 'Private ranch and picnic — child ages 3 and up',
          price: '250',
          priceCurrency: 'USD',
          url: pageUrl,
          description: 'From $250 per child (ages 3+).',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      name: privateRanchFishingPageTitle,
      description:
        'Private ranch fly fishing at Spring Creek Ranch, Carbondale. Private ranch and picnic: ponds, creeks, and a private section of the Roaring Fork River.',
      url: pageUrl,
      image: ogImageAbsolute,
      touristType: 'Families',
      provider: {
        '@type': 'Organization',
        name: 'Rich Valley Adventures',
        telephone: '+19704563666',
        url: 'https://www.richvalleyadventures.com',
      },
      offers: [
        {
          '@type': 'Offer',
          name: 'Private ranch and picnic — adult',
          price: '800',
          priceCurrency: 'USD',
          url: pageUrl,
          description: 'From $800 per adult.',
        },
        {
          '@type': 'Offer',
          name: 'Private ranch and picnic — child ages 3 and up',
          price: '250',
          priceCurrency: 'USD',
          url: pageUrl,
          description: 'From $250 per child (ages 3+).',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
  ]

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
        title={privateRanchFishingPageTitle}
        content={content}
        heroImage={heroImage}
        heroImageAlt={seoAlt({
          subject: 'Angler with a trout',
          location: 'Roaring Fork Valley, Colorado',
          context: 'private ranch fly fishing',
          brand: 'Rich Valley Adventures',
        })}
        heroSplit
        bookingHref="/contact?service=private-ranch-fishing"
        bookingLabel="Book private ranch fishing"
        relatedLinks={[
          { href: '/fly-fishing', label: 'Guided fly fishing on the Roaring Fork and nearby rivers' },
          { href: '/service-areas/carbondale', label: 'Carbondale, in the Roaring Fork Valley' },
          ...rvaServicePageRelatedBlogLinks('fly-fishing'),
        ]}
      />
    </>
  )
}
