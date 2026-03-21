import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { alpenglowData } from '@/lib/site-data'

const serviceDetails: Record<string, {
  title: string
  slug: string
  description: string
  longDescription: string
  features: string[]
  icon: string
}> = {
  'airport-transfers': {
    title: 'Airport Transfers',
    slug: 'airport-transfers',
    description: alpenglowData.services[0].description,
    longDescription: 'Whether you are arriving at Aspen/Pitkin County Airport (ASE), Eagle County Regional Airport (EGE), or Denver International Airport (DEN), Aspen Alpenglow Limousine provides seamless, stress-free transfers. Our chauffeurs monitor your flight in real time so your vehicle is waiting when you land — even if your flight is early or delayed. Enjoy complimentary wait time, luggage assistance, and a pristine luxury vehicle for the ride to your destination.',
    features: alpenglowData.services[0].features,
    icon: 'Plane',
  },
  'hourly-charter': {
    title: 'Hourly Charter',
    slug: 'hourly-charter',
    description: alpenglowData.services[1].description,
    longDescription: 'With hourly charter service, you set the schedule. Whether you need a few hours for shopping in downtown Aspen, a scenic tour of Maroon Bells, or a full-day excursion through the Roaring Fork Valley, your professional chauffeur is at your service. Multiple stops, flexible timing, and complimentary refreshments are all included. Perfect for visitors who want to explore at their own pace.',
    features: alpenglowData.services[1].features,
    icon: 'Clock',
  },
  'corporate-travel': {
    title: 'Corporate Travel',
    slug: 'corporate-travel',
    description: alpenglowData.services[2].description,
    longDescription: 'First impressions matter. Aspen Alpenglow Limousine provides polished, dependable transportation for executives, clients, and corporate teams. From roadshow logistics and conference transfers to executive point-to-point service, we handle every detail with professionalism and discretion. Set up a corporate account for streamlined billing and priority booking.',
    features: alpenglowData.services[2].features,
    icon: 'Briefcase',
  },
  'wedding-transportation': {
    title: 'Wedding Transportation',
    slug: 'wedding-transportation',
    description: alpenglowData.services[3].description,
    longDescription: 'Your wedding day deserves flawless transportation. From bridal party pickups and ceremony transfers to the grand getaway, Aspen Alpenglow Limousine coordinates every vehicle movement so you can focus on celebrating. We work directly with your wedding planner and venue coordinator to build a custom itinerary. Decorated vehicles, package discounts, and multi-vehicle coordination are all available.',
    features: alpenglowData.services[3].features,
    icon: 'Heart',
  },
}

const allSlugs = Object.keys(serviceDetails)

export function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = serviceDetails[params.slug]
  if (!service) return { title: 'Service Not Found' }

  return {
    title: `${service.title} | Aspen Alpenglow Limousine`,
    description: service.description,
  }
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = serviceDetails[params.slug]

  if (!service) {
    return (
      <div className="min-h-screen bg-alp-pearl font-inter flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-playfair text-3xl font-bold text-alp-navy mb-4">Service Not Found</h1>
          <Link href="/services" className="text-alp-gold hover:underline">Back to Services</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      {/* Breadcrumb */}
      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-alp-pearl/70">
            <Link href="/" className="hover:text-alp-gold transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="hover:text-alp-gold transition-colors">Services</Link>
            <span className="mx-2">/</span>
            <span className="text-alp-gold">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-alp-navy-deep text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            {service.title}
          </h1>
          <p className="text-lg sm:text-xl text-alp-pearl/80 max-w-3xl">
            {service.description}
          </p>
        </div>
      </section>

      {/* Details */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-playfair text-3xl font-bold text-alp-navy mb-6">
                About This Service
              </h2>
              <p className="text-alp-slate leading-relaxed text-lg mb-8">
                {service.longDescription}
              </p>
              <h3 className="font-playfair text-xl font-bold text-alp-navy mb-4">What&apos;s Included</h3>
              <ul className="space-y-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-alp-navy">
                    <svg className="w-5 h-5 text-alp-gold mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Fleet Preview */}
            <div className="space-y-6">
              <h3 className="font-playfair text-2xl font-bold text-alp-navy mb-4">Available Vehicles</h3>
              {alpenglowData.fleet.map((vehicle) => (
                <div key={vehicle.name} className="bg-white rounded-2xl shadow-md p-6 border border-alp-pearl-dark">
                  <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-alp-navy-deep">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <h4 className="font-playfair text-xl font-bold text-alp-navy mb-1">{vehicle.name}</h4>
                  <p className="text-alp-gold font-semibold text-sm mb-3">{vehicle.passengers}</p>
                  <ul className="grid grid-cols-2 gap-1">
                    {vehicle.features.map((f) => (
                      <li key={f} className="text-sm text-alp-slate flex items-center gap-1">
                        <span className="w-1 h-1 bg-alp-gold rounded-full flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-alp-navy-deep text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-4">
            Book <span className="text-alp-gold">{service.title}</span>
          </h2>
          <p className="text-alp-pearl/80 mb-8 max-w-2xl mx-auto">
            Ready to experience luxury transportation? Contact us today to reserve your ride.
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
