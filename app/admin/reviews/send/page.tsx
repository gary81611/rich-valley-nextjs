'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import Toast from '@/components/admin/Toast'
import { DEFAULT_TEMPLATES, renderTemplate } from '../_templates'

const STORAGE_KEY = 'review_templates_v1'
const PLACE_ID_KEY = 'review_place_ids'

interface ReviewRequest {
  id: string
  brand: string
  customer_name: string
  customer_email: string
  adventure_name: string | null
  template_id: string
  subject: string
  sent_at: string
  status: string
}

export default function SendReviewPage() {
  const supabase = createClient()

  // Form state
  const [brand, setBrand] = useState<'rva' | 'alpenglow'>('rva')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [adventureName, setAdventureName] = useState('')
  const [templateId, setTemplateId] = useState('rva_initial')
  const [placeIds, setPlaceIds] = useState({ rva: '', alpenglow: '' })

  // UI state
  const [showPreview, setShowPreview] = useState(false)
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [history, setHistory] = useState<ReviewRequest[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)

  // Load saved templates + place IDs
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setTemplates(JSON.parse(saved))
    } catch {}
    try {
      const saved = localStorage.getItem(PLACE_ID_KEY)
      if (saved) setPlaceIds(JSON.parse(saved))
    } catch {}
  }, [])

  // Keep template selection in sync with brand
  useEffect(() => {
    const brandTemplates = Object.values(templates).filter(t => t.brand === brand)
    if (brandTemplates.length > 0 && !brandTemplates.find(t => t.id === templateId)) {
      setTemplateId(brandTemplates[0].id)
    }
  }, [brand, templates, templateId])

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true)
    const { data } = await supabase
      .from('review_requests')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(20)
    setHistory(data || [])
    setHistoryLoading(false)
  }, [supabase])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  const savePlaceIds = (updated: typeof placeIds) => {
    setPlaceIds(updated)
    localStorage.setItem(PLACE_ID_KEY, JSON.stringify(updated))
  }

  const googleReviewLink = placeIds[brand]
    ? `https://search.google.com/local/writereview?placeid=${placeIds[brand]}`
    : 'https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID'

  const currentTemplate = templates[templateId]

  const { subject, html } = currentTemplate
    ? renderTemplate(currentTemplate, {
        customerName: customerName || '{{customer_name}}',
        adventureName: adventureName || undefined,
        googleReviewLink,
      })
    : { subject: '', html: '' }

  const previewDoc = `<html><head><style>body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:14px;color:#1e293b;padding:24px;max-width:600px;margin:0 auto;line-height:1.6}p{margin:0 0 16px}</style></head><body>${html}</body></html>`

  const handleSend = async () => {
    if (!customerName || !customerEmail) {
      setToast({ message: 'Customer name and email are required.', type: 'error' })
      return
    }
    if (!placeIds[brand]) {
      setToast({ message: `Set the Google Place ID for ${brand === 'rva' ? 'RVA' : 'AAL'} before sending.`, type: 'error' })
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/reviews/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: customerEmail,
          customerName,
          brand,
          adventureName: adventureName || undefined,
          templateId,
          subject,
          html,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Send failed')
      setToast({ message: `Review request sent to ${customerEmail}!`, type: 'success' })
      setCustomerName('')
      setCustomerEmail('')
      setAdventureName('')
      setShowPreview(false)
      fetchHistory()
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Failed to send.', type: 'error' })
    } finally {
      setSending(false)
    }
  }

  const brandTemplates = Object.values(templates).filter(t => t.brand === brand)

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Send Review Request</h1>
        <p className="text-slate-500 text-sm mt-1">Send a personalized Google review request email to a customer.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left: Form */}
        <div className="space-y-5">
          {/* Brand */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Brand</h2>
            <div className="flex gap-2">
              {(['rva', 'alpenglow'] as const).map(b => (
                <button
                  key={b}
                  onClick={() => setBrand(b)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    brand === b
                      ? b === 'rva'
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-blue-600 border-blue-600 text-white'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {b === 'rva' ? 'Rich Valley Adventures' : 'Aspen Alpenglow'}
                </button>
              ))}
            </div>
          </div>

          {/* Customer details */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-700">Customer</h2>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Name</label>
              <input
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>
            {brand === 'rva' && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Adventure Name</label>
                <input
                  value={adventureName}
                  onChange={e => setAdventureName(e.target.value)}
                  placeholder="e.g. Fly Fishing Tour"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
            )}
          </div>

          {/* Template */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Template</h2>
            <div className="space-y-2">
              {brandTemplates.map(t => (
                <label
                  key={t.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    templateId === t.id ? 'border-slate-400 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="template"
                    value={t.id}
                    checked={templateId === t.id}
                    onChange={() => setTemplateId(t.id)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{t.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{t.subject.replace(/\{\{[^}]+\}\}/g, '…')}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Google Place ID config */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-1">Google Place ID</h2>
            <p className="text-xs text-slate-500 mb-3">
              Find yours at <strong>developers.google.com/maps/documentation/places/web-service/place-id</strong>. Saved to your browser.
            </p>
            <div className="space-y-2">
              {(['rva', 'alpenglow'] as const).map(b => (
                <div key={b} className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    b === 'rva' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {b === 'rva' ? 'RVA' : 'AAL'}
                  </span>
                  <input
                    value={placeIds[b]}
                    onChange={e => savePlaceIds({ ...placeIds, [b]: e.target.value })}
                    placeholder="ChIJ..."
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex-1 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              {showPreview ? 'Hide Preview' : 'Preview Email'}
            </button>
            <button
              onClick={handleSend}
              disabled={sending || !customerName || !customerEmail}
              className="flex-1 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Sending…' : 'Send Review Request'}
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div>
          {showPreview ? (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Email Preview</p>
                <p className="text-sm text-slate-700">
                  <span className="text-slate-500">To:</span> {customerEmail || 'customer@example.com'}
                </p>
                <p className="text-sm text-slate-700">
                  <span className="text-slate-500">Subject:</span> {subject}
                </p>
              </div>
              <iframe
                srcDoc={previewDoc}
                className="w-full h-[480px]"
                title="Email preview"
                sandbox="allow-same-origin"
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center h-64">
              <svg className="w-10 h-10 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-slate-500">Fill in the form and click <strong>Preview Email</strong> to see how it looks.</p>
            </div>
          )}
        </div>
      </div>

      {/* Send history */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-3">Recent Sends</h2>
        <div className="bg-white rounded-xl border border-slate-200">
          {historyLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">No review requests sent yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Brand</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Template</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(r => (
                    <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-900">{r.customer_name}</p>
                        <p className="text-xs text-slate-500">{r.customer_email}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          r.brand === 'rva' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {r.brand === 'rva' ? 'RVA' : 'AAL'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-600 text-xs">{r.template_id.replace('_', ' ')}</td>
                      <td className="px-5 py-3 text-slate-500 text-xs">{new Date(r.sent_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
