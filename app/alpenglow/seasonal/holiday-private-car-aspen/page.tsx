import type { Metadata } from 'next'
import AalGuidePage from '@/components/alpenglow/AalGuidePage'
import { AAL_OG_IMAGE } from '@/lib/aal-vehicles'

const path = '/seasonal/holiday-private-car-aspen'
const title = 'Christmas & Holiday Private Car Service in Aspen'
const description =
  "Private chauffeurs for Aspen's holiday weeks: airport arrivals, dinners, church, and ski days. Book early; holiday rates may apply."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `https://aspenalpenglowlimousine.com${path}` },
  openGraph: { title, description, url: `https://aspenalpenglowlimousine.com${path}`, type: 'website', images: [AAL_OG_IMAGE] },
}

export default function HolidayPrivateCarPage() {
  return (
    <AalGuidePage
      path={path}
      eyebrow="Holiday weeks"
      title={title}
      lede="Private chauffeurs for Aspen's holiday weeks: airport arrivals, dinners, church, and ski days. Book early. Holiday pricing may change seasonally. This page does not list a separate holiday rate or a holiday minimum."
      sections={[
        {
          heading: 'What holiday rides cover',
          paragraphs: [
            'The same private fleet runs through Christmas week and New Year\'s Eve: SUVs seat 7 and the Ford Transit passenger van seats 13. No shared rides are offered. Child car seats and boosters are free. Pets are welcome, with a cleaning fee.',
            'Airport one-way rates that stay published outside any seasonal change are Eagle $720, Denver $1,375, Grand Junction $950, and Rifle $720. If a holiday rate differs, it is quoted when you book.',
          ],
        },
        {
          heading: 'Notice and accounts',
          paragraphs: [
            "General cancellations need 24 hours' notice. Flight diversions to Denver or Grand Junction are handled with 2 hours' notice and no Aspen cancellation penalty. Corporate charge accounts are billed monthly.",
          ],
        },
      ]}
      faqs={[
        {
          question: 'Do holiday weeks use a different rate?',
          answer: 'Holiday pricing may change seasonally. Book early and ask for the quote that applies to your dates. No holiday minimum is published on this page.',
        },
        {
          question: 'What can a holiday private car be used for?',
          answer: "Airport arrivals, dinners, church, and ski days in Aspen and Snowmass. New Year's Eve uses the same private cars.",
        },
        {
          question: 'How far ahead do cancellations need to be made?',
          answer: "General cancellations need 24 hours' notice.",
        },
        {
          question: 'How many people fit?',
          answer: 'SUVs seat 7. The Ford Transit passenger van seats 13. No shared rides are offered.',
        },
        {
          question: 'Which airport rates are published?',
          answer: 'One-way each way: Eagle $720, Denver $1,375, Grand Junction $950, Rifle $720, unless a seasonal holiday quote replaces them for your dates.',
        },
      ]}
      links={[
        { href: '/events/new-years-eve-aspen', label: "New Year's Eve private car service" },
        { href: '/blog/new-years-eve-aspen-private-car', label: "New Year's Eve 2026 planning guide" },
        { href: '/ski-resort-transfers', label: 'Ski resort transfers' },
        { href: '/airport-transfers', label: 'Airport transfers' },
        { href: '/pricing', label: 'Published rates' },
        { href: '/reservations', label: 'Book a ride' },
      ]}
    />
  )
}
