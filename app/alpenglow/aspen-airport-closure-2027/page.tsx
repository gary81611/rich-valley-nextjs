import type { Metadata } from 'next'
import AalGuidePage from '@/components/alpenglow/AalGuidePage'
import { AAL_OG_IMAGE } from '@/lib/aal-vehicles'

const path = '/aspen-airport-closure-2027'
const title = 'Aspen Airport Closure 2027 | Private Car Alternatives'
const description =
  'ASE closes April 4, 2027 at 11:00 p.m. through November 19, 2027 at 7:00 p.m. Eagle and Rifle SUV $720, Grand Junction $950, Denver $1,375. Transit van: Eagle or Rifle $1,200, Denver $1,600.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `https://aspenalpenglowlimousine.com${path}` },
  openGraph: { title, description, url: `https://aspenalpenglowlimousine.com${path}`, type: 'website', images: [AAL_OG_IMAGE] },
}

export default function AspenAirportClosurePage() {
  return (
    <AalGuidePage
      path={path}
      eyebrow="Aspen/Pitkin County Airport"
      title={title}
      lede="Aspen/Pitkin County Airport (ASE) closes Sunday, April 4, 2027 at 11:00 p.m. through Friday, November 19, 2027 at 7:00 p.m. for runway reconstruction. There are no commercial or general aviation operations during the closure. Check aspenairport.com for updates before you travel."
      source={{ href: 'https://www.aspenairport.com/closure/', label: 'Aspen/Pitkin County Airport closure (press release May 28, 2026)' }}
      sections={[
        {
          heading: 'What the airport has said',
          paragraphs: [
            'The closure dates and times above are from the Aspen/Pitkin County Airport closure page, in a press release dated May 28, 2026. After reopening, the existing terminal remains in use until the new terminal is completed (projected 2029).',
            'This page repeats those published facts. It is not an airport operations notice. Check https://www.aspenairport.com/closure/ for updates.',
          ],
        },
        {
          heading: 'Alternate airports and one-way rates',
          paragraphs: [
            'Published one-way SUV rates each way while you are using another airport: Eagle (EGE, in Gypsum) $720, Rifle $720, Grand Junction $950, Denver (DEN) $1,375. The 13-passenger Ford Transit is $1,200 from Eagle or Rifle and $1,600 from Denver. Holiday pricing may change seasonally.',
          ],
          bullets: [
            'Eagle (EGE, Gypsum) — SUV $720, Transit $1,200',
            'Rifle — $720 each way',
            'Grand Junction — $950 each way',
            'Denver (DEN) — $1,375 each way',
          ],
        },
        {
          heading: 'Private FBO service',
          paragraphs: [
            'Private FBO airport service includes Eagle, Rifle, Grand Junction, Buena Vista, Montrose, and Gunnison. Rifle, Grand Junction, and Denver have a published one-way price. Eagle, Buena Vista, Montrose, and Gunnison are quoted when you book. Call 970-456-3666.',
          ],
        },
        {
          heading: 'Diversions and cancellations',
          paragraphs: [
            "Flight diversions to Denver or Grand Junction are handled with 2 hours' notice and no Aspen cancellation penalty. General cancellations need 24 hours' notice.",
            'SUVs seat 7. The Ford Transit passenger van seats 13. No shared rides are offered.',
          ],
        },
      ]}
      faqs={[
        {
          question: 'When does Aspen Airport close in 2027?',
          answer:
            'Sunday, April 4, 2027 at 11:00 p.m. through Friday, November 19, 2027 at 7:00 p.m., for runway reconstruction. Source: https://www.aspenairport.com/closure/ (press release May 28, 2026).',
        },
        {
          question: 'Can commercial or private planes use ASE during the closure?',
          answer: 'No. There are no commercial or general aviation operations during the closure.',
        },
        {
          question: 'Which alternate airports have published one-way rates?',
          answer: 'SUV each way: Eagle $720, Rifle $720, Grand Junction $950, Denver $1,375. The 13-passenger Ford Transit is $1,200 from Eagle or Rifle and $1,600 from Denver. Eagle County Airport is in Gypsum. Holiday pricing may change seasonally.',
        },
        {
          question: 'Where is private FBO service available?',
          answer: 'Eagle, Rifle, Grand Junction, Buena Vista, Montrose, and Gunnison.',
        },
        {
          question: 'What happens if a flight diverts to Denver or Grand Junction?',
          answer: "Diversions to Denver or Grand Junction are handled with 2 hours' notice and no Aspen cancellation penalty.",
        },
        {
          question: 'Does the old terminal stay after the runway reopens?',
          answer: 'The existing terminal remains in use after reopening until the new terminal is completed (projected 2029). Check aspenairport.com for updates.',
        },
      ]}
      links={[
        { href: '/airport-transfers/eagle-ege-to-aspen', label: 'Eagle Airport (EGE) to Aspen — SUV $720' },
        { href: '/airport-transfers/denver-den-to-aspen', label: 'Denver Airport (DEN) to Aspen — $1,375' },
        { href: '/service-areas/rifle', label: 'Rifle airport transfers' },
        { href: '/service-areas/grand-junction', label: 'Grand Junction airport transfers' },
        { href: '/airport-transfers', label: 'All airport transfers' },
        { href: '/pricing', label: 'Published rates' },
      ]}
    />
  )
}
