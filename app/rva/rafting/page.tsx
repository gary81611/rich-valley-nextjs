import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/templates/ServicePageTemplate'
import type { ServiceContent } from '@/lib/pages'
import { RVA_TRIP_OWNERSHIP } from '@/lib/rva-confirmed'

export const dynamic = 'force-dynamic'

const pageUrl = 'https://www.richvalleyadventures.com/rafting'
const pageTitle = 'Aspen Scenic River Rafting with Picnic | Rich Valley Adventures'

export const metadata: Metadata = {
  title: pageTitle,
  description:
    'Scenic river rafting with a picnic, guided in-house by Rich Valley Adventures in the Roaring Fork Valley. Since 2012.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: 'Scenic river rafting with a picnic, guided in-house by Rich Valley Adventures.',
    type: 'website',
    url: pageUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
  },
}

export default function RaftingPage() {
  const content: ServiceContent = {
    hero_title: 'Aspen Scenic River Rafting',
    hero_subtitle: 'Picnic on the river. Guided in-house.',
    intro: `Rich Valley Adventures guides scenic river rafting in the Roaring Fork Valley. ${RVA_TRIP_OWNERSHIP} Call 970-456-3666 to plan the day.`,
    lead: {
      heading: 'Published price',
      paragraphs: [],
      facts: [{ label: 'Scenic river rafting with picnic', value: '$1,200' }],
    },
    faqs: [
      {
        question: 'Do you guide rafting yourselves?',
        answer: RVA_TRIP_OWNERSHIP,
      },
      {
        question: 'How much is scenic river rafting?',
        answer: 'Scenic river rafting with a picnic is $1,200.',
      },
      {
        question: 'What licenses do you hold?',
        answer: 'CO Licensed Outfitter OUT.0003060. CO River License 620.',
      },
    ],
    cta_text: 'Check availability',
  }

  return (
    <>
      <div className="h-[var(--rva-header,97px)] md:h-[var(--rva-header,117px)]" aria-hidden />
      <ServicePageTemplate
        site="rva"
        title="Aspen Scenic River Rafting"
        content={content}
        bookingHref="/contact"
        relatedLinks={[
          { href: '/fly-fishing', label: 'Aspen fly fishing guides' },
          { href: '/adventures/scenic-wildlife-tours', label: 'Scenic and wildlife tours' },
          { href: '/conditions', label: 'River and fishing conditions' },
        ]}
      />
    </>
  )
}
