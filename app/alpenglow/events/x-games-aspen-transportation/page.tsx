import type { Metadata } from 'next'
import AalGuidePage from '@/components/alpenglow/AalGuidePage'
import { AAL_OG_IMAGE } from '@/lib/aal-vehicles'

const path = '/events/x-games-aspen-transportation'
const title = 'X Games Aspen 2027 Transportation | Buttermilk Jan 29–31'
const description =
  'Private SUV and group van rides to X Games Aspen at Buttermilk, Jan 29–31, 2027. Skip parking; pickups after night sessions and concerts.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `https://aspenalpenglowlimousine.com${path}` },
  openGraph: { title, description, url: `https://aspenalpenglowlimousine.com${path}`, type: 'website', images: [AAL_OG_IMAGE] },
}

export default function XGamesTransportationPage() {
  return (
    <AalGuidePage
      path={path}
      eyebrow="Buttermilk Mountain"
      title={title}
      lede="X Games Aspen 2027 is January 29–31, 2027 at Buttermilk Mountain. Aspen Alpenglow Limousine runs private SUVs and a 13-passenger Ford Transit van to Buttermilk so your group can skip the parking lot. Pickups can be set after night sessions and concerts. Confirm the session schedule on the X Games event page."
      facts={['January 29–31, 2027', 'Buttermilk Mountain']}
      source={{ href: 'https://www.xgames.com/events/aspen-2027/', label: 'X Games Aspen 2027' }}
      sections={[
        {
          heading: 'Private rides to Buttermilk',
          paragraphs: [
            'Buttermilk is one of the four Aspen Snowmass mountains. Door-to-slope ski transfers already cover Buttermilk, Aspen Mountain, Aspen Highlands, and Snowmass. For X Games week, the same private cars run to Buttermilk.',
            'SUVs seat 7. The Ford Transit passenger van seats 13. No shared rides are offered. Ski racks and roof cargo space are on the vehicles. Child car seats and boosters are free.',
          ],
        },
        {
          heading: 'Hourly charter during the event',
          paragraphs: [
            'Hourly charter is available if you want the car to stay with your group between sessions. Holiday pricing may change seasonally. General cancellations need 24 hours\' notice. Call 970-456-3666 to book.',
          ],
        },
      ]}
      faqs={[
        {
          question: 'When and where are the X Games in Aspen in 2027?',
          answer: 'January 29–31, 2027 at Buttermilk Mountain. Source: https://www.xgames.com/events/aspen-2027/',
        },
        {
          question: 'Can a group ride together to Buttermilk?',
          answer: 'Yes. SUVs seat 7 and the Ford Transit passenger van seats 13. No shared rides are offered.',
        },
        {
          question: 'Do you pick up after night sessions?',
          answer: 'Yes. Pickups can be scheduled after night sessions and concerts. Check the X Games event page for the published times.',
        },
        {
          question: 'Is hourly charter available during X Games?',
          answer: 'Yes. Hourly charter can hold a private SUV or the Ford Transit passenger van for your group. Call 970-456-3666 for the current hourly quote.',
        },
        {
          question: 'What is the cancellation notice?',
          answer: "General cancellations need 24 hours' notice. Holiday pricing may change seasonally.",
        },
      ]}
      links={[
        { href: '/ski-resort-transfers', label: 'Ski resort transfers to all four mountains' },
        { href: '/services/hourly-charter', label: 'Hourly charter' },
        { href: '/seasonal/holiday-private-car-aspen', label: 'Holiday private car service' },
        { href: '/pricing', label: 'Published rates' },
        { href: '/reservations', label: 'Book a ride' },
      ]}
    />
  )
}
