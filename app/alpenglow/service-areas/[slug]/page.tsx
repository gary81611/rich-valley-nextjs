import type { Metadata } from 'next'
import Link from 'next/link'

const areaDetails: Record<string, {
  name: string
  description: string
  longDescription: string
  keyDestinations: string[]
}> = {
  aspen: {
    name: 'Aspen',
    description: 'The crown jewel of the Roaring Fork Valley.',
    longDescription: 'Aspen is our home base and primary service area. Whether you need a ride from Aspen/Pitkin County Airport (ASE) to your hotel, a transfer to one of the four ski mountains, or an evening out in downtown Aspen, we know every street, shortcut, and valet circle in town. Our chauffeurs live here — they are not just drivers, they are locals who can recommend the best restaurants, après-ski spots, and hidden gems.',
    keyDestinations: ['Aspen/Pitkin County Airport (ASE)', 'Aspen Mountain & Silver Queen Gondola', 'Aspen Highlands', 'Buttermilk Mountain', 'Downtown Aspen restaurants & shopping', 'The Little Nell & St. Regis', 'Wheeler Opera House', 'John Denver Sanctuary'],
  },
  'snowmass-village': {
    name: 'Snowmass Village',
    description: 'World-class skiing and year-round mountain resort living.',
    longDescription: 'Just 15 minutes from downtown Aspen, Snowmass Village offers some of the best skiing in Colorado along with a vibrant base village. We provide regular transfers between Snowmass and Aspen, airport pickups, and service to all Snowmass lodges and condominiums. During summer, we shuttle guests to the Snowmass Bike Park, hiking trails, and the renowned Anderson Ranch Arts Center.',
    keyDestinations: ['Snowmass Base Village', 'Snowmass Ski Area', 'The Viceroy Snowmass', 'Elk Camp Gondola', 'Anderson Ranch Arts Center', 'Snowmass Recreation Center', 'Treehouse Kids Adventure Center'],
  },
  basalt: {
    name: 'Basalt',
    description: 'Mid-valley charm at the confluence of the Frying Pan and Roaring Fork rivers.',
    longDescription: 'Basalt sits at the heart of the Roaring Fork Valley, making it a convenient home base for exploring in every direction. Known for world-class fly fishing on the Frying Pan River, a walkable downtown with excellent restaurants, and easy access to both Aspen and Glenwood Springs. We provide service throughout Basalt and neighboring El Jebel for airport transfers, dinner outings, and daily commutes.',
    keyDestinations: ['Downtown Basalt', 'Frying Pan River fishing access', 'Willits Town Center', 'El Jebel', 'Basalt Mountain', 'Arbaney-Kittle Trail', 'Local restaurants & breweries'],
  },
  carbondale: {
    name: 'Carbondale',
    description: 'Arts, culture, and gateway to Crystal Valley.',
    longDescription: 'Carbondale is a creative, vibrant community known for its arts scene, farm-to-table dining, and access to the stunning Crystal Valley. From here, guests can explore Redstone, Marble, and the famous Crystal Mill. We provide luxury transportation from Carbondale to both Aspen and Glenwood Springs airports, as well as scenic tours through Crystal Valley and beyond.',
    keyDestinations: ['Downtown Carbondale', 'Redstone & Redstone Castle', 'Marble & Crystal Mill', 'Mount Sopris', 'The Launchpad community center', 'True Nature Healing Arts', 'Carbondale Arts galleries'],
  },
  'glenwood-springs': {
    name: 'Glenwood Springs',
    description: 'Hot springs, adventure, and the I-70 corridor.',
    longDescription: 'Glenwood Springs is the western gateway to the Roaring Fork Valley and a destination in its own right. Home to the world-famous Glenwood Hot Springs Pool, the Iron Mountain Hot Springs, and Glenwood Caverns Adventure Park, it draws visitors year-round. Our service connects Glenwood Springs to Aspen, Eagle/Vail, and Denver, with convenient I-70 corridor access.',
    keyDestinations: ['Glenwood Hot Springs Pool', 'Iron Mountain Hot Springs', 'Glenwood Caverns Adventure Park', 'Hanging Lake trailhead', 'Hotel Colorado', 'Glenwood Springs Amtrak station', 'Downtown shops & restaurants'],
  },
  'eagle-vail': {
    name: 'Eagle / Vail',
    description: 'Eagle County Regional Airport and Vail Valley connections.',
    longDescription: 'Eagle County Regional Airport (EGE) is one of the primary gateways for visitors to the Aspen and Vail areas. We provide luxury transfers from EGE to Aspen (approximately 1.5–2 hours), as well as service throughout the Vail Valley. Whether you are connecting to Vail, Beaver Creek, or heading up-valley to Aspen, our professional chauffeurs ensure a smooth, comfortable journey over the mountain passes.',
    keyDestinations: ['Eagle County Regional Airport (EGE)', 'Vail Village & Lionshead', 'Beaver Creek Resort', 'Edwards & Riverwalk', 'Minturn', 'Vail Pass corridor', 'Eagle town center'],
  },
  denver: {
    name: 'Denver',
    description: 'Colorado\'s capital city and Denver International Airport.',
    longDescription: 'We offer premium long-distance transfers between Aspen and Denver, including door-to-door service to Denver International Airport (DEN). The drive is approximately 3.5–4 hours through some of Colorado\'s most beautiful mountain scenery. Relax in our luxury vehicles while our experienced chauffeurs navigate Independence Pass (summer) or I-70 through the Eisenhower Tunnel (year-round). We also provide service to Denver-area hotels, venues, and event centers.',
    keyDestinations: ['Denver International Airport (DEN)', 'Downtown Denver hotels', 'Red Rocks Amphitheatre', 'Coors Field', 'Denver Convention Center', 'Cherry Creek shopping', 'Denver Botanic Gardens'],
  },
  rifle: {
    name: 'Rifle',
    description: 'Western Garfield County and Rifle Falls.',
    longDescription: 'Rifle is the westernmost point of our primary service area, located along the I-70 corridor in Garfield County. Known for Rifle Falls State Park, Rifle Gap Reservoir, and its position as a gateway to western Colorado, Rifle provides convenient access for guests heading to Grand Junction, Mesa Verde, or the Colorado National Monument. We provide transfers from Rifle to Aspen, Glenwood Springs, and area airports.',
    keyDestinations: ['Rifle Falls State Park', 'Rifle Gap Reservoir', 'Rifle Creek Golf Course', 'Downtown Rifle', 'I-70 corridor access', 'Gateway to western Colorado'],
  },
}

const allSlugs = Object.keys(areaDetails)

export function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const area = areaDetails[params.slug]
  if (!area) return { title: 'Area Not Found' }

  return {
    title: `${area.name} Limo Service | Aspen Alpenglow Limousine`,
    description: `Luxury limousine and car service in ${area.name}, Colorado. ${area.description} Available 24/7.`,
  }
}

export default function ServiceAreaDetailPage({ params }: { params: { slug: string } }) {
  const area = areaDetails[params.slug]

  if (!area) {
    return (
      <div className="min-h-screen bg-alp-pearl font-inter flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-playfair text-3xl font-bold text-alp-navy mb-4">Area Not Found</h1>
          <Link href="/service-areas" className="text-alp-gold hover:underline">Back to Service Areas</Link>
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
            <Link href="/service-areas" className="hover:text-alp-gold transition-colors">Service Areas</Link>
            <span className="mx-2">/</span>
            <span className="text-alp-gold">{area.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-alp-navy-deep text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-alp-gold">{area.name}</span>
          </h1>
          <p className="text-lg sm:text-xl text-alp-pearl/80 max-w-3xl">
            {area.description}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="font-playfair text-3xl font-bold text-alp-navy mb-6">
                Luxury Transportation in {area.name}
              </h2>
              <p className="text-alp-slate leading-relaxed text-lg mb-8">
                {area.longDescription}
              </p>
              <div className="bg-white rounded-2xl shadow-md p-8 border border-alp-pearl-dark">
                <h3 className="font-playfair text-xl font-bold text-alp-navy mb-4">
                  Key Destinations
                </h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {area.keyDestinations.map((dest) => (
                    <li key={dest} className="flex items-start gap-2 text-alp-navy">
                      <svg className="w-5 h-5 text-alp-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">{dest}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-alp-navy-deep rounded-2xl p-8 text-white">
                <h3 className="font-playfair text-xl font-bold mb-4">
                  Book a Ride to <span className="text-alp-gold">{area.name}</span>
                </h3>
                <p className="text-alp-pearl/80 text-sm mb-6">
                  Available 24/7. Airport transfers, hourly charter, and point-to-point service.
                </p>
                <Link
                  href="/contact"
                  className="block bg-alp-gold text-alp-navy font-bold px-6 py-3 rounded-full hover:bg-alp-gold-light transition-colors text-center mb-3"
                >
                  Book Online
                </Link>
                <a
                  href="tel:+19704563666"
                  className="block border-2 border-alp-gold text-alp-gold font-bold px-6 py-3 rounded-full hover:bg-alp-gold hover:text-alp-navy transition-colors text-center"
                >
                  Call 970-456-3666
                </a>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-8 border border-alp-pearl-dark">
                <h3 className="font-playfair text-lg font-bold text-alp-navy mb-3">Our Services</h3>
                <ul className="space-y-2">
                  {['Airport Transfers', 'Hourly Charter', 'Corporate Travel', 'Wedding Transportation'].map((s) => (
                    <li key={s}>
                      <Link
                        href={`/services/${s.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center gap-2 text-alp-slate hover:text-alp-gold transition-colors text-sm py-1"
                      >
                        <svg className="w-3 h-3 text-alp-gold" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        {s}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
