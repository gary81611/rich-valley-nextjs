import type { Metadata } from 'next'

const RVA_URL = 'https://richvalleyadventures.com'
const RVA_OG_IMAGE = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80'

export const metadata: Metadata = {
  title: 'Rich Valley Adventures | Guided Outdoor Experiences in Aspen, CO',
  description: 'Guided fly fishing, paddle boarding, mountain biking, hiking, and more in Aspen and the Roaring Fork Valley. Small groups, expert local guides, all gear included. Operating since 2012.',
  keywords: 'Aspen guided adventures, fly fishing Aspen Colorado, paddle boarding Roaring Fork River, mountain biking Aspen, outdoor guide Aspen Colorado, guided hiking Aspen, adventure tours Roaring Fork Valley, Aspen outdoor activities',
  alternates: {
    canonical: RVA_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: 'Rich Valley Adventures | Guided Outdoor Experiences in Aspen, CO',
    description: 'Expert-guided fly fishing, paddle boarding, mountain biking & more in the Roaring Fork Valley. Since 2012. Small groups, all gear included.',
    type: 'website',
    locale: 'en_US',
    url: RVA_URL,
    siteName: 'Rich Valley Adventures',
    images: [
      {
        url: RVA_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Guided fly fishing and outdoor adventures in the Roaring Fork Valley near Aspen, Colorado',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rich Valley Adventures | Guided Outdoor Experiences in Aspen, CO',
    description: 'Expert-guided fly fishing, paddle boarding, mountain biking & more in the Roaring Fork Valley. Since 2012.',
    images: [RVA_OG_IMAGE],
  },
  verification: {
    google: '-q1tnKm96Tll0PlWAdnV5kSJHd-doPIrpc7BWnHb53o',
  },
  other: {
    'geo.region': 'US-CO',
    'geo.placename': 'Aspen, Colorado',
    'geo.position': '39.1911;-106.8175',
    'ICBM': '39.1911, -106.8175',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'SportsActivityLocation', 'TouristAttraction'],
  '@id': `${RVA_URL}/#business`,
  name: 'Rich Valley Adventures',
  description:
    'Rich Valley Adventures has been operating guided outdoor excursions in Aspen, Colorado since 2012. They offer guided adventures including fly fishing, paddle boarding, mountain biking, trail hiking, elevated camping, and scenic Escalade tours in the Roaring Fork Valley.',
  url: RVA_URL,
  telephone: '+19704563666',
  priceRange: '$$',
  image: RVA_OG_IMAGE,
  foundingDate: '2012',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Aspen',
    addressLocality: 'Aspen',
    addressRegion: 'CO',
    postalCode: '81611',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 39.1911,
    longitude: -106.8175,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '07:00',
      closes: '20:00',
    },
  ],
  areaServed: [
    { '@type': 'City', name: 'Aspen', sameAs: 'https://en.wikipedia.org/wiki/Aspen,_Colorado' },
    { '@type': 'City', name: 'Snowmass Village' },
    { '@type': 'Place', name: 'Roaring Fork Valley' },
    { '@type': 'City', name: 'Basalt' },
    { '@type': 'City', name: 'Carbondale' },
  ],
  sameAs: [
    'https://www.facebook.com/richvalleyadventures',
    'https://www.instagram.com/richvalleyadventures',
    'https://www.tripadvisor.com/richvalleyadventures',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '200',
    bestRating: '5',
    worstRating: '1',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Guided Adventure Experiences in Aspen, Colorado',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'SportsActivityLocation',
          name: 'Guided Fly Fishing — Roaring Fork River, Aspen CO',
          description:
            'Expert-guided fly fishing trips on the Roaring Fork River and its tributaries near Aspen, Colorado. All gear provided. All skill levels welcome.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'SportsActivityLocation',
          name: 'Guided Stand-Up Paddle Boarding — Aspen, CO',
          description:
            'Stand-up paddle boarding on pristine mountain lakes and rivers near Aspen, Colorado. Instruction and all equipment provided. No experience required.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'SportsActivityLocation',
          name: 'Guided Mountain Biking — Roaring Fork Valley, CO',
          description:
            'Expert-guided mountain biking on singletrack trails throughout the Roaring Fork Valley near Aspen, Colorado. Bikes and helmets included.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'SportsActivityLocation',
          name: 'Guided Trail Hiking — Aspen & Elk Mountains, CO',
          description:
            'Guided hiking in the Elk Mountains and Roaring Fork Valley near Aspen, Colorado. Half-day and full-day options available for all fitness levels.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'SportsActivityLocation',
          name: 'Elevated Camping — Roaring Fork Valley, CO',
          description:
            'Premium guided camping experiences with curated gear and gourmet food in the Colorado wilderness near Aspen.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'TouristAttraction',
          name: 'Scenic Escalade Tours — Aspen & Roaring Fork Valley, CO',
          description:
            'Private scenic tours of Aspen and the Roaring Fork Valley in a luxury Escalade with a knowledgeable local guide.',
        },
      },
    ],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a guided fly fishing trip in Aspen cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Guided fly fishing trips with Rich Valley Adventures in Aspen, Colorado typically range from $150–$350 per person depending on trip duration (half-day or full-day) and group size. All gear, licenses, and instruction are included. Contact us at 970-456-3666 for current pricing and availability.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is included in a Rich Valley Adventures guided trip?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "All Rich Valley Adventures trips include expert local guides, all necessary gear and equipment, safety briefings, and transportation to the activity location. For fly fishing, this includes rods, reels, waders, boots, and all flies. For mountain biking, bikes and helmets are provided. Groups are kept intentionally small — typically 2–6 guests per guide — for a personalized, high-quality experience.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best time of year for fly fishing in the Roaring Fork Valley?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The best fly fishing in the Roaring Fork Valley near Aspen is typically from late spring through fall (May–October). Peak season runs July through September when the river is lower and clearer. Spring runoff (April–June) can make the river high and murky. Winter fishing is possible on certain Gold Medal stretches but requires specialized cold-water gear.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need experience for paddle boarding in Aspen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No prior experience is needed for paddle boarding with Rich Valley Adventures. Our certified guides provide complete instruction for beginners, and we select calm, beginner-friendly waters for first-time paddlers. More experienced guests can explore more challenging routes. All ages and fitness levels are welcome.',
      },
    },
    {
      '@type': 'Question',
      name: 'How small are the guided adventure groups at Rich Valley Adventures?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Rich Valley Adventures intentionally keeps groups small — typically 2 to 6 guests per guide. We do not run large, impersonal group tours. Private and semi-private bookings are available for families, couples, and corporate groups. This small-group approach is central to the quality and personalization of each adventure.",
      },
    },
    {
      '@type': 'Question',
      name: 'What outdoor adventures are available near Aspen in summer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rich Valley Adventures offers guided outdoor experiences near Aspen in summer: guided fly fishing on the Roaring Fork River, stand-up paddle boarding on mountain lakes, mountain biking on singletrack trails, guided trail hiking in the Elk Mountains, scenic private Escalade tours, and elevated camping. All are available May through October.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Rich Valley Adventures located and what areas do you serve?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rich Valley Adventures is based in Aspen, Colorado (81611) and operates guided outdoor adventures throughout the Roaring Fork Valley, including Aspen, Snowmass Village, Basalt, and Carbondale. The company was founded in 2012 by local outdoor professionals who grew up in the valley.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is fly fishing legal on the Roaring Fork River near Aspen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. The Roaring Fork River and many of its tributaries near Aspen are designated Gold Medal trout waters and are open to fly fishing with a valid Colorado fishing license. Rich Valley Adventures handles all licensing requirements as part of guided trips — guests do not need to obtain a license separately.",
      },
    },
  ],
}

export default function RVALayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://lirp.cdn-website.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  )
}
