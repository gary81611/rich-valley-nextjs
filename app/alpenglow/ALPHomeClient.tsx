'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '@/components/shared/ScrollReveal'
import InquiryForm from '@/components/shared/InquiryForm'
import NewsletterSignup from '@/components/shared/NewsletterSignup'
import { alpenglowData } from '@/lib/site-data'
import { createClient } from '@/lib/supabase'
import { hrefForService } from '@/lib/alpenglow-services'
import type { Service as ServiceType, Testimonial } from '@/lib/types'
import { seoAlt } from '@/lib/seo/alt-text'
import { AAL_EAGLE_BOTH_WAYS, AAL_ONE_WAY_RATES, correctAalFaqItem, correctAalPublicText, normalizeAalStat } from '@/lib/aal-public-copy'
import { isPublicTestimonial } from '@/lib/rva-confirmed'

interface GeoBlock {
  id: string
  question: string
  answer: string
  block_type: string
}

function correctAalCopy(question: string, answer: string): string {
  const blob = `${question} ${answer}`.toLowerCase()
  if (/1,475|1475/.test(answer) && blob.includes('denver')) {
    return AAL_ONE_WAY_RATES
  }
  if (blob.includes('net-30') || blob.includes('net 30')) {
    return 'Corporate charge accounts are billed monthly.'
  }
  if (blob.includes('cancellation') && (/50%|7-day|7 day|full refund/.test(answer))) {
    return "Flight diversions to Denver or Grand Junction are handled with 2 hours' notice and no Aspen cancellation penalty. General cancellations need 24 hours' notice."
  }
  return correctAalPublicText(answer)
}

export default function AlpenglowHomeClient() {
  const [services, setServices] = useState<{ title: string; slug: string; description: string; features: string[] }[]>([])
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
        const [svcRes, testRes, geoRes, faqRes, settingsRes, vpRes, saRes, destRes] = await Promise.all([
          supabase.from('services').select('*').eq('is_active', true).order('display_order'),
          supabase.from('testimonials').select('*').eq('is_active', true).eq('verified', true).eq('site_key', 'alpenglow'),
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
              description: correctAalPublicText(s.description),
              features: Array.isArray(s.features) ? (s.features as string[]).map((feature) => correctAalPublicText(feature)) : [],
            })),
          )
        }
        if (testRes.error || !testRes.data) {
          setTestimonials([])
        } else {
          setTestimonials(
            testRes.data
              .filter((t: Testimonial) => isPublicTestimonial(t))
              .map((t: Testimonial) => ({
                quote: t.quote, name: t.author, location: '',
              })),
          )
        }
        if (geoRes.data && geoRes.data.length > 0) {
          setGeoBlocks(
            geoRes.data.flatMap((block: GeoBlock) => {
              const fixed = correctAalFaqItem(block.question, correctAalCopy(block.question, block.answer))
              return fixed ? [{ ...block, question: fixed.q, answer: fixed.a }] : []
            }),
          )
        }
        if (faqRes.data) {
          const mapped = faqRes.data
            .filter((f: { question: string; answer: string }) => f.question && f.answer)
            .flatMap((f: { question: string; answer: string }) => {
              const fixed = correctAalFaqItem(f.question, correctAalCopy(f.question, f.answer))
              return fixed ? [fixed] : []
            })
          setFaqs(mapped)
        }
        if (settingsRes.data?.phone) {
          setPhone(settingsRes.data.phone)
          setPhoneHref(`tel:+1${settingsRes.data.phone.replace(/\D/g, '')}`)
        }
        if (settingsRes.data?.stats && Array.isArray(settingsRes.data.stats)) {
          setStats(
            settingsRes.data.stats
              .map((stat: { value: string; label: string }) => normalizeAalStat(stat))
              .filter((stat): stat is { value: string; label: string } => stat !== null),
          )
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
            alt={seoAlt({
              subject: 'Luxury private SUV on a mountain road',
              location: 'Aspen, Colorado',
              context: 'private car service',
              brand: 'Aspen Alpenglow Limousine',
            })}
            fill
            className="object-cover"
            priority
            unoptimized
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-alp-navy-deep/80 via-alp-navy-deep/50 to-alp-navy-deep/85" />
        </div>
        <div className="aal-on-navy relative z-10 text-center text-white px-6 max-w-5xl mx-auto pb-36 sm:pb-28">
          <p className="font-cormorant text-xl md:text-2xl text-alp-gold tracking-[0.3em] uppercase mb-6">
            Aspen · Snowmass · Roaring Fork Valley
          </p>
          <h1 className="alp-speak-hero font-playfair text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Aspen Car Service &amp; Limousine
          </h1>
          <p className="alp-speak-intro text-xl md:text-2xl text-white/85 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Private SUV and Transit airport transfers for ASE, Eagle (EGE), and Denver (DEN). Available 24/7 since 2012. CO PUC permit LL-04725.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={alpenglowData.onlineReservationsPath} className="bg-alp-gold hover:bg-alp-gold-light text-alp-navy px-10 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-2xl hover:-translate-y-0.5 inline-block">
              Book online
            </a>
            <a href="#quote" className="border-2 border-white text-white hover:bg-white hover:text-alp-navy px-10 py-4 rounded-full font-semibold text-lg transition-all inline-block">
              Request a quote
            </a>
            <a href="/fleet" className="hidden md:inline-block border-2 border-white text-white hover:bg-white hover:text-alp-navy px-10 py-4 rounded-full font-semibold text-lg transition-all">
              See the fleet
            </a>
          </div>
          <a href="/fleet" className="md:hidden mt-5 inline-block text-white text-lg underline underline-offset-4">
            See the fleet
          </a>
        </div>
        {/* Stats bar */}
        {stats.length > 0 && (
        <div className="aal-on-navy absolute bottom-0 left-0 right-0 bg-alp-navy/90 backdrop-blur-sm border-t border-white/10">
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

      {/* Published airport rates — visible text only; no Offer/Product JSON-LD */}
      <section id="rates" className="py-16 bg-white border-b border-alp-pearl-dark" aria-label="Published airport rates">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-cormorant text-alp-gold text-lg tracking-widest uppercase mb-3 text-center">Published rates</p>
          <h2 className="font-playfair text-3xl md:text-4xl text-alp-navy font-bold mb-8 text-center">Airport transfer rates</h2>
          <ul className="space-y-4 text-alp-navy text-lg">
            <li className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-alp-pearl-dark pb-3">
              <span>Aspen Airport (ASE) SUV</span>
              <span className="font-semibold">from $210</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-alp-pearl-dark pb-3">
              <span>Eagle (EGE) SUV / Transit</span>
              <span className="font-semibold">$720 / $1,200</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-alp-pearl-dark pb-3">
              <span>Denver (DEN) SUV / Transit</span>
              <span className="font-semibold">$1,375 / $1,600</span>
            </li>
          </ul>
          <p className="mt-6 text-alp-slate text-sm text-center">
            One-way rates. Holiday pricing may change seasonally. No shared rides.{' '}
            <Link href="/pricing" className="text-alp-gold font-semibold hover:text-alp-navy">
              Full pricing
            </Link>
          </p>
        </div>
      </section>

      <section className="py-14 bg-alp-pearl" aria-label="Guest reviews">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-playfair text-3xl font-bold text-alp-navy mb-8 text-center">Guest reviews</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <blockquote className="bg-white rounded-xl p-6 border border-alp-pearl-dark">
              <p className="text-alp-slate text-sm leading-relaxed italic">
                &ldquo;Excellent car service in Aspen! I&apos;ve used them many times. The experience is excellent all around. The vehicles are always nice &amp; clean, and the drivers are very friendly and professional.&rdquo;
              </p>
              <footer className="mt-4 text-alp-navy font-semibold text-sm">— Michael D.</footer>
            </blockquote>
            <blockquote className="bg-white rounded-xl p-6 border border-alp-pearl-dark">
              <p className="text-alp-slate text-sm leading-relaxed italic">
                &ldquo;Always feel safe with Aspen Alpenglow Limo service, have been driven by this company for many years. Very professional and courteous. Whether you need a drive to the Denver airport or just out to dinner, Aspen Alpenglow has great service.&rdquo;
              </p>
              <footer className="mt-4 text-alp-navy font-semibold text-sm">— Lance Y.</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* TRANSPORTATION SERVICES */}
      <section id="services" className="py-24 bg-alp-pearl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="font-cormorant text-alp-gold text-lg tracking-widest uppercase mb-4">What We Offer</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-alp-navy font-bold mb-6">Our Services</h2>
            <p className="text-alp-slate text-xl max-w-2xl mx-auto">
              Every detail handled. Every journey seamless.
            </p>
            <p className="alp-speak-services-overview text-alp-slate text-base max-w-3xl mx-auto mt-6 leading-relaxed border-t border-alp-pearl-dark pt-6">
              Private airport transfers, hourly charters and event transportation across the Roaring Fork Valley.
            </p>
          </div>
          {services.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 100}>
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-alp-pearl-dark h-full">
                  <h3 className="font-playfair text-2xl text-alp-navy font-semibold mb-2">{service.title}</h3>
                  <p className="text-alp-slate text-sm leading-relaxed mb-6">{service.description}</p>
                  {service.features.length > 0 && (
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="text-sm text-gray-700">{feature}</li>
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
          )}
        </div>
      </section>

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
                  <div aria-hidden="true" className="font-playfair text-7xl text-alp-gold/20 absolute top-4 left-6 leading-none select-none">&ldquo;</div>
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
            <p className="font-cormorant text-alp-gold text-lg tracking-widest uppercase mb-4">Day trips & trailheads</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-white font-bold mb-4">Popular Destinations</h2>
            <p className="text-white/60 text-xl max-w-2xl mx-auto">
              Private rides to Independence Pass, Maroon Bells, Redstone, Marble, Glenwood, and the hikes on your list.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {destinations.map((dest, i) => (
              <ScrollReveal key={dest.name} delay={i * 80} className="group">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                  <Image
                    src={dest.image}
                    alt={seoAlt({
                      subject: dest.name,
                      location: 'Colorado',
                      context: 'private car service destination',
                      brand: 'Aspen Alpenglow Limousine',
                    })}
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

      {/* SEO answer FAQs — visible text only; no Offer/Product JSON-LD */}
      <section className="py-16 bg-alp-pearl" aria-label="Airport transfer questions">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-playfair text-3xl font-bold text-alp-navy mb-8 text-center">Airport transfer questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How much is a car service from Denver to Aspen?',
                a: 'A private Suburban from Denver Airport (DEN) to Aspen is $1,375 one way. The 13-passenger Ford Transit is $1,600. Holiday pricing may change seasonally.',
              },
              {
                q: 'How much is Eagle Airport to Aspen?',
                a: AAL_EAGLE_BOTH_WAYS,
              },
              {
                q: 'Do you offer shared rides?',
                a: 'No shared rides are offered.',
              },
              {
                q: 'What is your PUC permit?',
                a: 'CO PUC permit LL-04725.',
              },
            ].map((item) => (
              <details key={item.q} className="group rounded-xl border border-alp-pearl-dark bg-white p-5">
                <summary className="cursor-pointer font-semibold text-alp-navy flex justify-between gap-3">
                  <span>{item.q}</span>
                  <span className="text-alp-gold">+</span>
                </summary>
                <p className="mt-3 text-sm text-alp-slate leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

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
            <h2 className="font-playfair text-4xl md:text-5xl text-alp-navy font-bold mb-6">Event transportation for weddings and weekends</h2>
            <p className="text-alp-slate text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Private SUVs and the Ford Transit Passenger Van for weddings, X Games week, New Year&apos;s Eve, and holiday arrivals. No shared rides are offered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/weddings" className="inline-block bg-alp-navy hover:bg-alp-navy-deep text-white px-8 py-3 rounded-full font-semibold">Weddings</a>
              <a href="/events/x-games-aspen-transportation" className="inline-block border border-alp-navy text-alp-navy px-8 py-3 rounded-full font-semibold">X Games</a>
              <a href="/events/new-years-eve-aspen" className="inline-block border border-alp-navy text-alp-navy px-8 py-3 rounded-full font-semibold">New Year&apos;s Eve</a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* NEWSLETTER */}
      <NewsletterSignup siteKey="alpenglow" variant="alpenglow" />

      {/* BOOKING / CONTACT */}
      <section id="quote" className="py-24 bg-alp-pearl">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal className="text-center mb-12">
            <p className="font-cormorant text-alp-gold text-lg tracking-widest uppercase mb-4">Reserve Your Journey</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-alp-navy font-bold mb-4">Request a quote</h2>
            <p className="text-alp-slate text-lg">
              <a href={alpenglowData.onlineReservationsPath} className="text-alp-gold font-semibold hover:underline">
                Book online
              </a>{' '}
              for standard trips, or request a quote below and we&apos;ll respond with availability and pricing.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-alp-pearl-dark">
              <InquiryForm brand="alpenglow" />
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  )
}
