import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Popular Destinations | Rich Valley Adventures',
  description:
    'Aspen-area day trips and trailheads — Independence Pass, the Grottos, Maroon Bells, Redstone, Marble, Glenwood Springs, and popular hikes. Luxury transportation with Aspen Alpenglow Limousine.',
  alternates: {
    canonical: 'https://www.richvalleyadventures.com/destinations',
  },
}

export default async function DestinationsPage() {
  const supabase = await createServerSupabaseClient()

  const { data: destinationsRaw } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  const destinations = (destinationsRaw ?? []).map((dest: { id: string; name: string; description: string; image_url?: string; image?: string }) => ({
    id: dest.id,
    name: dest.name,
    description: dest.description,
    image: dest.image_url || dest.image || '/images/destinations/garden-of-the-gods.jpg',
  }))

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
            <span className="text-rva-copper-light">Destinations</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-20 bg-rva-forest-dark text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-cormorant text-rva-copper-light text-lg tracking-widest uppercase mb-4">
            Explore Colorado
          </p>
          <h1 className="font-playfair text-4xl md:text-6xl text-white font-bold mb-6">
            Popular Destinations
          </h1>
          <p className="text-white/75 text-xl max-w-2xl mx-auto">
            Independence Pass, Maroon Bells, the Crystal River valley, Glenwood Canyon, and the trailheads on your list —
            we help you explore the Roaring Fork and beyond with comfortable private transportation.
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {destinations.length === 0 ? (
            <p className="text-center text-gray-500">No destinations available at this time. Check back soon!</p>
          ) : (
            destinations.map((dest, i) => (
              <div
                key={dest.id}
                className="bg-white rounded-3xl shadow-md overflow-hidden border border-rva-cream-dark"
              >
                <div className={`grid lg:grid-cols-2 ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                  <div className="relative h-64 sm:h-80 lg:h-auto min-h-[280px] bg-rva-forest-dark">
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-8 sm:p-12 flex flex-col justify-center">
                    <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-rva-forest mb-4">
                      {dest.name}
                    </h2>
                    <div className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                      {dest.description}
                    </div>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 bg-rva-copper hover:bg-rva-copper-light text-white font-bold px-6 py-3 rounded-full transition-colors w-fit"
                    >
                      Plan a Trip
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-rva-forest">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl text-white font-bold mb-4">
            Have a Destination in Mind?
          </h2>
          <p className="text-white/75 text-lg mb-8 max-w-2xl mx-auto">
            We can arrange scenic tours, trailhead drop-offs, and full-day loops across the central mountains.
            Contact us for a custom itinerary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-rva-copper hover:bg-rva-copper-light text-white px-10 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-2xl hover:-translate-y-0.5 inline-block"
            >
              Get a Quote
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
