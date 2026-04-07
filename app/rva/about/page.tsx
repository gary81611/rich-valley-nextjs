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
                <p className="text-gray-500 italic">Story coming soon.</p>
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
            <p className="text-white/60 italic">Our story is being written...</p>
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

      {/* Meet Your Guides */}
      <section className="py-24 bg-rva-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="font-cormorant text-rva-copper text-lg tracking-widest uppercase mb-4">Our Team</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-rva-forest font-bold mb-6 leading-tight">
              Meet Your Guides
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Local experts who know these mountains and rivers — because they live here year-round.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Kit McLendon',
                title: 'Lead Fly Fishing Guide',
                tags: [
                  'Hatch reports',
                  'Fly recommendations',
                  'Water clarity assessment',
                  'River observations',
                  'Trail information',
                  'Boat ramp logistics',
                ],
                note: 'Primary expert for river conditions reporting',
              },
              {
                name: 'Bart Chandler',
                title: 'Shooting Guide',
                tags: ['Sporting clay instruction', 'Hunting guide'],
              },
              {
                name: 'Bobby Regan',
                title: 'Kids Fishing Guide',
                tags: ['Introduction to fly fishing', 'Youth instruction', 'Family trips'],
              },
              {
                name: 'Alex Macintyre',
                title: 'Boat Captain',
                tags: ['Float trips', 'Gunnison River', 'Colorado River boat operations'],
              },
              {
                name: 'Jason Fagre',
                title: 'Chef & Hunting Guide',
                tags: ['Elevated camping chef', 'Hunting guide', 'Field-to-table experiences'],
              },
              {
                name: 'John Mudrey',
                title: 'Fly Fishing Guide — Dry Fly Specialist',
                tags: ['Dry fly fishing', 'Nymphing', 'Technical presentation'],
              },
            ].map((g) => (
              <div
                key={g.name}
                className="bg-white rounded-2xl border border-rva-sage/20 shadow-sm overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-rva-cream to-rva-sage/10 flex items-center justify-center px-6">
                  <p className="text-sm font-medium text-rva-forest/45 tracking-wide text-center">Photo coming soon</p>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-playfair text-xl font-bold text-rva-forest mb-1">{g.name}</h3>
                  <p className="text-rva-copper text-sm font-semibold mb-4">{g.title}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {g.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-rva-forest/5 text-rva-forest px-2.5 py-1 rounded-full border border-rva-sage/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex self-start mt-auto text-xs font-bold uppercase tracking-wider bg-rva-copper/10 text-rva-copper px-2.5 py-1 rounded">
                    First Aid certified
                  </span>
                  {g.note ? (
                    <p className="text-xs text-gray-500 mt-3 italic border-t border-rva-sage/10 pt-3">{g.note}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-sm mt-12 max-w-2xl mx-auto leading-relaxed">
            All Rich Valley Adventures guides hold current First Aid certification and have extensive experience
            guiding in the Roaring Fork Valley.
          </p>
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
