import type { Metadata } from 'next'
import Link from 'next/link'
import { alpenglowData } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Luxury Fleet | Suburban SUVs & Transit Van | Alpenglow',
  description:
    'Chevrolet Suburban SUVs (7 pax each) & 14-passenger Ford Transit Van — Starlink WiFi, ski racks, Aspen & Snowmass chauffeur service. View amenities & book.',
  alternates: { canonical: 'https://aspenalpenglowlimousine.com/fleet' },
}

const VEHICLES = [
  {
    id: 'suburban-2026',
    title: '2026 Chevrolet Suburban',
    capacity: 7,
    amenities: [
      'WiFi (Starlink)',
      'XM Radio',
      'Complimentary Water',
      'Yakima Roof Rack (luggage)',
      'Myers 6X Ski Rack',
    ],
  },
  {
    id: 'suburban-2025',
    title: '2025 Chevrolet Suburban',
    capacity: 7,
    amenities: [
      'WiFi (Starlink)',
      'XM Radio',
      'Complimentary Water',
      'Yakima Roof Rack (luggage)',
      'Myers 6X Ski Rack',
    ],
  },
  {
    id: 'transit-2025',
    title: '2025 Ford Transit Van',
    capacity: 14,
    amenities: ['WiFi (Starlink)', 'XM Radio', 'Complimentary Water', 'Myers 6X Ski Rack'],
  },
] as const

const fleetJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Aspen Alpenglow Limousine Fleet',
  description: 'Luxury vehicle fleet serving Aspen, Snowmass, and the Roaring Fork Valley',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Vehicle',
        name: 'Chevrolet Suburban',
        vehicleModelDate: '2026',
        numberOfDoors: 4,
        seatingCapacity: 7,
        vehicleInteriorColor: 'Black',
        color: 'Black',
        description:
          'Full-size luxury SUV seating up to 7 passengers with ample luggage space. Ideal for airport transfers, corporate travel, and small groups. WiFi, ski racks, professionally chauffeured.',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Vehicle',
        name: 'Ford Transit Van',
        vehicleModelDate: '2025',
        numberOfDoors: 4,
        seatingCapacity: 14,
        vehicleInteriorColor: 'Black',
        color: 'Black',
        description:
          '14-passenger Ford Transit Van for larger groups, corporate retreats, wedding parties, and ski group transfers. Spacious interior, WiFi, ski racks.',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
      },
    },
  ],
}

export default function FleetPage() {
  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(fleetJsonLd) }} />
      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-alp-pearl/70">
            <Link href="/" className="hover:text-alp-gold transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-alp-gold">Fleet</span>
          </nav>
        </div>
      </div>

      <section className="bg-alp-navy-deep text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Our <span className="text-alp-gold">Fleet</span>
          </h1>
          <p className="text-lg sm:text-xl text-alp-pearl/80 max-w-3xl mx-auto">
            Late-model SUVs and group transport, meticulously maintained and professionally detailed before every ride.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {VEHICLES.map((v) => (
              <article
                key={v.id}
                className="bg-white rounded-2xl border border-alp-pearl-dark shadow-sm p-8 flex flex-col"
              >
                <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-alp-navy mb-3">{v.title}</h2>
                <p className="text-alp-slate text-sm font-medium mb-6">
                  Up to <span className="text-alp-gold font-bold">{v.capacity}</span> passengers
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {v.amenities.map((a) => (
                    <span
                      key={a}
                      className="text-xs font-semibold uppercase tracking-wide bg-alp-gold/10 text-alp-navy px-3 py-1.5 rounded-full border border-alp-gold/20"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <p className="mt-12 text-center text-alp-slate max-w-3xl mx-auto leading-relaxed">
            All vehicles are professionally maintained, late-model, and chauffeured by experienced mountain drivers.
            Ski racks and roof storage available on every vehicle.
          </p>
        </div>
      </section>

      <section className="bg-alp-navy-deep text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold mb-4">
            Ready to <span className="text-alp-gold">book</span>?
          </h2>
          <p className="text-alp-pearl/80 mb-8 max-w-2xl mx-auto">
            Reserve your vehicle or get a custom quote for your group.
          </p>
          <Link
            href={alpenglowData.onlineReservationsPath}
            className="inline-block bg-alp-gold text-alp-navy font-bold px-8 py-3 rounded-full hover:bg-alp-gold-light transition-colors"
          >
            Book online
          </Link>
          <p className="mt-6">
            <a
              href="tel:+19704563666"
              className="text-alp-gold hover:text-alp-gold-light font-semibold"
            >
              Or call 970-456-3666
            </a>
          </p>
          <p className="mt-4 text-sm text-alp-pearl/75">
            Planning a specific trip?{' '}
            <Link href="/weddings" className="text-alp-gold hover:text-alp-gold-light font-semibold">
              Wedding transportation
            </Link>{' '}
            ·{' '}
            <Link href="/corporate" className="text-alp-gold hover:text-alp-gold-light font-semibold">
              Corporate transportation
            </Link>{' '}
            ·{' '}
            <Link href="/airport-transfers" className="text-alp-gold hover:text-alp-gold-light font-semibold">
              Airport transfers
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
