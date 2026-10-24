import type { Metadata } from 'next'
import RVANav from '@/components/rva/RVANav'
import RVAFooter from '@/components/rva/RVAFooter'
import { rvaData } from '@/lib/site-data'
import './rva-type.css'

const RVA_URL = 'https://www.richvalleyadventures.com'
/** On-site logo, 441×212. Replaces the old Unsplash photo used as the OG and logo fallback. */
const RVA_LOGO = `${RVA_URL}/images/logos/rva-logo.png`
const RVA_LOGO_WIDTH = 441
const RVA_LOGO_HEIGHT = 212

export const metadata: Metadata = {
  metadataBase: new URL(RVA_URL),
  title: 'Rich Valley Adventures | Guided Outdoor Experiences in Aspen, CO',
  description:
    'Rich Valley Adventures offers expert-guided fly fishing, hiking, mountain biking, and elevated camping in Aspen, Colorado. Small groups, all gear included. Book your Roaring Fork Valley adventure today.',
  keywords: 'Aspen guided adventures, fly fishing Aspen Colorado, paddle boarding Roaring Fork River, mountain biking Aspen, outdoor guide Aspen Colorado, guided hiking Aspen, adventure tours Roaring Fork Valley, Aspen outdoor activities',
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
        url: RVA_LOGO,
        width: RVA_LOGO_WIDTH,
        height: RVA_LOGO_HEIGHT,
        alt: 'Rich Valley Adventures logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rich Valley Adventures | Guided Outdoor Experiences in Aspen, CO',
    description:
      'Expert-guided fly fishing, hiking, mountain biking, and elevated camping in Aspen and the Roaring Fork Valley.',
    images: [RVA_LOGO],
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
    'Expert-guided fly fishing, hiking, mountain biking, and elevated camping in Aspen, Colorado and the Roaring Fork Valley. Paddleboarding is a rental from $100.',
  publisher: { '@id': `${RVA_URL}/#business` },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'TouristInformationCenter'],
  '@id': `${RVA_URL}/#business`,
  name: 'Rich Valley Adventures',
  description:
    'Expert-guided fly fishing, hiking, mountain biking, paddleboard rentals, hunting from $250 per person, and elevated camping in Aspen, Colorado and the Roaring Fork Valley since 2012.',
  url: RVA_URL,
  telephone: '+19704563666',
  email: 'kit@richvalleyadventures.com',
  priceRange: '$$$$',
  image: RVA_LOGO,
  logo: {
    '@type': 'ImageObject',
    url: RVA_LOGO,
    width: RVA_LOGO_WIDTH,
    height: RVA_LOGO_HEIGHT,
  },
  foundingDate: '2012',
  address: {
    '@type': 'PostalAddress',
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
    rvaData.googleMapsPlaceUrl,
    rvaData.googleReviewUrl,
  ],
  hasMap: rvaData.googleMapsPlaceUrl,
  identifier: {
    '@type': 'PropertyValue',
    name: 'Google Place ID',
    value: rvaData.googlePlaceId,
  },
  brand: {
    '@type': 'Brand',
    name: 'Rich Valley Adventures',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-970-456-3666',
    contactType: 'Reservations',
    email: 'kit@richvalleyadventures.com',
    areaServed: 'US',
    availableLanguage: 'English',
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '07:00',
      closes: '20:00',
    },
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
        price: '800',
        priceCurrency: 'USD',
        url: 'https://www.richvalleyadventures.com/private-ranch-fishing',
        itemOffered: {
          '@type': 'TouristTrip',
          name: 'Private Ranch Fishing at Spring Creek Ranch, Carbondale',
          url: 'https://www.richvalleyadventures.com/private-ranch-fishing',
          description:
            'Private ranch and picnic package at Spring Creek Ranch, Carbondale, CO: from $800 per adult and $250 per child (ages 3+). Ponds, creeks, and a private section of the Roaring Fork River.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'SportsActivityLocation',
          name: 'Paddleboard Rental — Aspen, CO',
          description: 'Paddleboarding is a rental from $100, not a guided trip.',
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
            'Guided hiking in the Elk Mountains and Roaring Fork Valley near Aspen, Colorado. Trail Hiking is 3–6 hours and moderate. The hiking page also lists easier walks and strenuous alpine days.',
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
      <RVANav />
      <div className="rva-site pb-28 md:pb-0">
        {children}
      </div>
      <RVAFooter />
      {/* Sticky mobile bar. Header phone is hidden under md so this is the phone CTA. */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex min-h-14">
          <a href="tel:+19704563666" className="flex-1 flex items-center justify-center gap-2 min-h-11 px-2 text-[15px] font-semibold text-rva-forest-dark border-r border-gray-200 whitespace-nowrap">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Call
          </a>
          <a href="/contact" className="flex-1 flex items-center justify-center gap-2 min-h-11 px-2 text-[15px] font-semibold text-white bg-rva-copper-700 whitespace-nowrap">
            Check availability
          </a>
        </div>
      </div>
    </>
  )
}
