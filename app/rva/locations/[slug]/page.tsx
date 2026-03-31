import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const { data: loc } = await supabase.from('locations').select('*').eq('slug', slug).eq('is_active', true).single()
  if (!loc) return {}
  return {
    title: `${loc.name} Adventures | Rich Valley Adventures — Guided Outdoor Experiences`,
    description: (loc.description || '').slice(0, 160),
    alternates: { canonical: `https://www.richvalleyadventures.com/rva/locations/${slug}` },
  }
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const { data: loc } = await supabase.from('locations').select('*').eq('slug', slug).eq('is_active', true).single()
  if (!loc) notFound()

  const faqs: { q: string; a: string }[] = loc.faqs || []
  const rivers: string[] = loc.rivers || []
  const activities: string[] = loc.activities || []
  const highlights: string[] = loc.highlights || []
  const driveTime: string = loc.drive_time || ''

  return (
    <div className="min-h-screen bg-rva-cream font-inter">
      <div className="bg-rva-forest-dark pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <Link href="/rva/locations" className="text-rva-copper text-sm hover:underline mb-4 inline-block">← All Locations</Link>
          <h1 className="font-playfair text-4xl md:text-5xl text-white font-light mb-2">{loc.name}</h1>
          <p className="text-white/60 text-lg">{loc.tagline}</p>
          {driveTime && driveTime !== 'Home base' && <p className="text-white/40 text-sm mt-2">{driveTime} from Aspen</p>}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-lg text-rva-forest/80 leading-relaxed mb-10">{loc.description}</p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl">
            <h2 className="font-playfair text-xl text-rva-forest-dark mb-4">Activities Available</h2>
            <ul className="space-y-2">
              {activities.map(a => (
                <li key={a} className="flex items-center gap-2 text-sm text-rva-forest/70">
                  <span className="text-rva-copper">✓</span> {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl">
            <h2 className="font-playfair text-xl text-rva-forest-dark mb-4">Rivers &amp; Water</h2>
            <ul className="space-y-2">
              {rivers.map(r => (
                <li key={r} className="flex items-center gap-2 text-sm text-rva-forest/70">
                  <span className="text-rva-copper">🎣</span> {r}
                </li>
              ))}
            </ul>
            <h3 className="font-semibold text-rva-forest-dark mt-6 mb-2 text-sm">Highlights</h3>
            <ul className="space-y-1">
              {highlights.map(h => (
                <li key={h} className="text-xs text-rva-forest/60">• {h}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Transportation cross-promotion */}
        <div className="bg-gradient-to-r from-rva-forest-dark to-rva-forest p-8 rounded-xl mb-12 text-white">
          <h2 className="font-playfair text-xl mb-3">Getting to {loc.name}</h2>
          <p className="text-white/70 text-sm mb-4">
            All transportation provided by our partner <a href="https://aspenalpenglowlimousine.com" target="_blank" rel="noopener noreferrer" className="text-rva-copper-light hover:underline">Aspen Alpenglow Limousine</a> — luxury SUV or Sprinter with WiFi and Starlink. Door-to-door service included with guided adventures.
          </p>
          <a href="https://aspenalpenglowlimousine.com/alpenglow/pricing" target="_blank" rel="noopener noreferrer" className="text-sm text-rva-copper hover:underline">View transport pricing →</a>
        </div>

        {/* FAQ */}
        {faqs.length > 0 && (
          <div className="mb-12">
            <h2 className="font-playfair text-2xl text-rva-forest-dark mb-6">Frequently Asked Questions</h2>
            {faqs.map(f => (
              <details key={f.q} className="group mb-3 bg-white rounded-lg border border-rva-copper/10">
                <summary className="p-4 cursor-pointer font-medium text-rva-forest-dark text-sm">{f.q}</summary>
                <p className="px-4 pb-4 text-sm text-rva-forest/70">{f.a}</p>
              </details>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/rva/contact" className="inline-block bg-rva-copper hover:bg-rva-copper-light text-white px-8 py-3 rounded-full font-semibold transition-colors">
            Book a {loc.name} Adventure — 970-456-3666
          </Link>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TouristDestination',
        name: `${loc.name} — Rich Valley Adventures`,
        description: loc.description,
        touristType: activities,
        containedInPlace: { '@type': 'State', name: 'Colorado' },
      })}} />
      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        })}} />
      )}
    </div>
  )
}
