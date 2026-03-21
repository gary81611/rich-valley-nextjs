'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { alpenglowData } from '@/lib/site-data'
import { createClient } from '@/lib/supabase'
import type { ServiceArea } from '@/lib/types'

const slugMap: Record<string, string> = {
  'Aspen': 'aspen',
  'Snowmass Village': 'snowmass-village',
  'Basalt & El Jebel': 'basalt',
  'Carbondale': 'carbondale',
  'Glenwood Springs': 'glenwood-springs',
  'Eagle / Vail': 'eagle-vail',
  'Denver': 'denver',
  'Rifle': 'rifle',
}

export default function ServiceAreasPage() {
  const [areas, setAreas] = useState(alpenglowData.serviceAreas)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function fetchAreas() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('service_areas')
          .select('*')
          .eq('site_key', 'alpenglow')
          .eq('is_active', true)
          .order('name')

        if (data && data.length > 0) {
          const mapped = data.map((a: ServiceArea) => ({
            name: a.name,
            slug: a.name.toLowerCase().replace(/[\s/&]+/g, '-'),
            description: a.description,
          }))
          setAreas(mapped)
        }
      } catch {
        // fallback to static data
      } finally {
        setLoaded(true)
      }
    }
    fetchAreas()
  }, [])

  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      {/* Breadcrumb */}
      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-alp-pearl/70">
            <Link href="/" className="hover:text-alp-gold transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-alp-gold">Service Areas</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-alp-navy-deep text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Service <span className="text-alp-gold">Areas</span>
          </h1>
          <p className="text-lg sm:text-xl text-alp-pearl/80 max-w-3xl mx-auto">
            Aspen Alpenglow Limousine proudly serves the entire Roaring Fork Valley and beyond.
            From Aspen to Denver, we provide luxury transportation wherever you need to go.
          </p>
        </div>
      </section>

      {/* Areas Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
            {areas.map((area) => {
              const slug = slugMap[area.name] || area.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
              return (
                <Link
                  key={area.name}
                  href={`/service-areas/${slug}`}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-alp-pearl-dark hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-alp-gold/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-alp-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h2 className="font-playfair text-xl font-bold text-alp-navy group-hover:text-alp-gold transition-colors">
                      {area.name}
                    </h2>
                  </div>
                  <p className="text-alp-slate text-sm leading-relaxed mb-4">
                    {area.description}
                  </p>
                  <span className="inline-flex items-center text-alp-gold font-semibold text-sm">
                    View Area
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-alp-navy-deep text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-4">
            Don&apos;t See Your <span className="text-alp-gold">Destination</span>?
          </h2>
          <p className="text-alp-pearl/80 mb-8 max-w-2xl mx-auto">
            We serve all of Colorado. Contact us for service to any location not listed above.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-alp-gold text-alp-navy font-bold px-8 py-3 rounded-full hover:bg-alp-gold-light transition-colors"
            >
              Contact Us
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
