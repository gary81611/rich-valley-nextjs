import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Colorado Day Trips & Tours | Aspen Alpenglow Limousine',
  description:
    'Chauffeured luxury SUV & van service from Aspen to Red Rocks, Garden of the Gods, Pikes Peak, Denver venues & more. Custom itineraries, group-friendly, 24/7 quotes.',
  alternates: { canonical: 'https://aspenalpenglowlimousine.com/destinations' },
  openGraph: {
    title: 'Colorado Day Trips & Tours | Aspen Alpenglow Limousine',
    description: 'Private car service from the Roaring Fork Valley to Colorado’s most iconic landmarks.',
    url: 'https://aspenalpenglowlimousine.com/destinations',
    type: 'website',
  },
}

async function getDestinations() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('destinations')
    .select('id, name, image_url, description')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching destinations:', error)
    return []
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    image: row.image_url || '/images/destinations/garden-of-the-gods.jpg',
  }))
}

export default async function DestinationsPage() {
  const destinations = await getDestinations()

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Aspen Alpenglow Limousine — popular Colorado destinations',
    description:
      'Luxury chauffeured transportation from Aspen and the Roaring Fork Valley to signature Colorado landmarks and metro Denver experiences.',
    numberOfItems: destinations.length,
    itemListElement: destinations.map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: d.name,
    })),
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Chauffeured Colorado destination tours from Aspen',
    serviceType: 'Luxury ground transportation & private tours',
    url: 'https://aspenalpenglowlimousine.com/destinations',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Aspen Alpenglow Limousine',
      telephone: '+19704563666',
      url: 'https://aspenalpenglowlimousine.com',
      address: { '@type': 'PostalAddress', addressLocality: 'Aspen', addressRegion: 'CO', addressCountry: 'US' },
    },
    areaServed: { '@type': 'AdministrativeArea', name: 'Colorado' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    <div className="min-h-screen bg-alp-pearl font-inter">
      {/* Breadcrumb */}
      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-alp-pearl/70">
            <Link href="/" className="hover:text-alp-gold transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-alp-gold">Destinations</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-alp-navy-deep text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Popular <span className="text-alp-gold">Destinations</span>
          </h1>
          <p className="text-lg sm:text-xl text-alp-pearl/80 max-w-3xl mx-auto">
            From mountain peaks to city landmarks, we provide luxury transportation to Colorado&apos;s
            most celebrated destinations. Sit back, relax, and enjoy the ride.
          </p>
        </div>
      </section>

      <section className="bg-alp-pearl py-16 sm:py-20 border-b border-alp-pearl-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-playfair text-3xl sm:text-4xl text-alp-navy font-bold mb-6">
            Why book a private car for Colorado day trips?
          </h2>
          <div className="space-y-5 text-alp-slate text-lg leading-relaxed">
            <p>
              Aspen and Snowmass are an ideal home base — but some of Colorado&apos;s most memorable experiences sit
              beyond the Roaring Fork Valley: sunrise concerts at Red Rocks, Garden of the Gods at golden hour, a
              Rockies game at Coors Field, or a slow loop through Denver Botanic Gardens before dinner in LoDo. The
              drive itself can be half the adventure when you are not white-knuckling I-70 in a rental after a long
              travel week.
            </p>
            <p>
              Aspen Alpenglow Limousine plans these days as true door-to-door itineraries. Your chauffeur stages at
              your lodging with a Suburban or Transit van configured for your group, handles parking and load zones at
              crowded venues, and adjusts timing when Front Range weather or event traffic shifts the plan. Many guests
              pair a destination day with a simple airport strategy — we often coordinate DEN or EGE arrivals into a
              multi-stop Colorado week; see our{' '}
              <a href="/airport-transfers" className="text-alp-gold font-semibold hover:underline">
                airport transfer service
              </a>{' '}
              and regional route guide for{' '}
              <a href="/areas/vail" className="text-alp-gold font-semibold hover:underline">
                Aspen–Vail moves
              </a>
              .
            </p>
            <p>
              Every itinerary is quoted individually based on mileage, vehicle choice, wait time at venues, and season.
              Share your must-see list — we will recommend realistic pacing so you enjoy the day instead of watching the
              clock. For more travel ideas, browse our{' '}
              <a href="/blog" className="text-alp-gold font-semibold hover:underline">
                transportation blog
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {destinations.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-alp-slate text-lg">No destinations available at this time. Please check back soon.</p>
            </div>
          ) : (
            destinations.map((dest, i) => (
              <div
                key={dest.id}
                className="bg-white rounded-3xl shadow-md overflow-hidden border border-alp-pearl-dark"
              >
                <div className={`grid lg:grid-cols-2 ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                  <div className="relative h-64 sm:h-80 lg:h-auto min-h-[280px] bg-alp-navy-deep">
                    <Image
                      src={dest.image}
                      alt={`${dest.name} — Colorado destination with Aspen Alpenglow Limousine private chauffeured SUV and van service from Aspen`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-8 sm:p-12 flex flex-col justify-center">
                    <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-alp-navy mb-4">
                      {dest.name}
                    </h2>
                    <p className="text-alp-slate leading-relaxed mb-6">
                      {dest.description}
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 bg-alp-gold text-alp-navy font-bold px-6 py-3 rounded-full hover:bg-alp-gold-light transition-colors w-fit"
                    >
                      Book a Ride
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
      <section className="bg-alp-navy-deep text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-4">
            Have a <span className="text-alp-gold">Custom Destination</span> in Mind?
          </h2>
          <p className="text-alp-pearl/80 mb-8 max-w-2xl mx-auto">
            We go wherever you need. Contact us with your destination and we will provide a custom quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-alp-gold text-alp-navy font-bold px-8 py-3 rounded-full hover:bg-alp-gold-light transition-colors"
            >
              Get a Quote
            </Link>
            <a
              href="tel:+19704563666"
              className="inline-block border-2 border-alp-gold text-alp-gold font-bold px-8 py-3 rounded-full hover:bg-alp-gold hover:text-alp-navy transition-colors"
            >
              Call 970-456-3666
            </a>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
