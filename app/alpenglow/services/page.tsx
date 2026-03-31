'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { Service } from '@/lib/types'

const iconMap: Record<string, React.ReactNode> = {
  Plane: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l-7-7 1.41-1.41L11 15.17V2h2v13.17l4.59-4.58L19 12l-7 7z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.5 11l3-3h4l2.5 2.5L15.5 8h4l3 3M6 19h12" />
    </svg>
  ),
  Clock: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
    </svg>
  ),
  Briefcase: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="14" rx="2" strokeWidth={1.5} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  ),
  Heart: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
}

const slugMap: Record<string, string> = {
  'Airport Transfers': 'airport-transfers',
  'Hourly Charter': 'hourly-charter',
  'Corporate Travel': 'corporate-travel',
  'Wedding Transportation': 'wedding-transportation',
}

export default function ServicesPage() {
  const [services, setServices] = useState<{ title: string; slug: string; description: string; features: string[]; icon: string }[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function fetchServices() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('display_order')

        if (data && data.length > 0) {
          const mapped = data.map((s: Service) => ({
            title: s.name,
            slug: s.slug || s.name.toLowerCase().replace(/\s+/g, '-'),
            description: s.description,
            features: Array.isArray(s.features) ? s.features as string[] : [],
            icon: s.icon || 'Plane',
          }))
          setServices(mapped)
        }
      } catch {
        // DB fetch failed — services stays empty
      } finally {
        setLoaded(true)
      }
    }
    fetchServices()
  }, [])

  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      {/* Breadcrumb */}
      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-alp-pearl/70">
            <Link href="/" className="hover:text-alp-gold transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-alp-gold">Services</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-alp-navy-deep text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Our <span className="text-alp-gold">Services</span>
          </h1>
          <p className="text-lg sm:text-xl text-alp-pearl/80 max-w-3xl mx-auto">
            Distinguished luxury transportation for every occasion. From airport arrivals to wedding getaways,
            we deliver an impeccable experience every time.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!loaded ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-alp-gold border-t-transparent" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-alp-slate text-lg">No services available at this time. Please check back soon.</p>
            </div>
          ) : (
            <div className={`grid md:grid-cols-2 gap-8 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
              {services.map((service) => {
                const slug = slugMap[service.title] || service.slug || service.title.toLowerCase().replace(/\s+/g, '-')
                return (
                  <Link
                    key={service.title}
                    href={`/services/${slug}`}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-alp-pearl-dark hover:-translate-y-1"
                  >
                    <div className="text-alp-gold mb-5">
                      {iconMap[service.icon] || iconMap.Plane}
                    </div>
                    <h2 className="font-playfair text-2xl font-bold text-alp-navy mb-3 group-hover:text-alp-gold transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-alp-slate mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    {service.features && service.features.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-alp-navy">
                            <svg className="w-4 h-4 text-alp-gold mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                    <span className="inline-flex items-center text-alp-gold font-semibold text-sm group-hover:gap-2 transition-all">
                      Learn More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-alp-navy-deep text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-4">
            Ready to <span className="text-alp-gold">Book</span>?
          </h2>
          <p className="text-alp-pearl/80 mb-8 max-w-2xl mx-auto">
            Contact us today to arrange your luxury transportation. Available 24/7.
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
