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
  const pages = await getAllPublishedPages('rva')
  return pages.map((p) => ({ slug: p.slug.split('/') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const slugStr = slug.join('/')
  const page = await getPageBySlug('rva', slugStr)

  if (!page) {
    return { title: 'Page Not Found | Rich Valley Adventures' }
  }

  const baseUrl = 'https://richvalleyadventures.com'
  const pageUrl = `${baseUrl}/${slugStr}`

  return {
    title: page.meta_title || page.title,
    description: page.meta_description || undefined,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: page.meta_title || page.title,
      description: page.meta_description || undefined,
      url: pageUrl,
      siteName: 'Rich Valley Adventures',
      type: 'website',
      images: page.og_image ? [{ url: page.og_image }] : undefined,
    },
  }
}

function buildJsonLd(page: Awaited<ReturnType<typeof getPageBySlug>>) {
  if (!page) return null

  const baseUrl = 'https://richvalleyadventures.com'
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
        name: 'Rich Valley Adventures',
        telephone: '+19709487474',
        address: { '@type': 'PostalAddress', addressLocality: 'Aspen', addressRegion: 'CO', addressCountry: 'US' },
      },
      areaServed: { '@type': 'City', name: 'Aspen', containedIn: 'Colorado, USA' },
    })
  }

  if (page.template_type === 'location') {
    const content = page.content as LocationContent
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'TouristAttraction',
      name: page.title,
      description: page.meta_description || undefined,
      url: pageUrl,
      address: { '@type': 'PostalAddress', addressLocality: content.area_description, addressRegion: 'CO', addressCountry: 'US' },
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

  if (page.template_type === 'service' || page.template_type === 'faq') {
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
  const page = await getPageBySlug('rva', slugStr)

  if (!page) notFound()

  const jsonLdSchemas = buildJsonLd(page)

  return (
    <>
      {jsonLdSchemas && jsonLdSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {page.template_type === 'service' && (
        <ServicePageTemplate site="rva" title={page.title} content={page.content as ServiceContent} />
      )}
      {page.template_type === 'location' && (
        <LocationPageTemplate site="rva" title={page.title} content={page.content as LocationContent} />
      )}
      {page.template_type === 'faq' && (
        <FaqPageTemplate site="rva" title={page.title} content={page.content as FaqContent} />
      )}
      {page.template_type === 'landing' && (
        <LandingPageTemplate site="rva" title={page.title} content={page.content as LandingContent} />
      )}
    </>
  )
}
