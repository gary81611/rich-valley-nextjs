import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Our Fleet | Aspen Alpenglow Limousine',
  description: 'Explore our luxury fleet: Executive Cadillac Escalade (6 passengers) and Luxury Mercedes Sprinter (14 passengers). Late-model, professionally maintained vehicles for every occasion.',
}

type FleetVehicle = {
  id: number
  name: string
  type: string
  capacity: number
  description: string
  image_url: string
  features: string[]
  display_order: number
  is_active: boolean
}

export default async function FleetPage() {
  const supabase = await createServerSupabaseClient()
  const { data: fleetVehicles } = await supabase
    .from('fleet_vehicles')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  const vehicles: FleetVehicle[] = fleetVehicles ?? []

  if (vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-alp-pearl font-inter">
        <div className="bg-alp-navy-deep">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex text-sm text-alp-pearl/70">
              <Link href="/" className="hover:text-alp-gold transition-colors">Home</Link>
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
              Our fleet information is being updated. Please call us for vehicle availability.
            </p>
          </div>
        </section>
        <section className="bg-alp-navy-deep text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <a
              href="tel:+19704563666"
              className="inline-block border-2 border-alp-gold text-alp-gold font-bold px-8 py-3 rounded-full hover:bg-alp-gold hover:text-alp-navy transition-colors"
            >
              Call 970-456-3666
            </a>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      {/* Breadcrumb */}
      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-alp-pearl/70">
            <Link href="/" className="hover:text-alp-gold transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-alp-gold">Fleet</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-alp-navy-deep text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Our <span className="text-alp-gold">Fleet</span>
          </h1>
          <p className="text-lg sm:text-xl text-alp-pearl/80 max-w-3xl mx-auto">
            Late-model luxury vehicles, meticulously maintained and professionally detailed before every ride.
            Choose the perfect vehicle for your journey.
          </p>
        </div>
      </section>

      {/* Fleet Cards */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {vehicles.map((vehicle, i) => (
            <div key={vehicle.id} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-alp-pearl-dark">
              <div className="grid lg:grid-cols-2">
                <div className={`relative h-72 sm:h-96 lg:h-auto bg-alp-navy-deep${i % 2 === 1 ? ' lg:order-2' : ''}`}>
                  <Image
                    src={vehicle.image_url || '/images/fleet/default.png'}
                    alt={`${vehicle.name} — luxury limousine service in Aspen`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className={`p-8 sm:p-12 flex flex-col justify-center${i % 2 === 1 ? ' lg:order-1' : ''}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-alp-gold/10 text-alp-gold text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {vehicle.type}
                    </span>
                    <span className="text-alp-slate text-sm">Up to {vehicle.capacity} Passengers</span>
                  </div>
                  <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-alp-navy mb-4">
                    {vehicle.name}
                  </h2>
                  <p className="text-alp-slate leading-relaxed mb-6">
                    {vehicle.description}
                  </p>
                  {vehicle.features && vehicle.features.length > 0 && (
                    <ul className="grid grid-cols-2 gap-3 mb-8">
                      {vehicle.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-alp-navy">
                          <svg className="w-4 h-4 text-alp-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    href="/contact"
                    className="inline-block bg-alp-gold text-alp-navy font-bold px-8 py-3 rounded-full hover:bg-alp-gold-light transition-colors text-center w-fit"
                  >
                    Reserve Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-alp-navy-deep text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-4">
            Not Sure Which <span className="text-alp-gold">Vehicle</span>?
          </h2>
          <p className="text-alp-pearl/80 mb-8 max-w-2xl mx-auto">
            Call us and we will help you choose the perfect vehicle for your group size and occasion.
          </p>
          <a
            href="tel:+19704563666"
            className="inline-block border-2 border-alp-gold text-alp-gold font-bold px-8 py-3 rounded-full hover:bg-alp-gold hover:text-alp-navy transition-colors"
          >
            Call 970-456-3666
          </a>
        </div>
      </section>
    </div>
  )
}
