import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { seoAlt } from '@/lib/seo/alt-text'
import { correctAalFleetText } from '@/lib/aal-public-copy'
import RvaButton, { RVA_PHONE_HREF, RVA_PHONE_LABEL, RVA_BOOKING_LABEL } from '@/components/rva/Button'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Fleet | Rich Valley Adventures',
  description:
    'Our sister company Aspen Alpenglow Limousine provides luxury transportation in Chevrolet Suburbans (7 passengers each) and a Ford Transit Van (13 passengers) for Chauffeur Guided Tours and Excursions and transfers. Child seats are free. No shared rides are offered.',
  alternates: {
    canonical: 'https://aspenalpenglowlimousine.com/fleet',
  },
}

async function getFleetVehicles() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('fleet_vehicles')
    .select('id, name, type, capacity, description, image_url')
    .eq('is_active', true)
    .order('name', { ascending: true })

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
                  {vehicle.image_url ? (
                  <div className="relative h-72 sm:h-96 lg:h-auto min-h-[280px] bg-rva-forest-dark">
                    <Image
                      src={vehicle.image_url}
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
                  ) : null}
                  <div className="p-8 sm:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      {vehicle.type ? (
                      <span className="bg-rva-copper-700/10 text-rva-copper-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {vehicle.type}
                      </span>
                      ) : null}
                      {vehicle.capacity ? (
                      <span className="text-gray-500 text-sm">{correctAalFleetText(`${vehicle.capacity} passengers`)}</span>
                      ) : null}
                    </div>
                    <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-rva-forest mb-4">
                      {correctAalFleetText(vehicle.name)}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {vehicle.description ? correctAalFleetText(vehicle.description) : null}
                    </p>
                    <RvaButton href="/contact" className="w-fit">
                      {RVA_BOOKING_LABEL}
                    </RvaButton>
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
