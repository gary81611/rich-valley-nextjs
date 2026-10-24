import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPageBySlug, getAllPublishedPages } from '@/lib/pages'
import type { ServiceContent, LocationContent, FaqContent, LandingContent } from '@/lib/pages'
import { canonicalUrl, normalizePath } from '@/lib/seo/canonical'
import ServicePageTemplate from '@/components/templates/ServicePageTemplate'
import LocationPageTemplate from '@/components/templates/LocationPageTemplate'
import FaqPageTemplate from '@/components/templates/FaqPageTemplate'
import LandingPageTemplate from '@/components/templates/LandingPageTemplate'
import type { CmsPage } from '@/lib/pages'
import { correctAalPublicText } from '@/lib/aal-public-copy'
import { aalDisplayTitle } from '@/lib/aal-display-title'
import { AAL_OG_IMAGE } from '@/lib/aal-vehicles'

const AAL_FBO =
  'Private FBO airport service includes Eagle, Rifle, Grand Junction, Buena Vista, Montrose, and Gunnison.'
const AAL_ONE_WAY =
  'One-way rates each way: Eagle $720, Denver $1,375, Grand Junction $950, Rifle $720. Holiday pricing may change seasonally.'
const AAL_CANCEL =
  "Flight diversions to Denver or Grand Junction are handled with 2 hours' notice and no Aspen cancellation penalty. General cancellations need 24 hours' notice."
const AAL_CORPORATE = 'Corporate charge accounts are billed monthly.'

function applyFleetCapacityCopy(page: CmsPage): CmsPage {
  const meta_description = page.meta_description ? correctAalPublicText(page.meta_description) : page.meta_description
  const meta_title = page.meta_title ? correctAalPublicText(page.meta_title) : page.meta_title
  const title = aalDisplayTitle(correctAalPublicText(page.title))
  if (page.template_type === 'service' || page.template_type === 'location') {
    const content = { ...(page.content as ServiceContent & LocationContent) }
    content.hero_title = content.hero_title ? correctAalPublicText(content.hero_title) : content.hero_title
    content.hero_subtitle = content.hero_subtitle ? correctAalPublicText(content.hero_subtitle) : content.hero_subtitle
    content.intro = correctAalPublicText(content.intro || '')
    content.area_description = content.area_description ? correctAalPublicText(content.area_description) : content.area_description
    content.h2_sections = content.h2_sections?.map((section) => ({
      ...section,
      title: correctAalPublicText(section.title),
      content: correctAalPublicText(section.content),
    }))
    content.features = content.features?.map((feature) => ({
      ...feature,
      title: correctAalPublicText(feature.title),
      description: correctAalPublicText(feature.description),
    }))
    content.faqs = content.faqs?.map((faq) => ({
      ...faq,
      question: correctAalPublicText(faq.question),
      answer: correctAalPublicText(faq.answer),
    }))
    content.local_tips = content.local_tips?.map((tip) => ({
      ...tip,
      title: correctAalPublicText(tip.title),
      description: correctAalPublicText(tip.description),
    }))
    content.services_available = content.services_available?.map((item) => correctAalPublicText(item))
    return { ...page, title, meta_title, meta_description, content }
  }
  if (page.template_type === 'faq') {
    const content = { ...(page.content as FaqContent) }
    content.intro = content.intro ? correctAalPublicText(content.intro) : content.intro
    content.faqs = content.faqs.map((faq) => ({
      ...faq,
      question: correctAalPublicText(faq.question),
      answer: correctAalPublicText(faq.answer),
    }))
    return { ...page, title, meta_title, meta_description, content }
  }
  if (page.template_type === 'landing') {
    const content = { ...(page.content as LandingContent) }
    content.hero_title = correctAalPublicText(content.hero_title)
    content.hero_subtitle = content.hero_subtitle ? correctAalPublicText(content.hero_subtitle) : content.hero_subtitle
    content.sections = content.sections?.map((section) => ({
      ...section,
      title: section.title ? correctAalPublicText(section.title) : section.title,
      content: section.content ? correctAalPublicText(section.content) : section.content,
      items: section.items?.map((item) => ({
        ...item,
        title: correctAalPublicText(item.title),
        description: correctAalPublicText(item.description),
      })),
    }))
    return { ...page, title, meta_title, meta_description, content }
  }
  return { ...page, title, meta_title, meta_description }
}

function applyAalConfirmedFacts(page: CmsPage | null): CmsPage | null {
  if (!page) return null
  if (page.slug === 'airport-transfers' && page.template_type === 'service') {
    const content = { ...(page.content as ServiceContent) }
    const note = `${AAL_FBO} ${AAL_ONE_WAY} ${AAL_CANCEL}`
    if (!content.intro?.includes('Buena Vista')) {
      content.intro = `${content.intro || ''}\n\n${note}`.trim()
    }
    return applyFleetCapacityCopy({
      ...page,
      meta_description: page.meta_description?.includes('Buena Vista')
        ? page.meta_description
        : `${AAL_FBO} ${AAL_ONE_WAY}`.slice(0, 300),
      content,
    })
  }
  if ((page.slug === 'corporate' || page.slug === 'corporate-travel') && page.template_type === 'service') {
    const content = { ...(page.content as ServiceContent) }
    if (!content.intro?.includes('billed monthly')) {
      content.intro = `${content.intro || ''}\n\n${AAL_CORPORATE}`.trim()
    }
    return applyFleetCapacityCopy({ ...page, content })
  }
  return applyFleetCapacityCopy(page)
}

/** CMS fleet copy must render from this file, not a stale edge prerender. */
export const dynamic = 'force-dynamic'

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
  const page = applyAalConfirmedFacts(await getPageBySlug('alpenglow', slugStr))

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
      images: page.og_image ? [{ url: page.og_image }] : [AAL_OG_IMAGE],
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
          'Private FBO airport service includes Eagle, Rifle, Grand Junction, Buena Vista, Montrose, and Gunnison. One-way rates each way: Eagle $720, Denver $1,375, Grand Junction $950, Rifle $720. Holiday pricing may change seasonally. Flight diversions to Denver or Grand Junction are handled with 2 hours\' notice and no Aspen cancellation penalty.',
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
  const page = applyAalConfirmedFacts(await getPageBySlug('alpenglow', slugStr))

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
                  { href: '/airport-transfers/eagle-ege-to-aspen', label: 'Eagle Airport (EGE) to Aspen private car — $720' },
                  { href: '/airport-transfers/denver-den-to-aspen', label: 'Denver Airport (DEN) to Aspen private car — $1,375' },
                  { href: '/aspen-airport-closure-2027', label: 'Aspen Airport closure in 2027' },
                  { href: '/service-areas/snowmass-village', label: 'Snowmass Village pickups & Aspen transfers' },
                  { href: '/service-areas/eagle-vail', label: 'Aspen ↔ Vail / Beaver Creek private car service' },
                  { href: '/fleet', label: 'SUVs and Ford Transit van for airport arrivals' },
                  { href: '/pricing', label: 'Published private car rates' },
                ]
              : slugStr === 'ski-resort-transfers'
                ? [
                    { href: '/events/x-games-aspen-transportation', label: 'X Games Aspen 2027 transportation' },
                    { href: '/seasonal/holiday-private-car-aspen', label: 'Holiday private car service' },
                    { href: '/events/new-years-eve-aspen', label: "New Year's Eve private car service" },
                    { href: '/airport-transfers', label: 'Airport transfers' },
                    { href: '/pricing', label: 'Published private car rates' },
                    { href: '/blog/aspen-ski-season-private-transfers-vs-rental-cars', label: 'Ski season: rental car or private transfer' },
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
