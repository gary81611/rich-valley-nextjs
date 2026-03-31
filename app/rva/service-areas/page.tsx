import type { Metadata } from 'next'
import Link from 'next/link'
import { rvaData } from '@/lib/site-data'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Service Areas | Rich Valley Adventures',
  description: 'Rich Valley Adventures serves the entire Roaring Fork Valley — Aspen, Snowmass, Basalt, Carbondale, Glenwood Springs, and beyond. Guided outdoor adventures across Colorado.',
}

export default async function ServiceAreasPage() {
  const supabase = await createServerSupabaseClient()

  const { data: areasRaw } = await supabase
    .from('service_areas')
    .select('*')
    .eq('is_active', true)
    .order('display_order')
    .order('name')

  const areas = (areasRaw ?? []).map((area: any) => ({
    name: area.name,
    description: area.description,
    slug: area.slug,
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
            <span className="text-rva-copper-light">Service Areas</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-20 bg-rva-forest-dark text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-cormorant text-rva-copper-light text-lg tracking-widest uppercase mb-4">
            Where We Guide
          </p>
          <h1 className="font-playfair text-4xl md:text-6xl text-white font-bold mb-6">
            Service Areas
          </h1>
          <p className="text-white/75 text-xl max-w-2xl mx-auto">
            {rvaData.name} operates throughout the Roaring Fork Valley and beyond.
            From Aspen to Denver, the mountains are our backyard.
          </p>
        </div>
      </section>

      {/* Areas Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6">
          {areas.length === 0 ? (
            <p className="text-center text-gray-500">No service areas available at this time. Check back soon!</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {areas.map((area) => (
                <div
                  key={area.name}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-rva-cream-dark hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-rva-copper/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-rva-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h2 className="font-playfair text-xl font-bold text-rva-forest group-hover:text-rva-copper transition-colors">
                      {area.name}
                    </h2>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {area.description}
                  </p>
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
            Ready to Explore the Valley?
          </h2>
          <p className="text-white/75 text-lg mb-8 max-w-2xl mx-auto">
            No matter where you&apos;re staying, we can bring the adventure to you.
            Contact us to plan your trip.
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
