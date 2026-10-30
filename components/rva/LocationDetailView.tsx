import Link from 'next/link'
import RvaButton from '@/components/rva/Button'
import { isUnconfirmedWinterClaim, scrubUnconfirmedWinterList } from '@/lib/rva-unconfirmed-winter'
import { publicLocationActivities, publicLocationTagline, scrubChauffeurGuidedText } from '@/lib/rva-location-public'

/** Row shape from `locations` table — used by /locations/[slug] and /service-areas/[slug] fallback. */
export type LocationDetailRow = {
  slug: string
  name: string
  tagline: string | null
  description: string | null
  drive_time?: string | null
  faqs?: { q: string; a: string }[] | null
  rivers?: string[] | null
  activities?: string[] | null
  highlights?: string[] | null
}

type Props = {
  loc: LocationDetailRow
  backLink: { href: string; label: string }
}

export default function LocationDetailView({ loc, backLink }: Props) {
  const faqs: { q: string; a: string }[] = (loc.faqs || [])
    .filter((f) => !isUnconfirmedWinterClaim(`${f.q} ${f.a}`))
    .filter((f) => !/chauffeur guided/i.test(`${f.q} ${f.a}`))
    .map((f) => ({
      q: scrubChauffeurGuidedText(f.q) || f.q,
      a: scrubChauffeurGuidedText(f.a) || f.a,
    }))
  const rivers: string[] = loc.rivers || []
  const activities: string[] = publicLocationActivities(loc.slug, loc.activities)
  const highlights: string[] = scrubUnconfirmedWinterList(loc.highlights || [])
  const driveTime: string = loc.drive_time || ''
  const tagline = publicLocationTagline(loc.slug, loc.tagline)
  const description = scrubChauffeurGuidedText(loc.description)

  return (
    <div className="min-h-screen bg-rva-cream font-inter">
      <div className="bg-rva-forest-dark pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <Link href={backLink.href} className="text-rva-copper-700 text-sm hover:underline mb-4 inline-block">
            {backLink.label}
          </Link>
          <h1 className="font-playfair text-4xl md:text-5xl text-white font-light mb-2">{loc.name}</h1>
          <p className="text-white/60 text-lg">{tagline}</p>
          {driveTime && driveTime !== 'Home base' && (
            <p className="text-white/40 text-sm mt-2">{driveTime} from Aspen</p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-lg text-rva-forest/80 leading-relaxed mb-10">{description}</p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl">
            <h2 className="font-playfair text-xl text-rva-forest-dark mb-4">Activities Available</h2>
            <ul className="space-y-2">
              {activities.map((a) => (
                <li key={a} className="flex items-center gap-2 text-sm text-rva-forest/70">
                  <span className="text-rva-copper-700">✓</span> {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl">
            <h2 className="font-playfair text-xl text-rva-forest-dark mb-4">Rivers &amp; Water</h2>
            <ul className="space-y-2">
              {rivers.map((r) => (
                <li key={r} className="flex items-center gap-2 text-sm text-rva-forest/70">
                  <span className="text-rva-copper-700">🎣</span> {r}
                </li>
              ))}
            </ul>
            {highlights.length > 0 && (
              <>
                <h3 className="font-semibold text-rva-forest-dark mt-6 mb-2 text-sm">Highlights</h3>
                <ul className="space-y-1">
                  {highlights.map((h) => (
                    <li key={h} className="text-xs text-rva-forest/80">
                      • {h}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-rva-forest-dark to-rva-forest p-8 rounded-xl mb-12 text-white">
          <h2 className="font-playfair text-xl mb-3">Getting to {loc.name}</h2>
          <p className="text-white/70 text-sm mb-4">
            All transportation provided by our partner{' '}
            <a
              href="https://aspenalpenglowlimousine.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rva-copper-light hover:underline"
            >
              Aspen Alpenglow Limousine
            </a>{' '}
            — vehicles with Starlink, ski racks, and roof cargo space. Door-to-door service included with guided adventures.
          </p>
          <a
            href="https://aspenalpenglowlimousine.com/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-rva-copper-700 hover:underline"
          >
            View transport pricing →
          </a>
        </div>

        {faqs.length > 0 && (
          <div className="mb-12">
            <h2 className="font-playfair text-2xl text-rva-forest-dark mb-6">Frequently Asked Questions</h2>
            {faqs.map((f) => {
              const answer = /\$250/.test(f.a) && /fish/i.test(`${f.q} ${f.a}`)
                ? 'A full-day float trip is from $1,400 for 2 people (1 boat, 1 captain). Additional adults are $375 each and kids are $175. It covers an 8–12 mile stretch of the Roaring Fork or Colorado River. Lunch, gear, and luxury door-to-door transportation are included. A Colorado Parks and Wildlife fishing license is required for ages 16 and up.'
                : f.a
              return (
              <details key={f.q} className="group mb-3 bg-white rounded-lg border border-rva-copper-700/10">
                <summary className="p-4 cursor-pointer font-medium text-rva-forest-dark text-sm">{f.q}</summary>
                <p className="px-4 pb-4 text-sm text-rva-forest/70">{answer}</p>
              </details>
              )
            })}
          </div>
        )}

        <div className="text-center">
          <RvaButton href="/contact">Check availability</RvaButton>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TouristDestination',
            name: `${loc.name} — Rich Valley Adventures`,
            description,
            touristType: activities,
            containedInPlace: { '@type': 'State', name: 'Colorado' },
          }),
        }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
      )}
    </div>
  )
}
