import type { Metadata } from 'next'
import { AAL_OG_IMAGE } from '@/lib/aal-vehicles'

const canonical = 'https://aspenalpenglowlimousine.com/contact'

export const metadata: Metadata = {
  title: 'Contact & Book | Aspen Alpenglow Limousine',
  description:
    'Book luxury private car and airport transportation in Aspen, Snowmass, and the Roaring Fork Valley. Call 970-315-6111 or send a message.',
  alternates: { canonical },
  openGraph: {
    title: 'Contact & Book | Aspen Alpenglow Limousine',
    description:
      'Book private car service, airport transfers, and group transportation in Aspen and the Roaring Fork Valley.',
    url: canonical,
    siteName: 'Aspen Alpenglow Limousine',
    type: 'website',
    images: [AAL_OG_IMAGE],
  },
}

export default function AlpenglowContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
