'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '@/components/shared/ScrollReveal'
import BookingPlaceholder from '@/components/shared/BookingPlaceholder'
import AdventureCard from '@/components/rva/AdventureCard'
import RvaButton from '@/components/rva/Button'
import { rvaPublicStats } from '@/lib/rva-public-claims'
import { createClient } from '@/lib/supabase'
import type { Adventure, Testimonial, GalleryImage } from '@/lib/types'
import {
  FLY_FISHING_IMAGE,
  FLY_FISHING_IMAGE_ALT,
  FLY_FISHING_PUBLIC_DESCRIPTION,
  PADDLE_PHOTO,
  PADDLE_PHOTO_ALT,
  TRAIL_HIKING_IMAGE,
  TRAIL_HIKING_IMAGE_ALT,
  TRAIL_HIKING_PUBLIC_DESCRIPTION,
  isHomeGridAdventure,
  toPublicAdventureCard,
} from '@/lib/rva-adventure-public'
import { seoAlt } from '@/lib/seo/alt-text'
import { KIDS_FAMILY_FISHING } from '@/lib/rva-fly-fishing-content'
import {
  formatFishingReportFeedDate,
  type FishingReportFeedItem,
} from '@/lib/fishing-report-feed'

const FEATURED_TRIPS = [
  {
    title: 'Fly Fishing',
    href: '/fly-fishing',
    image: FLY_FISHING_IMAGE,
    alt: FLY_FISHING_IMAGE_ALT,
    detail: FLY_FISHING_PUBLIC_DESCRIPTION,
  },
  {
    title: 'Private ranch family fishing and picnic lunch',
    href: '/private-ranch-fishing',
    image: '/images/adventures/fishing-catch-1440.webp',
    alt: 'Kids and a canoe at a pond',
    detail:
      'Private ranch and picnic package at Spring Creek Ranch, Carbondale CO: from $800 per adult, $250 per child (ages 3+).',
  },
  {
    title: 'Trail Hiking',
    href: '/hiking',
    image: TRAIL_HIKING_IMAGE,
    alt: TRAIL_HIKING_IMAGE_ALT,
    detail: TRAIL_HIKING_PUBLIC_DESCRIPTION,
  },
] as const

export default function RVAHomeClient({
  featuredReport = null,
}: {
  featuredReport?: FishingReportFeedItem | null
}) {
  const [adventures, setAdventures] = useState<
    Array<{
      title: string
      slug: string
      description: string
      image: string
      imageAlt?: string
      objectPosition?: string
      href: string
      duration: string
      difficulty: string
      season: string
      fromText: string | null
    }>
  >([])
  const [activeSeason, setActiveSeason] = useState<string | null>(null)
  const [testimonials, setTestimonials] = useState<Array<{ quote: string; name: string; location: string }>>([])
  const [gallery, setGallery] = useState<string[]>([])
  const [phone, setPhone] = useState('970-456-3666')
  const [phoneHref, setPhoneHref] = useState('tel:+19704563666')
  const [stats, setStats] = useState([
    { value: '2012', label: 'Guiding since' },
    { value: '3,000+', label: 'Adventures Led' },
  ])
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
      const [advRes, testRes, galRes, settingsRes] = await Promise.all([
        supabase.from('adventures').select('*').eq('is_active', true).order('display_order'),
        supabase.from('testimonials').select('*').eq('is_active', true).eq('site_key', 'rva'),
        supabase.from('gallery_images').select('*').eq('is_active', true).eq('site_key', 'rva').order('display_order'),
        supabase.from('site_settings').select('phone, stats').eq('site_key', 'rva').single(),
      ])
      if (advRes.data && advRes.data.length > 0) {
        setAdventures(
          advRes.data
            .filter((a: Adventure) => isHomeGridAdventure(a))
            .map((a: Adventure) => toPublicAdventureCard(a)),
        )
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
      if (Array.isArray(settingsRes.data?.stats)) {
        const published = rvaPublicStats(settingsRes.data.stats as { value: string; label: string }[])
        if (published.length > 0) setStats(published)
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
            alt={seoAlt({
              subject: 'Panoramic view of the Rocky Mountains and Roaring Fork Valley',
              location: 'Aspen, Colorado',
              context: 'guided outdoor experiences',
              brand: 'Rich Valley Adventures',
            })}
            fill
            className="object-cover object-bottom"
            priority
            unoptimized
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-rva-forest-dark/70 via-rva-forest-dark/40 to-rva-forest-dark/80" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto pb-28">
          <p className="font-cormorant text-sm md:text-lg text-rva-sage tracking-[0.14em] uppercase mb-6 whitespace-nowrap">
            Aspen · Roaring Fork Valley
          </p>
          <h1 className="rva-speak-hero font-playfair mb-8">
            Outdoor Adventures in Aspen{' '}
            <span className="text-rva-copper-light italic">&amp; the Roaring Fork Valley</span>
          </h1>
          <p className="rva-speak-hero-intro text-xl md:text-2xl text-white/85 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Rich Valley Adventures is Aspen’s outdoor guide company — expert-led fly fishing, hiking, mountain biking, and elevated camping. Paddleboarding is a rental from $100, not a guided trip. Full-day float trips start at $1,400 for 2 people. Since 2012.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RvaButton href="#adventures" size="lg" tone="on-dark">
              Explore Adventures
            </RvaButton>
            <RvaButton href="/contact" variant="secondary" size="lg" tone="on-dark">
              Check availability
            </RvaButton>
          </div>
          <p className="mt-10 text-white/70 text-sm md:text-base max-w-xl mx-auto">
            Need a ride? Ground transportation via our sister company{' '}
            <a href="https://aspenalpenglowlimousine.com" target="_blank" rel="noopener noreferrer" className="text-rva-copper-light underline hover:text-white transition-colors">
              Aspen Alpenglow Limousine
            </a>
            .
          </p>
        </div>
        {/* Stats bar */}
        <div className="absolute bottom-20 md:bottom-0 left-0 right-0 bg-rva-forest/90 backdrop-blur-sm border-t border-white/10">
          <div className={`max-w-4xl mx-auto px-6 py-5 grid gap-4 text-center ${stats.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-playfair text-3xl font-bold text-rva-copper-light">{stat.value}</div>
                <div className="text-white/70 text-xs tracking-wide uppercase mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Private ranch fishing" className="bg-rva-cream border-b border-rva-copper-700/20">
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-14 grid md:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/images/adventures/fishing-catch-1440.webp"
              alt={seoAlt({
                subject: 'Angler with a trout',
                location: 'Roaring Fork Valley, Colorado',
                context: 'private ranch fly fishing at Spring Creek Ranch',
                brand: 'Rich Valley Adventures',
              })}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
            />
          </div>
          <div>
            <p className="font-cormorant text-rva-copper-700 text-sm tracking-[0.25em] uppercase mb-3">Signature trip</p>
            <h2 className="font-playfair text-3xl md:text-4xl text-rva-forest font-bold mb-4 leading-tight">
              Private ranch fly fishing at Spring Creek Ranch, Carbondale
            </h2>
            <p className="text-rva-forest/80 text-base md:text-lg leading-relaxed mb-6">
              Spring Creek Ranch in Carbondale is a famous historic ranch owned by the same family since the late 1800s. The private ranch and picnic package is from $800 per adult and $250 per child (ages 3+), on ponds, creeks, and a private section of the Roaring Fork River.
            </p>
            <RvaButton href="/private-ranch-fishing">Private ranch fishing</RvaButton>
          </div>
        </div>
      </section>

      {/* Live conditions — informational strip above adventure cards */}
      <section className="bg-gradient-to-r from-rva-forest via-rva-forest-dark to-rva-forest border-y border-rva-copper-700/20" aria-label="Live river conditions">
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
          <RvaButton href="/conditions" tone="on-dark" className="shrink-0">
            View Full Conditions Report
          </RvaButton>
        </div>
      </section>

      {/* ADVENTURES */}
      <section id="adventures" className="py-16 bg-rva-cream">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-10">
            <p className="font-cormorant text-rva-copper-700 text-lg tracking-widest uppercase mb-4">What We Offer</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-rva-forest font-bold mb-6">Our Adventures</h2>
            <p className="rva-speak-services-intro text-rva-forest/80 text-xl max-w-2xl mx-auto">
              Guided trips and rentals across the Roaring Fork Valley, fully equipped.
            </p>
            <div className="mt-8 max-w-3xl mx-auto text-left bg-rva-cream text-rva-forest rounded-2xl p-6 md:p-8">
              <h3 className="font-playfair text-2xl md:text-3xl font-bold mb-3">Kids &amp; Family Fishing</h3>
              <p className="text-base md:text-lg leading-relaxed">{KIDS_FAMILY_FISHING}</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                <Link href="/fly-fishing" className="inline-flex min-h-11 items-center text-rva-copper-700 font-semibold hover:underline">
                  Fly fishing trips
                </Link>
                <Link href="/private-ranch-fishing" className="inline-flex min-h-11 items-center text-rva-copper-700 font-semibold hover:underline">
                  Private ranch fishing
                </Link>
              </div>
            </div>
            <div className="mt-8 flex max-w-full flex-wrap justify-center gap-2">
              {[
                { label: 'All', value: null },
                { label: 'Summer', value: 'summer' },
                { label: 'Winter', value: 'winter' },
                { label: 'Year-Round', value: 'year-round' },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  onClick={() => setActiveSeason(value)}
                  className={`min-h-11 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors ${
                    activeSeason === value
                      ? 'bg-rva-copper-700 text-white border-rva-copper-700'
                      : 'bg-white text-rva-forest border-rva-forest/20 hover:border-rva-copper-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </ScrollReveal>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {(activeSeason ? [] : FEATURED_TRIPS).map((trip) => (
              <AdventureCard
                key={trip.href}
                href={trip.href}
                title={trip.title}
                image={trip.image}
                imageAlt={trip.alt}
                excerpt={trip.detail}
              />
            ))}
            {(activeSeason ? adventures.filter((a) => a.season === activeSeason) : adventures.filter((a) => !FEATURED_TRIPS.some((trip) => trip.href === a.href))).map((adventure) => (
              <AdventureCard
                key={adventure.href}
                href={adventure.href}
                title={adventure.title}
                image={adventure.image}
                imageAlt={
                  adventure.imageAlt ||
                  (adventure.image === PADDLE_PHOTO
                    ? PADDLE_PHOTO_ALT
                    : seoAlt({
                        subject: adventure.title,
                        location: 'Aspen and the Roaring Fork Valley, Colorado',
                        context: 'expert-guided outdoor adventure',
                        brand: 'Rich Valley Adventures',
                      }))
                }
                objectPosition={adventure.objectPosition}
                duration={adventure.duration}
                level={adventure.difficulty}
                excerpt={adventure.description}
                priceNote={adventure.fromText}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT — anchor for nav; links to guides (not a bookable adventure card) */}
      <section id="about" className="py-14 bg-rva-cream border-t border-rva-cream-dark">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-cormorant text-rva-copper-700 text-lg tracking-widest uppercase mb-3">Our Team</p>
          <h2 className="font-playfair text-3xl md:text-4xl text-rva-forest font-bold mb-4">Local Guides, Year-Round</h2>
          <p className="text-gray-600 text-lg mb-6">
            First Aid certified, valley-raised, and passionate about these mountains — meet the people behind your trip.
          </p>
          <Link
            href="/guides"
            className="inline-flex min-h-11 items-center gap-2 text-rva-copper-700 font-semibold hover:underline text-lg"
          >
            Meet Our Guides
            <span aria-hidden>→</span>
          </Link>
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

      {/* LATEST FISHING REPORT — newest item from the merged server feed */}
      {featuredReport && (
      <section className="py-16 bg-rva-cream">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal className="text-center mb-10">
            <p className="font-cormorant text-rva-copper-700 text-lg tracking-widest uppercase mb-4">River Conditions</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-rva-forest font-bold">Latest Fishing Report</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-rva-cream-dark">
              {featuredReport.imageUrl && (
                <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden mb-6 bg-rva-cream-dark">
                  <Image
                    src={featuredReport.imageUrl}
                    alt={seoAlt({
                      subject: featuredReport.title || featuredReport.river || 'Fishing report',
                      location: 'Roaring Fork Valley, Colorado',
                      context: 'weekly fishing conditions',
                      brand: 'Rich Valley Adventures',
                    })}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 42rem"
                  />
                </div>
              )}
              <p className="text-xs font-semibold uppercase tracking-wide text-rva-copper-700 mb-2">
                {featuredReport.source === 'voice' ? 'Guide call-in' : 'Weekly report'}
              </p>
              <h3 className="font-playfair text-2xl text-rva-forest font-semibold mb-2">
                {featuredReport.title || featuredReport.river}
              </h3>
              <p className="text-rva-copper-700 text-sm mb-4">
                {formatFishingReportFeedDate(featuredReport)}
                {featuredReport.reporter_display ? ` · ${featuredReport.reporter_display}` : ''}
              </p>
              {featuredReport.title && featuredReport.river ? (
                <p className="text-sm text-gray-600 mb-4">{featuredReport.river}</p>
              ) : null}
              <p className="text-gray-700 leading-relaxed mb-6">
                {featuredReport.body.length > 200 ? `${featuredReport.body.slice(0, 200)}...` : featuredReport.body}
              </p>
              <Link
                href="/conditions"
                className="inline-flex items-center gap-2 text-rva-copper-700 font-semibold hover:text-rva-copper-light transition-colors"
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
            <p className="font-cormorant text-rva-copper-800 text-lg tracking-widest uppercase mb-4">What Guests Say</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-rva-forest font-bold">Stories from the Valley</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 150}>
                <div className="bg-white rounded-2xl p-8 shadow-sm relative">
                  <div className="font-playfair text-7xl text-rva-copper-700/20 absolute top-4 left-6 leading-none select-none" aria-hidden="true">&ldquo;</div>
                  <p className="text-gray-700 text-lg leading-relaxed italic mb-6 pt-6 relative z-10">{t.quote}</p>
                  <div className="border-t border-rva-cream-dark pt-4">
                    <p className="font-semibold text-rva-forest">{t.name}</p>
                    <p className="text-rva-copper-700 text-sm">{t.location}</p>
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
                    alt={seoAlt({
                      subject: `Gallery photo ${i + 1}`,
                      location: 'Aspen, Colorado',
                      context: 'guided outdoor experience',
                      brand: 'Rich Valley Adventures',
                    })}
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
              <RvaButton href="/gallery" size="lg" tone="on-dark">
                See All Photos
              </RvaButton>
            </ScrollReveal>
          )}
        </div>
      </section>
      )}

      {/* BOOKING / CONTACT */}
      <section id="contact" className="py-16 bg-rva-cream">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal className="text-center mb-8">
            <p className="font-cormorant text-rva-copper-700 text-lg tracking-widest uppercase mb-4">Reserve Your Experience</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-rva-forest font-bold mb-4">Book Your Adventure</h2>
            <p className="text-gray-600 text-lg">Tell us what you have in mind and we&apos;ll get back to you quickly with availability and pricing.</p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
              <BookingPlaceholder
                accentColor="bg-rva-copper-700"
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
