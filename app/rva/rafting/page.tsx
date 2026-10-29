import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/templates/ServicePageTemplate'
import type { ServiceContent } from '@/lib/pages'
import { RVA_RAFTING_PRICE, RVA_TRIP_OWNERSHIP } from '@/lib/rva-confirmed'

export const dynamic = 'force-dynamic'

const pageUrl = 'https://www.richvalleyadventures.com/rafting'

export const metadata: Metadata = {
  title: 'Scenic River Rafting with Picnic | Rich Valley Adventures',
  description:
    'Scenic river rafting with a picnic is $1,200. Rafting is guided in-house by Rich Valley Adventures in the Roaring Fork Valley.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Scenic River Rafting with Picnic | Rich Valley Adventures',
    description: 'Scenic river rafting with a picnic is $1,200. Rafting is guided in-house.',
    type: 'website',
    url: pageUrl,
  },
}

export default function RaftingPage() {
  const content: ServiceContent = {
    hero_title: 'Scenic River Rafting',
    hero_subtitle: 'Picnic on the river. Guided in-house.',
    intro: `${RVA_RAFTING_PRICE}. Rafting is guided in-house. ${RVA_TRIP_OWNERSHIP}`,
    lead: {
      heading: 'Published price',
      paragraphs: ['Scenic river rafting with a picnic is $1,200. Call 970-456-3666 to plan the day.'],
      facts: [{ label: 'Scenic river rafting with picnic', value: '$1,200' }],
    },
    cta_text: 'Check availability',
  }

  return (
    <>
      <div className="h-[86px]" />
      <ServicePageTemplate site="rva" title="Scenic River Rafting" content={content} bookingHref="/contact" />
    </>
  )
}
