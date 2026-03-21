import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Popular Destinations | Aspen Alpenglow Limousine',
  description: 'Luxury transportation to Colorado\'s top destinations: Garden of the Gods, Denver Botanic Gardens, Red Rocks Amphitheatre, Coors Field, and Pikes Peak.',
}

const destinations = [
  {
    name: 'Garden of the Gods',
    image: '/images/destinations/garden-of-the-gods.jpg',
    description: 'Marvel at towering red rock formations set against the backdrop of Pikes Peak. This National Natural Landmark in Colorado Springs offers breathtaking scenery, hiking trails, and a world-class visitor center. Let us drive you in comfort so you can enjoy every view.',
  },
  {
    name: 'Denver Botanic Gardens',
    image: '/images/destinations/denver-botanic-gardens.jpg',
    description: 'Explore 24 acres of stunning gardens featuring diverse plant collections from around the world. From tranquil Japanese gardens to vibrant tropical conservatories, Denver Botanic Gardens is a perfect day trip from Aspen — especially in our climate-controlled luxury vehicles.',
  },
  {
    name: 'Red Rocks Amphitheatre',
    image: '/images/destinations/red-rocks.jpg',
    description: 'Experience a concert or event at one of the most iconic outdoor venues in the world. Naturally formed red sandstone acoustics, stunning views, and unforgettable performances. Skip the parking hassle — arrive and depart in style with a private chauffeur.',
  },
  {
    name: 'Coors Field',
    image: '/images/destinations/coors-field.jpg',
    description: 'Catch a Colorado Rockies game at Coors Field in downtown Denver. With its stunning mountain views from the upper deck and lively LoDo neighborhood surroundings, it is one of baseball\'s best ballpark experiences. We handle the drive so you can enjoy the game.',
  },
  {
    name: 'Pikes Peak',
    image: '/images/destinations/pikes-peak.jpg',
    description: 'Ascend to 14,115 feet on America\'s Mountain for panoramic views that stretch across four states. Whether you take the cog railway or the Pikes Peak Highway, the journey is unforgettable. Start your adventure with a relaxing luxury transfer from Aspen.',
  },
]

export default function DestinationsPage() {
  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      {/* Breadcrumb */}
      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-alp-pearl/70">
            <Link href="/" className="hover:text-alp-gold transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-alp-gold">Destinations</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-alp-navy-deep text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Popular <span className="text-alp-gold">Destinations</span>
          </h1>
          <p className="text-lg sm:text-xl text-alp-pearl/80 max-w-3xl mx-auto">
            From mountain peaks to city landmarks, we provide luxury transportation to Colorado&apos;s
            most celebrated destinations. Sit back, relax, and enjoy the ride.
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {destinations.map((dest, i) => (
            <div
              key={dest.name}
              className="bg-white rounded-3xl shadow-md overflow-hidden border border-alp-pearl-dark"
            >
              <div className={`grid lg:grid-cols-2 ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <div className="relative h-64 sm:h-80 lg:h-auto min-h-[280px] bg-alp-navy-deep">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-8 sm:p-12 flex flex-col justify-center">
                  <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-alp-navy mb-4">
                    {dest.name}
                  </h2>
                  <p className="text-alp-slate leading-relaxed mb-6">
                    {dest.description}
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-alp-gold text-alp-navy font-bold px-6 py-3 rounded-full hover:bg-alp-gold-light transition-colors w-fit"
                  >
                    Book a Ride
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-alp-navy-deep text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-4">
            Have a <span className="text-alp-gold">Custom Destination</span> in Mind?
          </h2>
          <p className="text-alp-pearl/80 mb-8 max-w-2xl mx-auto">
            We go wherever you need. Contact us with your destination and we will provide a custom quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-alp-gold text-alp-navy font-bold px-8 py-3 rounded-full hover:bg-alp-gold-light transition-colors"
            >
              Get a Quote
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
