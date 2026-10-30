import type { Metadata } from 'next'
import AalGuidePage from '@/components/alpenglow/AalGuidePage'
import { AAL_OG_IMAGE } from '@/lib/aal-vehicles'

const path = '/airport-transfers/aspen-to-denver-den'
const h1 = 'Aspen to Denver Airport (DEN)'
const title = 'Aspen to Denver Airport (DEN) Private Car | $1,375'
const description =
  'Aspen→DEN door to door in a private Suburban, $1,375 all-inclusive. The 13-passenger Ford Transit is $1,600. About 4 hrs via I-70.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `https://aspenalpenglowlimousine.com${path}` },
  openGraph: {
    title,
    description,
    url: `https://aspenalpenglowlimousine.com${path}`,
    type: 'website',
    images: [AAL_OG_IMAGE],
  },
}

export default function AspenToDenverAirportPage() {
  return (
    <AalGuidePage
      path={path}
      eyebrow="Denver International Airport"
      title={h1}
      lede="Published one-way rates are $1,375 for the Suburban and $1,600 for the 13-passenger Ford Transit. Holiday pricing may change seasonally."
      facts={['SUV $1,375', 'Transit $1,600', 'About 3.5–4 hours', 'I-70', 'SUV up to 7 · Transit up to 13']}
      sections={[
        {
          heading: 'The Aspen to Denver ride',
          paragraphs: [
            'Private door-to-door service from Aspen to Denver Airport (DEN), and Denver to Aspen at the same published rates. The drive uses I-70. Public driving estimates put Aspen about 3.5–4 hours from Denver International Airport, depending on weather and traffic. This is a private SUV or Ford Transit Passenger Van, not a shared shuttle.',
            'SUVs seat 7. The Ford Transit Passenger Van seats 13.',
            'Starlink, ski racks, and roof cargo space are on the vehicles. Child car seats and boosters are free. Pets are welcome, with a cleaning fee. No shared rides are offered.',
          ],
        },
        {
          heading: 'Other Front Range airports',
          paragraphs: [
            'Centennial Airport (KAPA) is listed on the pricing page at $1,475. Private FBO airport service also includes Eagle, Rifle, Grand Junction, Buena Vista, Montrose, and Gunnison.',
          ],
        },
        {
          heading: 'If your Aspen flight changes',
          paragraphs: [
            "Flight diversions to Denver or Grand Junction are handled with 2 hours' notice and no Aspen cancellation penalty. General cancellations need 24 hours' notice.",
          ],
        },
      ]}
      faqs={[
        {
          question: 'How much is a private car from Aspen to Denver Airport?',
          answer:
            'Aspen to Denver (DEN) is $1,375 each way in a private SUV. Denver to Aspen is $1,375. The 13-passenger Ford Transit is $1,600 each way. Holiday pricing may change seasonally.',
        },
        {
          question: 'How long does Aspen to DEN take?',
          answer:
            'Public driving estimates put the I-70 drive at about 3.5–4 hours, depending on weather and your Aspen address.',
        },
        {
          question: 'Is the Denver rate all-inclusive?',
          answer:
            'Yes. The published one-way SUV rate is $1,375. The 13-passenger Ford Transit is $1,600 each way.',
        },
        {
          question: 'Do you offer shared rides?',
          answer: 'No shared rides are offered.',
        },
      ]}
      links={[
        { href: '/airport-transfers', label: 'All airport transfers' },
        { href: '/airport-transfers/denver-den-to-aspen', label: 'Denver Airport (DEN) to Aspen — $1,375' },
        { href: '/airport-transfers/aspen-to-eagle-ege', label: 'Aspen to Eagle Airport (EGE) — SUV $720' },
        { href: '/pricing', label: 'Published rates' },
        { href: '/reservations', label: 'Book a ride' },
      ]}
    />
  )
}
