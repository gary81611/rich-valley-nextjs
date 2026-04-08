import type { Metadata } from 'next'
import RVANav from '@/components/rva/RVANav'
import RVAFooter from '@/components/rva/RVAFooter'

const RVA_URL = 'https://www.richvalleyadventures.com'
const RVA_OG_IMAGE = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80'

export const metadata: Metadata = {
  metadataBase: new URL(RVA_URL),
  title: 'Rich Valley Adventures | Guided Outdoor Experiences in Aspen, CO',
  description:
    'Rich Valley Adventures offers expert-guided fly fishing, hiking, mountain biking, and elevated camping in Aspen, Colorado. Small groups, all gear included. Book your Roaring Fork Valley adventure today.',
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
    description:
      'Expert-guided fly fishing, hiking, mountain biking, and elevated camping in Aspen and the Roaring Fork Valley. Small groups, all gear included.',
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
    description:
      'Expert-guided fly fishing, hiking, mountain biking, and elevated camping in Aspen and the Roaring Fork Valley.',
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

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${RVA_URL}/#website`,
  url: RVA_URL,
  name: 'Rich Valley Adventures',
  inLanguage: 'en-US',
  description:
    'Expert-guided fly fishing, hiking, mountain biking, paddle boarding, and elevated camping in Aspen, Colorado and the Roaring Fork Valley.',
  publisher: { '@id': `${RVA_URL}/#business` },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'TouristInformationCenter'],
  '@id': `${RVA_URL}/#business`,
  name: 'Rich Valley Adventures',
  description:
    'Expert-guided fly fishing, hiking, mountain biking, paddle boarding, hunting, and elevated camping in Aspen, Colorado and the Roaring Fork Valley since 2012.',
  url: RVA_URL,
  telephone: '+19704563666',
  email: 'kit@richvalleyadventures.com',
  priceRange: '$$$$',
  image: RVA_OG_IMAGE,
  logo: {
    '@type': 'ImageObject',
    url: RVA_OG_IMAGE,
    width: 1200,
    height: 630,
  },
  foundingDate: '2012',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '',
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
      opens: '00:00',
      closes: '23:59',
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
    'https://aspenalpenglowlimousine.com',
  ],
  parentOrganization: {
    '@type': 'Organization',
    name: 'Rich Valley Adventures & Aspen Alpenglow Limousine',
    url: 'https://www.richvalleyadventures.com',
  },
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
          name: 'Chauffeur Guided Tours and Excursions — Aspen & Roaring Fork Valley, CO',
          description:
            'Private scenic tours of Aspen and the Roaring Fork Valley on Chauffeur Guided Tours and Excursions with a knowledgeable local guide and luxury vehicle.',
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
        text: 'Rich Valley Adventures offers guided outdoor experiences near Aspen in summer: guided fly fishing on the Roaring Fork River, stand-up paddle boarding on mountain lakes, mountain biking on singletrack trails, guided trail hiking in the Elk Mountains, scenic private Chauffeur Guided Tours, and elevated camping. All are available May through October.',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <RVANav />
      <div className="pb-16 md:pb-0">
        {children}
      </div>
      <RVAFooter />
      {/* Sticky Mobile CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex h-14">
          <a href="tel:+19704563666" className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-rva-forest-dark border-r border-gray-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Call Now
          </a>
          <a href="/contact" className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-rva-copper">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Check Availability
          </a>
        </div>
      </div>
    </>
  )
}
