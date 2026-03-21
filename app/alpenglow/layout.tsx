import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aspen Alpenglow Limousine | Luxury Transportation in Aspen, CO',
  description: 'Premium private car and limousine service in Aspen, Snowmass, and the Roaring Fork Valley. Airport transfers, hourly charter, corporate travel, wedding transportation. Available 24/7.',
  keywords: 'Aspen limo service, Aspen airport transfer, luxury car service Aspen, private chauffeur Aspen Colorado, wedding limo Aspen',
  openGraph: {
    title: 'Aspen Alpenglow Limousine | Luxury Transportation',
    description: 'Distinguished private car and limousine service throughout Aspen and the Roaring Fork Valley. Since 2012.',
    type: 'website', locale: 'en_US',
  },
}

export default function AlpenglowLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
