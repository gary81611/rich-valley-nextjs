import type { Metadata } from 'next'
import GuideCard from '@/components/rva/GuideCard'
import RvaButton, { RVA_BOOKING_LABEL } from '@/components/rva/Button'
import { getActiveGuides } from '@/lib/rva-guides'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Our Guides | Rich Valley Adventures — Expert Local Guides in Aspen',
  description:
    'Meet the Rich Valley Adventures guide team: fly fishing, hiking, and outdoor adventures in the Roaring Fork Valley.',
  alternates: { canonical: 'https://www.richvalleyadventures.com/guides' },
  openGraph: {
    description:
      'Meet the Rich Valley Adventures guide team: fly fishing, hiking, and outdoor adventures in the Roaring Fork Valley.',
  },
}

export default async function GuidesPage() {
  const guides = await getActiveGuides()

  return (
    <div className="min-h-screen bg-rva-cream font-inter">
      <div className="bg-rva-forest-dark pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-rva-copper-light text-sm font-semibold uppercase tracking-[0.2em] mb-3">Our Team</p>
          <h1 className="font-playfair text-4xl md:text-5xl text-white font-light mb-4">Meet Your Guides</h1>
          <p className="text-white/60">Local experts. Passionate about the outdoors.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {guides.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-rva-forest/80 text-lg">Our guide profiles are being updated. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((g) => (
              <GuideCard key={g.id} guide={g} />
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-rva-forest/80 mb-6">
            All transportation provided by{' '}
            <a href="https://aspenalpenglowlimousine.com" target="_blank" rel="noopener noreferrer" className="text-rva-copper-700 underline underline-offset-2 hover:text-rva-forest">
              Aspen Alpenglow Limousine
            </a>
          </p>
          <RvaButton href="/contact" size="lg">
            {RVA_BOOKING_LABEL}
          </RvaButton>
        </div>
      </div>

      {guides.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              guides.map((g) => {
                const person: Record<string, unknown> = {
                  '@context': 'https://schema.org',
                  '@type': 'Person',
                  name: g.name,
                  worksFor: {
                    '@type': 'Organization',
                    name: 'Rich Valley Adventures',
                    url: 'https://www.richvalleyadventures.com',
                  },
                }
                if (g.title) person.jobTitle = g.title
                return person
              }),
            ),
          }}
        />
      )}
    </div>
  )
}
