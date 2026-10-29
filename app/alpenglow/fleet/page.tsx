import type { Metadata } from 'next'
import Link from 'next/link'
import { alpenglowData } from '@/lib/site-data'
import VehicleCard from '@/components/alpenglow/VehicleCard'
import { AAL_OG_IMAGE, AAL_VEHICLES } from '@/lib/aal-vehicles'

/** Fleet capacities must render from this file, not a stale edge prerender. */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Luxury Fleet | Suburban SUVs & Transit Van | Alpenglow',
  description:
    'Chevrolet Suburban SUVs (7 pax each) & 13-passenger Ford Transit Passenger Van — Starlink WiFi, ski racks, Aspen & Snowmass chauffeur service. Child seats are free. No shared rides are offered.',
  alternates: { canonical: 'https://aspenalpenglowlimousine.com/fleet' },
  openGraph: {
    title: 'Luxury Fleet | Suburban SUVs & Transit Van | Alpenglow',
    description:
      'Chevrolet Suburban SUVs (up to 7) and a Ford Transit Passenger Van (up to 13). No model years are listed until confirmed.',
    url: 'https://aspenalpenglowlimousine.com/fleet',
    type: 'website',
    images: [AAL_OG_IMAGE],
  },
}

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
        seatingCapacity: 7,
        description:
          'Full-size luxury SUV seating up to 7 passengers. Starlink, ski racks, and roof cargo space. Child car seats and boosters are free. No shared rides are offered. Pets are welcome, with a cleaning fee.',
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
        name: 'Ford Transit Passenger Van',
        seatingCapacity: 13,
        description:
          '13-passenger Ford Transit Passenger Van for larger groups, corporate retreats, wedding parties, and ski group transfers. Spacious interior, WiFi, ski racks. Child car seats and boosters are free. No shared rides are offered.',
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

      <section className="aal-hero-compact bg-alp-navy-deep text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left w-full">
          <h1 className="font-playfair font-bold mb-6">
            Our Fleet
          </h1>
          <p className="text-lg sm:text-xl text-alp-pearl/80 max-w-3xl">
            Two Chevrolet Suburbans (7 passengers) and one Ford Transit Passenger Van (13). Starlink, ski racks, and roof cargo. CO PUC permit LL-04725.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {AAL_VEHICLES.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

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
