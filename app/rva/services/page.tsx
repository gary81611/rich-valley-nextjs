import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Services | Rich Valley Adventures',
  description: 'Guided outdoor adventures and luxury transportation in Aspen and the Roaring Fork Valley. Fly fishing, hiking, mountain biking, scenic tours, and more from Rich Valley Adventures.',
  alternates: {
    canonical: 'https://www.richvalleyadventures.com/services',
  },
}

export default async function ServicesPage() {
  const supabase = await createServerSupabaseClient()

  const { data: adventuresRaw } = await supabase
    .from('adventures')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  const { data: servicesRaw } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  const adventures = (adventuresRaw ?? []).map((a: any) => ({
    title: a.name,
    slug: a.name.toLowerCase().replace(/\s+/g, '-'),
    description: a.description,
    image: a.image_url,
    duration: a.duration,
    difficulty: a.difficulty,
  }))

  const services = (servicesRaw ?? []).map((s: any) => ({
    title: s.name,
    slug: s.slug || s.name.toLowerCase().replace(/\s+/g, '-'),
    description: s.description,
    features: s.features || [],
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
            <span className="text-rva-copper-light">Services</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-20 bg-rva-forest-dark text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-cormorant text-rva-copper-light text-lg tracking-widest uppercase mb-4">
            What We Offer
          </p>
          <h1 className="font-playfair text-4xl md:text-6xl text-white font-bold mb-6">
            Adventures &amp; Services
          </h1>
          <p className="text-white/75 text-xl max-w-2xl mx-auto">
            From guided outdoor experiences to luxury transportation, we have everything
            you need for an unforgettable time in the Roaring Fork Valley.
          </p>
        </div>
      </section>

      {/* Adventures Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-cormorant text-rva-copper text-lg tracking-widest uppercase mb-2">
              Rich Valley Adventures
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl text-rva-forest font-bold mb-4">
              Guided Outdoor Adventures
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Expert-led experiences for all skill levels, with all gear included.
            </p>
          </div>
          {adventures.length === 0 ? (
            <p className="text-center text-gray-500">No adventures available at this time. Check back soon!</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {adventures.map((adventure) => (
                <Link
                  key={adventure.slug}
                  href={`/adventures/${adventure.slug}`}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-rva-cream-dark hover:-translate-y-1"
                >
                  <div className="relative h-48 bg-rva-forest-dark">
                    <Image
                      src={adventure.image}
                      alt={adventure.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-playfair text-xl font-bold text-rva-forest group-hover:text-rva-copper transition-colors mb-2">
                      {adventure.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                      {adventure.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{adventure.duration}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span>{adventure.difficulty}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Transportation Section */}
      <section className="py-16 sm:py-24 bg-rva-cream-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-cormorant text-rva-copper text-lg tracking-widest uppercase mb-2">
              Aspen Alpenglow Limousine
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl text-rva-forest font-bold mb-4">
              Luxury Transportation
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our sister company offers premium car service throughout the Roaring Fork Valley and beyond.
            </p>
          </div>
          {services.length === 0 ? (
            <p className="text-center text-gray-500">No services available at this time. Check back soon!</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <div
                  key={service.slug}
                  className="bg-white rounded-2xl shadow-md p-6 border border-rva-cream-dark"
                >
                  <h3 className="font-playfair text-lg font-bold text-rva-forest mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  <ul className="space-y-1">
                    {service.features.slice(0, 2).map((feature: string) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-3 h-3 text-rva-copper flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-rva-forest">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl text-white font-bold mb-4">
            Ready to Plan Your Trip?
          </h2>
          <p className="text-white/75 text-lg mb-8 max-w-2xl mx-auto">
            Whether you need a guided adventure or a luxury ride, we&apos;ve got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/adventures"
              className="bg-rva-copper hover:bg-rva-copper-light text-white px-10 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-2xl hover:-translate-y-0.5 inline-block"
            >
              View Adventures
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-rva-forest px-10 py-4 rounded-full font-semibold text-lg transition-all inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
