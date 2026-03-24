'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import ScrollReveal from '@/components/shared/ScrollReveal'
import BookingPlaceholder from '@/components/shared/BookingPlaceholder'
import NewsletterSignup from '@/components/shared/NewsletterSignup'
import { alpenglowData, photoNotes } from '@/lib/site-data'
import { createClient } from '@/lib/supabase'
import type { Service as ServiceType, FleetVehicle, Testimonial, GalleryImage } from '@/lib/types'

interface GeoBlock {
  id: string
  question: string
  answer: string
  block_type: string
}

const alpenglowFaqs = [
  {
    q: 'How much does a limo from Aspen to Denver airport cost?',
    a: 'A private luxury transfer from Aspen, Colorado to Denver International Airport (DEN) is approximately 3.5–4 hours each way. Pricing varies based on vehicle, time of day, and group size. Call us at 970-456-3666 for a custom quote. We serve Denver (DEN), Eagle (EGE), and Aspen (ASE) airports.',
  },
  {
    q: 'Do you offer airport pickup at Aspen/Pitkin County Airport (ASE)?',
    a: 'Yes. We provide meet-and-greet pickup service at Aspen/Pitkin County Airport (ASE). We track your flight in real time and adjust for early arrivals or delays. Our chauffeurs assist with luggage and provide seamless door-to-door service to any destination in Aspen or the Roaring Fork Valley.',
  },
  {
    q: "What's the best way to get from Eagle/Vail airport to Aspen?",
    a: 'The most comfortable option is a private car service. Eagle County Regional Airport (EGE) is approximately 70 miles from Aspen via I-70 and Highway 82 — about 1.5 to 2 hours depending on conditions. Aspen Alpenglow Limousine offers direct, door-to-door luxury transfers from Eagle airport to any Aspen destination.',
  },
  {
    q: 'How far in advance should I book a limousine in Aspen?',
    a: 'We recommend booking 48–72 hours in advance for standard transfers. For weddings, corporate events, or peak seasons (ski season December–March and summer July–August), book 2–4 weeks ahead. Last-minute bookings are occasionally available — call 970-456-3666 to check.',
  },
  {
    q: 'Do you offer wedding transportation in Aspen?',
    a: 'Yes. We specialize in wedding transportation throughout Aspen and Snowmass, Colorado. We provide bridal party transfers, venue logistics, and guest shuttle coordination. Both our Escalade and Sprinter van are available. We work closely with wedding planners to ensure a flawless, elegant experience.',
  },
  {
    q: 'Is Aspen Alpenglow Limousine available 24 hours a day?',
    a: 'Yes. We operate 24/7/365 — including early-morning departures, late-night arrivals, and overnight transfers to Denver. Call 970-456-3666 at any hour for assistance.',
  },
  {
    q: 'Can you transport groups to ski resorts from Aspen?',
    a: 'Absolutely. We provide private group transportation to Aspen Mountain, Aspen Highlands, Buttermilk, Snowmass ski resort, and other destinations throughout the Roaring Fork Valley. Our Luxury Sprinter van seats up to 14 passengers — ideal for ski groups.',
  },
  {
    q: 'What vehicles does Aspen Alpenglow Limousine use?',
    a: 'Our fleet includes a black Executive Cadillac Escalade (up to 6 passengers) and a black Luxury Mercedes Sprinter van (up to 14 passengers). Both feature premium leather interiors, climate control, and complimentary amenities. All vehicles are late-model, meticulously maintained, and professionally chauffeured.',
  },
]

const transportationServices = [
  {
    title: 'Hourly Limo Service',
    href: '/alpenglow/services',
    description: 'Flexible hourly limousine service for any occasion in Aspen and the Roaring Fork Valley.',
    icon: 'Clock',
    features: [
      'Real-time flight tracking',
      'Meet & greet at pickup',
      '24/7 dispatch availability',
      'Easy account setup',
      'Email confirmations for every booking',
    ],
  },
  {
    title: 'Corporate Travel & Executive Car Service',
    href: '/alpenglow/corporate-events',
    description: 'Professional, discreet transportation for business travelers and corporate events.',
    icon: 'Briefcase',
    features: [
      'Affordable business travel rates',
      'Competitive corporate pricing',
      'Licensed & fully insured',
      'Efficient scheduling & routing',
      'Hourly services for tours & conferences',
    ],
  },
  {
    title: 'Airport Transfer',
    href: '/alpenglow/airport-transfers',
    description: 'Seamless door-to-door transfers to ASE, EGE, and Denver International airports.',
    icon: 'Plane',
    features: [
      'Real-time flight tracking',
      'Meet & greet at arrivals',
      '24/7 dispatch availability',
      'Easy account setup',
      'Email confirmations for every trip',
    ],
  },
  {
    title: 'Wedding Transportation',
    href: '/alpenglow/wedding-transportation',
    description: 'Elegant, reliable transportation for your special day in Aspen and Snowmass.',
    icon: 'Heart',
    features: [
      'Personalized itineraries',
      'Pristine SUVs & Sprinters',
      'Dedicated coordinators for seamless guest transport',
      'Wedding packages & group discounts',
    ],
  },
]

const ServiceIcon = ({ icon }: { icon: string }) => {
  const icons: Record<string, React.ReactNode> = {
    Plane: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
    Clock: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Briefcase: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    Heart: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  }
  return <div className="text-alp-gold">{icons[icon] ?? null}</div>
}

interface NavItem { label: string; href: string }

const FALLBACK_SERVICE_PAGES: NavItem[] = [
  { label: 'Airport Transfers', href: '/alpenglow/airport-transfers' },
  { label: 'Corporate Events', href: '/alpenglow/corporate-events' },
  { label: 'Wedding Transportation', href: '/alpenglow/wedding-transportation' },
  { label: 'Ski Resort Transfers', href: '/alpenglow/ski-resort-transfers' },
  { label: 'Wine Tours', href: '/alpenglow/wine-tours' },
  { label: 'Night Out', href: '/alpenglow/night-out' },
]

const FALLBACK_AREA_PAGES: NavItem[] = [
  { label: 'Aspen', href: '/alpenglow/areas/aspen' },
  { label: 'Snowmass', href: '/alpenglow/areas/snowmass' },
  { label: 'Vail', href: '/alpenglow/areas/vail' },
]

export default function AlpenglowPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [areasOpen, setAreasOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobileAreasOpen, setMobileAreasOpen] = useState(false)
  const closeServicesTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeAreasTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [services, setServices] = useState(alpenglowData.services)
  const [fleet, setFleet] = useState(alpenglowData.fleet)
  const [testimonials, setTestimonials] = useState(alpenglowData.testimonials)
  const [geoBlocks, setGeoBlocks] = useState<GeoBlock[]>([])
  const [faqs, setFaqs] = useState(alpenglowFaqs)
  const [serviceNavItems, setServiceNavItems] = useState<NavItem[]>(FALLBACK_SERVICE_PAGES)
  const [areaNavItems, setAreaNavItems] = useState<NavItem[]>(FALLBACK_AREA_PAGES)
  const [phone, setPhone] = useState(alpenglowData.phone)
  const [phoneHref, setPhoneHref] = useState(alpenglowData.phoneHref)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    async function fetchSupabaseData() {
      try {
        const supabase = createClient()
        const [svcRes, fleetRes, testRes, geoRes, faqRes, navRes, settingsRes, areasRes] = await Promise.all([
          supabase.from('services').select('*').eq('is_active', true).order('display_order'),
          supabase.from('fleet_vehicles').select('*').eq('is_active', true),
          supabase.from('testimonials').select('*').eq('is_active', true).eq('site_key', 'alpenglow'),
          supabase.from('geo_content_blocks').select('*').eq('is_active', true).eq('site_key', 'alpenglow').eq('display_on_page', '/').order('display_order'),
          supabase.from('faqs').select('*').eq('is_active', true).eq('site_key', 'alpenglow').order('display_order'),
          supabase.from('navigation').select('*').eq('site_id', 'alpenglow').eq('is_visible', true).order('position'),
          supabase.from('site_settings').select('phone').eq('site_key', 'alpenglow').single(),
          supabase.from('service_areas').select('name').eq('site_key', 'alpenglow').eq('is_active', true).order('name'),
        ])
        if (svcRes.data && svcRes.data.length > 0) {
          setServices(svcRes.data.map((s: ServiceType) => ({
            title: s.name, slug: s.name.toLowerCase().replace(/\s+/g, '-'), description: s.description, features: [], icon: 'Briefcase',
          })))
        }
        if (fleetRes.data && fleetRes.data.length > 0) {
          setFleet(fleetRes.data.map((v: FleetVehicle) => ({
            name: v.name, image: v.image_url || '/images/alpenglow/escalade.png',
            passengers: `Up to ${v.capacity} Passengers`, features: v.description ? [v.description] : [],
          })))
        }
        if (testRes.data && testRes.data.length > 0) {
          setTestimonials(testRes.data.map((t: Testimonial) => ({
            quote: t.quote, name: t.author, location: '',
          })))
        }
        if (geoRes.data && geoRes.data.length > 0) {
          setGeoBlocks(geoRes.data)
        }
        if (faqRes.data && faqRes.data.length > 0) {
          const mapped = faqRes.data
            .filter((f: { question: string; answer: string }) => f.question && f.answer)
            .map((f: { question: string; answer: string }) => ({ q: f.question, a: f.answer }))
          if (mapped.length > 0) setFaqs(mapped)
        }
        if (navRes.data && navRes.data.length > 0) {
          const servicesParent = navRes.data.find((item: { parent_id: string | null; label: string }) => !item.parent_id && item.label === 'Services')
          if (servicesParent) {
            const children = navRes.data.filter((item: { parent_id: string | null }) => item.parent_id === servicesParent.id)
            if (children.length > 0) setServiceNavItems(children.map((item: { label: string; href: string }) => ({ label: item.label, href: item.href })))
          }
        }
        if (areasRes.data && areasRes.data.length > 0) {
          setAreaNavItems(areasRes.data.map((area: { name: string }) => ({
            label: area.name,
            href: `/alpenglow/areas/${area.name.toLowerCase().replace(/\s+/g, '-')}`,
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
    fetchSupabaseData()
  }, [])

  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      {/* NAV */}
      <nav aria-label="Main navigation" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-alp-navy/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/alpenglow" className="flex items-center gap-3" aria-label="Aspen Alpenglow Limousine — home">
            <Image src={alpenglowData.logo} alt="Aspen Alpenglow Limousine logo" width={160} height={50} className="h-14 w-auto object-contain" unoptimized loading="eager" />
          </a>
          <div className="hidden md:flex items-center gap-8">
            {/* Services dropdown */}
            <div className="relative" onMouseEnter={() => { if (closeServicesTimer.current) clearTimeout(closeServicesTimer.current); setServicesOpen(true) }} onMouseLeave={() => { closeServicesTimer.current = setTimeout(() => setServicesOpen(false), 300) }}>
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
            {/* Service Areas dropdown */}
            <div className="relative" onMouseEnter={() => { if (closeAreasTimer.current) clearTimeout(closeAreasTimer.current); setAreasOpen(true) }} onMouseLeave={() => { closeAreasTimer.current = setTimeout(() => setAreasOpen(false), 300) }}>
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
            <a href="/blog" className="text-white/90 hover:text-alp-gold-light transition-colors text-sm font-medium tracking-wide">
              Blog
            </a>
            <a href={phoneHref} aria-label={`Call Aspen Alpenglow Limousine at ${phone}`} className="bg-alp-gold hover:bg-alp-gold-light text-alp-navy px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg">
              {phone}
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
            <a href="/blog" onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-alp-gold text-sm font-medium py-2">
              Blog
            </a>
            <a href={phoneHref} className="block bg-alp-gold text-alp-navy text-center py-3 rounded-full font-semibold mt-2">
              {phone}
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src={photoNotes.alpenglowHero.current}
            alt="Luxury black Escalade limousine on a mountain road in Aspen, Colorado — Aspen Alpenglow Limousine private car service"
            fill
            className="object-cover"
            priority
            unoptimized
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-alp-navy-deep/80 via-alp-navy-deep/50 to-alp-navy-deep/85" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto pb-28">
          <p className="font-cormorant text-xl md:text-2xl text-alp-gold tracking-[0.3em] uppercase mb-6">
            Aspen · Snowmass · Roaring Fork Valley
          </p>
          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            Luxury Transportation<br />
            <span className="text-alp-gold-light italic">in the Roaring <span className="whitespace-nowrap"><span style={{ letterSpacing: '-0.04em' }}>F</span>ork Valley</span></span>
          </h1>
          <p className="text-xl md:text-2xl text-white/85 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Distinguished private car and limousine service — available 24/7 since 2012.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/alpenglow/contact" className="bg-alp-gold hover:bg-alp-gold-light text-alp-navy px-10 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-2xl hover:-translate-y-0.5 inline-block">
              Reserve Your Ride
            </a>
            <a href="/alpenglow/services" className="border-2 border-white text-white hover:bg-white hover:text-alp-navy px-10 py-4 rounded-full font-semibold text-lg transition-all inline-block">
              Our Services
            </a>
          </div>
        </div>
        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-alp-navy/90 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 py-5 grid grid-cols-3 gap-4 text-center">
            {alpenglowData.stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-playfair text-3xl font-bold text-alp-gold">{stat.value}</div>
                <div className="text-white/70 text-xs tracking-wide uppercase mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLEET SHOWCASE */}
      <section id="fleet" className="py-24 bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="font-cormorant text-alp-gold text-lg tracking-widest uppercase mb-4">Travel in Style</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-white font-bold">Our Fleet</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-10">
            {fleet.map((vehicle, i) => (
              <ScrollReveal key={vehicle.name} delay={i * 150}>
                <div className="bg-alp-navy rounded-2xl overflow-hidden shadow-xl border border-white/5">
                  <div className="relative aspect-[16/9] bg-alp-navy-deep/50 flex items-center justify-center p-6">
                    <Image
                      src={vehicle.image}
                      alt={`${vehicle.name} — luxury vehicle in the Aspen Alpenglow Limousine fleet, serving Aspen and the Roaring Fork Valley`}
                      fill
                      className="object-contain p-8"
                      loading="eager"
                      unoptimized
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-playfair text-2xl text-white font-semibold">{vehicle.name}</h3>
                      <span className="bg-alp-gold/20 text-alp-gold text-xs px-3 py-1 rounded-full border border-alp-gold/30">{vehicle.passengers}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {vehicle.features.map((f) => (
                        <span key={f} className="bg-white/5 text-white/70 text-xs px-3 py-1.5 rounded-full border border-white/10">{f}</span>
                      ))}
                    </div>
                    <a href="/alpenglow/contact" className="inline-block bg-alp-gold hover:bg-alp-gold-light text-alp-navy px-8 py-3 rounded-full font-semibold text-sm transition-all hover:shadow-lg">
                      Reserve Now
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSPORTATION SERVICES */}
      <section id="services" className="py-24 bg-alp-pearl">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="font-cormorant text-alp-gold text-lg tracking-widest uppercase mb-4">What We Offer</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-alp-navy font-bold mb-6">Our Services</h2>
            <p className="text-alp-slate text-xl max-w-2xl mx-auto">
              Every detail handled. Every journey seamless.
            </p>
            <p className="text-alp-slate text-base max-w-3xl mx-auto mt-6 leading-relaxed border-t border-alp-pearl-dark pt-6">
              Aspen Alpenglow Limousine has provided distinguished private car and limousine service in Aspen, Colorado since 2012. The company operates a professional fleet of two vehicles — an Executive Cadillac Escalade (6 passengers) and a Luxury Mercedes Sprinter van (14 passengers) — serving Aspen/Pitkin County Airport (ASE), Eagle County Regional Airport (EGE), and Denver International Airport (DEN), as well as all destinations throughout the Roaring Fork Valley.
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8">
            {transportationServices.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 100}>
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-alp-pearl-dark h-full">
                  <div className="flex items-start gap-5 mb-6">
                    <div className="w-16 h-16 bg-alp-navy rounded-2xl flex items-center justify-center flex-shrink-0">
                      <ServiceIcon icon={service.icon} />
                    </div>
                    <div>
                      <h3 className="font-playfair text-2xl text-alp-navy font-semibold mb-2">{service.title}</h3>
                      <p className="text-alp-slate text-sm leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-gray-700">
                        <div className="w-5 h-5 bg-alp-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-alp-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a href={service.href} className="mt-6 inline-flex items-center gap-2 text-alp-gold font-semibold text-sm hover:text-alp-gold-light transition-colors">
                    Book This Service
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY ALPENGLOW */}
      <section className="py-24 bg-alp-pearl">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="font-cormorant text-alp-gold text-lg tracking-widest uppercase mb-4">Why Alpenglow</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-alp-navy font-bold">The Alpenglow Difference</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {alpenglowData.whyChooseUs.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 100}>
                <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-alp-pearl-dark">
                  <div className="w-16 h-16 bg-alp-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <div className="w-8 h-8 bg-alp-gold rounded-lg" />
                  </div>
                  <h3 className="font-playfair text-xl text-alp-navy font-semibold mb-3">{item.title}</h3>
                  <p className="text-alp-slate text-sm leading-relaxed">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section id="service-areas" className="py-24 bg-alp-pearl-dark">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="font-cormorant text-alp-gold text-lg tracking-widest uppercase mb-4">Where We Go</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-alp-navy font-bold mb-4">Service Areas</h2>
            <p className="text-alp-slate text-xl max-w-2xl mx-auto">From Aspen to Vail and everywhere in between.</p>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alpenglowData.serviceAreas.map((area, i) => (
              <ScrollReveal key={area.name} delay={i * 80}>
                <div className="bg-white rounded-xl p-6 border border-alp-pearl-dark hover:border-alp-gold/40 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-alp-navy rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-alp-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                      <h3 className="font-playfair text-lg text-alp-navy font-semibold mb-1">{area.name}</h3>
                      <p className="text-alp-slate text-sm">{area.description}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-alp-navy">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="font-cormorant text-alp-gold text-lg tracking-widest uppercase mb-4">Client Stories</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-white font-bold">What Our Clients Say</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 150}>
                <div className="bg-alp-navy-deep rounded-2xl p-8 border border-white/5 relative">
                  <div className="font-playfair text-7xl text-alp-gold/20 absolute top-4 left-6 leading-none select-none">&ldquo;</div>
                  <p className="text-white/80 text-lg leading-relaxed italic mb-6 pt-6 relative z-10">{t.quote}</p>
                  <div className="border-t border-white/10 pt-4">
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-alp-gold text-sm">{t.location}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section id="destinations" className="py-24 bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="font-cormorant text-alp-gold text-lg tracking-widest uppercase mb-4">Beyond the Valley</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-white font-bold mb-4">Popular Destinations</h2>
            <p className="text-white/60 text-xl max-w-2xl mx-auto">
              VIP transportation and limousine service to Colorado&apos;s most iconic landmarks.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {alpenglowData.destinations.map((dest, i) => (
              <ScrollReveal key={dest.name} delay={i * 80} className="group">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                  <Image
                    src={dest.image}
                    alt={`${dest.name}, Colorado — a popular destination served by Aspen Alpenglow Limousine private car service`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-alp-navy-deep/85 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-playfair text-sm font-semibold leading-tight">{dest.name}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-alp-pearl" aria-label="Frequently asked questions about Aspen Alpenglow Limousine">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal className="text-center mb-12">
            <p className="font-cormorant text-alp-gold text-lg tracking-widest uppercase mb-4">Common Questions</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-alp-navy font-bold">Frequently Asked Questions</h2>
            <p className="text-alp-slate mt-4 text-lg">Everything you need to know before booking your luxury transfer.</p>
          </ScrollReveal>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl border border-alp-pearl-dark overflow-hidden shadow-sm">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-playfair text-lg text-alp-navy font-semibold hover:text-alp-gold transition-colors gap-4">
                  <span>{faq.q}</span>
                  <svg className="w-5 h-5 text-alp-gold flex-shrink-0 transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 pt-0 text-alp-slate leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* GEO CONTENT BLOCKS */}
      {geoBlocks.length > 0 && (
        <section className="py-16 bg-alp-pearl-dark">
          <div className="max-w-3xl mx-auto px-6">
            <ScrollReveal className="text-center mb-10">
              <h2 className="font-playfair text-3xl text-alp-navy font-bold">About Aspen Limo Service</h2>
            </ScrollReveal>
            <div className="space-y-4">
              {geoBlocks.map((block) => (
                <div key={block.id} className="bg-white rounded-xl p-6 border border-alp-pearl-dark" itemScope itemType="https://schema.org/Question">
                  {block.question && (
                    <h3 className="font-playfair text-lg text-alp-navy font-semibold mb-2" itemProp="name">{block.question}</h3>
                  )}
                  <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                    <p className="text-alp-slate text-sm leading-relaxed" itemProp="text">{block.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EVENT TRANSPORTATION */}
      <section className="py-24 bg-alp-pearl">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <p className="font-cormorant text-alp-gold text-lg tracking-widest uppercase mb-4">Beyond the Transfer</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-alp-navy font-bold mb-6">Event Transportation That Feels Like an Adventure</h2>
            <p className="text-alp-slate text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              From corporate retreats to private celebrations, we create seamless, tailor-made transportation itineraries that turn logistics into luxury. Every detail is handled — so you can focus on the experience.
            </p>
            <a
              href="https://richvalleyadventures.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-alp-navy hover:bg-alp-navy-deep text-white px-10 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              View All Adventures →
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* PARTNER CALLOUT */}
      <section className="py-20 bg-gradient-to-r from-alp-navy to-alp-navy-deep">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <p className="font-cormorant text-alp-gold text-lg tracking-widest uppercase mb-4">Our Sister Company</p>
            <h2 className="font-playfair text-3xl md:text-4xl text-white font-bold mb-4">{alpenglowData.partnerSite.name}</h2>
            <p className="text-white/75 text-lg mb-8 max-w-2xl mx-auto">{alpenglowData.partnerSite.description}</p>
            <a
              href={alpenglowData.partnerSite.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-alp-gold hover:bg-alp-gold-light text-alp-navy px-10 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Explore Adventures →
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* NEWSLETTER */}
      <NewsletterSignup siteKey="alpenglow" variant="alpenglow" />

      {/* BOOKING / CONTACT */}
      <section id="contact" className="py-24 bg-alp-pearl">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal className="text-center mb-12">
            <p className="font-cormorant text-alp-gold text-lg tracking-widest uppercase mb-4">Reserve Your Journey</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-alp-navy font-bold mb-4">Book Your Ride</h2>
            <p className="text-alp-slate text-lg">Request a quote and we&apos;ll respond promptly with availability and pricing.</p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-alp-pearl-dark">
              <BookingPlaceholder
                accentColor="bg-alp-gold"
                accentHover="hover:bg-alp-gold-light"
                phone={phone}
                phoneHref={phoneHref}
                variant="alpenglow"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-alp-navy-deep text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <Image src={alpenglowData.logo} alt="Aspen Alpenglow Limousine" width={160} height={50} className="h-14 w-auto object-contain mb-4" unoptimized />
              <p className="text-white/65 text-sm leading-relaxed">{alpenglowData.description}</p>
            </div>
            <div>
              <h4 className="font-playfair text-lg font-semibold mb-5 text-alp-gold">Services</h4>
              <ul className="space-y-2">
                <li><a href="/alpenglow/airport-transfers" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Airport Transfers</a></li>
                <li><a href="/alpenglow/corporate-events" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Corporate Events</a></li>
                <li><a href="/alpenglow/wedding-transportation" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Wedding Transportation</a></li>
                <li><a href="/alpenglow/ski-resort-transfers" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Ski Resort Transfers</a></li>
                <li><a href="/alpenglow/wine-tours" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Wine Tours</a></li>
                <li><a href="/alpenglow/night-out" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Night Out</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-playfair text-lg font-semibold mb-5 text-alp-gold">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/alpenglow/contact" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Book Transportation</a></li>
                <li><a href="/terms" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Terms & Conditions</a></li>
                <li><a href="/privacy" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-playfair text-lg font-semibold mb-5 text-alp-gold">Contact</h4>
              <div className="space-y-3 text-white/65 text-sm">
                <p>{alpenglowData.location}</p>
                <a href={phoneHref} className="block hover:text-alp-gold-light transition-colors">{phone}</a>
                <p className="text-white/40 text-xs">Available 24/7</p>
                <div className="pt-3 border-t border-white/10">
                  <p className="text-white/40 text-xs mb-2">Sister Company</p>
                  <a href={alpenglowData.partnerSite.url} target="_blank" rel="noopener noreferrer" className="text-alp-gold hover:text-alp-gold-light transition-colors">
                    {alpenglowData.partnerSite.name} →
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">© {new Date().getFullYear()} Aspen Alpenglow Limousine. All rights reserved. | {alpenglowData.location}</p>
            <div className="flex items-center gap-4">
              <a href={alpenglowData.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/40 hover:text-alp-gold-light transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href={alpenglowData.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/40 hover:text-alp-gold-light transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
