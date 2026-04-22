import type { Metadata } from 'next'
import Link from 'next/link'

const pageUrl = 'https://aspenalpenglowlimousine.com/corporate'

export const metadata: Metadata = {
  title: 'Corporate Transportation & Executive Transfers | Aspen Alpenglow Limousine',
  description:
    'Executive transportation in Aspen, CO for airport arrivals, meetings, and retreats. Private Suburban SUV and Transit Van service with experienced chauffeurs.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Corporate Transportation in Aspen | Aspen Alpenglow Limousine',
    description:
      'Professional executive transfers for business travelers, corporate retreats, and event logistics in Aspen and the Roaring Fork Valley.',
    type: 'website',
    url: pageUrl,
  },
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Corporate Transportation',
  serviceType: 'Corporate Transportation',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Aspen Alpenglow Limousine',
    url: 'https://aspenalpenglowlimousine.com',
    telephone: '+19704563666',
  },
  areaServed: ['Aspen', 'Snowmass Village', 'Basalt', 'Carbondale', 'Glenwood Springs'],
  description:
    'Executive airport transfers, corporate retreat shuttles, and private group transport in Aspen and the Roaring Fork Valley.',
  url: pageUrl,
}

export default function CorporatePage() {
  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-alp-pearl/70">
            <Link href="/" className="hover:text-alp-gold transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-alp-gold">Corporate</span>
          </nav>
        </div>
      </div>

      <section className="bg-alp-navy-deep text-white py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold mb-6">
            Corporate &amp; Executive Transportation
          </h1>
          <p className="text-lg text-alp-pearl/80 max-w-3xl mx-auto leading-relaxed">
            Reliable private transportation for business travelers, leadership teams, and corporate events in Aspen,
            Snowmass, and the Roaring Fork Valley.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-alp-slate leading-relaxed">
          <p>
            Business travel in mountain destinations requires precision. Flight changes, weather windows, and
            distributed meeting locations can quickly create friction for guests and event organizers. Aspen
            Alpenglow Limousine provides executive transportation that is punctual, discreet, and structured for
            professional schedules.
          </p>
          <p>
            We support airport transfers from ASE, EGE, and DEN for individual executives and visiting teams.
            Suburban SUVs provide private comfort for leadership travelers and small groups, while the Ford Transit
            Van handles larger team movements between hotels, conference venues, and off-site dinners.
          </p>
          <p>
            For retreats and multi-day events, we help create a transportation plan before guests arrive: pickup
            windows, vehicle assignments, route sequencing, and contingency timing for mountain conditions. This
            reduces day-of coordination load for your operations team and improves the guest experience from the first
            transfer to final departure.
          </p>
          <p>
            Our chauffeurs are local professionals who understand Aspen-area event traffic and winter driving. Service
            is available 24/7 for early departures, late arrivals, and schedule changes that happen in real-world
            corporate travel.
          </p>

          <div className="pt-4">
            <h2 className="font-playfair text-2xl font-bold text-alp-navy mb-3">Coordinate your executive transport</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="px-5 py-2.5 rounded-full bg-alp-gold text-alp-navy font-semibold hover:bg-alp-gold-light transition-colors">
                Contact our team
              </Link>
              <Link href="/services" className="px-5 py-2.5 rounded-full border border-alp-gold text-alp-gold font-semibold hover:bg-alp-gold hover:text-alp-navy transition-colors">
                Explore services
              </Link>
              <Link href="/fleet" className="px-5 py-2.5 rounded-full border border-alp-slate/30 text-alp-slate font-semibold hover:bg-white transition-colors">
                View fleet
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
