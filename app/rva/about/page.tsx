import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About Rich Valley Adventures | Our Story Since 2012 | Aspen, CO',
  description:
    'Learn about Rich Valley Adventures — founded in 2012 by Kit and a team of local Aspen guides. 14+ years of guided fly fishing, hiking, biking, and more in the Roaring Fork Valley.',
  alternates: {
    canonical: 'https://www.richvalleyadventures.com/about',
  },
  openGraph: {
    title: 'About Rich Valley Adventures | Our Story Since 2012',
    description:
      'Founded in 2012 by local Aspen guides. 14+ years, 3,000+ adventures, 4.9 rating. Discover the team behind Rich Valley Adventures.',
    type: 'website',
    url: 'https://www.richvalleyadventures.com/about',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Rich Valley Adventures team in Aspen, Colorado',
      },
    ],
  },
}

export default async function AboutPage() {
  const supabase = await createServerSupabaseClient()

  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('site_key', 'rva')
    .single()

  const stats = settings?.stats || []
  const about = settings?.about_content || null

  return (
    <div className="min-h-screen bg-rva-cream font-inter">
      {/* Breadcrumb */}
      <div className="bg-rva-forest-dark">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-white/60 hover:text-rva-copper-light transition-colors">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-rva-copper-light">About</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/about/hero.jpg"
            alt="Rich Valley Adventures — guided outdoor experiences in the Roaring Fork Valley since 2012"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-rva-forest-dark/70 via-rva-forest-dark/40 to-rva-forest-dark/80" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <p className="font-cormorant text-rva-sage text-lg tracking-widest uppercase mb-4">
            Our Story
          </p>
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4 leading-tight">
            About Rich Valley Adventures
          </h1>
          <p className="text-xl text-white/85 max-w-2xl mx-auto">
            Born in the valley, built on a love of the outdoors — since 2012.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-24 bg-rva-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-cormorant text-rva-copper text-lg tracking-widest uppercase mb-4">
                The Beginning
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl text-rva-forest font-bold mb-8 leading-tight">
                Meet Kit — Founder &amp; Lead Guide
              </h2>
              {about?.founder_story ? (
                about.founder_story.split('\n\n').map((paragraph: string, i: number) => (
                  <p key={i} className="text-gray-700 text-lg leading-relaxed mb-6">
                    {paragraph}
                  </p>
                ))
              ) : (
                <>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Kit grew up on the banks of the Roaring Fork River, learning to fly fish before he could
                    ride a bike. After years guiding across Colorado and the Mountain West, he founded Rich
                    Valley Adventures in 2012 with a simple idea: share the real Aspen — the hidden trails,
                    the secret fishing holes, the places only locals know.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    What started as one guide and a truck full of fly rods has grown into a full-service
                    adventure company offering seven distinct guided experiences. But the philosophy has
                    never changed: small groups, expert guides, and trips that feel personal — not
                    packaged.
                  </p>
                </>
              )}
              <p className="text-gray-600 text-base leading-relaxed border-l-4 border-rva-copper/30 pl-4">
                &ldquo;We don&apos;t just guide trips — we share our home with you. Every river bend,
                every summit, every campfire story. That&apos;s what makes this different.&rdquo;
                <br />
                <span className="text-rva-copper font-medium mt-2 inline-block">— Kit, Founder</span>
              </p>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5]">
                <Image
                  src="/images/about/founder-kit.jpeg"
                  alt="Kit — founder and lead guide of Rich Valley Adventures, Aspen Colorado"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rva-forest-dark/40 via-transparent to-transparent" />
              </div>
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-rva-copper/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-rva-sage/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Since 2012 Narrative */}
      <section className="py-24 bg-rva-forest-dark">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-cormorant text-rva-copper-light text-lg tracking-widest uppercase mb-4">
            Since 2012
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl text-white font-bold mb-8">
            A Decade of Adventure
          </h2>
          {about?.company_narrative ? (
            about.company_narrative.split('\n\n').map((paragraph: string, i: number) => (
              <p key={i} className="text-white/80 text-lg leading-relaxed mb-6">
                {paragraph}
              </p>
            ))
          ) : (
            <>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                Over 14 years, Rich Valley Adventures has grown from a passion project into one of
                Aspen&apos;s most trusted adventure outfitters. We&apos;ve guided more than 3,000
                adventures across the Roaring Fork Valley — from quiet fly fishing mornings on Gold Medal
                waters to multi-day elevated camping experiences under the stars.
              </p>
              <p className="text-white/80 text-lg leading-relaxed mb-12">
                Every year brings new trails to explore, new guests to welcome, and new stories to tell.
                But our core promise remains the same: when you adventure with us, you&apos;re not a
                tourist — you&apos;re a guest in our valley.
              </p>
            </>
          )}
          {stats.length > 0 && (
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-6">
              {stats.map((stat: { label: string; value: string }) => (
                <div key={stat.label} className="text-center">
                  <div className="font-playfair text-4xl md:text-5xl font-bold text-rva-copper-light">
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-sm uppercase tracking-wide mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-rva-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src="/images/about/team-1.jpeg"
                  alt="The Rich Valley Adventures guide team — local outdoor experts in Aspen, Colorado"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rva-forest-dark/40 via-transparent to-transparent" />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="font-cormorant text-rva-copper text-lg tracking-widest uppercase mb-4">
                Our Team
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl text-rva-forest font-bold mb-8 leading-tight">
                Guides Who Grew Up Here
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Every Rich Valley guide is a local — born and raised in the Roaring Fork Valley or
                long-time residents who chose this place as home. They&apos;re wilderness first-aid
                certified, deeply experienced, and genuinely passionate about sharing the outdoors.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Our guides don&apos;t just know the trails — they know the ecology, the history, the
                weather patterns, and the best spot to catch the sunset. That local knowledge is what
                turns a good trip into an unforgettable one.
              </p>
              <ul className="space-y-3">
                {(about?.team_characteristics && about.team_characteristics.length > 0
                  ? about.team_characteristics
                  : [
                      'Wilderness First-Aid certified',
                      'Average 8+ years guiding experience',
                      'Local naturalists & historians',
                      'CPR & swift-water rescue trained',
                    ]
                ).map((item: string) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <span className="w-2 h-2 bg-rva-copper rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      {stats.length > 0 && (
        <section className="py-16 bg-rva-cream-dark">
          <div className="max-w-5xl mx-auto px-6">
            <div className={`grid grid-cols-2 ${stats.length >= 4 ? 'md:grid-cols-4' : stats.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-8 text-center`}>
              {stats.map((stat: { label: string; value: string }) => (
                <div key={stat.label}>
                  <div className="font-playfair text-4xl font-bold text-rva-copper">{stat.value}</div>
                  <div className="text-gray-600 text-sm uppercase tracking-wide mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-rva-forest">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl text-white font-bold mb-4">
            Ready to Experience the Valley?
          </h2>
          <p className="text-white/75 text-lg mb-8 max-w-2xl mx-auto">
            {about?.cta_text || "Whether it's your first visit or your fourteenth, we'll make it unforgettable."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/adventures"
              className="bg-rva-copper hover:bg-rva-copper-light text-white px-10 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-2xl hover:-translate-y-0.5 inline-block"
            >
              View Adventures
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-rva-forest px-10 py-4 rounded-full font-semibold text-lg transition-all inline-block"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
