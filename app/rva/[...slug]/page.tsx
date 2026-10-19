import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPageBySlug, getAllPublishedPages } from '@/lib/pages'
import type { ServiceContent, LocationContent, FaqContent, LandingContent } from '@/lib/pages'
import { canonicalUrl, normalizePath } from '@/lib/seo/canonical'
import ServicePageTemplate from '@/components/templates/ServicePageTemplate'
import LocationPageTemplate from '@/components/templates/LocationPageTemplate'
import FaqPageTemplate from '@/components/templates/FaqPageTemplate'
import LandingPageTemplate from '@/components/templates/LandingPageTemplate'
import { rvaServicePageRelatedBlogLinks } from '@/lib/rva-blog-pillars'
import type { CmsPage } from '@/lib/pages'

const PADDLE_RENTAL = 'Paddleboarding is a rental from $100, not a guided trip.'
const RVA_BOOKING =
  "Book at least 2 days in advance. A 50% deposit is due at booking. Cancellations within 72 hours are billed in full."
const RVA_CORPORATE =
  'Corporate packages are for groups of 50 or more: a custom mix of fishing and hiking.'
const RVA_LICENSE = 'A Colorado Parks and Wildlife fishing license is required for ages 16 and up.'

function rewritePaddleCopy(text: string): string {
  return text
    .replace(/Rich Valley Adventures guides SUP experiences/gi, 'Rich Valley Adventures rents stand-up paddle boards')
    .replace(/Our paddle boarding trips are guided[^.]*\./gi, PADDLE_RENTAL)
    .replace(/\bguided paddle\s*boarding\b/gi, 'paddleboard rental')
    .replace(/\bguided SUP tours\b/gi, 'paddleboard rentals')
    .replace(/\bguided SUP\b/gi, 'paddleboard rental')
    .replace(/\bSUP tours\b/gi, 'paddleboard rentals')
    .replace(/\bour guided sessions\b/gi, 'Rentals')
    .replace(/\bguided sessions\b/gi, 'rentals')
}

function applyRvaConfirmedFacts(page: CmsPage | null): CmsPage | null {
  if (!page) return null
  if (page.slug === 'paddle-boarding' && page.template_type === 'service') {
    const content = { ...(page.content as ServiceContent) }
    let intro = rewritePaddleCopy(content.intro || '')
    if (!intro.includes('rental from $100')) {
      intro = `${PADDLE_RENTAL}\n\n${intro}`
    }
    content.intro = intro
    content.hero_subtitle = content.hero_subtitle
      ? rewritePaddleCopy(content.hero_subtitle)
      : PADDLE_RENTAL
    content.h2_sections = (content.h2_sections || [])
      .filter((section) => !/lesson|guided/i.test(section.title))
      .map((section) => ({ ...section, content: rewritePaddleCopy(section.content) }))
    content.features = (content.features || [])
      .filter((feature) => !/lesson|guided/i.test(feature.title))
      .map((feature) => ({
        ...feature,
        description: rewritePaddleCopy(feature.description),
      }))
    if (!content.features.some((feature) => feature.description.includes('rental from $100'))) {
      content.features = [
        { title: 'Paddleboard rental', description: PADDLE_RENTAL },
        ...content.features,
      ]
    }
    content.faqs = (content.faqs || []).map((faq) => ({
      ...faq,
      answer: rewritePaddleCopy(faq.answer).includes('rental from $100')
        ? rewritePaddleCopy(faq.answer)
        : `${PADDLE_RENTAL} ${rewritePaddleCopy(faq.answer)}`,
    }))
    content.cta_text = 'Rent a Paddleboard'
    return {
      ...page,
      meta_title: 'Paddleboard Rental Aspen CO | From $100 | Rich Valley Adventures',
      meta_description: `${PADDLE_RENTAL} Rich Valley Adventures, Aspen, Colorado.`,
      content,
    }
  }

  if (page.slug === 'faq' && page.template_type === 'faq') {
    const content = { ...(page.content as FaqContent) }
    content.faqs = content.faqs.map((faq) => {
      const q = faq.question.toLowerCase()
      if (q.includes('cancellation') || q.includes('how do i book')) {
        return { ...faq, answer: RVA_BOOKING }
      }
      if (q.includes('fishing license')) {
        return { ...faq, answer: RVA_LICENSE }
      }
      if (q.includes('group size')) {
        const cleaned = faq.answer.replace(/,?\s*paddle boarding \(6 per guide\)/gi, '')
        return { ...faq, answer: cleaned.includes('groups of 50') ? cleaned : `${cleaned} ${RVA_CORPORATE}` }
      }
      if (q.includes('corporate') || q.includes('private tours')) {
        return faq.answer.includes('groups of 50') ? faq : { ...faq, answer: `${faq.answer} ${RVA_CORPORATE}` }
      }
      if (q.includes('paddle')) {
        return { ...faq, answer: rewritePaddleCopy(faq.answer).includes('$100') ? rewritePaddleCopy(faq.answer) : `${PADDLE_RENTAL} ${rewritePaddleCopy(faq.answer)}` }
      }
      return faq
    })
    if (!content.faqs.some((faq) => faq.question.toLowerCase().includes('corporate package'))) {
      content.faqs = [
        ...content.faqs,
        { question: 'Do you offer corporate packages?', answer: RVA_CORPORATE, category: 'Booking & Logistics' },
      ]
    }
    return { ...page, content }
  }

  return page
}

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
  const page = applyRvaConfirmedFacts(await getPageBySlug('rva', slugStr))

  if (!page) {
    return { title: 'Page Not Found | Rich Valley Adventures' }
  }

  const pageUrl = canonicalUrl('rva', `/${slugStr}`)

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

  const baseUrl = 'https://www.richvalleyadventures.com'
  const pageUrl = canonicalUrl('rva', normalizePath(`/${page.slug}`))

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
        telephone: '+19704563666',
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

  if (page.template_type === 'service') {
    const content = page.content as ServiceContent
    if (content.popular_hikes && content.popular_hikes.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Popular hikes near Aspen, Colorado',
        description: 'Reference hikes and typical mileage and duration; guided trips are customized.',
        numberOfItems: content.popular_hikes.length,
        itemListElement: content.popular_hikes.map((h, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: h.name,
          description: `${h.mileage}; typical time ${h.duration}. ${h.description}`,
        })),
      })
    }
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
  const page = applyRvaConfirmedFacts(await getPageBySlug('rva', slugStr))

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
          site="rva"
          title={page.title}
          content={page.content as ServiceContent}
          relatedLinks={rvaServicePageRelatedBlogLinks(slugStr)}
        />
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
