'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '@/components/shared/ScrollReveal'
import BookingPlaceholder from '@/components/shared/BookingPlaceholder'
import { createClient } from '@/lib/supabase'
import type { Adventure, Testimonial, GalleryImage } from '@/lib/types'

export default function RVAPage() {
  const [adventures, setAdventures] = useState<Array<{ title: string; slug: string; description: string; image: string; duration: string; difficulty: string; season: string }>>([])
  const [activeSeason, setActiveSeason] = useState<string | null>(null)
  const [testimonials, setTestimonials] = useState<Array<{ quote: string; name: string; location: string }>>([])
  const [gallery, setGallery] = useState<string[]>([])
  const [phone, setPhone] = useState('970-456-3666')
  const [phoneHref, setPhoneHref] = useState('tel:+19704563666')
  const [stats, setStats] = useState([
    { value: '14+', label: 'Years of Experience' },
    { value: '3,000+', label: 'Adventures Led' },
    { value: '4.9', label: 'Average Rating' },
  ])
  const [fishingReport, setFishingReport] = useState<{ title: string; date: string; author: string; preview: string } | null>(null)
  const [conditionsPreview, setConditionsPreview] = useState<{ teaser: string; author?: string; date?: string } | null>(null)
  const [conditionsPreviewReady, setConditionsPreviewReady] = useState(false)

  useEffect(() => {
    fetch('/api/conditions/latest')
      .then((r) => r.json())
      .then((body: { report: { teaser: string; author?: string; date?: string } | null }) => {
        setConditionsPreview(body.report)
        setConditionsPreviewReady(true)
      })
      .catch(() => setConditionsPreviewReady(true))
  }, [])

  useEffect(() => {
    async function fetchSupabaseData() {
      const supabase = createClient()
      const [advRes, testRes, galRes, settingsRes, reportRes] = await Promise.all([
        supabase.from('adventures').select('*').eq('is_active', true).order('display_order'),
        supabase.from('testimonials').select('*').eq('is_active', true).eq('site_key', 'rva'),
        supabase.from('gallery_images').select('*').eq('is_active', true).eq('site_key', 'rva').order('display_order'),
        supabase.from('site_settings').select('phone, settings').eq('site_key', 'rva').single(),
        supabase.from('fishing_reports').select('title, date, content, guides(name)').eq('is_published', true).order('date', { ascending: false }).limit(1).single(),
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
      if (settingsRes.data?.phone) {
        setPhone(settingsRes.data.phone)
        setPhoneHref(`tel:+1${settingsRes.data.phone.replace(/\D/g, '')}`)
      }
      if (settingsRes.data?.settings?.stats) {
        setStats(settingsRes.data.settings.stats)
      }
      if (reportRes.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = reportRes.data as any
        const guideName = Array.isArray(r.guides) ? r.guides[0]?.name : r.guides?.name
        setFishingReport({
          title: r.title,
          date: r.published_at || r.created_at,
          author: guideName || 'Staff',
          preview: r.content?.length > 200 ? r.content.slice(0, 200) + '...' : r.content || '',
        })
      }
    }
    fetchSupabaseData()
  }, [])

  return (
    <div className="min-h-screen bg-rva-cream font-inter">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0">
          <Image
            src="/images/about/hero.jpg"
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
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-playfair text-3xl font-bold text-rva-copper-light">{stat.value}</div>
                <div className="text-white/70 text-xs tracking-wide uppercase mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live conditions — informational strip above adventure cards */}
      <section className="bg-gradient-to-r from-rva-forest via-rva-forest-dark to-rva-forest border-y border-rva-copper/20" aria-label="Live river conditions">
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1 min-w-0">
            <p className="font-cormorant text-rva-copper-light text-sm tracking-[0.25em] uppercase mb-2">Live River Conditions</p>
            <p className="text-white/90 text-base md:text-lg leading-relaxed">
              {!conditionsPreviewReady
                ? 'Loading latest report…'
                : conditionsPreview?.teaser
                  ? conditionsPreview.teaser
                  : 'Fishing report updated weekly by our guides. Check current conditions →'}
            </p>
          </div>
          <Link
            href="/rva/conditions"
            className="inline-flex items-center justify-center gap-2 shrink-0 bg-rva-copper hover:bg-rva-copper-light text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm md:text-base"
          >
            View Full Conditions Report
            <span aria-hidden>→</span>
          </Link>
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

      {/* LATEST FISHING REPORT */}
      {fishingReport && (
      <section className="py-16 bg-rva-cream">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal className="text-center mb-10">
            <p className="font-cormorant text-rva-copper text-lg tracking-widest uppercase mb-4">River Conditions</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-rva-forest font-bold">Latest Fishing Report</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-rva-cream-dark">
              <h3 className="font-playfair text-2xl text-rva-forest font-semibold mb-2">{fishingReport.title}</h3>
              <p className="text-rva-copper text-sm mb-4">
                {new Date(fishingReport.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {fishingReport.author}
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">{fishingReport.preview}</p>
              <Link
                href="/rva/conditions"
                className="inline-flex items-center gap-2 text-rva-copper font-semibold hover:text-rva-copper-light transition-colors"
              >
                Read Full Report
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
      )}

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
                phone={phone}
                phoneHref={phoneHref}
                variant="rva"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  )
}
