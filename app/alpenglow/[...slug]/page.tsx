import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPageBySlug, getAllPublishedPages } from '@/lib/pages'
import type { ServiceContent, LocationContent, FaqContent, LandingContent } from '@/lib/pages'
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

  const baseUrl = 'https://aspenalpenglowlimousine.com'
  const pageUrl = `${baseUrl}/${slugStr}`

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
  const pageUrl = `${baseUrl}/${page.slug}`

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: page.title, item: pageUrl },
    ],
  }

  const schemas: Record<string, unknown>[] = [breadcrumb]

  if (page.template_type === 'service') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: page.title,
      description: page.meta_description || undefined,
      url: pageUrl,
      provider: {
        '@type': 'LocalBusiness',
        name: 'Aspen Alpenglow Limousine',
        telephone: '+19704563666',
        address: { '@type': 'PostalAddress', addressLocality: 'Aspen', addressRegion: 'CO', addressCountry: 'US' },
      },
      areaServed: [
        { '@type': 'City', name: 'Aspen', containedIn: 'Colorado, USA' },
        { '@type': 'City', name: 'Snowmass Village', containedIn: 'Colorado, USA' },
      ],
    })
  }

  if (page.template_type === 'location') {
    const content = page.content as LocationContent
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#business`,
      name: 'Aspen Alpenglow Limousine',
      description: page.meta_description || undefined,
      url: pageUrl,
      areaServed: { '@type': 'Place', name: content.area_description },
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
        <ServicePageTemplate site="alpenglow" title={page.title} content={page.content as ServiceContent} />
      )}
      {page.template_type === 'location' && (
        <LocationPageTemplate site="alpenglow" title={page.title} content={page.content as LocationContent} />
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
