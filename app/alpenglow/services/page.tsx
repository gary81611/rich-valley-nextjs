import type { Metadata } from 'next'
import Link from 'next/link'

const pageUrl = 'https://aspenalpenglowlimousine.com/services'

export const metadata: Metadata = {
  title: 'Services | Aspen Alpenglow Limousine — Aspen & Roaring Fork Valley',
  description:
    'Airport transfers, corporate travel, wedding transportation, and ski resort shuttles in Aspen, Colorado. All-inclusive rates, professional chauffeurs, Suburban SUVs and Ford Transit Van.',
  alternates: { canonical: pageUrl },
}

const sections = [
  {
    id: 'airport-transfers',
    title: 'Airport Transfers',
    href: '/airport-transfers',
    body: `Aspen Alpenglow Limousine offers all-inclusive, door-to-door private car service from ASE, EGE, DEN, KAPA (Centennial), KRIL (Rifle), and GJT (Grand Junction). We monitor flights in real time, meet you at arrivals with a warm greeting, and include thirty minutes of complimentary wait time on airport pickups so you are never rushed after baggage claim. Whether you are landing after a long haul or connecting from a regional flight, your chauffeur handles luggage and navigation while you relax. Service is available twenty-four hours a day, every day of the year — early Aspen departures and late-night Denver arrivals are our specialty.`,
  },
  {
    id: 'corporate-events',
    title: 'Corporate & Executive Travel',
    href: '/services/corporate-events',
    body: `Discreet, professional transportation for business travelers, corporate retreats, and executive transfers across Aspen and Snowmass. We understand confidentiality, tight schedules, and the need for a calm cabin between meetings. Corporate billing is available for approved accounts, and every driver is an experienced mountain operator — not a generic city driver guessing at snow-packed passes. All vehicles are equipped with Starlink WiFi so you can stay productive between venues, hotels, and the airport.`,
  },
  {
    id: 'wedding-transportation',
    title: 'Wedding Transportation',
    href: '/services/wedding-transportation',
    body: `Your wedding day deserves transportation that is punctual, elegant, and invisible when it needs to be. We coordinate bridal party transfers, venue shuttles, and guest movement throughout Aspen and Snowmass so nobody is stranded at the wrong property. Our team has extensive experience with premier venues including The Little Nell, Hotel Jerome, Aspen Meadows, Limelight, and Snowmass base-area properties. Both our Chevrolet Suburban SUVs and Ford Transit Van are available depending on group size — the Transit comfortably moves parties up to fourteen with room for gowns, flowers, and celebration gear.`,
  },
  {
    id: 'ski-resort-transfers',
    title: 'Ski Resort Transfers',
    href: '/services/ski-resort-transfers',
    body: `Private group transport to Aspen Mountain, Aspen Highlands, Buttermilk, and Snowmass — without the parking headache or the shared-shuttle shuffle. We run Suburban SUVs and a fourteen-passenger Ford Transit Van, each fitted with Myers 6X ski racks so boots and bags stay organized. Early-morning first-chair runs and flexible afternoon pickups are standard. You focus on the turns; we handle icy lots, gear loading, and the drive home when your legs are done.`,
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-alp-pearl/70">
            <Link href="/" className="hover:text-alp-gold transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-alp-gold">Services</span>
          </nav>
        </div>
      </div>

      <section className="bg-alp-navy-deep text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Our <span className="text-alp-gold">Services</span>
          </h1>
          <p className="text-lg sm:text-xl text-alp-pearl/80 max-w-3xl mx-auto leading-relaxed">
            Distinguished luxury transportation for airports, boardrooms, weddings, and ski days — one standard of service across every ride.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {sections.map((s) => (
            <article key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-alp-navy mb-4">{s.title}</h2>
              <p className="text-alp-slate leading-relaxed mb-6">{s.body}</p>
              <Link
                href={s.href}
                className="inline-flex items-center text-alp-gold font-semibold text-sm hover:text-alp-navy transition-colors group"
              >
                More about {s.title}
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-alp-navy-deep text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-4">
            Ready to <span className="text-alp-gold">Book</span>?
          </h2>
          <p className="text-alp-pearl/80 mb-8 max-w-2xl mx-auto">
            Contact us today to arrange your transportation. Available 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-alp-gold text-alp-navy font-bold px-8 py-3 rounded-full hover:bg-alp-gold-light transition-colors"
            >
              Book Now
            </Link>
            <a
              href="tel:+19704563666"
              className="inline-block border-2 border-alp-gold text-alp-gold font-bold px-8 py-3 rounded-full hover:bg-alp-gold hover:text-alp-navy transition-colors"
            >
              Call 970-456-3666
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
