'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { alpenglowData } from '@/lib/site-data'

const SERVICE_PAGES = [
  { label: 'Airport Transfers', slug: 'airport-transfers' },
  { label: 'Corporate Events', slug: 'corporate-events' },
  { label: 'Wedding Transportation', slug: 'wedding-transportation' },
  { label: 'Ski Resort Transfers', slug: 'ski-resort-transfers' },
  { label: 'Wine Tours', slug: 'wine-tours' },
  { label: 'Night Out', slug: 'night-out' },
]

const AREA_PAGES = [
  { label: 'Aspen', slug: 'areas/aspen' },
  { label: 'Snowmass', slug: 'areas/snowmass' },
  { label: 'Vail', slug: 'areas/vail' },
]

export default function ALPNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [areasOpen, setAreasOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobileAreasOpen, setMobileAreasOpen] = useState(false)
  const closeServicesTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeAreasTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav aria-label="Main navigation" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'shadow-lg' : 'shadow-lg'}`} style={{ backgroundColor: '#1b2338' }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/alpenglow" className="flex items-center gap-3" aria-label="Aspen Alpenglow Limousine — home">
          <Image src={alpenglowData.logo} alt="Aspen Alpenglow Limousine logo" width={160} height={50} className="h-14 w-auto object-contain" unoptimized loading="eager" />
        </a>
        <div className="hidden md:flex items-center gap-8">
          {/* Services dropdown */}
          <div
            className="relative"
            onMouseEnter={() => { if (closeServicesTimer.current) clearTimeout(closeServicesTimer.current); setServicesOpen(true) }}
            onMouseLeave={() => { closeServicesTimer.current = setTimeout(() => setServicesOpen(false), 300) }}
          >
            <button className="flex items-center gap-1 text-white/90 hover:text-alp-gold-light transition-colors text-sm font-medium tracking-wide">
              Services
              <svg className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 rounded-xl shadow-2xl border border-white/10 py-2 z-50" style={{ backgroundColor: '#1b2338', backdropFilter: 'none' }}>
                {SERVICE_PAGES.map((page) => (
                  <a key={page.slug} href={`/alpenglow/${page.slug}`} className="block px-4 py-2 text-white/85 hover:text-alp-gold-light hover:bg-white/5 text-sm transition-colors">
                    {page.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <a href="/alpenglow/fleet" className="text-white/90 hover:text-alp-gold-light transition-colors text-sm font-medium tracking-wide">
            Fleet
          </a>
          <a href="/alpenglow/destinations" className="text-white/90 hover:text-alp-gold-light transition-colors text-sm font-medium tracking-wide">
            Destinations
          </a>
          {/* Service Areas dropdown */}
          <div
            className="relative"
            onMouseEnter={() => { if (closeAreasTimer.current) clearTimeout(closeAreasTimer.current); setAreasOpen(true) }}
            onMouseLeave={() => { closeAreasTimer.current = setTimeout(() => setAreasOpen(false), 300) }}
          >
            <button className="flex items-center gap-1 text-white/90 hover:text-alp-gold-light transition-colors text-sm font-medium tracking-wide">
              Service Areas
              <svg className={`w-3.5 h-3.5 transition-transform ${areasOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {areasOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 rounded-xl shadow-2xl border border-white/10 py-2 z-50" style={{ backgroundColor: '#1b2338', backdropFilter: 'none' }}>
                {AREA_PAGES.map((page) => (
                  <a key={page.slug} href={`/alpenglow/${page.slug}`} className="block px-4 py-2 text-white/85 hover:text-alp-gold-light hover:bg-white/5 text-sm transition-colors">
                    {page.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <a href="/alpenglow/contact" className="text-white/90 hover:text-alp-gold-light transition-colors text-sm font-medium tracking-wide">
            Contact
          </a>
          <a href="/blog" className="text-white/90 hover:text-alp-gold-light transition-colors text-sm font-medium tracking-wide">
            Blog
          </a>
          <a href={alpenglowData.phoneHref} aria-label={`Call Aspen Alpenglow Limousine at ${alpenglowData.phone}`} className="bg-alp-gold hover:bg-alp-gold-light text-alp-navy px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg">
            {alpenglowData.phone}
          </a>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle mobile navigation menu" aria-expanded={mobileMenuOpen} className="md:hidden text-white p-2">
          <div className="w-6 h-0.5 bg-white mb-1.5"></div>
          <div className="w-6 h-0.5 bg-white mb-1.5"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-alp-navy border-t border-white/10 px-6 py-4 space-y-3">
          <div>
            <button onClick={() => setMobileServicesOpen(!mobileServicesOpen)} className="flex items-center justify-between w-full text-white/90 hover:text-alp-gold-light text-sm font-medium py-2">
              Services
              <svg className={`w-3.5 h-3.5 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {mobileServicesOpen && (
              <div className="pl-4 space-y-1 border-l border-white/20 ml-2 mt-1">
                {SERVICE_PAGES.map((page) => (
                  <a key={page.slug} href={`/alpenglow/${page.slug}`} onClick={() => setMobileMenuOpen(false)} className="block text-white/75 hover:text-alp-gold-light text-sm py-1.5">
                    {page.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <a href="/alpenglow/fleet" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-alp-gold text-sm font-medium py-2">
            Fleet
          </a>
          <a href="/alpenglow/destinations" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-alp-gold text-sm font-medium py-2">
            Destinations
          </a>
          <div>
            <button onClick={() => setMobileAreasOpen(!mobileAreasOpen)} className="flex items-center justify-between w-full text-white/90 hover:text-alp-gold-light text-sm font-medium py-2">
              Service Areas
              <svg className={`w-3.5 h-3.5 transition-transform ${mobileAreasOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {mobileAreasOpen && (
              <div className="pl-4 space-y-1 border-l border-white/20 ml-2 mt-1">
                {AREA_PAGES.map((page) => (
                  <a key={page.slug} href={`/alpenglow/${page.slug}`} onClick={() => setMobileMenuOpen(false)} className="block text-white/75 hover:text-alp-gold-light text-sm py-1.5">
                    {page.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <a href="/alpenglow/contact" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-alp-gold text-sm font-medium py-2">
            Contact
          </a>
          <a href="/blog" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-alp-gold text-sm font-medium py-2">
            Blog
          </a>
          <a href={alpenglowData.phoneHref} className="block bg-alp-gold text-alp-navy text-center py-3 rounded-full font-semibold mt-2">
            {alpenglowData.phone}
          </a>
        </div>
      )}
    </nav>
  )
}
