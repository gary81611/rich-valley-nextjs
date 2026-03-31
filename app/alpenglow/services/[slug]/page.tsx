import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

type ServiceRow = {
  id: number
  slug: string
  title: string
  description: string
  long_description: string
  features: string[]
  icon: string
}

type FleetVehicle = {
  id: number
  name: string
  capacity: number
  image_url: string
  features: string[]
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const { data: service } = await supabase
    .from('services')
    .select('title, description')
    .eq('slug', slug)
    .single()

  if (!service) return { title: 'Service Not Found' }

  return {
    title: `${service.title} | Aspen Alpenglow Limousine`,
    description: service.description,
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single<ServiceRow>()

  if (!service) {
    return (
      <div className="min-h-screen bg-alp-pearl font-inter flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-playfair text-3xl font-bold text-alp-navy mb-4">Service Not Found</h1>
          <Link href="/services" className="text-alp-gold hover:underline">Back to Services</Link>
        </div>
      </div>
    )
  }

  const { data: fleetVehicles } = await supabase
    .from('fleet_vehicles')
    .select('id, name, capacity, image_url, features')
    .eq('is_active', true)
    .order('display_order')

  const vehicles: FleetVehicle[] = fleetVehicles ?? []

  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      {/* Breadcrumb */}
      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-alp-pearl/70">
            <Link href="/" className="hover:text-alp-gold transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="hover:text-alp-gold transition-colors">Services</Link>
            <span className="mx-2">/</span>
            <span className="text-alp-gold">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-alp-navy-deep text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            {service.title}
          </h1>
          <p className="text-lg sm:text-xl text-alp-pearl/80 max-w-3xl">
            {service.description}
          </p>
        </div>
      </section>

      {/* Details */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-playfair text-3xl font-bold text-alp-navy mb-6">
                About This Service
              </h2>
              <p className="text-alp-slate leading-relaxed text-lg mb-8">
                {service.long_description}
              </p>
              {service.features && service.features.length > 0 && (
                <>
                  <h3 className="font-playfair text-xl font-bold text-alp-navy mb-4">What&apos;s Included</h3>
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-alp-navy">
                        <svg className="w-5 h-5 text-alp-gold mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Fleet Preview */}
            {vehicles.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-playfair text-2xl font-bold text-alp-navy mb-4">Available Vehicles</h3>
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="bg-white rounded-2xl shadow-md p-6 border border-alp-pearl-dark">
                    <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-alp-navy-deep">
                      <Image
                        src={vehicle.image_url || '/images/fleet/default.png'}
                        alt={vehicle.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <h4 className="font-playfair text-xl font-bold text-alp-navy mb-1">{vehicle.name}</h4>
                    <p className="text-alp-gold font-semibold text-sm mb-3">Up to {vehicle.capacity} Passengers</p>
                    {vehicle.features && vehicle.features.length > 0 && (
                      <ul className="grid grid-cols-2 gap-1">
                        {vehicle.features.map((f) => (
                          <li key={f} className="text-sm text-alp-slate flex items-center gap-1">
                            <span className="w-1 h-1 bg-alp-gold rounded-full flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-alp-navy-deep text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-4">
            Book <span className="text-alp-gold">{service.title}</span>
          </h2>
          <p className="text-alp-pearl/80 mb-8 max-w-2xl mx-auto">
            Ready to experience luxury transportation? Contact us today to reserve your ride.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-alp-gold text-alp-navy font-bold px-8 py-3 rounded-full hover:bg-alp-gold-light transition-colors"
            >
              Book Now
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
  )
}
