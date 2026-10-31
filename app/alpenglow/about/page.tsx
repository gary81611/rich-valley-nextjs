import type { Metadata } from 'next'
import Link from 'next/link'
import { alpenglowData, AAL_GOOGLE_REVIEW_URL } from '@/lib/site-data'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { AAL_SERVICE_AREAS, correctAalPublicText, normalizeAalStat } from '@/lib/aal-public-copy'
import { AAL_OG_IMAGE } from '@/lib/aal-vehicles'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About Aspen Alpenglow Limousine | Aspen Limo Since 2012',
  description:
    'Roaring Fork Valley private car & limo service since 2012 — our story, chauffeur standards, luxury Suburban & Transit fleet, values, and how we run ASE, EGE & DEN airport transfers.',
  alternates: { canonical: 'https://aspenalpenglowlimousine.com/about' },
  openGraph: {
    title: 'About Aspen Alpenglow Limousine | Aspen Limo Since 2012',
    description:
      'Meet the Aspen-based team behind distinguished airport transfers, ski-day shuttles, weddings, and corporate transport.',
    url: 'https://aspenalpenglowlimousine.com/about',
    type: 'website',
    images: [AAL_OG_IMAGE],
  },
}

const defaultStats = [
  { value: '24/7', label: 'Dispatch Available' },
  { value: 'Since 2012', label: 'Serving Aspen' },
]

const defaultWhyChooseUs = [
  { title: 'Flight Tracking', description: 'We monitor your flight in real-time so your ride is waiting, even if plans change.' },
  { title: 'Local Knowledge', description: 'Our drivers live here. They know the fastest routes and the valley inside out.' },
  { title: 'White-Glove Service', description: 'Meet-and-greet, luggage handling, complimentary refreshments — every detail covered.' },
]

export default async function AboutPage() {
  let stats = defaultStats
  let whyChooseUs = defaultWhyChooseUs

  try {
    const supabase = await createServerSupabaseClient()
    const [settingsRes, vpRes] = await Promise.all([
      supabase.from('site_settings').select('stats').eq('site_key', 'alpenglow').single(),
      supabase.from('value_propositions').select('title, description').eq('site_key', 'alpenglow').eq('is_active', true).order('display_order'),
    ])
    if (settingsRes.data?.stats && Array.isArray(settingsRes.data.stats) && settingsRes.data.stats.length > 0) {
      stats = settingsRes.data.stats
        .map((stat: { value: string; label: string }) => normalizeAalStat(stat))
        .filter((stat): stat is { value: string; label: string } => stat !== null)
      if (stats.length === 0) stats = defaultStats
    }
    if (vpRes.data && vpRes.data.length > 0) {
      whyChooseUs = vpRes.data
        .map((vp: { title: string; description: string }) => ({
          title: correctAalPublicText(vp.title),
          description: correctAalPublicText(vp.description),
        }))
        .filter((vp) => !/impeccable fleet/i.test(vp.title))
      if (whyChooseUs.length === 0) whyChooseUs = defaultWhyChooseUs
    }
  } catch {
    // Use defaults on error
  }

  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': 'https://aspenalpenglowlimousine.com/about#aboutpage',
        url: 'https://aspenalpenglowlimousine.com/about',
        name: 'About Aspen Alpenglow Limousine',
        description:
          'Luxury private transportation in Aspen and the Roaring Fork Valley since 2012 — airport transfers, events, ski shuttles, and corporate travel.',
        isPartOf: { '@type': 'WebSite', url: 'https://aspenalpenglowlimousine.com', name: 'Aspen Alpenglow Limousine' },
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://aspenalpenglowlimousine.com/#business',
        name: 'Aspen Alpenglow Limousine',
        url: 'https://aspenalpenglowlimousine.com',
        telephone: '+19703156111',
        priceRange: '$$$',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Aspen',
          addressRegion: 'CO',
          postalCode: '81611',
          addressCountry: 'US',
        },
        areaServed: [...AAL_SERVICE_AREAS],
        foundingDate: '2012',
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
    <div className="min-h-screen bg-alp-pearl font-inter">
      {/* Breadcrumb */}
      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-alp-pearl/70">
            <Link href="/" className="hover:text-alp-gold transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-alp-gold">About</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="aal-hero-compact bg-alp-navy-deep text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left w-full">
          <p className="text-alp-gold text-sm tracking-widest uppercase mb-4 font-medium">
            Our Story
          </p>
          <h1 className="font-playfair font-bold mb-4 leading-tight">
            About Aspen Alpenglow Limousine
          </h1>
          <p className="text-xl text-white/85 max-w-2xl">
            Distinguished private car service since 2012 — where every ride is first class.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-24 bg-alp-pearl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-alp-gold text-sm tracking-widest uppercase mb-4 font-semibold">
                Since 2012
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl text-alp-navy font-bold mb-8 leading-tight">
                A Legacy of Luxury
              </h2>
              <p className="text-alp-slate text-lg leading-relaxed mb-6">
                Aspen Alpenglow Limousine was founded in 2012 with a simple promise: deliver the
                highest standard of private transportation in the Roaring Fork Valley. What began
                as a single SUV and a dedication to impeccable service has grown into
                a private car service built on local drivers and on-time pickups.
              </p>
              <p className="text-alp-slate text-lg leading-relaxed mb-6">
                We believe that luxury transportation is about more than a nice vehicle — it&apos;s
                about anticipating every need, knowing the valley inside and out, and making every
                ride feel effortless. From 4 a.m. airport pickups to midnight event returns, our
                commitment never wavers.
              </p>
              <p className="text-alp-slate text-lg leading-relaxed mb-6">
                Over the years we have coordinated thousands of ASE, EGE, and DEN arrivals, ski-week
                shuttles for multi-generational families, corporate retreats with complex multi-hotel
                logistics, and wedding weekends where timing is everything. That volume taught us
                something simple: the best service is calm, precise, and kind — especially when
                weather, flights, or mountain traffic refuse to cooperate.
              </p>
              <p className="text-alp-slate text-base leading-relaxed border-l-4 border-alp-gold/30 pl-4">
                &ldquo;Our clients don&apos;t just book a ride — they book peace of mind.
                That&apos;s the Alpenglow difference.&rdquo;
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-center">
              {stats.map((stat) => {
                const reviewLink = stat.value === '5.0' && /google/i.test(stat.label)
                const figure = (
                  <div className="font-playfair text-4xl md:text-5xl font-bold text-alp-gold-700">
                    {stat.value}
                  </div>
                )
                return (
                  <div key={stat.label}>
                    {reviewLink ? (
                      <a href={AAL_GOOGLE_REVIEW_URL} className="hover:underline">
                        {figure}
                      </a>
                    ) : (
                      figure
                    )}
                    <div className="text-alp-slate text-sm uppercase tracking-wide mt-2">
                      {stat.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 bg-alp-navy-deep text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-alp-gold text-sm tracking-widest uppercase mb-4 font-semibold">
            Our Philosophy
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-8">
            White-Glove <span className="text-alp-gold">Service</span>, Every Time
          </h2>
          <p className="text-alp-pearl/80 text-lg leading-relaxed mb-12">
            Every detail matters. We track your flight in real time, so your chauffeur is waiting
            even if your plans change. Luggage is handled, refreshments are ready, and the vehicle
            is spotless. Whether it&apos;s a wedding, a corporate event, or a family vacation,
            we treat every ride as the most important one of the day.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="text-center">
                <h3 className="font-playfair text-lg font-bold text-alp-gold mb-2">
                  {item.title}
                </h3>
                <p className="text-alp-pearl/70 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-alp-pearl-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-alp-gold text-sm tracking-widest uppercase mb-3 font-semibold">How we work</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-alp-navy font-bold">Values &amp; service standards</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white rounded-2xl p-8 border border-alp-pearl-dark shadow-sm">
              <h3 className="font-playfair text-xl font-bold text-alp-navy mb-3">Safety first, always</h3>
              <p className="text-alp-slate leading-relaxed text-sm">
                Winter traction, canyon closures, and high-altitude fatigue are not abstract concepts here — they are
                Tuesday afternoon. We maintain vehicles for mountain duty, adjust routes when CDOT conditions change,
                and never rush a guest to save minutes on a snowy pass.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-alp-pearl-dark shadow-sm">
              <h3 className="font-playfair text-xl font-bold text-alp-navy mb-3">Discretion &amp; reliability</h3>
              <p className="text-alp-slate leading-relaxed text-sm">
                Aspen is a small town with a global guest list. Our team respects privacy, honors NDAs where required,
                and shows up when we say we will — with flight tracking on every airport job and proactive dispatch if
                plans shift.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-alp-pearl-dark shadow-sm">
              <h3 className="font-playfair text-xl font-bold text-alp-navy mb-3">Hospitality mindset</h3>
              <p className="text-alp-slate leading-relaxed text-sm">
                A transfer is often the first and last impression of a trip. We treat luggage, kids, elderly guests,
                and jet-lagged travelers with patience — the way we would want our own family treated after a long day
                of travel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-alp-navy-deep text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-4">
            Experience the <span className="text-alp-gold">Alpenglow Difference</span>
          </h2>
          <p className="text-alp-pearl/80 mb-8 max-w-2xl mx-auto">
            Book your next ride with a private car service built on local drivers and on-time pickups.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={alpenglowData.onlineReservationsPath}
              className="inline-block bg-alp-gold text-alp-navy font-bold px-8 py-3 rounded-full hover:bg-alp-gold-light transition-colors"
            >
              Book online
            </Link>
            <a
              href="tel:+19703156111"
              className="inline-block border-2 border-alp-gold text-alp-gold font-bold px-8 py-3 rounded-full hover:bg-alp-gold hover:text-alp-navy transition-colors"
            >
              Call 970-315-6111
            </a>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
