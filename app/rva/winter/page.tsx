import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Winter Adventures | Rich Valley Adventures | Aspen, CO',
  description:
    'Explore winter in the Roaring Fork Valley with Rich Valley Adventures. Guided snowshoeing, cross-country skiing, ice fishing, and winter Chauffeur Guided Tours in Aspen, Colorado.',
  alternates: {
    canonical: 'https://www.richvalleyadventures.com/winter',
  },
  openGraph: {
    title: 'Winter Adventures in Aspen | Rich Valley Adventures',
    description:
      'Guided snowshoeing, cross-country skiing, ice fishing, and scenic winter tours in the Roaring Fork Valley.',
    type: 'website',
    url: 'https://www.richvalleyadventures.com/winter',
  },
}

const winterAdventures = [
  {
    title: 'Fall & Winter Guided Hunting (Elk)',
    description: 'Experience Colorado elk hunting with expert guides in the Roaring Fork Valley. Rich Valley Adventures provides all gear, local knowledge, and door-to-door transport by Aspen Alpenglow Limousine. Our hunting guides have decades of experience in these mountains.',
    duration: 'Full Day (6-8 hours)',
    difficulty: 'Moderate to Challenging',
    season: 'Sept 1 - Dec 10',
    image: 'https://images.unsplash.com/photo-1504208434969-66e7e9d5e6fa?w=800&q=80',
  },
  {
    title: 'Mule Deer Hunting',
    description: 'Guided mule deer hunting in the high country of the Roaring Fork Valley. All gear provided including rifles, ammunition, and field dressing equipment. Our guides know the migration patterns and prime territory.',
    duration: 'Full Day (6-8 hours)',
    difficulty: 'Moderate',
    season: 'Sept 1 - Dec 10',
    image: 'https://images.unsplash.com/photo-1504208434969-66e7e9d5e6fa?w=800&q=80',
  },
  {
    title: 'Waterfowl Hunting',
    description: 'Guided waterfowl hunting along the rivers and reservoirs of the Roaring Fork Valley. All decoys, blinds, and equipment provided. Morning hunts with hot breakfast included.',
    duration: 'Half Day (3-4 hours)',
    difficulty: 'All Levels',
    season: 'Oct 1 - Jan 15',
    image: 'https://images.unsplash.com/photo-1504208434969-66e7e9d5e6fa?w=800&q=80',
  },
  {
    title: 'Winter Guided Ice Fishing',
    description: 'Fish frozen alpine lakes surrounded by snow-covered peaks. We provide all gear including auger, shelter, heater, rods, and bait. Hot coffee and snacks keep you warm while you wait for that first bite through the ice.',
    duration: '3-5 Hours',
    difficulty: 'All Levels',
    season: 'Dec 15 - Feb 25',
    image: 'https://images.unsplash.com/photo-1543039625-14cbd3802e7d?w=800&q=80',
  },
  {
    title: 'Winter Guided Snowshoeing',
    description: 'Trek through snow-covered meadows and frozen aspen groves. Routes range from gentle valley walks to challenging backcountry terrain. All snowshoe equipment, trekking poles, and hot drinks included.',
    duration: 'Half Day / Full Day',
    difficulty: 'All Levels',
    season: 'Dec 15 - Feb 25',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
  },
  {
    title: 'Cross-Country Skiing',
    description: 'Glide through quiet winter wilderness on groomed and backcountry trails. We provide skis, boots, poles, and expert instruction. Full-day tours include a trailside hot lunch.',
    duration: 'Half Day / Full Day',
    difficulty: 'Beginner to Intermediate',
    season: 'Year-round (snow dependent)',
    image: 'https://images.unsplash.com/photo-1482784160316-6eb046863ece?w=800&q=80',
  },
  {
    title: 'Electric/Fat Tire Guided Biking Tour',
    description: 'Explore snow-packed trails on fat tire bikes or electric bikes. A unique way to experience the winter landscape accessible to all fitness levels. All bikes and safety gear provided.',
    duration: 'Half Day (3-4 hours)',
    difficulty: 'All Levels',
    season: 'Nov 1 - May 31',
    image: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=800&q=80',
  },
  {
    title: 'Sporting Clay Shotgun Shooting Clinic',
    description: 'Expert instruction from guide Bart Chandler at a private sporting clay range. Perfect for beginners and experienced shooters alike. All equipment and ammunition provided.',
    duration: 'Half Day (3-4 hours)',
    difficulty: 'All Levels',
    season: 'Nov 1 - May 31',
    image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=800&q=80',
  },
  {
    title: 'Chauffeur Guided Tours and Excursions',
    description: 'See the Roaring Fork Valley in comfort from a luxury Chevrolet Suburban. Visit historical landmarks, scenic overlooks, frozen waterfalls, and learn about local Colorado history — from Native American heritage to mining and ranching eras.',
    duration: 'Half Day / Full Day',
    difficulty: 'Easy — Ride Along',
    season: 'Year-round',
    image: 'https://images.unsplash.com/photo-1520208422220-d12a3c588e6c?w=800&q=80',
  },
  {
    title: 'Cast and Blast',
    description: 'A unique Rich Valley Adventures combination — river float trip with waterfowl hunting and fly fishing. Fish in the morning, hunt in the afternoon (or vice versa). A true Colorado experience.',
    duration: 'Full Day (6-8 hours)',
    difficulty: 'Moderate',
    season: 'Fall Season',
    image: 'https://images.unsplash.com/photo-1504208434969-66e7e9d5e6fa?w=800&q=80',
  },
  {
    title: 'Snowmobile & Electric Snowbike Tours',
    description: 'Explore backcountry terrain on snowmobiles or electric snowbikes. Guided tours through pristine winter landscapes with stops at scenic overlooks. Requires 7-day advance booking.',
    duration: 'Half Day / Full Day',
    difficulty: 'Moderate',
    season: 'Winter Season',
    image: 'https://images.unsplash.com/photo-1520208422220-d12a3c588e6c?w=800&q=80',
  },
]

export default function WinterPage() {
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
            <span className="text-rva-copper-light">Winter Offerings</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="py-20 bg-rva-forest-dark text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-cormorant text-rva-copper-light text-lg tracking-widest uppercase mb-4">
            November through April
          </p>
          <h1 className="font-playfair text-4xl md:text-6xl text-white font-bold mb-6">
            Winter Offerings
          </h1>
          <p className="text-white/75 text-xl max-w-2xl mx-auto">
            The Roaring Fork Valley is just as magical under snow. Explore our guided winter
            adventures — all gear included, small groups, expert local guides.
          </p>
        </div>
      </section>

      {/* Winter Adventures */}
      <section className="py-16 bg-rva-cream">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          {winterAdventures.map((adventure, i) => (
            <div
              key={adventure.title}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? 'lg:direction-rtl' : ''
              }`}
            >
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-rva-copper/10 text-rva-copper text-sm px-4 py-1.5 rounded-full font-medium">
                    {adventure.duration}
                  </span>
                  <span className="bg-rva-forest/10 text-rva-forest text-sm px-4 py-1.5 rounded-full">
                    {adventure.difficulty}
                  </span>
                  {'season' in adventure && (
                    <span className="bg-blue-50 text-blue-700 text-sm px-4 py-1.5 rounded-full">
                      {(adventure as any).season}
                    </span>
                  )}
                </div>
                <h2 className="font-playfair text-3xl md:text-4xl text-rva-forest font-bold mb-6">
                  {adventure.title}
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  {adventure.description}
                </p>
                <p className="text-sm text-rva-copper font-medium mb-6">Starting at $250/person · All gear provided · Transport by Aspen Alpenglow Limousine</p>
                <Link
                  href="/rva/contact"
                  className="bg-rva-copper hover:bg-rva-copper-light text-white px-8 py-3.5 rounded-full font-semibold transition-all hover:shadow-lg inline-block"
                >
                  Book Now — 970-456-3666
                </Link>
              </div>
              <div className={`relative ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                  <Image
                    src={adventure.image}
                    alt={`${adventure.title} — guided winter adventure near Aspen, Colorado with Rich Valley Adventures`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rva-forest-dark/30 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-rva-forest">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl text-white font-bold mb-4">
            Plan Your Winter Adventure
          </h2>
          <p className="text-white/75 text-lg mb-8 max-w-2xl mx-auto">
            Winter in the Roaring Fork Valley is something special. Let us help you experience it
            the right way — with expert guides, premium gear, and small groups.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-rva-copper hover:bg-rva-copper-light text-white px-10 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-2xl hover:-translate-y-0.5 inline-block"
            >
              Book Now
            </Link>
            <a
              href="tel:+19704563666"
              className="border-2 border-white text-white hover:bg-white hover:text-rva-forest px-10 py-4 rounded-full font-semibold text-lg transition-all inline-block"
            >
              Call 970-456-3666
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
