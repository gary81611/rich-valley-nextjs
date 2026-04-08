import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

interface AdventureRow {
  id: string
  name: string
  description: string
  long_description: string | null
  whats_included: string[] | null
  highlights: string[] | null
  best_for: string | null
  group_size: string | null
  duration: string
  price: number
  difficulty: string
  image_url: string
  display_order: number
  is_active: boolean
  season: string
}

async function getAdventure(slug: string): Promise<AdventureRow | null> {
  const supabase = await createServerSupabaseClient()
  const { data: adventures } = await supabase
    .from('adventures')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  if (!adventures) return null
  return adventures.find((a: AdventureRow) => slugify(a.name) === slug) || null
}

async function getRelatedAdventures(currentId: string): Promise<AdventureRow[]> {
  const supabase = await createServerSupabaseClient()
  const { data: adventures } = await supabase
    .from('adventures')
    .select('*')
    .eq('is_active', true)
    .neq('id', currentId)
    .order('display_order')
    .limit(3)

  return (adventures as AdventureRow[]) || []
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const adventure = await getAdventure(slug)
  if (!adventure) {
    return { title: 'Adventure Not Found | Rich Valley Adventures' }
  }
  const adventureSlug = slugify(adventure.name)
  return {
    title: `${adventure.name} | Rich Valley Adventures | Aspen, CO`,
    description: adventure.description,
    alternates: {
      canonical: `https://www.richvalleyadventures.com/adventures/${adventureSlug}`,
    },
    openGraph: {
      title: `${adventure.name} — Guided Adventure in Aspen | Rich Valley Adventures`,
      description: adventure.description,
      type: 'website',
      url: `https://www.richvalleyadventures.com/adventures/${adventureSlug}`,
      images: [
        {
          url: adventure.image_url,
          width: 1200,
          height: 630,
          alt: `${adventure.name} with Rich Valley Adventures in Aspen, Colorado`,
        },
      ],
    },
  }
}

export default async function AdventureDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const adventure = await getAdventure(slug)

  if (!adventure) {
    return (
      <div className="min-h-screen bg-rva-cream font-inter flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-playfair text-4xl text-rva-forest font-bold mb-4">
            Adventure Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t find that adventure. Check out all of our offerings below.
          </p>
          <Link
            href="/adventures"
            className="bg-rva-copper hover:bg-rva-copper-light text-white px-8 py-3 rounded-full font-semibold transition-all inline-block"
          >
            View All Adventures
          </Link>
        </div>
      </div>
    )
  }

  const relatedAdventures = await getRelatedAdventures(adventure.id)
  const longDescription = adventure.long_description || adventure.description
  const whatsIncluded = Array.isArray(adventure.whats_included) ? adventure.whats_included : []
  const highlights = Array.isArray(adventure.highlights) ? adventure.highlights : []
  const groupSize = adventure.group_size || '2-6 guests'

  return (
    <div className="min-h-screen bg-rva-cream font-inter">
      {/* Breadcrumb */}
      <div className="bg-rva-forest-dark">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-white/60 hover:text-rva-copper-light transition-colors">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <Link
              href="/adventures"
              className="text-white/60 hover:text-rva-copper-light transition-colors"
            >
              Adventures
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-rva-copper-light">{adventure.name}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={adventure.image_url}
            alt={`${adventure.name} — guided adventure experience in Aspen, Colorado with Rich Valley Adventures`}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-rva-forest-dark/60 via-rva-forest-dark/30 to-rva-forest-dark/80" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <div className="flex justify-center gap-3 mb-6">
            <span className="bg-rva-copper/90 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full font-medium">
              {adventure.duration}
            </span>
            <span className="bg-white/15 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full border border-white/20">
              {adventure.difficulty}
            </span>
          </div>
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4">{adventure.name}</h1>
          <p className="text-xl text-white/85 max-w-2xl mx-auto">{adventure.description}</p>
        </div>
      </section>

      {/* "Best For" tag + Mobile CTA card */}
      <section className="bg-rva-cream pt-8 pb-0">
        <div className="max-w-7xl mx-auto px-6">
          {/* Best For tag */}
          {adventure.best_for && (
            <p className="text-sm text-rva-forest/60 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-rva-copper flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span><strong className="text-rva-forest/80">Best for:</strong> {adventure.best_for}</span>
            </p>
          )}

          {/* Mobile-only CTA card */}
          <div className="lg:hidden bg-white rounded-xl p-5 shadow-sm border border-rva-copper/10 mb-6">
            <div className="flex items-center justify-between text-sm text-rva-forest/70 mb-4">
              <span>{adventure.duration}</span>
              <span>{adventure.difficulty}</span>
              <span>{groupSize}</span>
            </div>
            <div className="flex gap-3">
              <Link href="/contact" className="flex-1 bg-rva-copper hover:bg-rva-copper-light text-white text-center py-3 rounded-full text-sm font-semibold transition-colors">
                Request Booking
              </Link>
              <a href="tel:+19704563666" className="flex-1 border-2 border-rva-forest/20 text-rva-forest text-center py-3 rounded-full text-sm font-medium transition-colors hover:border-rva-forest/40">
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-rva-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="font-playfair text-3xl text-rva-forest font-bold mb-6">
                About This Adventure
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-10">
                {longDescription}
              </p>

              {/* Highlights */}
              {highlights.length > 0 && (
                <>
                  <h3 className="font-playfair text-2xl text-rva-forest font-semibold mb-4">
                    Highlights
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4 mb-10">
                    {highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm"
                      >
                        <span className="w-3 h-3 bg-rva-copper rounded-full flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* What's Included */}
              {whatsIncluded.length > 0 && (
                <>
                  <h3 className="font-playfair text-2xl text-rva-forest font-semibold mb-4">
                    What&apos;s Included
                  </h3>
                  <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {whatsIncluded.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-gray-700">
                          <svg
                            className="w-5 h-5 text-rva-copper flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Booking CTA */}
              <div className="bg-rva-forest rounded-2xl p-8 text-white mb-8 sticky top-8">
                <h3 className="font-playfair text-2xl font-bold mb-2">Book This Adventure</h3>
                <p className="text-white/75 text-sm mb-6">
                  Ready to experience {adventure.name.toLowerCase()} in the Roaring Fork Valley?
                  Get in touch to check availability.
                </p>
                <Link
                  href="/contact"
                  className="block bg-rva-copper hover:bg-rva-copper-light text-white text-center px-6 py-3.5 rounded-full font-semibold transition-all hover:shadow-lg w-full mb-4"
                >
                  Request Booking
                </Link>
                <a
                  href="tel:+19704563666"
                  className="block border-2 border-white/30 hover:border-white text-white text-center px-6 py-3 rounded-full font-medium transition-all w-full"
                >
                  Call 970-456-3666
                </a>
                <div className="mt-6 pt-6 border-t border-white/20 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Duration</span>
                    <span className="font-medium">{adventure.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Difficulty</span>
                    <span className="font-medium">{adventure.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Group Size</span>
                    <span className="font-medium">{groupSize}</span>
                  </div>
                </div>
              </div>

              {/* Related Adventures */}
              {relatedAdventures.length > 0 && (
                <div>
                  <h3 className="font-playfair text-xl text-rva-forest font-semibold mb-4">
                    More Adventures
                  </h3>
                  <div className="space-y-4">
                    {relatedAdventures.map((related) => (
                      <Link
                        key={related.id}
                        href={`/adventures/${slugify(related.name)}`}
                        className="group flex gap-4 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={related.image_url}
                            alt={related.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-playfair text-rva-forest font-semibold group-hover:text-rva-copper transition-colors">
                            {related.name}
                          </h4>
                          <p className="text-gray-500 text-xs mt-1">{related.duration}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
