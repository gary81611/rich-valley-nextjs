'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { rvaData } from '@/lib/site-data'

const SERVICE_PAGES = [
  { label: 'Fly Fishing', slug: 'fly-fishing' },
  { label: 'Paddle Boarding', slug: 'paddle-boarding' },
  { label: 'Mountain Biking', slug: 'mountain-biking' },
  { label: 'Hiking', slug: 'hiking' },
  { label: 'Snowshoeing', slug: 'snowshoeing' },
  { label: 'Wine Tours', slug: 'wine-tours' },
  { label: 'Winter Adventures', slug: 'winter' },
]

export default function RVANav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adventuresOpen, setAdventuresOpen] = useState(false)
  const [mobileAdventuresOpen, setMobileAdventuresOpen] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav aria-label="Main navigation" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-rva-forest/95 backdrop-blur-md shadow-lg' : 'bg-rva-forest/95 backdrop-blur-md shadow-lg'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
        <a href="/rva" className="flex items-center gap-3 flex-shrink-0" aria-label="Rich Valley Adventures — home">
          <Image src={rvaData.logo} alt="Rich Valley Adventures logo" width={160} height={50} className="h-10 md:h-14 w-auto object-contain" unoptimized loading="eager" />
        </a>
        <a href="tel:+19704563666" aria-label="Call Rich Valley Adventures at 970-456-3666" className="ml-3 flex-shrink-0 bg-rva-copper hover:bg-rva-copper-light text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all hover:shadow-lg">
          970-456-3666
        </a>
        <div className="hidden md:flex items-center gap-8 ml-auto">
          <div
            className="relative"
            onMouseEnter={() => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); setAdventuresOpen(true) }}
            onMouseLeave={() => { closeTimerRef.current = setTimeout(() => setAdventuresOpen(false), 250) }}
          >
            <button onClick={() => setAdventuresOpen(!adventuresOpen)} className="flex items-center gap-1 text-white/90 hover:text-rva-copper-light transition-colors text-sm font-medium tracking-wide">
              Adventures
              <svg className={`w-3.5 h-3.5 transition-transform ${adventuresOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {adventuresOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-rva-forest rounded-xl shadow-2xl border border-white/10 py-2 z-50">
                {SERVICE_PAGES.map((page) => (
                  <a key={page.slug} href={`/rva/${page.slug}`} className="block px-4 py-2 text-white/85 hover:text-rva-copper-light hover:bg-white/5 text-sm transition-colors">
                    {page.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <a href="/rva/locations" className="text-white/90 hover:text-rva-copper-light transition-colors text-sm font-medium tracking-wide">
            Locations
          </a>
          <a href="/rva/conditions" className="text-white/90 hover:text-rva-copper-light transition-colors text-sm font-medium tracking-wide">
            Conditions
          </a>
          <a href="/rva/guides" className="text-white/90 hover:text-rva-copper-light transition-colors text-sm font-medium tracking-wide">
            Our Guides
          </a>
          <a href="/rva#about" className="text-white/90 hover:text-rva-copper-light transition-colors text-sm font-medium tracking-wide">
            About
          </a>
          <a href="/rva#gallery" className="text-white/90 hover:text-rva-copper-light transition-colors text-sm font-medium tracking-wide">
            Gallery
          </a>
          <a href="/rva#contact" className="text-white/90 hover:text-rva-copper-light transition-colors text-sm font-medium tracking-wide">
            Contact
          </a>
          <a href="/blog" className="text-white/90 hover:text-rva-copper-light transition-colors text-sm font-medium tracking-wide">
            Blog
          </a>
          <a href="https://aspenalpenglowlimousine.com" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-rva-copper-light transition-colors text-sm font-medium tracking-wide">
            Transportation
          </a>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle mobile navigation menu" aria-expanded={mobileMenuOpen} className="md:hidden ml-auto text-white p-2">
          <div className="w-6 h-0.5 bg-white mb-1.5"></div>
          <div className="w-6 h-0.5 bg-white mb-1.5"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-rva-forest border-t border-white/10 px-6 py-4 space-y-3">
          <div>
            <button onClick={() => setMobileAdventuresOpen(!mobileAdventuresOpen)} className="flex items-center justify-between w-full text-white/90 hover:text-rva-copper-light text-sm font-medium py-2">
              Adventures
              <svg className={`w-3.5 h-3.5 transition-transform ${mobileAdventuresOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {mobileAdventuresOpen && (
              <div className="pl-4 space-y-1 border-l border-white/20 ml-2 mt-1">
                {SERVICE_PAGES.map((page) => (
                  <a key={page.slug} href={`/rva/${page.slug}`} onClick={() => setMobileMenuOpen(false)} className="block text-white/75 hover:text-rva-copper-light text-sm py-1.5">
                    {page.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <a href="/rva/locations" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-rva-copper-light text-sm font-medium py-2">
            Locations
          </a>
          <a href="/rva/conditions" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-rva-copper-light text-sm font-medium py-2">
            Conditions
          </a>
          <a href="/rva/guides" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-rva-copper-light text-sm font-medium py-2">
            Our Guides
          </a>
          <a href="/rva#about" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-rva-copper-light text-sm font-medium py-2">
            About
          </a>
          <a href="/rva#gallery" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-rva-copper-light text-sm font-medium py-2">
            Gallery
          </a>
          <a href="/rva#contact" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-rva-copper-light text-sm font-medium py-2">
            Contact
          </a>
          <a href="/blog" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-rva-copper-light text-sm font-medium py-2">
            Blog
          </a>
          <a href="https://aspenalpenglowlimousine.com" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-rva-copper-light text-sm font-medium py-2">
            Transportation
          </a>
          <a href={rvaData.phoneHref} className="block bg-rva-copper text-white text-center py-3 rounded-full font-semibold mt-2">
            {rvaData.phone}
          </a>
        </div>
      )}
    </nav>
  )
}
