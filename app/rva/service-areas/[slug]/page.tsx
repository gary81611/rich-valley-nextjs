import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { serviceAreaMatchesPathSlug } from '@/lib/alpenglow-service-areas'

export const dynamic = 'force-dynamic'

const SITE = 'rva' as const
const BASE = 'https://www.richvalleyadventures.com'

async function getArea(pathSlug: string) {
  const supabase = await createServerSupabaseClient()
  const { data: rows } = await supabase
    .from('service_areas')
    .select('*')
    .eq('site_key', SITE)
    .eq('is_active', true)

  if (!rows?.length) return null
  return rows.find((area) => serviceAreaMatchesPathSlug(area, pathSlug)) ?? null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const area = await getArea(slug)
  if (!area) return { title: 'Service area | Rich Valley Adventures', robots: { index: true, follow: true } }

  const title = `${area.name} | Guided Adventures | Rich Valley Adventures`
  const desc = (area.description || area.long_description || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160)

  return {
    title,
    description: desc || `Guided outdoor adventures in ${area.name}, Colorado — Rich Valley Adventures.`,
    alternates: { canonical: `${BASE}/service-areas/${slug}` },
    robots: { index: true, follow: true },
  }
}

export default async function RvaServiceAreaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const area = await getArea(slug)
  if (!area) notFound()

  const keyDestinations: string[] = Array.isArray(area.key_destinations) ? area.key_destinations : []
  const longDesc = (area.long_description || area.description || '').trim()

  return (
    <div className="min-h-screen bg-rva-cream font-inter">
      <div className="bg-rva-forest-dark pt-28 pb-14">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/service-areas" className="text-rva-copper-light text-sm hover:underline mb-4 inline-block">
            ← Service areas
          </Link>
          <h1 className="font-playfair text-4xl md:text-5xl text-white font-light mb-3">{area.name}</h1>
          {area.description && <p className="text-white/70 text-lg max-w-2xl">{area.description}</p>}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {longDesc && (
          <div className="prose prose-lg text-rva-forest/90 mb-10 whitespace-pre-wrap leading-relaxed">
            {longDesc}
          </div>
        )}

        {keyDestinations.length > 0 && (
          <div className="bg-white rounded-xl border border-rva-cream-dark p-6 shadow-sm">
            <h2 className="font-playfair text-xl text-rva-forest-dark mb-4">Destinations &amp; access</h2>
            <ul className="space-y-2 text-rva-forest/80">
              {keyDestinations.map((d: string) => (
                <li key={d} className="flex gap-2">
                  <span className="text-rva-copper">•</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-rva-copper hover:bg-rva-copper-light text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Book an adventure
          </Link>
          <Link href="/locations" className="inline-flex items-center justify-center border border-rva-forest text-rva-forest font-semibold px-6 py-3 rounded-full hover:bg-rva-cream-dark/50 transition-colors">
            Location guides
          </Link>
        </div>
      </div>
    </div>
  )
}
