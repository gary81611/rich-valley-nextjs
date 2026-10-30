import type { Metadata } from 'next'
import ServicePageTemplate from '@/components/templates/ServicePageTemplate'
import type { ServiceContent } from '@/lib/pages'
import { RVA_RAFTING_PRICE, RVA_TRIP_OWNERSHIP } from '@/lib/rva-confirmed'

export const dynamic = 'force-dynamic'

const pageUrl = 'https://www.richvalleyadventures.com/rafting'
const ogImage = {
  url: 'https://www.richvalleyadventures.com/images/og/rva-rafting-drift-boat-launch.webp',
  width: 1200,
  height: 630,
  alt: 'Drift boat launch on a Colorado river with Rich Valley Adventures',
}

export const metadata: Metadata = {
  title: 'Aspen Rafting Trips | Scenic River Rafting with Picnic | Rich Valley Adventures',
  description:
    'Scenic river rafting with a picnic is $1,200. Guided in-house by Rich Valley Adventures in the Roaring Fork Valley. Since 2012.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Aspen Rafting Trips | Scenic River Rafting with Picnic | Rich Valley Adventures',
    description: 'Scenic river rafting with a picnic is $1,200. Guided in-house by Rich Valley Adventures.',
    type: 'website',
    url: pageUrl,
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aspen Rafting Trips | Scenic River Rafting with Picnic | Rich Valley Adventures',
    images: [ogImage.url],
  },
}

export default function RaftingPage() {
  const content: ServiceContent = {
    hero_title: 'Aspen Scenic River Rafting',
    hero_subtitle: 'Picnic on the river. Guided in-house.',
    intro:
      'Rich Valley Adventures guides scenic river rafting in-house in the Roaring Fork Valley. Scenic river rafting with a picnic is $1,200. Call 970-456-3666 to plan the day. Guides run fishing, hiking, rafting, and camping in-house.',
    lead: {
      heading: 'Published price',
      paragraphs: [
        'Scenic river rafting with a picnic is $1,200. Call 970-456-3666 to plan the day.',
        RVA_TRIP_OWNERSHIP,
      ],
      facts: [{ label: 'Scenic river rafting with picnic', value: '$1,200' }],
    },
    faqs: [
      {
        question: 'Do you guide rafting yourselves?',
        answer: 'Yes. Rafting is guided in-house by Rich Valley Adventures.',
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
        heroImage="/images/og/rva-rafting-drift-boat-launch.webp"
        heroImageAlt="Drift boat launch on a Colorado river with Rich Valley Adventures"
        relatedLinks={[
          { href: '/fly-fishing', label: 'Aspen fly fishing guides' },
          { href: '/adventures/scenic-wildlife-tours', label: 'Scenic and wildlife tours' },
          { href: '/conditions', label: 'River and fishing conditions' },
        ]}
      />
    </>
  )
}
