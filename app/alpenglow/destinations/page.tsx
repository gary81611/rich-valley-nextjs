import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { alpenglowData } from '@/lib/site-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Aspen Day Trips & Trailheads | Aspen Alpenglow Limousine',
  description:
    'Private SUV and van service from Aspen and Snowmass to Independence Pass, the Grottos, Maroon Bells, Redstone, Marble, Glenwood Springs, and popular trailheads. Custom quotes.',
  alternates: { canonical: 'https://aspenalpenglowlimousine.com/destinations' },
  openGraph: {
    title: 'Aspen Day Trips & Trailheads | Aspen Alpenglow Limousine',
    description:
      'Chauffeured rides to Independence Pass, Maroon Bells, hiking trailheads, Redstone, Marble, and regional highlights.',
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
    name: 'Aspen Alpenglow Limousine — Roaring Fork day trips and trailheads',
    description:
      'Luxury chauffeured transportation from Aspen and the Roaring Fork Valley to Independence Pass, Maroon Bells, Crystal River valley towns, Glenwood Springs, and popular hiking trailheads.',
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
    name: 'Chauffeured Aspen-area day trips and trailhead transfers',
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
            Independence Pass, the Grottos, Maroon Bells, Redstone, Marble, Glenwood, and the trailheads
            you read about online — we plan the drive so you focus on the views, not parking or shuttle
            logistics.
          </p>
        </div>
      </section>

      <section className="bg-alp-pearl py-16 sm:py-20 border-b border-alp-pearl-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-playfair text-3xl sm:text-4xl text-alp-navy font-bold mb-6">
            Why book a private car for Aspen-area outings?
          </h2>
          <div className="space-y-5 text-alp-slate text-lg leading-relaxed">
            <p>
              Trailhead parking fills early, Maroon Bells requires shuttle coordination, and passes such as Independence
              close in bad weather — a dedicated driver keeps your group together, carries the gear, and adjusts when the
              plan shifts. The same goes for scenic days out to Redstone, Marble, or Glenwood Springs when you would
              rather not trade off who stays sober for the canyon drive home.
            </p>
            <p>
              Aspen Alpenglow Limousine stages at your lodging with a Suburban or Transit van sized for your party,
              knows load zones and seasonal road rules, and quotes wait time realistically for hikes and hot springs.
              Many guests pair local day trips with airport service — see our{' '}
              <a href="/airport-transfers" className="text-alp-gold font-semibold hover:underline">
                airport transfer service
              </a>{' '}
              and regional notes for{' '}
              <a href="/areas/vail" className="text-alp-gold font-semibold hover:underline">
                Aspen–Vail moves
              </a>
              .
            </p>
            <p>
              Every itinerary is priced from mileage, vehicle, hours on site, and season. Share your trail or town list —
              we will help you pace the day. For more ideas, browse our{' '}
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
                    <div className="text-alp-slate leading-relaxed mb-6 whitespace-pre-line">
                      {dest.description}
                    </div>
                    <Link
                      href={alpenglowData.onlineReservationsPath}
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
