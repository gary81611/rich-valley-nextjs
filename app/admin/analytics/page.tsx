'use client'
import { useState } from 'react'

type Site = 'rva' | 'aal'

const placeholderMetrics = {
  rva: {
    pageviews: '—',
    visitors: '—',
    bounceRate: '—',
    avgSession: '—',
    topPages: [
      { path: '/rva', title: 'Homepage' },
      { path: '/rva/adventures', title: 'Adventures' },
      { path: '/rva/about', title: 'About' },
      { path: '/rva/contact', title: 'Contact' },
      { path: '/rva/blog', title: 'Blog' },
    ],
  },
  aal: {
    pageviews: '—',
    visitors: '—',
    bounceRate: '—',
    avgSession: '—',
    topPages: [
      { path: '/alpenglow', title: 'Homepage' },
      { path: '/alpenglow/services', title: 'Services' },
      { path: '/alpenglow/fleet', title: 'Fleet' },
      { path: '/alpenglow/about', title: 'About' },
      { path: '/alpenglow/contact', title: 'Contact' },
    ],
  },
}

const envVarInstructions = {
  rva: {
    name: 'Rich Valley Adventures',
    envVar: 'NEXT_PUBLIC_GA_MEASUREMENT_ID_RVA',
    hostname: 'richvalleyadventures.com',
  },
  aal: {
    name: 'Aspen Alpenglow Limousine',
    envVar: 'NEXT_PUBLIC_GA_MEASUREMENT_ID_AAL',
    hostname: 'alpenglowlimousine.com',
  },
}

export default function AnalyticsPage() {
  const [site, setSite] = useState<Site>('rva')
  const metrics = placeholderMetrics[site]
  const siteInfo = envVarInstructions[site]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Google Analytics 4 overview for your sites</p>
      </div>

      {/* Site selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSite('rva')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            site === 'rva'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Rich Valley Adventures
        </button>
        <button
          onClick={() => setSite('aal')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            site === 'aal'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Aspen Alpenglow Limousine
        </button>
      </div>

      {/* Placeholder metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Pageviews', value: metrics.pageviews, sub: 'Last 30 days' },
          { label: 'Visitors', value: metrics.visitors, sub: 'Unique users' },
          { label: 'Bounce Rate', value: metrics.bounceRate, sub: 'Session quality' },
          { label: 'Avg Session', value: metrics.avgSession, sub: 'Time on site' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
            <p className="text-xs text-slate-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Top Pages */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">Top Pages</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Page</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Views</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Visitors</th>
            </tr>
          </thead>
          <tbody>
            {metrics.topPages.map((page, i) => (
              <tr key={page.path} className={i < metrics.topPages.length - 1 ? 'border-b border-slate-50' : ''}>
                <td className="px-6 py-3">
                  <p className="font-medium text-slate-800">{page.title}</p>
                  <p className="text-xs text-slate-400">{page.path}</p>
                </td>
                <td className="px-6 py-3 text-right text-slate-400">—</td>
                <td className="px-6 py-3 text-right text-slate-400">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Live data note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Live data coming soon.</span> Once GA4 is configured and collecting data, connect the GA4 Data API to see live metrics here.
        </p>
      </div>

      {/* Setup guide */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Setup Guide — {siteInfo.name}</h2>

        <ol className="space-y-4 text-sm text-slate-700">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <div>
              <p className="font-medium">Create a GA4 Property</p>
              <p className="text-slate-500 mt-0.5">Go to Google Analytics → Admin → Create Property. Select &ldquo;Web&rdquo; as the platform and enter <code className="bg-slate-100 px-1 rounded text-xs">{siteInfo.hostname}</code> as your website URL.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <div>
              <p className="font-medium">Copy your Measurement ID</p>
              <p className="text-slate-500 mt-0.5">In your new GA4 property, go to Admin → Data Streams → your stream. Copy the Measurement ID (starts with <code className="bg-slate-100 px-1 rounded text-xs">G-</code>).</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
            <div>
              <p className="font-medium">Add to Vercel Environment Variables</p>
              <p className="text-slate-500 mt-0.5">In your Vercel project settings, go to Settings → Environment Variables and add:</p>
              <div className="mt-2 bg-slate-900 text-green-400 rounded-lg px-4 py-3 font-mono text-xs">
                <p>{siteInfo.envVar}=G-XXXXXXXXXX</p>
              </div>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
            <div>
              <p className="font-medium">Redeploy</p>
              <p className="text-slate-500 mt-0.5">Trigger a new deployment in Vercel so the environment variable takes effect. Analytics will begin collecting data immediately after deployment.</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  )
}
