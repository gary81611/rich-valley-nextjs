'use client'
import { useState, useEffect } from 'react'
import Toast from '@/components/admin/Toast'
import { DEFAULT_TEMPLATES, ReviewTemplate } from '../_templates'

const STORAGE_KEY = 'review_templates_v1'

export default function ReviewTemplatesPage() {
  const [templates, setTemplates] = useState<Record<string, ReviewTemplate>>(DEFAULT_TEMPLATES)
  const [activeId, setActiveId] = useState('rva_initial')
  const [view, setView] = useState<'edit' | 'preview'>('edit')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setTemplates(JSON.parse(saved))
    } catch {}
  }, [])

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
    setToast({ message: 'Templates saved.', type: 'success' })
  }

  const reset = () => {
    setTemplates(DEFAULT_TEMPLATES)
    localStorage.removeItem(STORAGE_KEY)
    setToast({ message: 'Templates reset to defaults.', type: 'success' })
  }

  const update = (field: 'subject' | 'body', value: string) => {
    setTemplates(t => ({ ...t, [activeId]: { ...t[activeId], [field]: value } }))
  }

  const current = templates[activeId]

  const previewDoc = (body: string) =>
    `<html><head><style>body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:14px;color:#1e293b;padding:24px;max-width:600px;margin:0 auto;line-height:1.6}p{margin:0 0 16px}</style></head><body>${body
      .replace(/\{\{customer_name\}\}/g, '<span style="background:#fef9c3;padding:0 3px;border-radius:3px">Jane Smith</span>')
      .replace(/\{\{adventure_name\}\}/g, '<span style="background:#fef9c3;padding:0 3px;border-radius:3px">Fly Fishing Tour</span>')
      .replace(/\{\{google_review_link\}\}/g, '#')
    }</body></html>`

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Review Email Templates</h1>
          <p className="text-slate-500 text-sm mt-1">Edit the templates used when sending Google review requests to customers.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
            Reset Defaults
          </button>
          <button onClick={save} className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800">
            Save Templates
          </button>
        </div>
      </div>

      {/* Google Place ID notice */}
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <strong>Google Place ID required:</strong> The{' '}
        <code className="bg-amber-100 px-1 rounded font-mono text-xs">{'{{google_review_link}}'}</code>{' '}
        placeholder is replaced with your Google review URL when sending.{' '}
        Format: <code className="bg-amber-100 px-1 rounded font-mono text-xs">https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID</code>.{' '}
        Find your Place ID at{' '}
        <strong>developers.google.com/maps/documentation/places/web-service/place-id</strong>.{' '}
        You&apos;ll enter the link on the Send Review Request page.
      </div>

      <div className="flex gap-6">
        {/* Sidebar: template selector */}
        <div className="w-52 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Templates</p>
            </div>
            {Object.values(templates).map(t => (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`w-full text-left px-4 py-3 text-sm border-b border-slate-100 last:border-0 transition-colors ${
                  activeId === t.id ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={`inline-block w-2 h-2 rounded-full mr-2 mb-0.5 ${t.brand === 'rva' ? 'bg-green-500' : 'bg-blue-500'}`} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editor panel */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  current.brand === 'rva' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {current.brand === 'rva' ? 'RVA' : 'AAL'}
                </span>
                <h2 className="text-sm font-semibold text-slate-900">{current.label}</h2>
              </div>
              <div className="flex rounded-lg overflow-hidden border border-slate-200 text-xs">
                {(['edit', 'preview'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-3 py-1.5 font-medium capitalize transition-colors ${
                      view === v ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {view === 'edit' ? (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Subject Line</label>
                  <input
                    value={current.subject}
                    onChange={e => update('subject', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Email Body (HTML)
                    <span className="ml-2 normal-case font-normal text-slate-400">
                      Variables: {'{{customer_name}}'}, {'{{adventure_name}}'}, {'{{google_review_link}}'}
                    </span>
                  </label>
                  <textarea
                    value={current.body}
                    onChange={e => update('body', e.target.value)}
                    rows={18}
                    className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 resize-y"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="mb-3 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Subject:</span>{' '}
                  {current.subject
                    .replace(/\{\{customer_name\}\}/g, 'Jane Smith')
                    .replace(/\{\{adventure_name\}\}/g, 'Fly Fishing Tour')}
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={previewDoc(current.body)}
                    className="w-full h-96"
                    title="Email preview"
                    sandbox="allow-same-origin"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Highlighted values are sample data. Yellow = replaced placeholder.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
