import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import GuideCard from '@/components/rva/GuideCard'
import RvaButton, { RVA_PHONE_LABEL, RVA_PHONE_HREF } from '@/components/rva/Button'
import { getActiveGuides } from '@/lib/rva-guides'
import { replaceRvaYearClaims, rvaPublicStats, type RvaStat } from '@/lib/rva-public-claims'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About Rich Valley Adventures | Our Story Since 2012 | Aspen, CO',
  description:
    'Learn about Rich Valley Adventures — founded in Aspen in 2012 by Kit and a team of local guides. Guided fly fishing, hiking, biking, and more in the Roaring Fork Valley.',
  alternates: {
    canonical: 'https://www.richvalleyadventures.com/about',
  },
  openGraph: {
    title: 'About Rich Valley Adventures | Our Story Since 2012',
    description:
      'Founded in Aspen in 2012 by local guides. Discover the team behind Rich Valley Adventures.',
    type: 'website',
    url: 'https://www.richvalleyadventures.com/about',
    images: [
      {
        url: 'https://www.richvalleyadventures.com/images/logos/rva-logo.png',
        width: 441,
        height: 212,
        alt: 'Rich Valley Adventures logo',
      },
    ],
  },
}

export default async function AboutPage() {
  let settings: { stats?: RvaStat[]; about_content?: Record<string, string> } | null = null
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (url && url.startsWith('http')) {
    try {
      const supabase = await createServerSupabaseClient()
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('site_key', 'rva')
        .single()
      settings = data
    } catch {
      settings = null
    }
  }

  const stats = rvaPublicStats((settings?.stats || []) as RvaStat[])
  const about = settings?.about_content || null
  const guides = await getActiveGuides()
  const companyNarrative = typeof about?.company_narrative === 'string' ? about.company_narrative.trim() : ''
  const founderStory = typeof about?.founder_story === 'string' ? replaceRvaYearClaims(about.founder_story).trim() : ''

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
      <section className="relative h-[70svh] md:h-[560px] flex items-center justify-center overflow-hidden">
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
          <p className="font-cormorant text-rva-sage text-sm md:text-lg tracking-[0.14em] uppercase mb-4 whitespace-nowrap">
            Our Story
          </p>
          <h1 className="font-playfair mb-4">
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
              <p className="font-cormorant text-rva-copper-700 text-lg tracking-widest uppercase mb-4">
                The Beginning
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl text-rva-forest font-bold mb-8 leading-tight">
                Meet Kit — Founder &amp; Lead Guide
              </h2>
              {founderStory ? (
                founderStory.split('\n\n').map((paragraph: string, i: number) => (
                  <p key={i} className="text-gray-700 text-lg leading-relaxed mb-6">
                    {paragraph}
                  </p>
                ))
              ) : (
                <>
                  {/* [PENDING FROM KIT: founder story] */}
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Rich Valley Adventures was founded in Aspen in 2012 by Kit McLendon.
                  </p>
                </>
              )}
              <p className="text-gray-600 text-base leading-relaxed border-l-4 border-rva-copper-700/30 pl-4">
                &ldquo;We don&apos;t just guide trips — we share our home with you. Every river bend,
                every summit, every campfire story. That&apos;s what makes this different.&rdquo;
                <br />
                <span className="text-rva-copper-700 font-medium mt-2 inline-block">— Kit, Founder</span>
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
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-rva-copper-700/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-rva-sage/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Company narrative stays hidden until Kit writes it. */}
      {companyNarrative ? (
      <section className="py-24 bg-rva-forest-dark">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-cormorant text-rva-copper-light text-lg tracking-widest uppercase mb-4">
            Since 2012
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl text-white font-bold mb-8">
            Since 2012
          </h2>
          {replaceRvaYearClaims(companyNarrative).split('\n\n').map((paragraph: string, i: number) => (
            <p key={i} className="text-white/80 text-lg leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
      ) : null}

      {/* Meet Your Guides */}
      <section className="py-24 bg-rva-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="font-cormorant text-rva-copper-700 text-lg tracking-widest uppercase mb-4">Our Team</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-rva-forest font-bold mb-6 leading-tight">
              Meet Your Guides
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Local experts who know these mountains and rivers — because they live here year-round.
            </p>
          </div>

          {guides.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {guides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          ) : (
            <p className="text-center text-rva-forest/70">
              {/* [PENDING FROM KIT: guide photos and bios if the guides list is empty] */}
              Guide profiles are on the guides page.
            </p>
          )}

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
                  <div className="font-playfair text-4xl font-bold text-rva-copper-700">{stat.value}</div>
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
            {about?.cta_text || 'Tell us what you want to do in the valley and we will help you plan it.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RvaButton href="/adventures" size="lg" tone="on-dark">
              View Adventures
            </RvaButton>
            <RvaButton href={RVA_PHONE_HREF} variant="secondary" size="lg" tone="on-dark">
              {RVA_PHONE_LABEL}
            </RvaButton>
          </div>
        </div>
      </section>
    </div>
  )
}
