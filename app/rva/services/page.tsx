import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Adventure } from '@/lib/types'
import { PADDLE_PHOTO, PADDLE_PHOTO_ALT, isPublicAdventureCard, toPublicAdventureCard } from '@/lib/rva-adventure-public'
import AdventureCard from '@/components/rva/AdventureCard'
import RvaButton, { RVA_BOOKING_LABEL, RVA_PHONE_LABEL, RVA_PHONE_HREF } from '@/components/rva/Button'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Guided Adventure Trips in Aspen, Colorado | Rich Valley Adventures',
  description:
    'Browse guided outdoor experiences — fly fishing, hiking, rafting, and glamping — plus paddleboard rentals from $100, from Rich Valley Adventures in the Aspen area.',
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

  const adventures = (adventuresRaw ?? [])
    .filter((a: Adventure) => isPublicAdventureCard(a))
    .map((a: Adventure) => toPublicAdventureCard(a))

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
            <p className="font-cormorant text-rva-copper-700 text-lg tracking-widest uppercase mb-2">
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
            <p className="text-center text-rva-forest">No adventures are listed yet. Call 970-456-3666 and we will help you plan.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {adventures.map((adventure) => (
                <AdventureCard
                  key={adventure.slug}
                  href={adventure.href}
                  title={adventure.title}
                  image={adventure.image}
                  imageAlt={adventure.imageAlt || (adventure.image === PADDLE_PHOTO ? PADDLE_PHOTO_ALT : adventure.title)}
                  objectPosition={adventure.objectPosition}
                  duration={adventure.duration}
                  level={adventure.difficulty}
                  excerpt={adventure.description}
                  priceNote={adventure.fromText}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Transportation Section */}
      <section className="py-16 sm:py-24 bg-rva-cream-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-cormorant text-rva-copper-800 text-lg tracking-widest uppercase mb-2">
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
                        <svg className="w-3 h-3 text-rva-copper-700 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
