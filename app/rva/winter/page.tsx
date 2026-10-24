import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { seasonForWinterAdventure } from '@/lib/rva-winter-seasons'
import RvaButton, { RVA_BOOKING_LABEL, RVA_PHONE_LABEL, RVA_PHONE_HREF } from '@/components/rva/Button'

const AAL_LINK = 'https://aspenalpenglowlimousine.com'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Winter Adventures | Rich Valley Adventures | Aspen, CO',
  description:
    'Explore winter in the Roaring Fork Valley with Rich Valley Adventures. Guided snowshoeing, cross-country skiing, ice fishing, and winter Chauffeur Guided Tours in Aspen, Colorado.',
  alternates: {
    canonical: 'https://www.richvalleyadventures.com/winter',
  },
  openGraph: {
    title: 'Winter Adventures in Aspen | Rich Valley Adventures',
    description:
      'Guided snowshoeing, cross-country skiing, ice fishing, and scenic winter tours in the Roaring Fork Valley.',
    type: 'website',
    url: 'https://www.richvalleyadventures.com/winter',
  },
}

interface WinterAdventure {
  id: string
  title: string
  description: string
  duration: string
  difficulty: string
  season?: string | null
  image_url?: string | null
  is_active: boolean
  display_order: number
}

async function getWinterAdventures(): Promise<WinterAdventure[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || !url.startsWith('http')) return []

  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from('winter_adventures')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    return (data as WinterAdventure[]) || []
  } catch {
    return []
  }
}

export default async function WinterPage() {
  const winterAdventures = await getWinterAdventures()

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
            <span className="text-rva-copper-light">Winter Offerings</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="py-20 bg-rva-forest-dark text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-cormorant text-rva-copper-light text-sm md:text-lg tracking-[0.14em] uppercase mb-4 whitespace-nowrap">
            November through April
          </p>
          <h1 className="font-playfair text-white mb-6">
            Winter Offerings
          </h1>
          <p className="text-white/75 text-xl max-w-2xl mx-auto">
            The Roaring Fork Valley is just as magical under snow. Explore our guided winter
            adventures — all gear included, small groups, expert local guides.
          </p>
        </div>
      </section>

      {/* How it works — shared */}
      <section className="py-14 bg-white border-b border-rva-sage/20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-playfair text-2xl md:text-3xl text-rva-forest font-bold mb-6 text-center">
            How winter trips work
          </h2>
          <ul className="space-y-3 text-gray-700 leading-relaxed">
            <li>
              <strong className="text-rva-forest">Pricing:</strong> Starting at $250 per person
            </li>
            <li>
              <strong className="text-rva-forest">Half-day:</strong> 3–4 hours door-to-door. Includes snacks and drinks.
            </li>
            <li>
              <strong className="text-rva-forest">Full day:</strong> 6–8 hours door-to-door. Includes lunch.
            </li>
            <li>
              <strong className="text-rva-forest">Gear:</strong> All gear provided on every trip
            </li>
            <li>
              <strong className="text-rva-forest">Group sizes:</strong> 1–12 people
            </li>
            <li>
              <strong className="text-rva-forest">Transportation:</strong> All transportation provided by{' '}
              <a href={AAL_LINK} className="text-rva-copper-700 font-semibold underline hover:text-rva-forest">
                Aspen Alpenglow Limousine
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* Advance booking */}
      <div className="bg-amber-50 border-y border-amber-200/80">
        <div className="max-w-4xl mx-auto px-6 py-5 flex gap-4 items-start">
          <span className="text-amber-700 text-xl" aria-hidden>
            ⚠
          </span>
          <p className="text-sm md:text-base text-amber-950/90 leading-relaxed">
            <strong>Advance booking required:</strong> Ice fishing, snowshoeing, and cross-country skiing must be booked
            with a minimum 7-day notice. All other winter activities: 48-hour advance booking recommended.
          </p>
        </div>
      </div>

      {/* Winter Adventures */}
      <section className="py-16 bg-rva-cream">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          {winterAdventures.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No winter adventures available at this time. Check back soon!</p>
            </div>
          )}
          {winterAdventures.map((adventure, i) => {
            const imageSrc = (adventure.image_url || '').trim()
            return (
            <div
              key={adventure.title}
              className={imageSrc ? `grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:direction-rtl' : ''}` : ''}
            >
              <div className={imageSrc && i % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-rva-copper-700/10 text-rva-copper-700 text-sm px-4 py-1.5 rounded-full font-medium">
                    {adventure.duration}
                  </span>
                  <span className="bg-rva-forest/10 text-rva-forest text-sm px-4 py-1.5 rounded-full">
                    {adventure.difficulty}
                  </span>
                  {(seasonForWinterAdventure(adventure.title) || adventure.season) && (
                    <span className="bg-blue-50 text-blue-700 text-sm px-4 py-1.5 rounded-full">
                      {seasonForWinterAdventure(adventure.title) || adventure.season}
                    </span>
                  )}
                </div>
                <h2 className="font-playfair text-3xl md:text-4xl text-rva-forest font-bold mb-6">
                  {adventure.title}
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {adventure.description}
                </p>
                <ul className="text-sm text-gray-700 space-y-2 mb-6 border-l-2 border-rva-copper/40 pl-4">
                  <li>Starting at $250 per person · Half-day &amp; full-day options (see above)</li>
                  <li>Groups 1–12 · All gear included</li>
                  <li>
                    Transport:{' '}
                    <a href={AAL_LINK} className="text-rva-copper-700 font-semibold underline hover:text-rva-forest">
                      Aspen Alpenglow Limousine
                    </a>
                  </li>
                </ul>
                <RvaButton href="/contact" size="md">
                  {RVA_BOOKING_LABEL}
                </RvaButton>
              </div>
              {imageSrc ? (
              <div className={`relative ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] border border-rva-forest/15">
                  <Image
                    src={imageSrc}
                    alt={`${adventure.title} — guided winter adventure near Aspen, Colorado with Rich Valley Adventures`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
              ) : null}
            </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-rva-forest">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl text-white font-bold mb-4">
            Plan Your Winter Adventure
          </h2>
          <p className="text-white/75 text-lg mb-8 max-w-2xl mx-auto">
            Winter in the Roaring Fork Valley is something special. Let us help you experience it
            the right way — with expert guides, premium gear, and small groups.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RvaButton href="/contact" size="lg" tone="on-dark">
              {RVA_BOOKING_LABEL}
            </RvaButton>
            <RvaButton href={RVA_PHONE_HREF} variant="secondary" size="lg" tone="on-dark">
              {RVA_PHONE_LABEL}
            </RvaButton>
          </div>
        </div>
      </section>
    </div>
  )
}
