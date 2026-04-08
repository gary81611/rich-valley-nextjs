import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Adventure Locations | Rich Valley Adventures — Colorado Outdoor Destinations',
  description: 'Guided adventures across Colorado — Aspen, Basalt, Carbondale, Glenwood Springs, Snowmass, Vail, Telluride, and more. Fly fishing, hiking, hunting throughout the Roaring Fork Valley.',
  alternates: { canonical: 'https://www.richvalleyadventures.com/locations' },
}

export default async function LocationsPage() {
  const supabase = await createServerSupabaseClient()

  const { data: locationsRaw } = await supabase
    .from('locations')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  const locations = (locationsRaw ?? []).map((loc: any) => ({
    name: loc.name,
    slug: loc.slug,
    tagline: loc.tagline,
    description: loc.description,
    driveTime: loc.drive_time,
    activities: loc.activities || [],
  }))

  return (
    <div className="min-h-screen bg-rva-cream font-inter">
      <div className="bg-rva-forest-dark pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-rva-copper text-sm font-semibold uppercase tracking-[0.2em] mb-3">Where We Guide</p>
          <h1 className="font-playfair text-4xl md:text-5xl text-white font-light mb-4">Adventure Locations</h1>
          <p className="text-white/60">Up Valley, Mid Valley, Down Valley — from High Rockies to Desert Mesas</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {locations.length === 0 ? (
          <p className="text-center text-gray-500">No locations available at this time. Check back soon!</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {locations.map(loc => (
              <Link key={loc.slug} href={`/locations/${loc.slug}`} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="font-playfair text-xl font-semibold text-rva-forest-dark group-hover:text-rva-copper transition-colors">{loc.name}</h2>
                    <p className="text-sm text-rva-copper">{loc.tagline}</p>
                  </div>
                  <span className="text-xs text-rva-forest/40 bg-rva-cream px-2 py-1 rounded">{loc.driveTime}</span>
                </div>
                <p className="text-sm text-rva-forest/70 mb-3 line-clamp-2">{loc.description}</p>
                <div className="flex flex-wrap gap-1">
                  {loc.activities.slice(0, 4).map((a: string) => (
                    <span key={a} className="text-xs bg-rva-copper/10 text-rva-copper px-2 py-0.5 rounded">{a}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
