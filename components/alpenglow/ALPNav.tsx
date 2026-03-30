'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { alpenglowData } from '@/lib/site-data'
import { createClient } from '@/lib/supabase'

interface NavItem { label: string; href: string }

const FALLBACK_SERVICE_PAGES: NavItem[] = [
  { label: 'Airport Transfers', href: '/alpenglow/airport-transfers' },
  { label: 'Corporate Events', href: '/alpenglow/corporate-events' },
  { label: 'Wedding Transportation', href: '/alpenglow/wedding-transportation' },
  { label: 'Ski Resort Transfers', href: '/alpenglow/ski-resort-transfers' },
  { label: 'Wine Tours', href: '/alpenglow/wine-tours' },
  { label: 'Night Out', href: '/alpenglow/night-out' },
]

const FALLBACK_AREA_PAGES: NavItem[] = alpenglowData.serviceAreas.map((a) => ({
  label: a.name,
  href: `/service-areas/${a.slug}`,
}))

export default function ALPNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [areasOpen, setAreasOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobileAreasOpen, setMobileAreasOpen] = useState(false)
  const closeServicesTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeAreasTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [serviceNavItems, setServiceNavItems] = useState<NavItem[]>(FALLBACK_SERVICE_PAGES)
  const [areaNavItems, setAreaNavItems] = useState<NavItem[]>(FALLBACK_AREA_PAGES)
  const [phone, setPhone] = useState(alpenglowData.phone)
  const [phoneHref, setPhoneHref] = useState(alpenglowData.phoneHref)

  useEffect(() => {
    async function fetchNavData() {
      try {
        const supabase = createClient()
        const [navRes, settingsRes, areasRes] = await Promise.all([
          supabase.from('navigation').select('*').eq('site_id', 'alpenglow').eq('is_visible', true).order('position'),
          supabase.from('site_settings').select('phone').eq('site_key', 'alpenglow').single(),
          supabase.from('service_areas').select('name').eq('site_key', 'alpenglow').eq('is_active', true).order('name'),
        ])
        if (navRes.data && navRes.data.length > 0) {
          const servicesParent = navRes.data.find((item: { parent_id: string | null; label: string }) => !item.parent_id && item.label === 'Services')
          if (servicesParent) {
            const children = navRes.data.filter((item: { parent_id: string | null }) => item.parent_id === servicesParent.id)
            if (children.length > 0) setServiceNavItems(children.map((item: { label: string; href: string }) => ({ label: item.label, href: item.href })))
          }
        }
        if (areasRes.data && areasRes.data.length > 0) {
          const staticSlugMap = Object.fromEntries(alpenglowData.serviceAreas.map((a) => [a.name, a.slug]))
          setAreaNavItems(areasRes.data.map((area: { name: string }) => ({
            label: area.name,
            href: `/service-areas/${staticSlugMap[area.name] || area.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
          })))
        }
        if (settingsRes.data?.phone) {
          setPhone(settingsRes.data.phone)
          setPhoneHref(`tel:+1${settingsRes.data.phone.replace(/\D/g, '')}`)
        }
      } catch {
        // Use static fallback
      }
    }
    fetchNavData()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav aria-label="Main navigation" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'shadow-lg' : 'shadow-lg'}`} style={{ backgroundColor: '#1b2338' }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
        <a href="/alpenglow" className="flex items-center gap-3 flex-shrink-0" aria-label="Aspen Alpenglow Limousine — home">
          <Image src={alpenglowData.logo} alt="Aspen Alpenglow Limousine logo" width={160} height={50} className="h-10 md:h-14 w-auto object-contain" unoptimized loading="eager" />
        </a>
        <a href={phoneHref} aria-label={`Call Aspen Alpenglow Limousine at ${phone}`} className="ml-3 flex-shrink-0 bg-alp-gold hover:bg-alp-gold-light text-alp-navy px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all hover:shadow-lg">
          {phone}
        </a>
        <div className="hidden md:flex items-center gap-8 ml-auto">
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
                {serviceNavItems.map((item) => (
                  <a key={item.href} href={item.href} className="block px-4 py-2 text-white/85 hover:text-alp-gold-light hover:bg-white/5 text-sm transition-colors">
                    {item.label}
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
          <a href="/alpenglow/pricing" className="text-white/90 hover:text-alp-gold-light transition-colors text-sm font-medium tracking-wide">
            Pricing
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
                {areaNavItems.map((item) => (
                  <a key={item.href} href={item.href} className="block px-4 py-2 text-white/85 hover:text-alp-gold-light hover:bg-white/5 text-sm transition-colors">
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <a href="/alpenglow/contact" className="text-white/90 hover:text-alp-gold-light transition-colors text-sm font-medium tracking-wide">
            Contact
          </a>
          <a href="/alpenglow/faq" className="text-white/90 hover:text-alp-gold-light transition-colors text-sm font-medium tracking-wide">
            FAQ
          </a>
          <a href="/blog" className="text-white/90 hover:text-alp-gold-light transition-colors text-sm font-medium tracking-wide">
            Blog
          </a>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle mobile navigation menu" aria-expanded={mobileMenuOpen} className="md:hidden ml-auto text-white p-2">
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
                {serviceNavItems.map((item) => (
                  <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="block text-white/75 hover:text-alp-gold-light text-sm py-1.5">
                    {item.label}
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
          <a href="/alpenglow/pricing" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-alp-gold text-sm font-medium py-2">
            Pricing
          </a>
          <div>
            <button onClick={() => setMobileAreasOpen(!mobileAreasOpen)} className="flex items-center justify-between w-full text-white/90 hover:text-alp-gold-light text-sm font-medium py-2">
              Service Areas
              <svg className={`w-3.5 h-3.5 transition-transform ${mobileAreasOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {mobileAreasOpen && (
              <div className="pl-4 space-y-1 border-l border-white/20 ml-2 mt-1">
                {areaNavItems.map((item) => (
                  <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="block text-white/75 hover:text-alp-gold-light text-sm py-1.5">
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <a href="/alpenglow/contact" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-alp-gold text-sm font-medium py-2">
            Contact
          </a>
          <a href="/alpenglow/faq" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-alp-gold text-sm font-medium py-2">
            FAQ
          </a>
          <a href="/blog" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-alp-gold text-sm font-medium py-2">
            Blog
          </a>
          <a href={phoneHref} className="block bg-alp-gold text-alp-navy text-center py-3 rounded-full font-semibold mt-2">
            {phone}
          </a>
        </div>
      )}
    </nav>
  )
}
