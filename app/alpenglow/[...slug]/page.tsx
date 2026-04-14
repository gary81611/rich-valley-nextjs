import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPageBySlug, getAllPublishedPages } from '@/lib/pages'
import type { ServiceContent, LocationContent, FaqContent, LandingContent } from '@/lib/pages'
import { canonicalUrl, normalizePath } from '@/lib/seo/canonical'
import ServicePageTemplate from '@/components/templates/ServicePageTemplate'
import LocationPageTemplate from '@/components/templates/LocationPageTemplate'
import FaqPageTemplate from '@/components/templates/FaqPageTemplate'
import LandingPageTemplate from '@/components/templates/LandingPageTemplate'

export const revalidate = 30

interface Props {
  params: Promise<{ slug: string[] }>
}

export async function generateStaticParams() {
  const pages = await getAllPublishedPages('alpenglow')
  return pages.map((p) => ({ slug: p.slug.split('/') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const slugStr = slug.join('/')
  const page = await getPageBySlug('alpenglow', slugStr)

  if (!page) {
    return { title: 'Page Not Found | Aspen Alpenglow Limousine' }
  }

  const pageUrl = canonicalUrl('alpenglow', `/${slugStr}`)

  return {
    title: page.meta_title || page.title,
    description: page.meta_description || undefined,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: page.meta_title || page.title,
      description: page.meta_description || undefined,
      url: pageUrl,
      siteName: 'Aspen Alpenglow Limousine',
      type: 'website',
      images: page.og_image ? [{ url: page.og_image }] : undefined,
    },
  }
}

function buildJsonLd(page: Awaited<ReturnType<typeof getPageBySlug>>) {
  if (!page) return null

  const baseUrl = 'https://aspenalpenglowlimousine.com'
  const pageUrl = canonicalUrl('alpenglow', normalizePath(`/${page.slug}`))

  const breadcrumbItems =
    page.template_type === 'service'
      ? [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${baseUrl}/services` },
          { '@type': 'ListItem', position: 3, name: page.title, item: pageUrl },
        ]
      : [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: page.title, item: pageUrl },
        ]

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  }

  const schemas: Record<string, unknown>[] = [breadcrumb]

  if (page.template_type === 'service') {
    const serviceSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: page.title,
      description: page.meta_description || undefined,
      url: pageUrl,
      provider: {
        '@type': 'LocalBusiness',
        name: 'Aspen Alpenglow Limousine',
        url: baseUrl,
        telephone: '+19704563666',
        address: { '@type': 'PostalAddress', addressLocality: 'Aspen', addressRegion: 'CO', addressCountry: 'US' },
      },
      areaServed: [
        { '@type': 'City', name: 'Aspen', addressRegion: 'CO' },
        { '@type': 'City', name: 'Snowmass Village', addressRegion: 'CO' },
      ],
    }

    if (page.slug === 'airport-transfers') {
      serviceSchema.serviceType = 'Airport Transportation'
      serviceSchema.areaServed = [
        { '@type': 'City', name: 'Aspen', addressRegion: 'CO' },
        { '@type': 'City', name: 'Snowmass Village', addressRegion: 'CO' },
        { '@type': 'City', name: 'Basalt', addressRegion: 'CO' },
        { '@type': 'City', name: 'Carbondale', addressRegion: 'CO' },
        { '@type': 'City', name: 'Glenwood Springs', addressRegion: 'CO' },
        { '@type': 'City', name: 'Vail', addressRegion: 'CO' },
        { '@type': 'City', name: 'Denver', addressRegion: 'CO' },
      ]
      serviceSchema.availableChannel = {
        '@type': 'ServiceChannel',
        servicePhone: '+1-970-456-3666',
        serviceUrl: pageUrl,
        availableLanguage: 'English',
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
      }
      serviceSchema.offers = {
        '@type': 'Offer',
        priceCurrency: 'USD',
        description:
          'Private luxury airport transfers to/from ASE, EGE, and DEN. Flight tracking included. No surcharges for delays.',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Aspen Alpenglow Limousine',
          url: baseUrl,
        },
      }
    }

    schemas.push(serviceSchema)
  }

  if (page.template_type === 'location') {
    const content = page.content as LocationContent
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${pageUrl}#local`,
      name: 'Aspen Alpenglow Limousine',
      description: page.meta_description || undefined,
      url: pageUrl,
      telephone: '+19704563666',
      priceRange: '$$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Aspen',
        addressRegion: 'CO',
        postalCode: '81611',
        addressCountry: 'US',
      },
      areaServed: { '@type': 'Place', name: content.area_description },
      makesOffer: {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: page.title,
          url: pageUrl,
        },
      },
    })
  }

  if (page.template_type === 'faq') {
    const content = page.content as FaqContent
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: content.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    })
  }

  if (page.template_type === 'service') {
    const content = page.content as ServiceContent
    if (content.faqs && content.faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: content.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      })
    }
  }

  return schemas
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params
  const slugStr = slug.join('/')
  const page = await getPageBySlug('alpenglow', slugStr)

  if (!page) notFound()

  const jsonLdSchemas = buildJsonLd(page)

  return (
    <>
      <div className="h-[86px]" />
      {jsonLdSchemas && jsonLdSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {page.template_type === 'service' && (
        <ServicePageTemplate
          site="alpenglow"
          title={page.title}
          content={page.content as ServiceContent}
          relatedLinks={
            slugStr === 'airport-transfers'
              ? [
                  { href: '/areas/snowmass', label: 'Snowmass Village pickups & Aspen transfers' },
                  { href: '/areas/vail', label: 'Aspen ↔ Vail / Beaver Creek private car service' },
                  { href: '/destinations', label: 'Chauffeured Colorado day trips & Front Range venues' },
                  { href: '/fleet', label: 'Our Suburban & Transit van fleet for airport arrivals' },
                  { href: '/blog/airport-transfer-guide-aspen-pitkin-county-airport', label: 'ASE airport transfer guide (blog)' },
                ]
              : undefined
          }
        />
      )}
      {page.template_type === 'location' && (
        <LocationPageTemplate
          site="alpenglow"
          title={page.title}
          content={page.content as LocationContent}
          pageSlug={slugStr}
        />
      )}
      {page.template_type === 'faq' && (
        <FaqPageTemplate site="alpenglow" title={page.title} content={page.content as FaqContent} />
      )}
      {page.template_type === 'landing' && (
        <LandingPageTemplate site="alpenglow" title={page.title} content={page.content as LandingContent} />
      )}
    </>
  )
}
