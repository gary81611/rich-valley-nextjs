import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'

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
  season: string
  image: string
  is_active: boolean
  display_order: number
  created_at: string
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
          <p className="font-cormorant text-rva-copper-light text-lg tracking-widest uppercase mb-4">
            November through April
          </p>
          <h1 className="font-playfair text-4xl md:text-6xl text-white font-bold mb-6">
            Winter Offerings
          </h1>
          <p className="text-white/75 text-xl max-w-2xl mx-auto">
            The Roaring Fork Valley is just as magical under snow. Explore our guided winter
            adventures — all gear included, small groups, expert local guides.
          </p>
        </div>
      </section>

      {/* Winter Adventures */}
      <section className="py-16 bg-rva-cream">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          {winterAdventures.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No winter adventures available at this time. Check back soon!</p>
            </div>
          )}
          {winterAdventures.map((adventure, i) => (
            <div
              key={adventure.title}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? 'lg:direction-rtl' : ''
              }`}
            >
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-rva-copper/10 text-rva-copper text-sm px-4 py-1.5 rounded-full font-medium">
                    {adventure.duration}
                  </span>
                  <span className="bg-rva-forest/10 text-rva-forest text-sm px-4 py-1.5 rounded-full">
                    {adventure.difficulty}
                  </span>
                  {adventure.season && (
                    <span className="bg-blue-50 text-blue-700 text-sm px-4 py-1.5 rounded-full">
                      {adventure.season}
                    </span>
                  )}
                </div>
                <h2 className="font-playfair text-3xl md:text-4xl text-rva-forest font-bold mb-6">
                  {adventure.title}
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  {adventure.description}
                </p>
                <p className="text-sm text-rva-copper font-medium mb-6">Starting at $250/person · All gear provided · Transport by Aspen Alpenglow Limousine</p>
                <Link
                  href="/rva/contact"
                  className="bg-rva-copper hover:bg-rva-copper-light text-white px-8 py-3.5 rounded-full font-semibold transition-all hover:shadow-lg inline-block"
                >
                  Book Now — 970-456-3666
                </Link>
              </div>
              <div className={`relative ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                  <Image
                    src={adventure.image}
                    alt={`${adventure.title} — guided winter adventure near Aspen, Colorado with Rich Valley Adventures`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rva-forest-dark/30 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          ))}
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
            <Link
              href="/contact"
              className="bg-rva-copper hover:bg-rva-copper-light text-white px-10 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-2xl hover:-translate-y-0.5 inline-block"
            >
              Book Now
            </Link>
            <a
              href="tel:+19704563666"
              className="border-2 border-white text-white hover:bg-white hover:text-rva-forest px-10 py-4 rounded-full font-semibold text-lg transition-all inline-block"
            >
              Call 970-456-3666
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
