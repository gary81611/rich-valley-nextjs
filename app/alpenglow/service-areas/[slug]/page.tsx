import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { slugifyServiceName } from '@/lib/alpenglow-services'
import { serviceAreaMatchesPathSlug } from '@/lib/alpenglow-service-areas'

export const dynamic = 'force-dynamic'

const AAL_BASE = 'https://aspenalpenglowlimousine.com'

type ServiceAreaRow = {
  name: string
  slug: string | null
  description: string
  long_description: string | null
  key_destinations: unknown
  meta_title?: string | null
  meta_description?: string | null
  faq_schema?: unknown
}

function parseServiceAreaFaqs(raw: unknown): { question: string; answer: string }[] {
  if (!Array.isArray(raw)) return []
  const out: { question: string; answer: string }[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const q = typeof o.question === 'string' ? o.question.trim() : ''
    const a = typeof o.answer === 'string' ? o.answer.trim() : ''
    if (q && a) out.push({ question: q, answer: a })
  }
  return out
}

async function getArea(pathSlug: string): Promise<ServiceAreaRow | null> {
  const supabase = await createServerSupabaseClient()
  const { data: rows } = await supabase
    .from('service_areas')
    .select('*')
    .eq('site_key', 'alpenglow')
    .eq('is_active', true)

  if (!rows?.length) return null
  return (rows as ServiceAreaRow[]).find((area) => serviceAreaMatchesPathSlug(area, pathSlug)) ?? null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const area = await getArea(slug)
  if (!area) return { title: 'Area Not Found' }

  const title =
    area.meta_title?.trim() ||
    `${area.name} Private Car Service | Aspen Alpenglow Limousine`
  const description =
    area.meta_description?.trim() ||
    `${area.description} Luxury SUV and van transportation in ${area.name}, Colorado. All-inclusive rates, 24/7. Call 970-456-3666.`
  const canonical = `${AAL_BASE}/service-areas/${slug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Aspen Alpenglow Limousine',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
    other: {
      'geo.region': 'US-CO',
      'geo.placename': `${area.name}, Colorado`,
    },
  }
}

export default async function ServiceAreaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const area = await getArea(slug)

  if (!area) {
    notFound()
  }

  const keyDestinations: string[] = Array.isArray(area.key_destinations)
    ? (area.key_destinations as string[])
    : []

  const bodyCopy = area.long_description?.trim() || area.description
  const faqs = parseServiceAreaFaqs(area.faq_schema)
  const pageUrl = `${AAL_BASE}/service-areas/${slug}`

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${AAL_BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'Service Areas', item: `${AAL_BASE}/service-areas` },
      { '@type': 'ListItem', position: 3, name: area.name, item: pageUrl },
    ],
  }

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: area.meta_title?.trim() || `${area.name} | Aspen Alpenglow Limousine`,
    description: area.meta_description?.trim() || area.description,
    isPartOf: { '@type': 'WebSite', name: 'Aspen Alpenglow Limousine', url: AAL_BASE },
    about: { '@type': 'Place', name: `${area.name}, Colorado`, addressRegion: 'CO', addressCountry: 'US' },
    inLanguage: 'en-US',
  }

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Aspen Alpenglow Limousine',
    url: AAL_BASE,
    telephone: '+19704563666',
    priceRange: '$$$$',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: `${area.name}, Colorado`,
      containedInPlace: { '@type': 'State', name: 'Colorado' },
    },
  }

  const faqJsonLd =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null

  const jsonLdBlocks = [breadcrumbJsonLd, webPageJsonLd, localBusinessJsonLd, faqJsonLd].filter(Boolean)

  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      {jsonLdBlocks.map((schema, i) => (
        <script key={`aal-sa-ldjson-${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      {/* Breadcrumb */}
      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-alp-pearl/70">
            <Link href="/" className="hover:text-alp-gold transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/service-areas" className="hover:text-alp-gold transition-colors">
              Service Areas
            </Link>
            <span className="mx-2">/</span>
            <span className="text-alp-gold">{area.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-alp-navy-deep text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-alp-gold">{area.name}</span>
          </h1>
          <p className="text-lg sm:text-xl text-alp-pearl/80 max-w-3xl">{area.description}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="font-playfair text-3xl font-bold text-alp-navy mb-6">
                Luxury Transportation in {area.name}
              </h2>
              <p className="text-alp-slate leading-relaxed text-lg mb-8 whitespace-pre-line">{bodyCopy}</p>
              {faqs.length > 0 && (
                <div className="mb-10">
                  <h3 className="font-playfair text-2xl font-bold text-alp-navy mb-4">Common questions</h3>
                  <ul className="space-y-4">
                    {faqs.map((f) => (
                      <li key={f.question} className="border border-alp-pearl-dark rounded-xl p-5 bg-white shadow-sm">
                        <p className="font-semibold text-alp-navy mb-2">{f.question}</p>
                        <p className="text-alp-slate text-sm leading-relaxed">{f.answer}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {keyDestinations.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md p-8 border border-alp-pearl-dark">
                  <h3 className="font-playfair text-xl font-bold text-alp-navy mb-4">Key Destinations</h3>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {keyDestinations.map((dest) => (
                      <li key={dest} className="flex items-start gap-2 text-alp-navy">
                        <svg
                          className="w-5 h-5 text-alp-gold mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-sm">{dest}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-alp-navy-deep rounded-2xl p-8 text-white">
                <h3 className="font-playfair text-xl font-bold mb-4">
                  Book a Ride to <span className="text-alp-gold">{area.name}</span>
                </h3>
                <p className="text-alp-pearl/80 text-sm mb-6">
                  Available 24/7. Airport transfers, hourly charter, and point-to-point service.
                </p>
                <Link
                  href="/contact"
                  className="block bg-alp-gold text-alp-navy font-bold px-6 py-3 rounded-full hover:bg-alp-gold-light transition-colors text-center mb-3"
                >
                  Book Online
                </Link>
                <a
                  href="tel:+19704563666"
                  className="block border-2 border-alp-gold text-alp-gold font-bold px-6 py-3 rounded-full hover:bg-alp-gold hover:text-alp-navy transition-colors text-center"
                >
                  Call 970-456-3666
                </a>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-8 border border-alp-pearl-dark">
                <h3 className="font-playfair text-lg font-bold text-alp-navy mb-3">Our Services</h3>
                <ul className="space-y-2">
                  {['Airport Transfers', 'Hourly Charter', 'Corporate Travel', 'Wedding Transportation'].map((s) => (
                    <li key={s}>
                      <Link
                        href={`/services/${slugifyServiceName(s)}`}
                        className="flex items-center gap-2 text-alp-slate hover:text-alp-gold transition-colors text-sm py-1"
                      >
                        <svg className="w-3 h-3 text-alp-gold" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {s}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
