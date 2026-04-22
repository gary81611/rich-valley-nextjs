import type { Metadata } from 'next'
import Link from 'next/link'

const pageUrl = 'https://aspenalpenglowlimousine.com/weddings'

export const metadata: Metadata = {
  title: 'Wedding Transportation in Aspen, CO | Aspen Alpenglow Limousine',
  description:
    'Wedding transportation in Aspen and Snowmass for bridal parties and guests. Chevrolet Suburban SUVs and Ford Transit Van service for venues, hotels, and airports.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Wedding Transportation in Aspen | Aspen Alpenglow Limousine',
    description:
      'Private wedding day transportation for Aspen and Roaring Fork Valley venues, guests, and airport arrivals.',
    type: 'website',
    url: pageUrl,
  },
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Wedding Transportation',
  serviceType: 'Wedding Transportation',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Aspen Alpenglow Limousine',
    url: 'https://aspenalpenglowlimousine.com',
    telephone: '+19704563666',
  },
  areaServed: ['Aspen', 'Snowmass Village', 'Basalt', 'Carbondale'],
  description:
    'Elegant wedding transportation for bridal parties and guests throughout Aspen and the Roaring Fork Valley.',
  url: pageUrl,
}

export default function WeddingsPage() {
  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-alp-pearl/70">
            <Link href="/" className="hover:text-alp-gold transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-alp-gold">Weddings</span>
          </nav>
        </div>
      </div>

      <section className="bg-alp-navy-deep text-white py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold mb-6">
            Wedding Transportation in <span className="text-alp-gold">Aspen</span>
          </h1>
          <p className="text-lg text-alp-pearl/80 max-w-3xl mx-auto leading-relaxed">
            We coordinate reliable, polished transportation for ceremonies, receptions, and guest arrivals
            across Aspen and Snowmass, with clear timelines and proactive communication.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-alp-slate leading-relaxed">
          <p>
            Wedding logistics in mountain towns are unforgiving. Ceremony windows are tight, venue access can be
            constrained, and guests often spread across multiple hotels and private homes. Aspen Alpenglow
            Limousine provides dedicated transportation planning so your day moves on schedule without last-minute
            scrambling.
          </p>
          <p>
            For bridal parties and immediate family groups, our Chevrolet Suburban SUVs seat up to seven passengers
            with comfortable luggage capacity. For larger groups and coordinated guest movement, our Ford Transit Van
            seats up to fourteen passengers and keeps everyone together from pre-ceremony pickups through the final
            return.
          </p>
          <p>
            We routinely support weddings at Aspen and Snowmass venues, including hotel properties, private estates,
            and ranch settings where timing and route planning matter. We can sequence airport pickups from ASE, EGE,
            and DEN, then transition to local venue service so out-of-town guests have one transportation team from
            arrival to departure.
          </p>
          <p>
            Every booking includes a clear transportation run-of-show, confirmation checkpoints, and direct contact
            for your planner or point person. Our chauffeurs are professional mountain drivers familiar with local
            event traffic patterns and weather-sensitive routes. The goal is simple: smooth arrivals, no missed
            moments, and a premium guest experience.
          </p>

          <div className="pt-4">
            <h2 className="font-playfair text-2xl font-bold text-alp-navy mb-3">Plan your wedding transportation</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="px-5 py-2.5 rounded-full bg-alp-gold text-alp-navy font-semibold hover:bg-alp-gold-light transition-colors">
                Request a quote
              </Link>
              <Link href="/fleet" className="px-5 py-2.5 rounded-full border border-alp-gold text-alp-gold font-semibold hover:bg-alp-gold hover:text-alp-navy transition-colors">
                View fleet
              </Link>
              <Link href="/service-areas" className="px-5 py-2.5 rounded-full border border-alp-slate/30 text-alp-slate font-semibold hover:bg-white transition-colors">
                Service areas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
