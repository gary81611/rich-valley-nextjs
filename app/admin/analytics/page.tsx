'use client'
import { useState, useEffect, useCallback } from 'react'
import type { AnalyticsData } from '@/app/api/analytics/route'

type SiteKey = 'rva' | 'alpenglow'
type DateRange = '7d' | '30d' | '90d'

const SITE_LABELS: Record<SiteKey, string> = { rva: 'Rich Valley Adventures', alpenglow: 'Aspen Alpenglow Limo' }

const dateRangeMap: Record<DateRange, string> = { '7d': '7daysAgo', '30d': '30daysAgo', '90d': '90daysAgo' }

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function formatNum(n: number): string {
  return n.toLocaleString()
}

// Simple SVG line chart — no external dependencies
function LineChart({ data }: { data: { date: string; views: number }[] }) {
  if (!data.length) return <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No data</div>

  const width = 600
  const height = 160
  const pad = { top: 12, right: 16, bottom: 28, left: 44 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom

  const maxViews = Math.max(...data.map((d) => d.views), 1)
  const points = data.map((d, i) => ({
    x: pad.left + (i / Math.max(data.length - 1, 1)) * innerW,
    y: pad.top + innerH - (d.views / maxViews) * innerH,
    ...d,
  }))

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ')
  const areaPath = [
    `M ${points[0].x} ${pad.top + innerH}`,
    ...points.map((p) => `L ${p.x} ${p.y}`),
    `L ${points[points.length - 1].x} ${pad.top + innerH}`,
    'Z',
  ].join(' ')

  // Y-axis labels (0 and max)
  const yTicks = [0, Math.round(maxViews / 2), maxViews]
  // X-axis: show ~5 evenly-spaced date labels
  const step = Math.max(1, Math.floor(data.length / 5))
  const xLabels = points.filter((_, i) => i % step === 0 || i === data.length - 1)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" aria-label="Daily pageviews chart">
      <defs>
        <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {yTicks.map((tick) => {
        const y = pad.top + innerH - (tick / maxViews) * innerH
        return (
          <g key={tick}>
            <line x1={pad.left} x2={pad.left + innerW} y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" />
            <text x={pad.left - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{formatNum(tick)}</text>
          </g>
        )
      })}
      {/* Area fill */}
      <path d={areaPath} fill="url(#chart-fill)" />
      {/* Line */}
      <polyline points={polyline} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {/* X-axis labels */}
      {xLabels.map((p) => (
        <text key={p.date} x={p.x} y={height - 6} textAnchor="middle" fontSize="9" fill="#94a3b8">
          {p.date.slice(5)} {/* MM-DD */}
        </text>
      ))}
    </svg>
  )
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  )
}

function SetupBanner() {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
        <svg className="h-7 w-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-slate-800">Set up Google Analytics to see your traffic data</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
        Create GA4 properties for each site, then add your credentials to environment variables to unlock this dashboard.
      </p>
      <div className="mt-6 text-left inline-block bg-white rounded-lg border border-slate-200 p-4 text-xs font-mono text-slate-600 space-y-1">
        <p className="text-slate-400"># .env.local — GA4 tracking (client-side)</p>
        <p>NEXT_PUBLIC_GA_MEASUREMENT_ID_RVA=G-XXXXXXXXXX</p>
        <p>NEXT_PUBLIC_GA_MEASUREMENT_ID_AAL=G-XXXXXXXXXX</p>
        <p className="mt-2 text-slate-400"># GA4 Data API — for this dashboard</p>
        <p>GA_PROPERTY_ID_RVA=123456789</p>
        <p>GA_PROPERTY_ID_AAL=123456789</p>
        <p>GOOGLE_SA_CLIENT_EMAIL=sa@project.iam.gserviceaccount.com</p>
        <p>GOOGLE_SA_PRIVATE_KEY=&quot;-----BEGIN PRIVATE KEY-----\n...&quot;</p>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [site, setSite] = useState<SiteKey>('rva')
  const [range, setRange] = useState<DateRange>('30d')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notConfigured, setNotConfigured] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    setNotConfigured(false)
    try {
      const params = new URLSearchParams({ site_key: site, start_date: dateRangeMap[range], end_date: 'today' })
      const res = await fetch(`/api/analytics?${params}`)
      const json = await res.json()
      if (!res.ok) {
        if (json.error === 'not_configured' || json.error === 'no_property') {
          setNotConfigured(true)
        } else {
          setError(json.message || 'Failed to load analytics.')
        }
      } else {
        setData(json as AnalyticsData)
      }
    } catch {
      setError('Network error — could not reach analytics API.')
    } finally {
      setLoading(false)
    }
  }, [site, range])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const rangeLabel = range === '7d' ? 'last 7 days' : range === '30d' ? 'last 30 days' : 'last 90 days'

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">Website traffic & engagement</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={site}
            onChange={(e) => setSite(e.target.value as SiteKey)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="rva">Rich Valley Adventures</option>
            <option value="alpenglow">Aspen Alpenglow Limo</option>
          </select>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as DateRange)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            title="Refresh"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Not configured */}
      {notConfigured && <SetupBanner />}

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !notConfigured && (
        <div className="space-y-4 animate-pulse">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-xl" />
            ))}
          </div>
          <div className="h-48 bg-slate-100 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-64 bg-slate-100 rounded-xl" />
            <div className="h-64 bg-slate-100 rounded-xl" />
          </div>
        </div>
      )}

      {/* Data */}
      {data && !loading && (
        <>
          {/* Metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Pageviews (7d)" value={formatNum(data.metrics.totalPageviews7d)} />
            <MetricCard label="Pageviews (30d)" value={formatNum(data.metrics.totalPageviews30d)} />
            <MetricCard
              label="Unique Visitors"
              value={formatNum(data.metrics.uniqueVisitors30d)}
              sub={rangeLabel}
            />
            <MetricCard
              label="Avg Session"
              value={formatDuration(data.metrics.avgSessionDuration30d)}
              sub={rangeLabel}
            />
          </div>

          {/* Second row metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricCard
              label="Bounce Rate"
              value={`${data.metrics.bounceRate30d.toFixed(1)}%`}
              sub={rangeLabel}
            />
            <MetricCard
              label="Tracking Site"
              value={SITE_LABELS[site]}
              sub={`Property ID: ${site === 'rva' ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID_RVA ?? '—' : process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID_AAL ?? '—'}`}
            />
          </div>

          {/* Daily pageviews chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Daily Pageviews — last 30 days</h2>
            <LineChart data={data.dailyPageviews} />
          </div>

          {/* Bottom two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top pages */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">Top Pages</h2>
              {data.topPages.length === 0 ? (
                <p className="text-sm text-slate-400">No page data available.</p>
              ) : (
                <div className="space-y-2">
                  {data.topPages.map((page) => (
                    <div key={page.path} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-600 truncate flex-1 font-mono">{page.path}</span>
                      <span className="text-xs text-slate-400 whitespace-nowrap">{formatNum(page.views)} views</span>
                      <span className="text-xs text-slate-400 whitespace-nowrap">{formatDuration(page.avgTimeOnPage)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Traffic sources */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">Traffic Sources</h2>
              {data.trafficSources.length === 0 ? (
                <p className="text-sm text-slate-400">No source data available.</p>
              ) : (
                <div className="space-y-3">
                  {data.trafficSources.map((src) => (
                    <div key={src.channel}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-slate-700">{src.channel}</span>
                        <span className="text-xs text-slate-500">{formatNum(src.sessions)} sessions · {src.percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${src.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
