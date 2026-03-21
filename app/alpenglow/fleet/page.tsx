import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { alpenglowData } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Our Fleet | Aspen Alpenglow Limousine',
  description: 'Explore our luxury fleet: Executive Cadillac Escalade (6 passengers) and Luxury Mercedes Sprinter (14 passengers). Late-model, professionally maintained vehicles for every occasion.',
}

export default function FleetPage() {
  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      {/* Breadcrumb */}
      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-alp-pearl/70">
            <Link href="/" className="hover:text-alp-gold transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-alp-gold">Fleet</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-alp-navy-deep text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Our <span className="text-alp-gold">Fleet</span>
          </h1>
          <p className="text-lg sm:text-xl text-alp-pearl/80 max-w-3xl mx-auto">
            Late-model luxury vehicles, meticulously maintained and professionally detailed before every ride.
            Choose the perfect vehicle for your journey.
          </p>
        </div>
      </section>

      {/* Fleet Cards */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Escalade */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-alp-pearl-dark">
            <div className="grid lg:grid-cols-2">
              <div className="relative h-72 sm:h-96 lg:h-auto bg-alp-navy-deep">
                <Image
                  src="/images/fleet/escalade.png"
                  alt="Executive Cadillac Escalade — luxury limousine service in Aspen"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-8 sm:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-alp-gold/10 text-alp-gold text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    SUV
                  </span>
                  <span className="text-alp-slate text-sm">Up to 6 Passengers</span>
                </div>
                <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-alp-navy mb-4">
                  {alpenglowData.fleet[0].name}
                </h2>
                <p className="text-alp-slate leading-relaxed mb-6">
                  Our flagship Cadillac Escalade offers the ultimate in comfort and style. Premium leather interior,
                  whisper-quiet ride, and ample space for luggage make it the perfect choice for airport transfers,
                  executive travel, and intimate celebrations.
                </p>
                <ul className="grid grid-cols-2 gap-3 mb-8">
                  {alpenglowData.fleet[0].features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-alp-navy">
                      <svg className="w-4 h-4 text-alp-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="inline-block bg-alp-gold text-alp-navy font-bold px-8 py-3 rounded-full hover:bg-alp-gold-light transition-colors text-center w-fit"
                >
                  Reserve Now
                </Link>
              </div>
            </div>
          </div>

          {/* Sprinter */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-alp-pearl-dark">
            <div className="grid lg:grid-cols-2">
              <div className="relative h-72 sm:h-96 lg:h-auto bg-alp-navy-deep lg:order-2">
                <Image
                  src="/images/fleet/sprinter.png"
                  alt="Luxury Mercedes Sprinter — group transportation in Aspen"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-8 sm:p-12 flex flex-col justify-center lg:order-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-alp-gold/10 text-alp-gold text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Van
                  </span>
                  <span className="text-alp-slate text-sm">Up to 14 Passengers</span>
                </div>
                <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-alp-navy mb-4">
                  {alpenglowData.fleet[1].name}
                </h2>
                <p className="text-alp-slate leading-relaxed mb-6">
                  Our Mercedes Sprinter combines spacious group capacity with true luxury. Standing headroom,
                  executive seating, and entertainment make it ideal for wedding parties, corporate groups,
                  ski teams, and scenic tours through the Roaring Fork Valley.
                </p>
                <ul className="grid grid-cols-2 gap-3 mb-8">
                  {alpenglowData.fleet[1].features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-alp-navy">
                      <svg className="w-4 h-4 text-alp-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="inline-block bg-alp-gold text-alp-navy font-bold px-8 py-3 rounded-full hover:bg-alp-gold-light transition-colors text-center w-fit"
                >
                  Reserve Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-alp-navy-deep text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-4">
            Not Sure Which <span className="text-alp-gold">Vehicle</span>?
          </h2>
          <p className="text-alp-pearl/80 mb-8 max-w-2xl mx-auto">
            Call us and we will help you choose the perfect vehicle for your group size and occasion.
          </p>
          <a
            href="tel:+19704563666"
            className="inline-block border-2 border-alp-gold text-alp-gold font-bold px-8 py-3 rounded-full hover:bg-alp-gold hover:text-alp-navy transition-colors"
          >
            Call 970-456-3666
          </a>
        </div>
      </section>
    </div>
  )
}
