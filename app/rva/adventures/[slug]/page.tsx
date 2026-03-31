import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { rvaData } from '@/lib/site-data'

interface AdventureDetail {
  title: string
  slug: string
  description: string
  longDescription: string
  image: string
  heroImage: string
  duration: string
  difficulty: string
  whatsIncluded: string[]
  highlights: string[]
  bestFor?: string
}

const adventureDetails: Record<string, AdventureDetail> = {
  'fly-fishing': {
    title: 'Fly Fishing',
    slug: 'fly-fishing',
    bestFor: 'Serious anglers and beginners alike — all gear provided',
    description: rvaData.adventures[0].description,
    longDescription:
      'Wade into the pristine waters of the Roaring Fork River and its tributaries with expert local guides who have fished these Gold Medal waters for decades. Whether you are a complete beginner or an experienced angler looking for new water, our guides will put you on fish. We provide all equipment — premium rods, reels, waders, boots, and hand-tied flies — so you just show up ready for the experience of a lifetime. The Roaring Fork Valley offers some of the finest trout fishing in the Rocky Mountain West, with healthy populations of rainbow, brown, and brook trout.',
    image: rvaData.adventures[0].image,
    heroImage: rvaData.adventures[0].image,
    duration: 'Half Day / Full Day',
    difficulty: 'All Levels',
    whatsIncluded: [
      'Expert local guide',
      'All fly fishing equipment (rod, reel, waders, boots)',
      'Hand-tied flies and tackle',
      'Colorado fishing license',
      'Transportation to fishing location',
      'Streamside instruction for beginners',
      'Snacks and water',
    ],
    highlights: [
      'Fish Gold Medal trout waters',
      'Rainbow, brown, and brook trout',
      'Private access to select stretches',
      'Photography of your catch',
    ],
  },
  'paddle-boarding': {
    title: 'Paddle Boarding',
    slug: 'paddle-boarding',
    bestFor: 'Families and anyone looking for a fun day on the water',
    description: rvaData.adventures[1].description,
    longDescription:
      'Experience the serenity of stand-up paddle boarding on crystal-clear alpine lakes surrounded by towering peaks. Our certified instructors start every session with a land-based lesson before getting you on the water with confidence. We select locations based on conditions and group ability — calm lakes for beginners, gentle river stretches for the more adventurous. All boards, paddles, and safety gear are provided. This is one of our most popular family activities and a perfect way to cool off on a warm Colorado afternoon.',
    image: rvaData.adventures[1].image,
    heroImage: rvaData.adventures[1].image,
    duration: '2-3 Hours',
    difficulty: 'Beginner Friendly',
    whatsIncluded: [
      'Certified paddle board instructor',
      'Premium inflatable SUP board',
      'Paddle and leash',
      'Personal flotation device',
      'Dry bag for personal items',
      'On-water instruction',
      'Transportation to lake',
    ],
    highlights: [
      'Crystal-clear alpine lakes',
      'Stunning mountain backdrops',
      'Perfect for families',
      'No experience needed',
    ],
  },
  'mountain-biking': {
    title: 'Mountain Biking',
    slug: 'mountain-biking',
    bestFor: 'Adventurous riders comfortable on trails — all levels welcome',
    description: rvaData.adventures[2].description,
    longDescription:
      'Explore world-class singletrack trails that wind through aspen groves, alpine meadows, and along mountain ridgelines. The Roaring Fork Valley is home to some of the best mountain biking in Colorado, and our guides know every trail — from smooth, beginner-friendly paths to technical descents that will challenge even experienced riders. We provide top-of-the-line full-suspension mountain bikes, helmets, and all safety gear. Half-day rides focus on a single trail system, while full-day adventures cover more ground with a trailside lunch.',
    image: rvaData.adventures[2].image,
    heroImage: rvaData.adventures[2].image,
    duration: 'Half Day / Full Day',
    difficulty: 'All Levels',
    whatsIncluded: [
      'Expert trail guide',
      'Full-suspension mountain bike',
      'Helmet and gloves',
      'Trail snacks and hydration',
      'Trailside bike repair kit',
      'Transportation to trailhead',
      'Full-day trips include lunch',
    ],
    highlights: [
      'World-class singletrack',
      'Aspen grove riding',
      'Routes for all skill levels',
      'Late-model bikes provided',
    ],
  },
  'trail-hiking': {
    title: 'Trail Hiking',
    slug: 'trail-hiking',
    bestFor: 'Nature lovers and groups of all fitness levels',
    description: rvaData.adventures[3].description,
    longDescription:
      'Discover the hidden waterfalls, wildflower meadows, and panoramic summit views that make the Elk Mountains one of America\'s most spectacular hiking destinations. Our guides are naturalists and local historians who bring every trail to life with stories about the geology, ecology, and mining heritage of the region. We offer everything from easy valley walks to challenging summit pushes, with routes tailored to your group\'s fitness level and interests. All hikes include transportation, trekking poles, snacks, and water.',
    image: rvaData.adventures[3].image,
    heroImage: rvaData.adventures[3].image,
    duration: '3-6 Hours',
    difficulty: 'Moderate',
    whatsIncluded: [
      'Expert naturalist guide',
      'Trekking poles',
      'Trail snacks and water',
      'First-aid kit',
      'Transportation to trailhead',
      'Wildlife and wildflower identification',
      'Photography tips and stops',
    ],
    highlights: [
      'Hidden waterfalls',
      'Wildflower meadows (seasonal)',
      'Panoramic summit views',
      'Elk Mountain ecology & history',
    ],
  },
  'chauffeur-guided-tours-tours': {
    bestFor: 'Anyone who wants to explore the valley in comfort',
    title: 'Chauffeur Guided Tours and Excursions',
    slug: 'chauffeur-guided-tours-tours',
    description: 'See Colorado\'s most iconic landmarks from the comfort of a luxury Cadillac Escalade with a knowledgeable local guide. Maroon Bells, Independence Pass, and beyond.',
    longDescription:
      'See Colorado\'s most iconic landmarks from the comfort of a luxury Cadillac Escalade with a knowledgeable local guide at the wheel. This is the perfect adventure for those who want the views without the vertical — or for guests who want to combine sightseeing with other activities. Half-day tours cover the Roaring Fork Valley\'s highlights, while full-day tours can venture to Independence Pass, Maroon Bells, or other iconic destinations. Complimentary refreshments and flexible itineraries are standard.',
    image: '/images/adventures/chauffeur-guided-tours.png',
    heroImage: '/images/adventures/chauffeur-guided-tours.png',
    duration: 'Half Day / Full Day',
    difficulty: 'Easy — Ride Along',
    whatsIncluded: [
      'Private luxury Escalade',
      'Knowledgeable local driver-guide',
      'Complimentary refreshments',
      'Flexible itinerary',
      'Photo stops at scenic overlooks',
      'Door-to-door pickup and drop-off',
      'Full-day tours include lunch stop',
    ],
    highlights: [
      'Luxury Escalade transportation',
      'Independence Pass & Maroon Bells',
      'Fully customizable route',
      'Accessible for all abilities',
    ],
  },
  'elevated-camping': {
    title: 'Elevated Camping',
    slug: 'elevated-camping',
    bestFor: 'Groups and families who want the outdoors without roughing it',
    description: 'Sleep under the stars in comfort — premium canvas tents with real beds, gourmet chef-prepared meals, and guided stargazing deep in the Colorado wilderness.',
    longDescription:
      'This is not roughing it — this is elevated wilderness. Our premium basecamp experience combines the beauty of sleeping under the stars with the comfort of quality gear, gourmet meals, and expert-guided activities. Each camp features spacious canvas tents with real beds, a communal dining area with chef-prepared meals, and guided night-sky viewing with a telescope. Wake up to fresh coffee and a sunrise over the mountains, then spend the day hiking, fishing, or simply relaxing in one of the most beautiful places on Earth.',
    image: '/images/adventures/elevated-camping.jpeg',
    heroImage: '/images/adventures/elevated-camping.jpeg',
    duration: 'Overnight / Multi-Day',
    difficulty: 'All Levels',
    whatsIncluded: [
      'Premium canvas tent with real bed',
      'Gourmet chef-prepared meals',
      'Expert wilderness guide',
      'Night-sky viewing with telescope',
      'All camping gear and equipment',
      'Campfire storytelling',
      'Morning coffee and sunrise viewing',
      'Transportation to and from camp',
    ],
    highlights: [
      'Glamping-style comfort',
      'Chef-prepared gourmet meals',
      'Guided stargazing',
      'Multi-day options available',
    ],
  },
}

const allSlugs = [
  'fly-fishing',
  'paddle-boarding',
  'mountain-biking',
  'trail-hiking',
  'chauffeur-guided-tours-tours',
  'elevated-camping',
]

export function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const adventure = adventureDetails[params.slug]
  if (!adventure) {
    return { title: 'Adventure Not Found | Rich Valley Adventures' }
  }
  return {
    title: `${adventure.title} | Rich Valley Adventures | Aspen, CO`,
    description: adventure.description,
    alternates: {
      canonical: `https://www.richvalleyadventures.com/adventures/${adventure.slug}`,
    },
    openGraph: {
      title: `${adventure.title} — Guided Adventure in Aspen | Rich Valley Adventures`,
      description: adventure.description,
      type: 'website',
      url: `https://www.richvalleyadventures.com/adventures/${adventure.slug}`,
      images: [
        {
          url: adventure.heroImage,
          width: 1200,
          height: 630,
          alt: `${adventure.title} with Rich Valley Adventures in Aspen, Colorado`,
        },
      ],
    },
  }
}

export default function AdventureDetailPage({ params }: { params: { slug: string } }) {
  const adventure = adventureDetails[params.slug]

  if (!adventure) {
    return (
      <div className="min-h-screen bg-rva-cream font-inter flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-playfair text-4xl text-rva-forest font-bold mb-4">
            Adventure Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t find that adventure. Check out all of our offerings below.
          </p>
          <Link
            href="/adventures"
            className="bg-rva-copper hover:bg-rva-copper-light text-white px-8 py-3 rounded-full font-semibold transition-all inline-block"
          >
            View All Adventures
          </Link>
        </div>
      </div>
    )
  }

  const relatedAdventures = allSlugs
    .filter((s) => s !== params.slug)
    .slice(0, 3)
    .map((s) => adventureDetails[s])

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
            <Link
              href="/adventures"
              className="text-white/60 hover:text-rva-copper-light transition-colors"
            >
              Adventures
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-rva-copper-light">{adventure.title}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={adventure.heroImage}
            alt={`${adventure.title} — guided adventure experience in Aspen, Colorado with Rich Valley Adventures`}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-rva-forest-dark/60 via-rva-forest-dark/30 to-rva-forest-dark/80" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <div className="flex justify-center gap-3 mb-6">
            <span className="bg-rva-copper/90 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full font-medium">
              {adventure.duration}
            </span>
            <span className="bg-white/15 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full border border-white/20">
              {adventure.difficulty}
            </span>
          </div>
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4">{adventure.title}</h1>
          <p className="text-xl text-white/85 max-w-2xl mx-auto">{adventure.description}</p>
        </div>
      </section>

      {/* "Best For" tag + Mobile CTA card */}
      <section className="bg-rva-cream pt-8 pb-0">
        <div className="max-w-7xl mx-auto px-6">
          {/* Best For tag */}
          {adventure.bestFor && (
            <p className="text-sm text-rva-forest/60 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-rva-copper flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span><strong className="text-rva-forest/80">Best for:</strong> {adventure.bestFor}</span>
            </p>
          )}

          {/* Mobile-only CTA card (Change 4) */}
          <div className="lg:hidden bg-white rounded-xl p-5 shadow-sm border border-rva-copper/10 mb-6">
            <div className="flex items-center justify-between text-sm text-rva-forest/70 mb-4">
              <span>{adventure.duration}</span>
              <span>{adventure.difficulty}</span>
              <span>2-6 guests</span>
            </div>
            {/* TODO: Replace [ASK KIT] with actual pricing from Kit */}
            {/* <p className="text-lg font-semibold text-rva-forest mb-3">Starting from $[ASK KIT]/person</p> */}
            <div className="flex gap-3">
              <Link href="/rva/contact" className="flex-1 bg-rva-copper hover:bg-rva-copper-light text-white text-center py-3 rounded-full text-sm font-semibold transition-colors">
                Request Booking
              </Link>
              <a href="tel:+19704563666" className="flex-1 border-2 border-rva-forest/20 text-rva-forest text-center py-3 rounded-full text-sm font-medium transition-colors hover:border-rva-forest/40">
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-rva-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="font-playfair text-3xl text-rva-forest font-bold mb-6">
                About This Adventure
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-10">
                {adventure.longDescription}
              </p>

              {/* Highlights */}
              <h3 className="font-playfair text-2xl text-rva-forest font-semibold mb-4">
                Highlights
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {adventure.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm"
                  >
                    <span className="w-3 h-3 bg-rva-copper rounded-full flex-shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>

              {/* What's Included */}
              <h3 className="font-playfair text-2xl text-rva-forest font-semibold mb-4">
                What&apos;s Included
              </h3>
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <ul className="grid sm:grid-cols-2 gap-3">
                  {adventure.whatsIncluded.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-700">
                      <svg
                        className="w-5 h-5 text-rva-copper flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Booking CTA */}
              <div className="bg-rva-forest rounded-2xl p-8 text-white mb-8 sticky top-8">
                <h3 className="font-playfair text-2xl font-bold mb-2">Book This Adventure</h3>
                {/* TODO: Replace [ASK KIT] with actual pricing from Kit */}
                {/* <p className="text-2xl font-light text-rva-copper-light mb-2">Starting from $[ASK KIT]<span className="text-sm text-white/60">/person</span></p> */}
                <p className="text-white/75 text-sm mb-6">
                  Ready to experience {adventure.title.toLowerCase()} in the Roaring Fork Valley?
                  Get in touch to check availability.
                </p>
                <Link
                  href="/rva/contact"
                  className="block bg-rva-copper hover:bg-rva-copper-light text-white text-center px-6 py-3.5 rounded-full font-semibold transition-all hover:shadow-lg w-full mb-4"
                >
                  Request Booking
                </Link>
                <a
                  href="tel:+19704563666"
                  className="block border-2 border-white/30 hover:border-white text-white text-center px-6 py-3 rounded-full font-medium transition-all w-full"
                >
                  Call 970-456-3666
                </a>
                <div className="mt-6 pt-6 border-t border-white/20 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Duration</span>
                    <span className="font-medium">{adventure.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Difficulty</span>
                    <span className="font-medium">{adventure.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Group Size</span>
                    <span className="font-medium">2-6 guests</span>
                  </div>
                </div>
              </div>

              {/* Related Adventures */}
              <div>
                <h3 className="font-playfair text-xl text-rva-forest font-semibold mb-4">
                  More Adventures
                </h3>
                <div className="space-y-4">
                  {relatedAdventures.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/adventures/${related.slug}`}
                      className="group flex gap-4 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={related.image}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-playfair text-rva-forest font-semibold group-hover:text-rva-copper transition-colors">
                          {related.title}
                        </h4>
                        <p className="text-gray-500 text-xs mt-1">{related.duration}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
