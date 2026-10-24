import type { Metadata } from 'next'
import AalGuidePage from '@/components/alpenglow/AalGuidePage'
import { AAL_OG_IMAGE } from '@/lib/aal-vehicles'

const path = '/airport-transfers/denver-den-to-aspen'
const title = 'Denver Airport (DEN) to Aspen Private Car | $1,375'
const description =
  'DEN→Aspen door to door in a private Suburban, $1,375 all-inclusive. About 4 hrs via I-70. Winter-ready drivers, Starlink WiFi.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `https://aspenalpenglowlimousine.com${path}` },
  openGraph: { title, description, url: `https://aspenalpenglowlimousine.com${path}`, type: 'website', images: [AAL_OG_IMAGE] },
}

export default function DenverAirportTransferPage() {
  return (
    <AalGuidePage
      path={path}
      eyebrow="Denver International Airport"
      title={title}
      lede="Private door-to-door service from Denver Airport (DEN) to Aspen is $1,375 each way. Aspen to Denver is the same $1,375. Holiday pricing may change seasonally."
      facts={['$1,375 each way', 'About 3.5–4 hours', 'I-70', 'SUV up to 7 · Transit up to 13']}
      sections={[
        {
          heading: 'The Denver to Aspen ride',
          paragraphs: [
            'The drive uses I-70. Public driving estimates put Denver International Airport about 3.5–4 hours from Aspen, depending on weather and traffic. This is a private SUV or Ford Transit passenger van, not a shared shuttle.',
            'SUVs seat 7. The Ford Transit passenger van seats 13. The published one-way rate is $1,375 in a private SUV. A Ford Transit passenger van is available for larger groups. Holiday pricing may change seasonally.',
            'Starlink, ski racks, and roof cargo space are on the vehicles. Drivers are 8 full-time locals who have been driving these mountain roads since 2012. Child car seats and boosters are free. Pets are welcome, with a cleaning fee. No shared rides are offered.',
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
          question: 'How much is a private car from Denver Airport to Aspen?',
          answer: 'Denver (DEN) to Aspen is $1,375 each way. Aspen to Denver is $1,375. Holiday pricing may change seasonally.',
        },
        {
          question: 'How long does DEN to Aspen take?',
          answer: 'Public driving estimates put the I-70 drive at about 3.5–4 hours, depending on weather and your Aspen address.',
        },
        {
          question: 'Is the Denver rate all-inclusive?',
          answer: 'Yes. The published one-way rate is $1,375 in a private SUV. A Ford Transit passenger van is available for larger groups.',
        },
        {
          question: 'Do you have WiFi on the Denver drive?',
          answer: 'Yes. Vehicles have Starlink, ski racks, and roof cargo space.',
        },
        {
          question: 'What if the flight is diverted to Denver?',
          answer: "Diversions to Denver or Grand Junction are handled with 2 hours' notice and no Aspen cancellation penalty.",
        },
      ]}
      links={[
        { href: '/airport-transfers', label: 'All airport transfers' },
        { href: '/airport-transfers/eagle-ege-to-aspen', label: 'Eagle Airport (EGE) to Aspen — request a quote' },
        { href: '/service-areas/denver', label: 'Denver service area' },
        { href: '/aspen-airport-closure-2027', label: 'Aspen Airport closure in 2027' },
        { href: '/pricing', label: 'Published rates' },
        { href: '/blog/aspen-to-denver-luxury-car-service', label: 'Aspen to Denver drive guide' },
      ]}
    />
  )
}
