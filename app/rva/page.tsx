'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import ScrollReveal from '@/components/shared/ScrollReveal'
import BookingPlaceholder from '@/components/shared/BookingPlaceholder'
import NewsletterSignup from '@/components/shared/NewsletterSignup'
import { rvaData, alpenglowData, photoNotes } from '@/lib/site-data'
import { createClient } from '@/lib/supabase'
import type { Adventure, Testimonial, GalleryImage, FAQ as FAQType } from '@/lib/types'

interface GeoBlock {
  id: string
  question: string
  answer: string
  block_type: string
}

const rvaFaqs = [
  {
    q: 'How much does a guided fly fishing trip in Aspen cost?',
    a: 'Guided fly fishing trips with Rich Valley Adventures typically range from $150–$350 per person depending on trip length (half-day or full-day) and group size. All gear, licenses, and instruction are included. Call us at 970-456-3666 for current pricing and availability.',
  },
  {
    q: 'What is included in a Rich Valley Adventures guided trip?',
    a: 'Every trip includes expert local guides, all necessary gear and equipment, safety briefings, and transportation to the activity location. For fly fishing: rods, reels, waders, boots, and flies. For mountain biking: bikes and helmets. Groups are kept to 2–6 guests per guide for a truly personalized experience.',
  },
  {
    q: 'What is the best time of year for fly fishing in the Roaring Fork Valley?',
    a: 'Peak fly fishing season in the Roaring Fork Valley near Aspen runs July through September, when the river is lower and clearer. The full season runs May–October. Spring runoff (April–June) can make the river high and murky. Certain Gold Medal stretches are fishable year-round.',
  },
  {
    q: 'Do I need prior experience for paddle boarding or mountain biking?',
    a: 'No experience is required for any of our adventures. Our certified guides provide complete instruction, and we select terrain appropriate for each group\'s ability level. All ages and fitness levels are welcome. Private instruction is available for complete beginners.',
  },
  {
    q: 'How small are Rich Valley Adventures guided groups?',
    a: 'We keep groups intentionally small — typically 2 to 6 guests per guide. We do not run large group tours. Private and semi-private bookings are available for families, couples, and corporate groups. Small groups are central to the quality and safety of every experience.',
  },
  {
    q: 'What outdoor adventures are available near Aspen in summer?',
    a: 'Rich Valley Adventures offers 7 guided outdoor experiences near Aspen from May through October: fly fishing on the Roaring Fork River, stand-up paddle boarding on mountain lakes, mountain biking on singletrack trails, guided hiking in the Elk Mountains, scenic private Escalade tours, horseback riding, and elevated camping.',
  },
  {
    q: 'Is fly fishing legal on the Roaring Fork River near Aspen?',
    a: 'Yes. The Roaring Fork River and many tributaries near Aspen are designated Gold Medal trout waters open to fly fishing with a valid Colorado license. Rich Valley Adventures handles all licensing as part of guided trips — guests do not need to obtain a license separately.',
  },
  {
    q: 'Where is Rich Valley Adventures based and what areas do you serve?',
    a: 'We are based in Aspen, Colorado (81611) and guide adventures throughout the Roaring Fork Valley, including Aspen, Snowmass Village, Basalt, and Carbondale. Rich Valley Adventures was founded in 2012 by local outdoor professionals who grew up in the valley.',
  },
]

export default function RVAPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adventures, setAdventures] = useState<Array<{ title: string; slug: string; description: string; image: string; duration: string; difficulty: string; season: string }>>(rvaData.adventures)
  const [testimonials, setTestimonials] = useState(rvaData.testimonials)
  const [gallery, setGallery] = useState(rvaData.gallery)
  const [faqs, setFaqs] = useState(rvaFaqs)
  const [geoBlocks, setGeoBlocks] = useState<GeoBlock[]>([])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    async function fetchSupabaseData() {
      try {
        const supabase = createClient()
        const [advRes, testRes, galRes, faqRes, geoRes] = await Promise.all([
          supabase.from('adventures').select('*').eq('is_active', true).order('display_order'),
          supabase.from('testimonials').select('*').eq('is_active', true).eq('site_key', 'rva'),
          supabase.from('gallery_images').select('*').eq('is_active', true).eq('site_key', 'rva').order('display_order'),
          supabase.from('faqs').select('*').eq('is_active', true).eq('site_key', 'rva').order('display_order'),
          supabase.from('geo_content_blocks').select('*').eq('is_active', true).eq('site_key', 'rva').eq('display_on_page', '/').order('display_order'),
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
        if (faqRes.data && faqRes.data.length > 0) {
          setFaqs(faqRes.data.map((f: FAQType) => ({ q: f.question, a: f.answer })))
        }
        if (geoRes.data && geoRes.data.length > 0) {
          setGeoBlocks(geoRes.data)
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
            {['Adventures', 'About', 'Gallery', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-white/90 hover:text-rva-copper-light transition-colors text-sm font-medium tracking-wide">
                {item}
              </a>
            ))}
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
            {['Adventures', 'About', 'Gallery', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="block text-white/90 hover:text-rva-copper-light text-sm font-medium py-2">
                {item}
              </a>
            ))}
            <a href={rvaData.phoneHref} className="block bg-rva-copper text-white text-center py-3 rounded-full font-semibold mt-2">
              {rvaData.phone}
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-[115vh] flex items-center justify-center overflow-hidden pt-24">
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

      {/* ABOUT / STORY */}
      <section id="about" className="py-24 bg-rva-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <p className="font-cormorant text-rva-copper text-lg tracking-widest uppercase mb-4">Our Story</p>
              <h2 className="font-playfair text-4xl md:text-5xl text-rva-forest font-bold mb-8 leading-tight">
                Born in the Valley,<br />Built on Adventure
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {rvaData.description}
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Every adventure is led by guides who grew up here — people who know the secret fishing holes, the trails the crowds never find, and how to make first-timers feel like lifelong outdoorspeople. We keep our groups small on purpose. This isn&apos;t a cattle operation.
              </p>
              {/* GEO content block — factual, entity-rich for AI search engines */}
              <p className="text-gray-600 text-base leading-relaxed mb-8 border-l-4 border-rva-copper/30 pl-4">
                Rich Valley Adventures has operated guided outdoor excursions in Aspen, Colorado since 2012. Based at the heart of the Roaring Fork Valley, the company is certified and insured for all 7 guided activity types it offers. The Roaring Fork River — which flows through Aspen — is designated a Gold Medal trout fishery by Colorado Parks and Wildlife, making it one of the premier fly fishing destinations in the Rocky Mountain West.
              </p>
              <div className="grid grid-cols-3 gap-6">
                {rvaData.stats.map((stat) => (
                  <div key={stat.label} className="text-center bg-rva-cream-dark rounded-xl p-5">
                    <div className="font-playfair text-3xl font-bold text-rva-copper">{stat.value}</div>
                    <div className="text-gray-600 text-xs uppercase tracking-wide mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5]">
                  <Image
                    src={photoNotes.teamPhoto.current}
                    alt="Rich Valley Adventures guide team — local outdoor experts based in Aspen, Colorado since 2012"
                    fill
                    className="object-cover"
                    loading="eager"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rva-forest-dark/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
                    <p className="text-white font-cormorant text-xl italic leading-relaxed">
                      &ldquo;We don&apos;t just guide trips — we share our home with you.&rdquo;
                    </p>
                    <p className="text-rva-copper-light text-sm mt-2 font-medium">— Kit, Lead Guide & Founder</p>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 w-40 h-40 bg-rva-copper/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-rva-sage/10 rounded-full blur-3xl" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ADVENTURES */}
      <section id="adventures" className="py-24 bg-rva-forest-dark">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="font-cormorant text-rva-copper-light text-lg tracking-widest uppercase mb-4">What We Offer</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-white font-bold mb-6">Our Adventures</h2>
            <p className="text-white/70 text-xl max-w-2xl mx-auto">
              Seven ways to experience the Roaring Fork Valley — each one expertly guided, fully equipped, and unforgettable.
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <span className="bg-rva-copper/20 text-rva-copper-light text-xs px-4 py-1.5 rounded-full border border-rva-copper/30">Summer Offerings</span>
              <span className="bg-white/10 text-white/60 text-xs px-4 py-1.5 rounded-full border border-white/10">Winter Offerings</span>
              <span className="bg-white/10 text-white/60 text-xs px-4 py-1.5 rounded-full border border-white/10">Year-Round</span>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {adventures.map((adventure, i) => (
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
                    <a href="#contact" className="mt-5 text-rva-copper-light text-sm font-semibold hover:text-rva-copper transition-colors flex items-center gap-2">
                      Book This Adventure
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-rva-cream">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="font-cormorant text-rva-copper text-lg tracking-widest uppercase mb-4">Why Rich Valley</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-rva-forest font-bold">The Difference</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {rvaData.whyChooseUs.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 100}>
                <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-rva-forest/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <div className="w-8 h-8 bg-rva-copper rounded-lg" />
                  </div>
                  <h3 className="font-playfair text-xl text-rva-forest font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEED A RIDE? — Transportation Cross-Reference */}
      <section className="py-24 bg-rva-forest">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="font-cormorant text-rva-copper-light text-lg tracking-widest uppercase mb-4">Our Sister Company</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-white font-bold mb-6">Getting Here Is Part of the Adventure</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Our sister company, Aspen Alpenglow Limousine, handles airport transfers, event transportation, and luxury car service throughout the Roaring Fork Valley.
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {alpenglowData.fleet.map((vehicle, i) => (
              <ScrollReveal key={vehicle.name} delay={i * 150}>
                <div className="bg-rva-forest-dark rounded-2xl overflow-hidden border border-white/10">
                  <div className="relative aspect-[16/9] bg-black/20 p-6">
                    <Image src={vehicle.image} alt={vehicle.name} fill className="object-contain p-8" unoptimized />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-playfair text-xl text-white font-semibold">{vehicle.name}</h3>
                      <span className="bg-rva-copper/20 text-rva-copper-light text-xs px-3 py-1 rounded-full">{vehicle.passengers}</span>
                    </div>
                    <a href="https://aspenalpenglow.com/#contact" target="_blank" rel="noopener noreferrer" className="inline-block bg-rva-copper hover:bg-rva-copper-light text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all mt-2">
                      Reserve
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="https://aspenalpenglow.com" target="_blank" rel="noopener noreferrer" className="text-rva-copper-light hover:text-white transition-colors font-semibold inline-flex items-center gap-2">
              View All Transportation Services
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
      <section className="py-24 bg-rva-cream-dark">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
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
      <section id="gallery" className="py-24 bg-rva-forest-dark">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="font-cormorant text-rva-copper-light text-lg tracking-widest uppercase mb-4">The Valley in Pictures</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-white font-bold">Gallery</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((img, i) => (
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
        </div>
      </section>
      )}

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white" aria-label="Frequently asked questions about Rich Valley Adventures">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal className="text-center mb-12">
            <p className="font-cormorant text-rva-copper text-lg tracking-widest uppercase mb-4">Common Questions</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-rva-forest font-bold">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-4 text-lg">Everything you need to know before booking your Aspen adventure.</p>
          </ScrollReveal>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-rva-cream rounded-xl border border-rva-cream-dark overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-playfair text-lg text-rva-forest font-semibold hover:text-rva-copper transition-colors gap-4">
                  <span>{faq.q}</span>
                  <svg className="w-5 h-5 text-rva-copper flex-shrink-0 transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 pt-0 text-gray-700 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* GEO CONTENT BLOCKS */}
      {geoBlocks.length > 0 && (
        <section className="py-16 bg-rva-cream-dark">
          <div className="max-w-3xl mx-auto px-6">
            <ScrollReveal className="text-center mb-10">
              <h2 className="font-playfair text-3xl text-rva-forest font-bold">About Aspen Adventures</h2>
            </ScrollReveal>
            <div className="space-y-4">
              {geoBlocks.map((block) => (
                <div key={block.id} className="bg-white rounded-xl p-6 border border-rva-cream-dark" itemScope itemType="https://schema.org/Question">
                  {block.question && (
                    <h3 className="font-playfair text-lg text-rva-forest font-semibold mb-2" itemProp="name">{block.question}</h3>
                  )}
                  <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                    <p className="text-gray-600 text-sm leading-relaxed" itemProp="text">{block.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PARTNER CALLOUT */}
      <section className="py-20 bg-gradient-to-r from-rva-forest to-rva-forest-dark">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <p className="font-cormorant text-rva-sage text-lg tracking-widest uppercase mb-4">Our Sister Company</p>
            <h2 className="font-playfair text-3xl md:text-4xl text-white font-bold mb-4">{rvaData.partnerSite.name}</h2>
            <p className="text-white/75 text-lg mb-8 max-w-2xl mx-auto">{rvaData.partnerSite.description}</p>
            <a
              href={rvaData.partnerSite.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-rva-forest hover:bg-rva-cream px-10 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Visit Aspen Alpenglow →
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* NEWSLETTER */}
      <NewsletterSignup siteKey="rva" variant="rva" />

      {/* BOOKING / CONTACT */}
      <section id="contact" className="py-24 bg-rva-cream">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal className="text-center mb-12">
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
