import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { seoAlt } from '@/lib/seo/alt-text'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Fleet | Rich Valley Adventures',
  description:
    'Our sister company Aspen Alpenglow Limousine provides luxury transportation in Chevrolet Suburbans (7 passengers each) and a Ford Transit Van (14 passengers) for Chauffeur Guided Tours and Excursions and transfers.',
  alternates: {
    canonical: 'https://aspenalpenglowlimousine.com/fleet',
  },
}

async function getFleetVehicles() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('fleet_vehicles')
    .select('id, name, image, passengers, features, description, vehicle_type')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching fleet vehicles:', error)
    return []
  }
  return data ?? []
}

export default async function FleetPage() {
  const vehicles = await getFleetVehicles()

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
            <span className="text-rva-copper-light">Fleet</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-20 bg-rva-forest-dark text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-cormorant text-rva-copper-light text-lg tracking-widest uppercase mb-4">
            Luxury Transportation
          </p>
          <h1 className="font-playfair text-4xl md:text-6xl text-white font-bold mb-6">
            Our Fleet
          </h1>
          <p className="text-white/75 text-xl max-w-2xl mx-auto">
            Through our sister company{' '}
            <span className="text-rva-copper-light font-semibold">Aspen Alpenglow Limousine</span>,
            we offer luxury vehicles for scenic tours, airport transfers, and special occasions.
          </p>
        </div>
      </section>

      {/* Fleet Cards */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {vehicles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No vehicles available at this time. Please check back soon.</p>
            </div>
          ) : (
            vehicles.map((vehicle, i) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden border border-rva-cream-dark"
              >
                <div className={`grid lg:grid-cols-2 ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                  <div className="relative h-72 sm:h-96 lg:h-auto min-h-[280px] bg-rva-forest-dark">
                    <Image
                      src={vehicle.image}
                      alt={seoAlt({
                        subject: vehicle.name,
                        location: 'Aspen, Colorado',
                        context: 'luxury transportation vehicle',
                        brand: 'Aspen Alpenglow Limousine',
                      })}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-8 sm:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-rva-copper/10 text-rva-copper text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {vehicle.vehicle_type ?? (i === 0 ? 'SUV' : 'Van')}
                      </span>
                      <span className="text-gray-500 text-sm">{vehicle.passengers}</span>
                    </div>
                    <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-rva-forest mb-4">
                      {vehicle.name}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {vehicle.description}
                    </p>
                    <ul className="grid grid-cols-2 gap-3 mb-8">
                      {(vehicle.features as string[])?.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-rva-forest">
                          <svg className="w-4 h-4 text-rva-copper flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/contact"
                      className="inline-block bg-rva-copper hover:bg-rva-copper-light text-white font-bold px-8 py-3 rounded-full transition-colors text-center w-fit"
                    >
                      Book a Ride
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
            Need a Ride?
          </h2>
          <p className="text-white/75 text-lg mb-8 max-w-2xl mx-auto">
            Whether it&apos;s an airport transfer, a scenic tour, or transportation to the trailhead,
            Aspen Alpenglow Limousine has you covered.
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
