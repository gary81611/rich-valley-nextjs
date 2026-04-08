'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const CONDITION_COLORS: Record<string, string> = {
  good: '#16A34A',
  fair: '#CA8A04',
  low: '#3B82F6',
  high: '#DC2626',
}

const CONDITION_LABELS: Record<string, string> = {
  good: 'Good — Ideal fishing conditions',
  fair: 'Fair — Fishable with caution',
  low: 'Low — Excellent wading, watch temps',
  high: 'High — Unsafe wading, boat fishing only',
}

type Station = {
  siteCode: string
  name: string
  discharge_cfs?: number
  water_temp_f?: number
  water_temp_c?: number
  condition?: string
  discharge_time?: string
}

type ConditionsReportRow = {
  id: string
  report_date: string
  author_name: string | null
  hatch_report: string | null
  fly_recommendations: string | null
  water_clarity: string | null
  trail_conditions: string | null
  wildlife_notes: string | null
  birdwatching_highlights: string | null
  environmental_alerts: string | null
  general_notes: string | null
}

type FishingReport = {
  id: string
  title: string
  content: string
  river: string | null
  hatch_info: string | null
  fly_recommendations: string | null
  water_clarity: string | null
  published_at: string
  guides: { name: string } | null
}

type TrailCondition = {
  id: string
  section: string
  label: string
  description: string
  icon: string | null
  display_order: number
}

const FISHING_FALLBACK = (
  <p className="text-rva-forest/70 italic leading-relaxed">
    Fishing reports will be updated regularly during fishing season. Our guides cover hatch reports, fly recommendations, water clarity, and river observations across the Roaring Fork, Frying Pan, Colorado River, and Gunnison River.
  </p>
)

const TRAIL_FALLBACK = 'Trail condition updates coming soon.'
const BIRD_FALLBACK = 'Birdwatching highlights — check back soon.'

export default function ConditionsPage() {
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchedAt, setFetchedAt] = useState('')
  const [conditionsReport, setConditionsReport] = useState<ConditionsReportRow | null>(null)
  const [fishingReport, setFishingReport] = useState<FishingReport | null>(null)
  const [reportExpanded, setReportExpanded] = useState(false)
  const [trailConditions, setTrailConditions] = useState<TrailCondition[]>([])

  useEffect(() => {
    fetch('/api/usgs-conditions')
      .then((r) => r.json())
      .then((d) => {
        setStations(d.stations || [])
        setFetchedAt(d.fetchedAt || '')
      })
      .catch(() => {})
      .finally(() => setLoading(false))

    const supabase = createClient()

    supabase
      .from('conditions_reports')
      .select('*')
      .eq('published', true)
      .order('report_date', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setConditionsReport(data as ConditionsReportRow)
      })

    supabase
      .from('fishing_reports')
      .select('*, guides(name)')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setFishingReport(data as FishingReport)
      })

    supabase
      .from('trail_conditions')
      .select('*')
      .eq('is_active', true)
      .order('display_order')
      .then(({ data }) => {
        if (data) setTrailConditions(data as TrailCondition[])
      })
  }, [])

  const trailGroups: Record<string, TrailCondition[]> = {}
  for (const tc of trailConditions) {
    if (!trailGroups[tc.section]) trailGroups[tc.section] = []
    trailGroups[tc.section].push(tc)
  }

  const wildlife = trailGroups['wildlife'] || []
  const birdwatching = trailGroups['birdwatching'] || []
  const trailStatus = trailGroups['trail_status'] || []
  const general = trailGroups['general'] || []

  const useLegacyTrailGrid =
    !conditionsReport && trailConditions.length > 0

  const alertBanner = conditionsReport?.environmental_alerts?.trim()

  return (
    <div className="min-h-screen bg-rva-cream font-inter">
      <div className="bg-rva-forest-dark pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-rva-copper text-sm font-semibold uppercase tracking-[0.2em] mb-3">Live Conditions</p>
          <h1 className="font-playfair text-4xl md:text-5xl text-white font-light mb-4">River &amp; Trail Conditions</h1>
          <p className="text-white/60">Real-time USGS flow data for the Roaring Fork Valley</p>
        </div>
      </div>

      {alertBanner && (
        <div className="bg-amber-600 text-white">
          <div className="max-w-5xl mx-auto px-6 py-4 flex gap-3 items-start">
            <span className="text-xl shrink-0" aria-hidden>
              ⚠
            </span>
            <div>
              <p className="font-semibold text-sm uppercase tracking-wide mb-1">Environmental alert</p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{alertBanner}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Live Flow Data */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-playfair text-2xl text-rva-forest-dark">Current Flow Rates</h2>
            {fetchedAt && <p className="text-xs text-rva-forest/50">Updated: {new Date(fetchedAt).toLocaleString()}</p>}
          </div>

          {loading ? (
            <div className="text-center py-12 text-rva-forest/50">Loading USGS data...</div>
          ) : stations.length === 0 ? (
            <div className="text-center py-12 text-rva-forest/50">Unable to fetch river data. Check back shortly.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {stations.map((s) => (
                <div key={s.siteCode} className="bg-white p-5 rounded-lg border border-rva-copper/10">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-rva-forest-dark text-sm leading-tight">{s.name}</h3>
                    {s.condition && (
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: CONDITION_COLORS[s.condition] + '20', color: CONDITION_COLORS[s.condition] }}
                      >
                        {s.condition.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-6">
                    {s.discharge_cfs !== undefined && (
                      <div>
                        <p className="text-2xl font-light text-rva-forest-dark">
                          {Math.round(s.discharge_cfs)} <span className="text-sm text-rva-forest/50">cfs</span>
                        </p>
                        <p className="text-xs text-rva-forest/40">Discharge</p>
                      </div>
                    )}
                    {s.water_temp_f !== undefined && (
                      <div>
                        <p className="text-2xl font-light text-rva-forest-dark">
                          {s.water_temp_f}&deg; <span className="text-sm text-rva-forest/50">F</span>
                        </p>
                        <p className="text-xs text-rva-forest/40">Water Temp</p>
                      </div>
                    )}
                  </div>
                  {s.condition && <p className="text-xs text-rva-forest/60 mt-3">{CONDITION_LABELS[s.condition]}</p>}
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-rva-forest/40 mt-4">Data source: USGS Water Services &middot; Updated hourly</p>
        </div>

        {/* Latest report meta */}
        {conditionsReport && (
          <p className="text-sm text-rva-forest/60 mb-6">
            Last updated{' '}
            {new Date(conditionsReport.report_date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
            {conditionsReport.author_name ? ` by ${conditionsReport.author_name}` : ''}
          </p>
        )}

        {/* Fishing / hatches */}
        <div className="mb-12 bg-white p-8 rounded-lg border border-rva-copper/10">
          <h2 className="font-playfair text-2xl text-rva-forest-dark mb-4">Latest Fishing Report</h2>

          {conditionsReport ? (
            <div className="space-y-4 text-sm text-rva-forest/80 leading-relaxed">
              {conditionsReport.hatch_report && (
                <div>
                  <p className="text-xs font-semibold text-rva-forest-dark uppercase tracking-wide mb-1">Hatch report</p>
                  <p className="whitespace-pre-wrap">{conditionsReport.hatch_report}</p>
                </div>
              )}
              {conditionsReport.fly_recommendations && (
                <div>
                  <p className="text-xs font-semibold text-rva-forest-dark uppercase tracking-wide mb-1">Fly recommendations</p>
                  <p className="whitespace-pre-wrap">{conditionsReport.fly_recommendations}</p>
                </div>
              )}
              {conditionsReport.water_clarity && (
                <div>
                  <p className="text-xs font-semibold text-rva-forest-dark uppercase tracking-wide mb-1">Water clarity</p>
                  <p className="whitespace-pre-wrap">{conditionsReport.water_clarity}</p>
                </div>
              )}
              {conditionsReport.general_notes && (
                <div>
                  <p className="text-xs font-semibold text-rva-forest-dark uppercase tracking-wide mb-1">Notes</p>
                  <p className="whitespace-pre-wrap">{conditionsReport.general_notes}</p>
                </div>
              )}
              {!conditionsReport.hatch_report &&
                !conditionsReport.fly_recommendations &&
                !conditionsReport.water_clarity &&
                !conditionsReport.general_notes && <div className="bg-rva-cream p-6 rounded-lg">{FISHING_FALLBACK}</div>}
            </div>
          ) : fishingReport ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                {fishingReport.guides?.name && <p className="text-sm text-rva-forest/60">By {fishingReport.guides.name}</p>}
                <p className="text-sm text-rva-forest/40">
                  {new Date(fishingReport.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <h3 className="font-semibold text-rva-forest-dark mb-3">{fishingReport.title}</h3>
              <div className="flex flex-wrap gap-4 mb-4">
                {fishingReport.river && (
                  <span className="text-xs bg-rva-copper/10 text-rva-copper px-2 py-1 rounded">{fishingReport.river}</span>
                )}
                {fishingReport.water_clarity && (
                  <span className="text-xs bg-rva-forest/10 text-rva-forest px-2 py-1 rounded">Clarity: {fishingReport.water_clarity}</span>
                )}
              </div>
              {fishingReport.hatch_info && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-rva-forest-dark uppercase tracking-wide mb-1">Hatch Report</p>
                  <p className="text-sm text-rva-forest/70">{fishingReport.hatch_info}</p>
                </div>
              )}
              {fishingReport.fly_recommendations && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-rva-forest-dark uppercase tracking-wide mb-1">Fly Recommendations</p>
                  <p className="text-sm text-rva-forest/70">{fishingReport.fly_recommendations}</p>
                </div>
              )}
              <div className="bg-rva-cream p-6 rounded-lg">
                <p className="text-rva-forest/70 leading-relaxed text-sm">
                  {reportExpanded ? fishingReport.content : fishingReport.content.length > 300 ? `${fishingReport.content.slice(0, 300)}...` : fishingReport.content}
                </p>
                {fishingReport.content.length > 300 && (
                  <button onClick={() => setReportExpanded(!reportExpanded)} className="text-rva-copper text-sm font-semibold mt-3 hover:underline">
                    {reportExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="bg-rva-cream p-6 rounded-lg">
              {FISHING_FALLBACK}
              <p className="text-xs text-rva-copper mt-4">
                Check back for the latest from the river — or{' '}
                <Link href="/contact" className="underline">
                  book a guided trip
                </Link>{' '}
                and get the report firsthand.
              </p>
            </div>
          )}
        </div>

        {/* Trail / wildlife / birds */}
        <div className="mb-12 bg-white p-8 rounded-lg border border-rva-copper/10">
          <h2 className="font-playfair text-2xl text-rva-forest-dark mb-4">Trail Conditions</h2>

          {conditionsReport?.trail_conditions?.trim() ? (
            <p className="text-sm text-rva-forest/80 whitespace-pre-wrap leading-relaxed mb-8">{conditionsReport.trail_conditions}</p>
          ) : useLegacyTrailGrid && trailStatus.length > 0 ? (
            <div className="mb-6">
              <h3 className="font-semibold text-rva-forest-dark mb-2">Trail Status</h3>
              <ul className="text-sm text-rva-forest/70 space-y-1">
                {trailStatus.map((tc) => (
                  <li key={tc.id}>
                    {tc.icon ? `${tc.icon} ` : ''}
                    {tc.label} — {tc.description}
                  </li>
                ))}
              </ul>
            </div>
          ) : !conditionsReport ? (
            <p className="text-sm text-rva-forest/50 italic mb-8">{TRAIL_FALLBACK}</p>
          ) : null}

          {conditionsReport?.wildlife_notes?.trim() ? (
            <div className="mb-8">
              <h3 className="font-semibold text-rva-forest-dark mb-2">Wildlife</h3>
              <p className="text-sm text-rva-forest/80 whitespace-pre-wrap leading-relaxed">{conditionsReport.wildlife_notes}</p>
            </div>
          ) : useLegacyTrailGrid && wildlife.length > 0 ? (
            <div className="mb-8">
              <h3 className="font-semibold text-rva-forest-dark mb-2">Wildlife Awareness</h3>
              <ul className="text-sm text-rva-forest/70 space-y-1">
                {wildlife.map((tc) => (
                  <li key={tc.id}>
                    {tc.icon ? `${tc.icon} ` : ''}
                    {tc.label} — {tc.description}
                  </li>
                ))}
              </ul>
            </div>
          ) : !conditionsReport ? (
            <div className="mb-8">
              <h3 className="font-semibold text-rva-forest-dark mb-2">Wildlife Awareness</h3>
              <p className="text-sm text-rva-forest/50 italic">{TRAIL_FALLBACK}</p>
            </div>
          ) : null}

          {conditionsReport?.birdwatching_highlights?.trim() ? (
            <div>
              <h3 className="font-semibold text-rva-forest-dark mb-2">Birdwatching Highlights</h3>
              <p className="text-sm text-rva-forest/80 whitespace-pre-wrap leading-relaxed">{conditionsReport.birdwatching_highlights}</p>
            </div>
          ) : useLegacyTrailGrid && birdwatching.length > 0 ? (
            <div>
              <h3 className="font-semibold text-rva-forest-dark mb-2">Birdwatching Highlights</h3>
              <ul className="text-sm text-rva-forest/70 space-y-1">
                {birdwatching.map((tc) => (
                  <li key={tc.id}>
                    {tc.icon ? `${tc.icon} ` : ''}
                    {tc.label} — {tc.description}
                  </li>
                ))}
              </ul>
            </div>
          ) : !conditionsReport ? (
            <div>
              <h3 className="font-semibold text-rva-forest-dark mb-2">Birdwatching Highlights</h3>
              <p className="text-sm text-rva-forest/50 italic">{BIRD_FALLBACK}</p>
            </div>
          ) : null}

          {useLegacyTrailGrid && general.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-rva-forest-dark mb-2">General Conditions</h3>
              <ul className="text-sm text-rva-forest/70 space-y-1">
                {general.map((tc) => (
                  <li key={tc.id}>
                    {tc.icon ? `${tc.icon} ` : ''}
                    {tc.label} — {tc.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="text-center bg-rva-forest-dark rounded-lg p-10">
          <h2 className="font-playfair text-2xl text-white mb-3">Book a Guided Adventure</h2>
          <p className="text-white/60 mb-6">Expert local guides, all gear provided, door-to-door transport by Aspen Alpenglow Limousine.</p>
          <Link href="/contact" className="inline-block bg-rva-copper hover:bg-rva-copper-light text-white px-8 py-3 rounded-full font-semibold transition-colors">
            Book Now — 970-456-3666
          </Link>
        </div>
      </div>
    </div>
  )
}
