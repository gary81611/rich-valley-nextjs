import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { alpenglowData } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'About | Aspen Alpenglow Limousine',
  description: 'Since 2012, Aspen Alpenglow Limousine has provided distinguished private car and limousine service throughout Aspen, Snowmass, and the Roaring Fork Valley. Learn about our story, fleet, and team.',
}

export default function AboutPage() {
  return (
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
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/about/pexels-outdoor.png"
            alt="Aspen Alpenglow Limousine — luxury transportation in the Roaring Fork Valley since 2012"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-alp-navy-deep/70 via-alp-navy-deep/40 to-alp-navy-deep/80" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <p className="text-alp-gold text-lg tracking-widest uppercase mb-4 font-medium">
            Our Story
          </p>
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4 leading-tight">
            About Aspen Alpenglow Limousine
          </h1>
          <p className="text-xl text-white/85 max-w-2xl mx-auto">
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
                as a single Escalade and a dedication to impeccable service has grown into
                Aspen&apos;s most trusted luxury car service.
              </p>
              <p className="text-alp-slate text-lg leading-relaxed mb-6">
                We believe that luxury transportation is about more than a nice vehicle — it&apos;s
                about anticipating every need, knowing the valley inside and out, and making every
                ride feel effortless. From 4 a.m. airport pickups to midnight event returns, our
                commitment never wavers.
              </p>
              <p className="text-alp-slate text-base leading-relaxed border-l-4 border-alp-gold/30 pl-4">
                &ldquo;Our clients don&apos;t just book a ride — they book peace of mind.
                That&apos;s the Alpenglow difference.&rdquo;
              </p>
            </div>
            <div className="grid grid-cols-3 gap-8 text-center">
              {alpenglowData.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-playfair text-4xl md:text-5xl font-bold text-alp-gold">
                    {stat.value}
                  </div>
                  <div className="text-alp-slate text-sm uppercase tracking-wide mt-2">
                    {stat.label}
                  </div>
                </div>
              ))}
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {alpenglowData.whyChooseUs.map((item) => (
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

      {/* Fleet Overview */}
      <section className="py-24 bg-alp-pearl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-alp-gold text-sm tracking-widest uppercase mb-4 font-semibold">
              Our Vehicles
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl text-alp-navy font-bold mb-4">
              The Fleet
            </h2>
            <p className="text-alp-slate text-lg max-w-2xl mx-auto">
              Late-model luxury vehicles, professionally detailed before every ride.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {alpenglowData.fleet.map((vehicle) => (
              <div
                key={vehicle.name}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-alp-pearl-dark"
              >
                <div className="relative h-64 bg-alp-navy-deep">
                  <Image
                    src={vehicle.image}
                    alt={`${vehicle.name} — Aspen Alpenglow Limousine fleet vehicle`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-playfair text-2xl font-bold text-alp-navy mb-1">
                    {vehicle.name}
                  </h3>
                  <p className="text-alp-slate text-sm mb-4">{vehicle.passengers}</p>
                  <ul className="grid grid-cols-2 gap-2">
                    {vehicle.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-alp-navy">
                        <svg className="w-4 h-4 text-alp-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/fleet"
              className="inline-flex items-center gap-2 text-alp-gold font-semibold hover:text-alp-gold-light transition-colors"
            >
              View Full Fleet Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-alp-gold text-sm tracking-widest uppercase mb-4 font-semibold">
              Our Team
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl text-alp-navy font-bold mb-8">
              Professional Chauffeurs, Local Experts
            </h2>
            <p className="text-alp-slate text-lg leading-relaxed mb-6">
              Our chauffeurs are more than drivers — they are hospitality professionals who live in
              the Roaring Fork Valley. They know the fastest routes, the best restaurants, and every
              back road shortcut. Professionally licensed, background-checked, and trained in
              white-glove service.
            </p>
            <p className="text-alp-slate text-lg leading-relaxed">
              When you ride with Alpenglow, you are in the hands of someone who takes pride in making
              your experience flawless. That is our promise, on every single ride.
            </p>
          </div>
        </div>
      </section>

      {/* Sister Company */}
      <section className="py-16 bg-alp-pearl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-alp-slate text-lg mb-4">
            <span className="font-semibold text-alp-navy">Looking for outdoor adventures?</span>{' '}
            Our sister company{' '}
            <span className="font-semibold text-alp-gold">{alpenglowData.partnerSite.name}</span>{' '}
            offers guided fly fishing, hiking, mountain biking, and more.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-alp-navy-deep text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-4">
            Experience the <span className="text-alp-gold">Alpenglow Difference</span>
          </h2>
          <p className="text-alp-pearl/80 mb-8 max-w-2xl mx-auto">
            Book your next ride with Aspen&apos;s most trusted luxury car service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-alp-gold text-alp-navy font-bold px-8 py-3 rounded-full hover:bg-alp-gold-light transition-colors"
            >
              Book a Ride
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
