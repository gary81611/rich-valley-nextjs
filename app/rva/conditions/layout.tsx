import type { Metadata } from 'next'

const canonical = 'https://www.richvalleyadventures.com/conditions'

export const metadata: Metadata = {
  title: 'River & Fishing Conditions | Rich Valley Adventures — Aspen, CO',
  description:
    'Current Roaring Fork Valley fishing conditions, river flows, and hatch activity from Rich Valley Adventures — your local Aspen fly fishing guide team.',
  alternates: { canonical },
  openGraph: {
    title: 'River & Fishing Conditions | Rich Valley Adventures',
    description:
      'Current Roaring Fork Valley fishing conditions, river flows, and hatch activity from Rich Valley Adventures.',
    url: canonical,
    siteName: 'Rich Valley Adventures',
    type: 'website',
  },
}

export default function ConditionsLayout({ children }: { children: React.ReactNode }) {
  return children
}
