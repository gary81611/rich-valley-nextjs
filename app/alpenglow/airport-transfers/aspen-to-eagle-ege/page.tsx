import type { Metadata } from 'next'
import AalGuidePage from '@/components/alpenglow/AalGuidePage'
import { AAL_OG_IMAGE } from '@/lib/aal-vehicles'

const path = '/airport-transfers/aspen-to-eagle-ege'
const title = 'Aspen to Eagle Airport (EGE) Private Car | $720'
const description =
  'Aspen or Snowmass to EGE in Gypsum in a private Suburban, $720 one way. The 13-passenger Ford Transit is $1,200. About 1.5–2 hrs.'

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

export default function AspenToEagleAirportPage() {
  return (
    <AalGuidePage
      path={path}
      eyebrow="Eagle County Regional Airport · Gypsum"
      title={title}
      lede="Private one-way car service from Aspen or Snowmass to Eagle County Regional Airport (EGE) in Gypsum is $720 in a Suburban. Eagle back to Aspen is $720. The 13-passenger Ford Transit is $1,200 each way. Holiday pricing may change seasonally."
      facts={['SUV $720', 'Transit $1,200', 'About 68–70 miles', 'About 1.5 hours', 'EGE is in Gypsum']}
      sections={[
        {
          heading: 'The drive',
          paragraphs: [
            'Eagle County Regional Airport (EGE) is in Gypsum, about 68–70 miles from Aspen, roughly 1.5 hours in ordinary conditions. Winter weather can change the timing. This is a private ride, not a shared shuttle.',
            'SUVs seat 7. The Ford Transit Passenger Van seats 13. No shared rides are offered.',
          ],
        },
        {
          heading: 'What a booked Eagle ride includes',
          paragraphs: [
            'The Eagle one-way SUV rate is $720. The 13-passenger Ford Transit is $1,200 each way. Holiday pricing may change seasonally.',
            'Child car seats and boosters are free. Pets are welcome, with a cleaning fee. Vehicles have Starlink, ski racks, and roof cargo space.',
          ],
        },
        {
          heading: 'FBO drop-offs at Eagle',
          paragraphs: [
            'Private FBO airport service includes Eagle, Rifle, Grand Junction, Buena Vista, Montrose, and Gunnison. Tell us the FBO and tail number when you book an Eagle drop-off.',
          ],
        },
      ]}
      faqs={[
        {
          question: 'How much is a private car from Aspen to Eagle Airport?',
          answer:
            'Aspen to Eagle (EGE) in Gypsum is $720 each way in a private SUV, and $720 from Eagle back to Aspen. The 13-passenger Ford Transit is $1,200 each way. Holiday pricing may change seasonally.',
        },
        {
          question: 'How long is the Aspen to Eagle drive?',
          answer:
            'Eagle County Regional Airport is in Gypsum, about 68–70 miles from Aspen, roughly 1.5 hours in ordinary conditions. Winter weather can change the timing.',
        },
        {
          question: 'Do you offer shared rides?',
          answer: 'No shared rides are offered.',
        },
        {
          question: 'What is your PUC permit?',
          answer: 'CO PUC permit LL-04725.',
        },
      ]}
      links={[
        { href: '/airport-transfers', label: 'All airport transfers' },
        { href: '/airport-transfers/eagle-ege-to-aspen', label: 'Eagle Airport (EGE) to Aspen — SUV $720' },
        { href: '/airport-transfers/aspen-to-denver-den', label: 'Aspen to Denver Airport (DEN) — $1,375' },
        { href: '/pricing', label: 'Published rates' },
        { href: '/reservations', label: 'Book a ride' },
      ]}
    />
  )
}
