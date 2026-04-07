'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import ScrollReveal from '@/components/shared/ScrollReveal'
import BookingPlaceholder from '@/components/shared/BookingPlaceholder'
import NewsletterSignup from '@/components/shared/NewsletterSignup'
import { alpenglowData } from '@/lib/site-data'
import { createClient } from '@/lib/supabase'
import { hrefForService } from '@/lib/alpenglow-services'
import type { Service as ServiceType, FleetVehicle, Testimonial } from '@/lib/types'

interface GeoBlock {
  id: string
  question: string
  answer: string
  block_type: string
}

const ServiceIcon = ({ icon }: { icon: string }) => {
  const icons: Record<string, React.ReactNode> = {
    Plane: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
    Clock: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Briefcase: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    Heart: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  }
  return <div className="text-alp-gold">{icons[icon] ?? null}</div>
}

export default function AlpenglowPage() {
  const [services, setServices] = useState<{ title: string; slug: string; description: string; features: string[]; icon: string }[]>([])
  const [fleet, setFleet] = useState<{ name: string; image: string; passengers: string; features: string[] }[]>([])
  const [testimonials, setTestimonials] = useState<{ quote: string; name: string; location: string }[]>([])
  const [stats, setStats] = useState<{value: string; label: string}[]>([])
  const [whyChooseUs, setWhyChooseUs] = useState<{title: string; description: string}[]>([])
  const [serviceAreas, setServiceAreas] = useState<{name: string; description: string}[]>([])
  const [destinations, setDestinations] = useState<{name: string; image: string; description: string}[]>([])
  const [geoBlocks, setGeoBlocks] = useState<GeoBlock[]>([])
  const [faqs, setFaqs] = useState<{q: string; a: string}[]>([])
  const [phone, setPhone] = useState(alpenglowData.phone)
  const [phoneHref, setPhoneHref] = useState(alpenglowData.phoneHref)

  useEffect(() => {
    async function fetchSupabaseData() {
      try {
        const supabase = createClient()
        const [svcRes, fleetRes, testRes, geoRes, faqRes, settingsRes, vpRes, saRes, destRes] = await Promise.all([
          supabase.from('services').select('*').eq('is_active', true).order('display_order'),
          supabase.from('fleet_vehicles').select('*').eq('is_active', true),
          supabase.from('testimonials').select('*').eq('is_active', true).eq('site_key', 'alpenglow'),
          supabase.from('geo_content_blocks').select('*').eq('is_active', true).eq('site_key', 'alpenglow').eq('display_on_page', '/').order('display_order'),
          supabase.from('faqs').select('*').eq('is_active', true).eq('site_key', 'alpenglow').order('display_order'),
          supabase.from('site_settings').select('phone, stats').eq('site_key', 'alpenglow').single(),
          supabase.from('value_propositions').select('*').eq('site_key', 'alpenglow').eq('is_active', true).order('display_order'),
          supabase.from('service_areas').select('*').eq('site_key', 'alpenglow').eq('is_active', true).order('display_order'),
          supabase.from('destinations').select('*').eq('is_active', true).order('display_order'),
        ])
        if (svcRes.data && svcRes.data.length > 0) {
          setServices(
            svcRes.data.map((s: ServiceType) => ({
              title: s.name,
              slug: s.slug ?? '',
              description: s.description,
              features: Array.isArray(s.features) ? (s.features as string[]) : [],
              icon: s.icon || 'Plane',
            })),
          )
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
        if (faqRes.data) {
          const mapped = faqRes.data
            .filter((f: { question: string; answer: string }) => f.question && f.answer)
            .map((f: { question: string; answer: string }) => ({ q: f.question, a: f.answer }))
          setFaqs(mapped)
        }
        if (settingsRes.data?.phone) {
          setPhone(settingsRes.data.phone)
          setPhoneHref(`tel:+1${settingsRes.data.phone.replace(/\D/g, '')}`)
        }
        if (settingsRes.data?.stats && Array.isArray(settingsRes.data.stats)) {
          setStats(settingsRes.data.stats)
        }
        if (vpRes.data) {
          setWhyChooseUs(vpRes.data.map((vp: { title: string; description: string }) => ({
            title: vp.title, description: vp.description,
          })))
        }
        if (saRes.data) {
          setServiceAreas(saRes.data.map((sa: { name: string; description: string }) => ({
            name: sa.name, description: sa.description,
          })))
        }
        if (destRes.data) {
          setDestinations(destRes.data.map((d: { name: string; image_url: string; description: string }) => ({
            name: d.name, image: d.image_url || '/images/destinations/garden-of-the-gods.jpg', description: d.description,
          })))
        }
      } catch {
        // Use static fallback
      }
    }
    fetchSupabaseData()
  }, [])

  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="/images/about/pexels-outdoor.png"
            alt="Luxury private SUV on a mountain road in Aspen, Colorado — Aspen Alpenglow Limousine private car service"
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
        {stats.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-alp-navy/90 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 py-5 grid grid-cols-3 gap-4 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-playfair text-3xl font-bold text-alp-gold">{stat.value}</div>
                <div className="text-white/70 text-xs tracking-wide uppercase mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        )}
      </section>

      {/* FLEET SHOWCASE */}
      {fleet.length > 0 && (
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
      )}

      {/* TRANSPORTATION SERVICES */}
      {services.length > 0 && (
      <section id="services" className="py-24 bg-alp-pearl">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="font-cormorant text-alp-gold text-lg tracking-widest uppercase mb-4">What We Offer</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-alp-navy font-bold mb-6">Our Services</h2>
            <p className="text-alp-slate text-xl max-w-2xl mx-auto">
              Every detail handled. Every journey seamless.
            </p>
            <p className="text-alp-slate text-base max-w-3xl mx-auto mt-6 leading-relaxed border-t border-alp-pearl-dark pt-6">
              Aspen Alpenglow Limousine operates a professional fleet of three late-model vehicles — two Chevrolet Suburbans (7 passengers each) and a Ford Transit Van (14 passengers) — serving Aspen/Pitkin County Airport (ASE), Eagle County Regional Airport (EGE), Rifle/Garfield County Airport (KRIL), Grand Junction Regional Airport (GJT), and Denver International Airport (DEN), as well as all destinations throughout the Roaring Fork Valley.
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, i) => (
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
                  {service.features.length > 0 && (
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
                  )}
                  <a href={hrefForService({ slug: service.slug, name: service.title })} className="mt-6 inline-flex items-center gap-2 text-alp-gold font-semibold text-sm hover:text-alp-gold-light transition-colors">
                    Book This Service
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* WHY ALPENGLOW */}
      {whyChooseUs.length > 0 && (
      <section className="py-24 bg-alp-pearl">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="font-cormorant text-alp-gold text-lg tracking-widest uppercase mb-4">Why Alpenglow</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-alp-navy font-bold">The Alpenglow Difference</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, i) => (
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
      )}

      {/* SERVICE AREAS */}
      {serviceAreas.length > 0 && (
      <section id="service-areas" className="py-24 bg-alp-pearl-dark">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="font-cormorant text-alp-gold text-lg tracking-widest uppercase mb-4">Where We Go</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-alp-navy font-bold mb-4">Service Areas</h2>
            <p className="text-alp-slate text-xl max-w-2xl mx-auto">From Aspen to Vail and everywhere in between.</p>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceAreas.map((area, i) => (
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
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
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
      )}

      {/* POPULAR DESTINATIONS */}
      {destinations.length > 0 && (
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
            {destinations.map((dest, i) => (
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
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
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
      )}

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

    </div>
  )
}
