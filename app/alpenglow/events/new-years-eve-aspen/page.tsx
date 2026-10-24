import type { Metadata } from 'next'
import AalGuidePage from '@/components/alpenglow/AalGuidePage'
import { AAL_OG_IMAGE } from '@/lib/aal-vehicles'

const path = '/events/new-years-eve-aspen'
const title = "New Year's Eve Private Car Service in Aspen"
const description =
  "Private SUV and Ford Transit van rides for New Year's Eve 2026 in Aspen. Holiday pricing may change seasonally. Cancellations need 24 hours' notice."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `https://aspenalpenglowlimousine.com${path}` },
  openGraph: { title, description, url: `https://aspenalpenglowlimousine.com${path}`, type: 'website', images: [AAL_OG_IMAGE] },
}

export default function NewYearsEveCarPage() {
  return (
    <AalGuidePage
      path={path}
      eyebrow="New Year's Eve 2026"
      title={title}
      lede="Private car service for New Year's Eve 2026 in Aspen. SUVs seat 7 and the Ford Transit passenger van seats 13, so a group can stay in one car from dinner through the ride home. Holiday pricing may change seasonally. This page does not add an event list beyond the planning guide."
      sections={[
        {
          heading: 'A private car for the night',
          paragraphs: [
            "No shared rides are offered. Child car seats and boosters are free. Pets are welcome, with a cleaning fee. Vehicles have Starlink, ski racks, and roof cargo space.",
            "General cancellations need 24 hours' notice. Call 970-456-3666 to book. The editorial planning guide covers the evening; this page is the ride.",
          ],
        },
        {
          heading: 'Cloud Nine is on Aspen Highlands',
          paragraphs: [
            'Cloud Nine Alpine Bistro is on Aspen Highlands, not Aspen Mountain. If a reservation is part of your night, the private car can handle the lodging pickup and the return.',
          ],
        },
      ]}
      faqs={[
        {
          question: "Is there a published New Year's Eve rate?",
          answer: 'Holiday pricing may change seasonally. Ask for the quote for your New Year\'s Eve 2026 pickup. No holiday minimum is published here.',
        },
        {
          question: 'Can a group of more than seven ride together?',
          answer: 'Yes. The Ford Transit passenger van seats 13. SUVs seat 7.',
        },
        {
          question: 'Where is Cloud Nine Alpine Bistro?',
          answer: 'Cloud Nine Alpine Bistro is on Aspen Highlands.',
        },
        {
          question: 'How much notice is required to cancel?',
          answer: "General cancellations need 24 hours' notice.",
        },
        {
          question: 'Where is the evening planning guide?',
          answer: "The article is at /blog/new-years-eve-aspen-private-car. It is framed for New Year's Eve 2026.",
        },
      ]}
      links={[
        { href: '/blog/new-years-eve-aspen-private-car', label: "New Year's Eve 2026 planning guide" },
        { href: '/seasonal/holiday-private-car-aspen', label: 'Christmas and holiday private car' },
        { href: '/ski-resort-transfers', label: 'Ski resort transfers' },
        { href: '/pricing', label: 'Published rates' },
        { href: '/reservations', label: 'Book a ride' },
      ]}
    />
  )
}
