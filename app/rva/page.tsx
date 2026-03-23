'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '@/components/shared/ScrollReveal'
import BookingPlaceholder from '@/components/shared/BookingPlaceholder'
import { rvaData, photoNotes } from '@/lib/site-data'
import { createClient } from '@/lib/supabase'
import type { Adventure, Testimonial, GalleryImage } from '@/lib/types'

const SERVICE_PAGES = [
  { label: 'Fly Fishing', slug: 'fly-fishing' },
  { label: 'Hiking', slug: 'hiking' },
  { label: 'Mountain Biking', slug: 'mountain-biking' },
  { label: 'Paddle Boarding', slug: 'paddle-boarding' },
  { label: 'Snowshoeing', slug: 'snowshoeing' },
]

export default function RVAPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adventuresOpen, setAdventuresOpen] = useState(false)
  const [mobileAdventuresOpen, setMobileAdventuresOpen] = useState(false)
  const [adventures, setAdventures] = useState<Array<{ title: string; slug: string; description: string; image: string; duration: string; difficulty: string; season: string }>>(rvaData.adventures)
  const [activeSeason, setActiveSeason] = useState<string | null>(null)
  const [testimonials, setTestimonials] = useState(rvaData.testimonials)
  const [gallery, setGallery] = useState(rvaData.gallery)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    async function fetchSupabaseData() {
      try {
        const supabase = createClient()
        const [advRes, testRes, galRes] = await Promise.all([
          supabase.from('adventures').select('*').eq('is_active', true).order('display_order'),
          supabase.from('testimonials').select('*').eq('is_active', true).eq('site_key', 'rva'),
          supabase.from('gallery_images').select('*').eq('is_active', true).eq('site_key', 'rva').order('display_order'),
        ])
        if (advRes.data && advRes.data.length > 0) {
          setAdventures(advRes.data.map((a: Adventure) => ({
            title: a.name, slug: a.name.toLowerCase().replace(/\s+/g, '-'), description: a.description, image: a.image_url || '/images/adventures/fly-fishing.png',
            duration: a.duration, difficulty: a.difficulty, season: a.season || 'summer',
          })))
        }
        if (testRes.data && testRes.data.length > 0) {
          setTestimonials(testRes.data.map((t: Testimonial) => ({
            quote: t.quote, name: t.author, location: '',
          })))
        }
        if (galRes.data && galRes.data.length > 0) {
          setGallery(galRes.data.map((g: GalleryImage) => g.url))
        }
      } catch {
        // Use static fallback — Supabase may not be configured
      }
    }
    fetchSupabaseData()
  }, [])

  return (
    <div className="min-h-screen bg-rva-cream font-inter">
      {/* NAV */}
      <nav aria-label="Main navigation" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-rva-forest/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3" aria-label="Rich Valley Adventures — home">
            <Image src={rvaData.logo} alt="Rich Valley Adventures logo" width={160} height={50} className="h-14 w-auto object-contain" unoptimized loading="eager" />
          </a>
          <div className="hidden md:flex items-center gap-8">
            <div className="relative" onMouseEnter={() => setAdventuresOpen(true)} onMouseLeave={() => setAdventuresOpen(false)}>
              <button onClick={() => setAdventuresOpen(!adventuresOpen)} className="flex items-center gap-1 text-white/90 hover:text-rva-copper-light transition-colors text-sm font-medium tracking-wide">
                Adventures
                <svg className={`w-3.5 h-3.5 transition-transform ${adventuresOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {adventuresOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-rva-forest/98 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 py-2 z-50">
                  {SERVICE_PAGES.map((page) => (
                    <a key={page.slug} href={`/rva/${page.slug}`} className="block px-4 py-2 text-white/85 hover:text-rva-copper-light hover:bg-white/5 text-sm transition-colors">
                      {page.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            {['About', 'Gallery', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-white/90 hover:text-rva-copper-light transition-colors text-sm font-medium tracking-wide">
                {item}
              </a>
            ))}
            <a href="/blog" className="text-white/90 hover:text-rva-copper-light transition-colors text-sm font-medium tracking-wide">
              Blog
            </a>
            <a href="https://aspenalpenglowlimousine.com" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-rva-copper-light transition-colors text-sm font-medium tracking-wide">
              Transportation
            </a>
            <a href={rvaData.phoneHref} aria-label={`Call Rich Valley Adventures at ${rvaData.phone}`} className="bg-rva-copper hover:bg-rva-copper-light text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg">
              {rvaData.phone}
            </a>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle mobile navigation menu" aria-expanded={mobileMenuOpen} className="md:hidden text-white p-2">
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
            {['About', 'Gallery', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-rva-copper-light text-sm font-medium py-2">
                {item}
              </a>
            ))}
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

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0">
          <Image
            src={photoNotes.rvaHero.current}
            alt="Panoramic view of the Rocky Mountains and Roaring Fork Valley near Aspen, Colorado — home of Rich Valley Adventures guided outdoor experiences"
            fill
            className="object-cover object-bottom"
            priority
            unoptimized
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-rva-forest-dark/70 via-rva-forest-dark/40 to-rva-forest-dark/80" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto pb-28">
          <p className="font-cormorant text-xl md:text-2xl text-rva-sage tracking-[0.3em] uppercase mb-6">
            Aspen · Roaring Fork Valley
          </p>
          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            Discover the<br />
            <span className="text-rva-copper-light italic">Heart of Aspen</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/85 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Expert-guided fly fishing, mountain biking, paddle boarding, hiking, and more — since 2012.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://aspenalpenglowlimousine.com" target="_blank" rel="noopener noreferrer" className="border-2 border-white text-white hover:bg-white hover:text-rva-forest px-10 py-4 rounded-full font-semibold text-lg transition-all inline-block">
              Book Transportation
            </a>
            <a href="#adventures" className="bg-rva-copper hover:bg-rva-copper-light text-white px-10 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-2xl hover:-translate-y-0.5 inline-block">
              Explore Adventures
            </a>
            <a href="#contact" className="border-2 border-white text-white hover:bg-white hover:text-rva-forest px-10 py-4 rounded-full font-semibold text-lg transition-all inline-block">
              Book Your Trip
            </a>
          </div>
        </div>
        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-rva-forest/90 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 py-5 grid grid-cols-3 gap-4 text-center">
            {rvaData.stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-playfair text-3xl font-bold text-rva-copper-light">{stat.value}</div>
                <div className="text-white/70 text-xs tracking-wide uppercase mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADVENTURES */}
      <section id="adventures" className="py-16 bg-rva-forest-dark">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-10">
            <p className="font-cormorant text-rva-copper-light text-lg tracking-widest uppercase mb-4">What We Offer</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-white font-bold mb-6">Our Adventures</h2>
            <p className="text-white/70 text-xl max-w-2xl mx-auto">
              Seven ways to experience the Roaring Fork Valley — each one expertly guided, fully equipped, and unforgettable.
            </p>
            <div className="flex justify-center gap-3 mt-6">
              {[
                { label: 'All', value: null },
                { label: 'Summer', value: 'summer' },
                { label: 'Winter', value: 'winter' },
                { label: 'Year-Round', value: 'year-round' },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  onClick={() => setActiveSeason(value)}
                  className={`text-xs px-4 py-1.5 rounded-full border transition-colors ${
                    activeSeason === value
                      ? 'bg-rva-copper/20 text-rva-copper-light border-rva-copper/30'
                      : 'bg-white/10 text-white/60 border-white/10 hover:bg-white/20 hover:text-white/90'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(activeSeason ? adventures.filter(a => a.season === activeSeason) : adventures).map((adventure, i) => (
              <ScrollReveal key={adventure.title} delay={i * 80} className="group">
                <div className="bg-rva-forest rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={adventure.image}
                      alt={`${adventure.title} — expert-guided outdoor adventure in Aspen and the Roaring Fork Valley, Colorado`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="eager"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-rva-forest-dark/70 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-rva-copper/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">{adventure.duration}</span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-white/15 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/20">{adventure.difficulty}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-playfair text-2xl text-rva-copper font-semibold mb-3">{adventure.title}</h3>
                    <p className="text-white/75 text-sm leading-relaxed flex-1">{adventure.description}</p>
                    <Link href={`/rva/${adventure.slug}`} className="mt-5 text-rva-copper-light text-sm font-semibold hover:text-rva-copper transition-colors flex items-center gap-2">
                      Learn More
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section className="py-16 bg-rva-forest-dark">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal className="text-center mb-10">
            <p className="font-cormorant text-rva-copper-light text-lg tracking-widest uppercase mb-4">See It for Yourself</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-white font-bold">Experience the Valley</h2>
          </ScrollReveal>
          <ScrollReveal>
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="https://www.youtube.com/embed/jxJZKObzjZw?si=9c4ylLMS92Qjmz6w"
                title="Rich Valley Adventures — Experience the Valley"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
      <section className="py-16 bg-rva-cream-dark">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal className="text-center mb-10">
            <p className="font-cormorant text-rva-copper text-lg tracking-widest uppercase mb-4">What Guests Say</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-rva-forest font-bold">Stories from the Valley</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 150}>
                <div className="bg-white rounded-2xl p-8 shadow-sm relative">
                  <div className="font-playfair text-7xl text-rva-copper/20 absolute top-4 left-6 leading-none select-none">&ldquo;</div>
                  <p className="text-gray-700 text-lg leading-relaxed italic mb-6 pt-6 relative z-10">{t.quote}</p>
                  <div className="border-t border-rva-cream-dark pt-4">
                    <p className="font-semibold text-rva-forest">{t.name}</p>
                    <p className="text-rva-copper text-sm">{t.location}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* GALLERY */}
      {gallery.length > 0 && (
      <section id="gallery" className="py-16 bg-rva-forest-dark">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-10">
            <p className="font-cormorant text-rva-copper-light text-lg tracking-widest uppercase mb-4">The Valley in Pictures</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-white font-bold">Gallery</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.slice(0, 12).map((img, i) => (
              <ScrollReveal key={i} delay={i * 60} className="group">
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <Image
                    src={img}
                    alt={`Rich Valley Adventures guided outdoor experiences in Aspen, Colorado — gallery photo ${i + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="eager"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-rva-forest-dark/0 group-hover:bg-rva-forest-dark/30 transition-colors duration-300" />
                </div>
              </ScrollReveal>
            ))}
          </div>
          {gallery.length > 12 && (
            <ScrollReveal className="text-center mt-12">
              <Link
                href="/gallery"
                className="inline-block bg-rva-copper hover:bg-rva-copper-dark text-white font-semibold px-8 py-3 rounded-full transition-colors duration-300"
              >
                See All Photos
              </Link>
            </ScrollReveal>
          )}
        </div>
      </section>
      )}

      {/* BOOKING / CONTACT */}
      <section id="contact" className="py-16 bg-rva-cream">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal className="text-center mb-8">
            <p className="font-cormorant text-rva-copper text-lg tracking-widest uppercase mb-4">Reserve Your Experience</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-rva-forest font-bold mb-4">Book Your Adventure</h2>
            <p className="text-gray-600 text-lg">Tell us what you have in mind and we&apos;ll get back to you quickly with availability and pricing.</p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
              <BookingPlaceholder
                accentColor="bg-rva-copper"
                accentHover="hover:bg-rva-copper-light"
                phone={rvaData.phone}
                phoneHref={rvaData.phoneHref}
                variant="rva"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-rva-forest-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <Image src={rvaData.logo} alt="Rich Valley Adventures" width={160} height={50} className="h-14 w-auto object-contain mb-4" unoptimized />
              <p className="text-white/65 text-sm leading-relaxed">{rvaData.description}</p>
            </div>
            <div>
              <h4 className="font-playfair text-lg font-semibold mb-5 text-rva-copper">Adventures</h4>
              <ul className="space-y-2">
                {rvaData.adventures.map((a) => (
                  <li key={a.title}>
                    <a href="#adventures" className="text-white/65 hover:text-rva-copper-light text-sm transition-colors">{a.title}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-playfair text-lg font-semibold mb-5 text-rva-copper">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#contact" className="text-white/65 hover:text-rva-copper-light text-sm transition-colors">Book an Adventure</a></li>
                <li><a href="#" className="text-white/65 hover:text-rva-copper-light text-sm transition-colors">Review Us</a></li>
                <li><a href="/terms" className="text-white/65 hover:text-rva-copper-light text-sm transition-colors">Terms & Conditions</a></li>
                <li><a href="/privacy" className="text-white/65 hover:text-rva-copper-light text-sm transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-playfair text-lg font-semibold mb-5 text-rva-copper">Contact</h4>
              <div className="space-y-3 text-white/65 text-sm">
                <p>{rvaData.location}</p>
                <a href={rvaData.phoneHref} className="block hover:text-rva-copper-light transition-colors">{rvaData.phone}</a>
                <div className="pt-3 border-t border-white/10">
                  <p className="text-white/40 text-xs mb-2">Sister Company</p>
                  <a href={rvaData.partnerSite.url} target="_blank" rel="noopener noreferrer" className="text-rva-copper-light hover:text-rva-copper transition-colors">
                    {rvaData.partnerSite.name} →
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">© {new Date().getFullYear()} Rich Valley Adventures. All rights reserved. | {rvaData.location}</p>
            <div className="flex items-center gap-4">
              <a href={rvaData.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/40 hover:text-rva-copper-light transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href={rvaData.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/40 hover:text-rva-copper-light transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
