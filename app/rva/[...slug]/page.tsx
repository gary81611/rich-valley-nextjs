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
import { KIDS_FAMILY_FISHING, withYearRoundFishingNote } from '@/lib/rva-fly-fishing-content'
import { rvaHikingAnswerFaqs, rvaHikingAnswerLead } from '@/lib/rva-hiking-page-seed'
import { RVA_SNOWSHOE_PRICE, RVA_TRIP_OWNERSHIP } from '@/lib/rva-confirmed'
import {
  PADDLE_OG_IMAGE,
  PADDLE_PHOTO,
  PADDLE_PHOTO_ALT,
  PADDLE_PHOTO_POSITION,
} from '@/lib/rva-adventure-public'

const PADDLE_RENTAL = 'Paddleboarding is a rental from $100, not a guided trip.'
const PADDLE_PAGE_TITLE = 'Paddleboard Rentals in Aspen, Colorado'
const PADDLE_META_TITLE = 'Paddleboard Rentals in Aspen, CO | From $100 | Rich Valley Adventures'
const PADDLE_META_DESCRIPTION = `${PADDLE_RENTAL} Rich Valley Adventures, Aspen, Colorado.`
/** Equipment fact — kept in the body (not the split hero). Rental sentence stays in the intro too. */
const PADDLE_SUBTITLE =
  'All equipment is provided — premium inflatable and hard SUP boards, adjustable paddles, Coast Guard-approved PFDs, and dry bags for your gear.'
const PADDLE_DELIVERY = 'Boards can be delivered to you.'
/** Live intro sentences that stay. Lesson, endurance, and logistics sentences are not included. */
const PADDLE_INTRO = [
  'Stand up paddle boarding in the Roaring Fork Valley offers something rare: glassy water surrounded by 14,000-foot peaks. Rich Valley Adventures rents stand-up paddle boards on some of the most scenic alpine lakes in Colorado, from the vast calm of Ruedi Reservoir above Basalt to the intimate wilderness setting of Grizzly Lake near Independence Pass.',
  PADDLE_RENTAL,
].join('\n\n')
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

function isPaddleLessonSentence(sentence: string): boolean {
  return (
    /beginners learn balance/i.test(sentence) ||
    /experienced paddlers/i.test(sentence) ||
    /push their endurance/i.test(sentence) ||
    /beginner orientation/i.test(sentence) ||
    /within the first 30 minutes/i.test(sentence) ||
    /we handle the logistics/i.test(sentence) ||
    /we schedule sessions/i.test(sentence) ||
    /adjust meeting locations/i.test(sentence) ||
    /reschedule if conditions/i.test(sentence) ||
    /monitor forecasts closely/i.test(sentence)
  )
}

/** Drop lesson and guided-session sentences. Keep the rental sentence, which contains the word "guided". */
function stripPaddleLessonCopy(text: string): string {
  const rewritten = rewritePaddleCopy(text)
  const cleaned = rewritten
    .split(/(\n\n+)/)
    .map((part) => {
      if (/^\n+$/.test(part)) return part
      return part
        .split(/(?<=[.!?])\s+/)
        .filter((sentence) => sentence.trim() && !isPaddleLessonSentence(sentence))
        .join(' ')
    })
    .join('')
  return cleaned.replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
}

/** Lesson or session headings. A heading that only says this is not a guided trip stays. */
function isPaddleLessonHeading(title: string): boolean {
  if (/not a guided trip/i.test(title)) return false
  return /\b(lesson|lessons|orientation|instruction|session|sessions|guided)\b/i.test(title)
}

function cleanPaddleFaqAnswer(question: string, answer: string): string {
  if (/experience/i.test(question)) return 'No experience needed at all.'
  if (/wind/i.test(question)) return 'Wind is the main variable for SUP.'
  return stripPaddleLessonCopy(answer)
    .replace(/^Paddleboarding is a rental from \$100, not a guided trip\.\s*/i, '')
    .trim()
}

function applyRvaConfirmedFacts(page: CmsPage | null): CmsPage | null {
  if (!page) return null
  if (page.slug === 'paddle-boarding' && page.template_type === 'service') {
    const content = { ...(page.content as ServiceContent) }
    content.hero_title = PADDLE_PAGE_TITLE
    // Split hero matches ranch: H1 + CTAs only. Intro rental copy first; equipment sentence second in the body.
    content.hero_subtitle = ''
    content.intro = `${PADDLE_INTRO}

${PADDLE_SUBTITLE}`
    content.cta_note = PADDLE_DELIVERY
    content.h2_sections = (content.h2_sections || [])
      .filter((section) => !isPaddleLessonHeading(section.title))
      .map((section) => ({
        ...section,
        title: section.title
          .replace(/\s*[—–-]\s*Aspen['’]s Premier SUP Destination/gi, '')
          .replace(/Aspen['’]s Premier SUP Destination/gi, 'Ruedi Reservoir')
          .trim(),
        content: stripPaddleLessonCopy(section.content)
          .replace(/Paddleboarding is a rental from \$100, not a guided trip\.?\s*/gi, '')
          .trim(),
      }))
      .filter((section) => section.content.trim().length > 0)
    const features = (content.features || [])
      .filter((feature) => !isPaddleLessonHeading(feature.title))
      .map((feature) =>
        /not a guided trip/i.test(feature.title) || /rental from \$100/i.test(feature.description)
          ? { title: 'Wind', description: 'Wind is the main variable for SUP.' }
          : {
              ...feature,
              title: feature.title
                .replace(/\s*[—–-]\s*Aspen['’]s Premier SUP Destination/gi, '')
                .replace(/Aspen['’]s Premier SUP Destination/gi, 'Ruedi Reservoir')
                .trim(),
              description: stripPaddleLessonCopy(feature.description)
                .replace(/Paddleboarding is a rental from \$100, not a guided trip\.?\s*/gi, '')
                .trim(),
            },
      )
      .filter((feature) => feature.description.trim().length > 0)
    const seenTitles = new Set<string>()
    content.features = features.filter((feature) => {
      const key = feature.title.toLowerCase()
      if (seenTitles.has(key)) return false
      seenTitles.add(key)
      return true
    })
    content.faqs = (content.faqs || []).map((faq) => ({
      ...faq,
      answer: cleanPaddleFaqAnswer(faq.question, faq.answer),
    }))
    content.cta_text = 'Rent a Paddleboard'
    return {
      ...page,
      title: PADDLE_PAGE_TITLE,
      meta_title: PADDLE_META_TITLE,
      meta_description: PADDLE_META_DESCRIPTION,
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
    return applyFishingSeasonAndKids({ ...page, content })
  }

  if (page.slug === 'hiking' && page.template_type === 'service') {
    const content = { ...(page.content as ServiceContent) }
    content.lead = rvaHikingAnswerLead
    const have = new Set((content.faqs || []).map((faq) => faq.question))
    const extra = rvaHikingAnswerFaqs.filter((faq) => !have.has(faq.question))
    content.faqs = [...extra, ...(content.faqs || [])]
    return applyFishingSeasonAndKids({ ...page, content })
  }

  if (page.slug === 'snowshoeing' && page.template_type === 'service') {
    const content = { ...(page.content as ServiceContent) }
    const price = `${RVA_SNOWSHOE_PRICE}. Snowshoeing is guided in-house.`
    content.lead = {
      heading: 'Half-day snowshoeing',
      paragraphs: [price, ...(content.lead?.paragraphs || [])],
      facts: [{ label: 'Half-day snowshoe', value: '$500' }, ...(content.lead?.facts || [])],
    }
    if (content.intro && !content.intro.includes('$500')) {
      content.intro = `${price}\n\n${content.intro}`
    }
    return applyFishingSeasonAndKids({ ...page, content })
  }

  return applyFishingSeasonAndKids(page)
}

function applyFishingSeasonAndKids(page: CmsPage): CmsPage {
  if (page.template_type === 'faq') {
    const content = { ...(page.content as FaqContent) }
    content.intro = content.intro ? withYearRoundFishingNote(content.intro) : content.intro
    content.faqs = content.faqs.map((faq) => ({
      ...faq,
      answer: /can kids fish/i.test(faq.question) ? KIDS_FAMILY_FISHING : withYearRoundFishingNote(faq.answer),
    }))
    if (!content.faqs.some((faq) => /can kids fish/i.test(faq.question))) {
      content.faqs = [
        { question: 'Can kids fish?', answer: KIDS_FAMILY_FISHING, category: 'Fly Fishing' },
        ...content.faqs,
      ]
    }
    return { ...page, content }
  }

  if (page.template_type === 'service' || page.template_type === 'location') {
    const content = { ...(page.content as ServiceContent & LocationContent) }
    content.intro = withYearRoundFishingNote(content.intro || '')
    if (content.h2_sections) {
      content.h2_sections = content.h2_sections.map((section) => ({
        ...section,
        content: withYearRoundFishingNote(section.content),
      }))
    }
    content.faqs = (content.faqs || []).map((faq) => ({
      ...faq,
      answer: /can kids fish/i.test(faq.question) ? KIDS_FAMILY_FISHING : withYearRoundFishingNote(faq.answer),
    }))
    if (
      page.slug === 'fly-fishing' &&
      !(content.faqs || []).some((faq) => /can kids fish/i.test(faq.question))
    ) {
      content.faqs = [{ question: 'Can kids fish?', answer: KIDS_FAMILY_FISHING }, ...(content.faqs || [])]
    }
    return { ...page, content }
  }

  return page
}

/** CMS FAQ and season copy must render from this file, not a stale edge prerender. */
export const dynamic = 'force-dynamic'

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
  const isPaddlePage = slugStr === 'paddle-boarding'
  const title = page.meta_title || page.title
  const description = page.meta_description || undefined

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Rich Valley Adventures',
      type: 'website',
      images: isPaddlePage
        ? [{ url: PADDLE_OG_IMAGE, width: 1536, height: 2048, alt: PADDLE_PHOTO_ALT }]
        : page.og_image
          ? [{ url: page.og_image }]
          : undefined,
    },
    twitter: isPaddlePage
      ? {
          card: 'summary_large_image',
          title,
          description,
          images: [PADDLE_OG_IMAGE],
        }
      : undefined,
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
      ...(page.slug === 'paddle-boarding' ? { image: PADDLE_OG_IMAGE } : {}),
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
      <div className="h-[var(--rva-header,97px)] md:h-[var(--rva-header,117px)]" aria-hidden />
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
          emitFaqSchema={false}
          content={page.content as ServiceContent}
          relatedLinks={rvaServicePageRelatedBlogLinks(slugStr)}
          heroImage={slugStr === 'paddle-boarding' ? PADDLE_PHOTO : undefined}
          heroImageAlt={slugStr === 'paddle-boarding' ? PADDLE_PHOTO_ALT : undefined}
          heroObjectPosition={slugStr === 'paddle-boarding' ? PADDLE_PHOTO_POSITION : undefined}
          heroSplit={slugStr === 'paddle-boarding'}
          bookingHref={slugStr === 'paddle-boarding' ? '/contact?service=paddle-boarding' : undefined}
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
