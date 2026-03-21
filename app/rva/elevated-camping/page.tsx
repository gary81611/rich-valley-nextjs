import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Elevated Camping | Glamping in Aspen | Rich Valley Adventures',
  description:
    'Experience elevated camping near Aspen, Colorado — premium canvas tents, gourmet chef-prepared meals, guided night-sky viewing, and all the comforts of home in the heart of the Colorado wilderness.',
  openGraph: {
    title: 'Elevated Camping — Glamping Near Aspen | Rich Valley Adventures',
    description:
      'Premium basecamp with gourmet meals, real beds, and guided stargazing in the Roaring Fork Valley. This is not roughing it.',
    type: 'website',
    url: 'https://richvalleyadventures.com/elevated-camping',
    images: [
      {
        url: '/images/adventures/elevated-camping.jpeg',
        width: 1200,
        height: 630,
        alt: 'Elevated camping experience with Rich Valley Adventures near Aspen, Colorado',
      },
    ],
  },
}

const includedItems = [
  {
    title: 'Gourmet Meals',
    description:
      'Chef-prepared breakfast, lunch, and dinner using fresh, local ingredients. Dietary accommodations available.',
  },
  {
    title: 'Premium Gear',
    description:
      'Spacious canvas tents with real beds, quality linens, and camp furniture. No sleeping on the ground here.',
  },
  {
    title: 'Guided Night-Sky Viewing',
    description:
      'Our guides set up a telescope and walk you through the constellations, planets, and deep-sky objects visible from our remote camp.',
  },
  {
    title: 'Expert Wilderness Guide',
    description:
      'A dedicated guide stays with your group the entire trip — leading activities, sharing stories, and keeping everyone safe.',
  },
  {
    title: 'All Camping Equipment',
    description:
      'Campfire setup, cooking gear, camp chairs, lanterns, first-aid supplies — everything you need is already there.',
  },
  {
    title: 'Daytime Activities',
    description:
      'Hiking, fishing, nature walks, or simply relaxing. Your guide tailors the day to your group\'s interests.',
  },
]

export default function ElevatedCampingPage() {
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
            <span className="text-rva-copper-light">Elevated Camping</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative h-[55vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/adventures/elevated-camping.jpeg"
            alt="Elevated camping — premium glamping experience near Aspen, Colorado with Rich Valley Adventures"
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
              Overnight / Multi-Day
            </span>
            <span className="bg-white/15 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full border border-white/20">
              All Levels
            </span>
          </div>
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4">Elevated Camping</h1>
          <p className="text-xl text-white/85 max-w-2xl mx-auto">
            Glamping meets wilderness. Premium comfort in the heart of the Colorado Rockies.
          </p>
        </div>
      </section>

      {/* Description */}
      <section className="py-24 bg-rva-cream">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-cormorant text-rva-copper text-lg tracking-widest uppercase mb-4 text-center">
            The Experience
          </p>
          <h2 className="font-playfair text-3xl md:text-4xl text-rva-forest font-bold mb-8 text-center">
            This Is Not Roughing It
          </h2>
          <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
            <p>
              Our elevated camping experience is designed for people who love the idea of sleeping
              under the stars but don&apos;t want to sacrifice comfort. Think of it as a luxury
              basecamp — spacious canvas tents with real beds, a communal dining area with
              chef-prepared meals, and guided activities that make every moment count.
            </p>
            <p>
              Each camp is set in a carefully chosen location deep in the Roaring Fork Valley
              backcountry — far from roads and crowds, close to streams and mountain views. You
              wake up to fresh coffee and a sunrise over the peaks, spend the day hiking or fishing
              or simply reading by the creek, and end the evening around a campfire with a gourmet
              dinner and guided stargazing.
            </p>
            <p>
              Whether it&apos;s a romantic getaway, a family milestone, or a group trip with
              friends, our elevated camping experiences create memories that last. We handle every
              detail so you can be fully present in one of the most beautiful places on Earth.
            </p>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-24 bg-rva-forest-dark">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-cormorant text-rva-copper-light text-lg tracking-widest uppercase mb-4 text-center">
            Everything You Need
          </p>
          <h2 className="font-playfair text-3xl md:text-4xl text-white font-bold mb-12 text-center">
            What&apos;s Included
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {includedItems.map((item) => (
              <div
                key={item.title}
                className="bg-rva-forest rounded-2xl p-8 border border-white/10"
              >
                <h3 className="font-playfair text-xl text-rva-copper font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="py-24 bg-rva-cream">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="font-playfair text-3xl font-bold text-rva-copper mb-2">1-3</div>
              <div className="text-gray-600 text-sm uppercase tracking-wide mb-3">Nights</div>
              <p className="text-gray-500 text-sm">
                Single overnight or multi-day experiences available
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="font-playfair text-3xl font-bold text-rva-copper mb-2">2-8</div>
              <div className="text-gray-600 text-sm uppercase tracking-wide mb-3">Guests</div>
              <p className="text-gray-500 text-sm">
                Perfect for couples, families, and small groups
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="font-playfair text-3xl font-bold text-rva-copper mb-2">4 Seasons</div>
              <div className="text-gray-600 text-sm uppercase tracking-wide mb-3">Availability</div>
              <p className="text-gray-500 text-sm">
                Year-round camping with seasonal variations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-20 bg-rva-forest">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl text-white font-bold mb-4">
            Ready for an Unforgettable Night Under the Stars?
          </h2>
          <p className="text-white/75 text-lg mb-8 max-w-2xl mx-auto">
            Contact us to plan your elevated camping experience. We&apos;ll customize every detail
            to your group.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-rva-copper hover:bg-rva-copper-light text-white px-10 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-2xl hover:-translate-y-0.5 inline-block"
            >
              Book Elevated Camping
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
