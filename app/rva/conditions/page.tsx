'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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

export default function ConditionsPage() {
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchedAt, setFetchedAt] = useState('')

  useEffect(() => {
    fetch('/api/usgs-conditions')
      .then(r => r.json())
      .then(d => {
        setStations(d.stations || [])
        setFetchedAt(d.fetchedAt || '')
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-rva-cream font-inter">
      <div className="bg-rva-forest-dark pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-rva-copper text-sm font-semibold uppercase tracking-[0.2em] mb-3">Live Conditions</p>
          <h1 className="font-playfair text-4xl md:text-5xl text-white font-light mb-4">River &amp; Trail Conditions</h1>
          <p className="text-white/60">Real-time USGS flow data for the Roaring Fork Valley</p>
        </div>
      </div>

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
              {stations.map(s => (
                <div key={s.siteCode} className="bg-white p-5 rounded-lg border border-rva-copper/10">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-rva-forest-dark text-sm leading-tight">{s.name}</h3>
                    {s.condition && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: CONDITION_COLORS[s.condition] + '20', color: CONDITION_COLORS[s.condition] }}>
                        {s.condition.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-6">
                    {s.discharge_cfs !== undefined && (
                      <div>
                        <p className="text-2xl font-light text-rva-forest-dark">{Math.round(s.discharge_cfs)} <span className="text-sm text-rva-forest/50">cfs</span></p>
                        <p className="text-xs text-rva-forest/40">Discharge</p>
                      </div>
                    )}
                    {s.water_temp_f !== undefined && (
                      <div>
                        <p className="text-2xl font-light text-rva-forest-dark">{s.water_temp_f}° <span className="text-sm text-rva-forest/50">F</span></p>
                        <p className="text-xs text-rva-forest/40">Water Temp</p>
                      </div>
                    )}
                  </div>
                  {s.condition && (
                    <p className="text-xs text-rva-forest/60 mt-3">{CONDITION_LABELS[s.condition]}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-rva-forest/40 mt-4">Data source: USGS Water Services · Updated hourly</p>
        </div>

        {/* Expert Commentary */}
        <div className="mb-12 bg-white p-8 rounded-lg border border-rva-copper/10">
          <h2 className="font-playfair text-2xl text-rva-forest-dark mb-4">Expert Report</h2>
          <p className="text-sm text-rva-forest/60 mb-4">Weekly commentary from Kit McLendon, Lead Fly Fishing Guide</p>
          <div className="bg-rva-cream p-6 rounded-lg">
            <p className="text-rva-forest/70 italic leading-relaxed">
              Expert river reports will be updated weekly during fishing season. Kit covers hatch reports, fly recommendations, water clarity, and river observations across the Roaring Fork, Frying Pan, Colorado River, and Gunnison River.
            </p>
            <p className="text-xs text-rva-copper mt-4">Check back for the latest from the river — or <Link href="/rva/contact" className="underline">book a guided trip</Link> and get the report firsthand.</p>
          </div>
        </div>

        {/* Trail Conditions */}
        <div className="mb-12 bg-white p-8 rounded-lg border border-rva-copper/10">
          <h2 className="font-playfair text-2xl text-rva-forest-dark mb-4">Trail Conditions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-rva-forest-dark mb-2">Wildlife Awareness</h3>
              <ul className="text-sm text-rva-forest/70 space-y-1">
                <li>🐻 Bear activity — store food properly, carry bear spray</li>
                <li>🦁 Mountain lion habitat — hike in groups</li>
                <li>🦌 Elk and mule deer active at dawn/dusk</li>
                <li>🕷 Tick season (spring-fall) — check after hikes</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-rva-forest-dark mb-2">Birdwatching Highlights</h3>
              <ul className="text-sm text-rva-forest/70 space-y-1">
                <li>🦅 Bald eagle — winter along the Roaring Fork</li>
                <li>🐦 American dipper — year-round along rivers</li>
                <li>🏔 Mountain bluebird — meadows above 8,000ft</li>
                <li>🌸 Calliope hummingbird — summer wildflower areas</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-rva-forest-dark rounded-lg p-10">
          <h2 className="font-playfair text-2xl text-white mb-3">Book a Guided Adventure</h2>
          <p className="text-white/60 mb-6">Expert local guides, all gear provided, door-to-door transport by Aspen Alpenglow Limousine.</p>
          <Link href="/rva/contact" className="inline-block bg-rva-copper hover:bg-rva-copper-light text-white px-8 py-3 rounded-full font-semibold transition-colors">
            Book Now — 970-456-3666
          </Link>
        </div>
      </div>
    </div>
  )
}
