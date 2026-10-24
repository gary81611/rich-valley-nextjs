import type { Metadata } from 'next'
import AalGuidePage from '@/components/alpenglow/AalGuidePage'
import { AAL_OG_IMAGE } from '@/lib/aal-vehicles'

const path = '/airport-transfers/eagle-ege-to-aspen'
const title = 'Eagle Airport (EGE) to Aspen Private Car | $720 All-In'
const description =
  'EGE→Aspen or Snowmass in a private Suburban, $720 one way all-inclusive. About 1.5–2 hrs. Flight tracking, ski racks, FBO pickups.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `https://aspenalpenglowlimousine.com${path}` },
  openGraph: { title, description, url: `https://aspenalpenglowlimousine.com${path}`, type: 'website', images: [AAL_OG_IMAGE] },
}

export default function EagleAirportTransferPage() {
  return (
    <AalGuidePage
      path={path}
      eyebrow="Eagle County Regional Airport"
      title={title}
      lede="Private one-way car service from Eagle Airport (EGE) to Aspen or Snowmass is $720 each way. The same rate applies from Aspen back to Eagle. Holiday pricing may change seasonally."
      facts={['$720 each way', 'About 68–70 miles', 'About 1.5 hours', 'SUV up to 7 · Transit up to 13']}
      sections={[
        {
          heading: 'The drive',
          paragraphs: [
            'Public driving estimates put Eagle County Regional Airport about 68–70 miles from Aspen, roughly 1.5 hours in ordinary conditions. Winter weather can change the timing. This is a private ride, not a shared shuttle.',
            'SUVs seat 7. The Ford Transit passenger van seats 13. No shared rides are offered.',
          ],
        },
        {
          heading: 'What the $720 rate includes',
          paragraphs: [
            'The published Eagle rate is $720 each way in a private SUV. A Ford Transit passenger van is available for larger groups. Holiday pricing may change seasonally.',
            'Child car seats and boosters are free. Pets are welcome, with a cleaning fee. Vehicles have Starlink, ski racks, and roof cargo space. Drivers are 8 full-time locals with 15+ years of mountain driving.',
          ],
        },
        {
          heading: 'FBO pickups at Eagle',
          paragraphs: [
            'Private FBO airport service includes Eagle, Rifle, Grand Junction, Buena Vista, Montrose, and Gunnison. Tell us the FBO and tail number when you book an Eagle pickup.',
          ],
        },
        {
          heading: 'Changes and cancellations',
          paragraphs: [
            "Flight diversions to Denver or Grand Junction are handled with 2 hours' notice and no Aspen cancellation penalty. General cancellations need 24 hours' notice.",
          ],
        },
      ]}
      faqs={[
        {
          question: 'How much is a private car from Eagle Airport to Aspen?',
          answer: 'Eagle (EGE) to Aspen or Snowmass is $720 one way. Aspen to Eagle is $720. Holiday pricing may change seasonally.',
        },
        {
          question: 'How long is the Eagle to Aspen drive?',
          answer: 'Public driving estimates put Eagle County Regional Airport about 68–70 miles from Aspen, roughly 1.5 hours in ordinary conditions. Winter weather can change the timing.',
        },
        {
          question: 'Are child seats available?',
          answer: 'Yes. Child car seats and boosters are free. Tell us the ages when you book.',
        },
        {
          question: 'Do you pick up at the Eagle FBO?',
          answer: 'Yes. Private FBO service includes Eagle, along with Rifle, Grand Junction, Buena Vista, Montrose, and Gunnison.',
        },
        {
          question: 'What vehicles are available?',
          answer: 'SUVs seat 7. The Ford Transit passenger van seats 13. No shared rides are offered. Child car seats and boosters are free.',
        },
        {
          question: 'What is the cancellation notice?',
          answer: "General cancellations need 24 hours' notice. Diversions to Denver or Grand Junction are handled with 2 hours' notice and no Aspen cancellation penalty.",
        },
      ]}
      links={[
        { href: '/airport-transfers', label: 'All airport transfers' },
        { href: '/airport-transfers/denver-den-to-aspen', label: 'Denver Airport (DEN) to Aspen — $1,375' },
        { href: '/aspen-airport-closure-2027', label: 'Aspen Airport closure in 2027' },
        { href: '/pricing', label: 'Published rates' },
        { href: '/reservations', label: 'Book a ride' },
      ]}
    />
  )
}
