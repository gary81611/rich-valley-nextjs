'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { CmsPage, TemplateType, PageStatus, SiteId } from '@/lib/pages'

type EditingPage = Pick<CmsPage, 'title' | 'slug' | 'meta_title' | 'meta_description' | 'template_type' | 'status' | 'site_id'>
type ContentFaq = { question: string; answer: string; category?: string }
type H2Section = { title: string; content: string }
type Feature = { title: string; description: string }

const SITE_LABELS: Record<SiteId, string> = { rva: 'RVA', alpenglow: 'ALP' }
const TEMPLATE_LABELS: Record<TemplateType, string> = { service: 'Service', location: 'Location', faq: 'FAQ', landing: 'Landing' }
const STATUS_COLORS: Record<PageStatus, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-yellow-100 text-yellow-700',
}

const blank: EditingPage = { title: '', slug: '', meta_title: '', meta_description: '', template_type: 'service', status: 'draft', site_id: 'rva' }

// ── Helpers ──────────────────────────────────────────────────────────────────

function getContent(editing: Partial<CmsPage>): Record<string, unknown> {
  return (editing.content as unknown as Record<string, unknown>) || {}
}

function useContentField(editing: Partial<CmsPage> | null, setEditing: React.Dispatch<React.SetStateAction<Partial<CmsPage> | null>>) {
  const update = useCallback((field: string, value: unknown) => {
    setEditing(prev => {
      if (!prev) return null
      const merged = { ...((prev.content as unknown as Record<string, unknown>) || {}), [field]: value }
      return { ...prev, content: merged as unknown as CmsPage['content'] }
    })
  }, [setEditing])
  return update
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FaqEditor({ faqs, onChange }: { faqs: ContentFaq[]; onChange: (faqs: ContentFaq[]) => void }) {
  const add = () => onChange([...faqs, { question: '', answer: '' }])
  const remove = (i: number) => onChange(faqs.filter((_, idx) => idx !== i))
  const update = (i: number, field: keyof ContentFaq, val: string) => {
    const next = faqs.map((f, idx) => idx === i ? { ...f, [field]: val } : f)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">FAQs on this page</span>
        <button
          type="button"
          onClick={add}
          className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
        >
          + Add FAQ
        </button>
      </div>
      {faqs.length === 0 && (
        <p className="text-xs text-slate-400 italic">No FAQs yet. Click "+ Add FAQ" to add one.</p>
      )}
      {faqs.map((faq, i) => (
        <div key={i} className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50">
          <div className="flex gap-2 items-start">
            <span className="text-xs font-bold text-slate-400 mt-2 w-4 shrink-0">{i + 1}</span>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={faq.question}
                onChange={e => update(i, 'question', e.target.value)}
                placeholder="Question"
                className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <textarea
                value={faq.answer}
                onChange={e => update(i, 'answer', e.target.value)}
                placeholder="Answer"
                rows={2}
                className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
              />
              <input
                type="text"
                value={faq.category || ''}
                onChange={e => update(i, 'category', e.target.value)}
                placeholder="Category (optional)"
                className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="mt-1.5 text-red-400 hover:text-red-600 text-lg leading-none"
              title="Remove FAQ"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function H2SectionEditor({ sections, onChange }: { sections: H2Section[]; onChange: (s: H2Section[]) => void }) {
  const add = () => onChange([...sections, { title: '', content: '' }])
  const remove = (i: number) => onChange(sections.filter((_, idx) => idx !== i))
  const update = (i: number, field: keyof H2Section, val: string) => {
    onChange(sections.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">H2 Sections</span>
        <button type="button" onClick={add} className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200">
          + Add Section
        </button>
      </div>
      {sections.length === 0 && <p className="text-xs text-slate-400 italic">No sections yet.</p>}
      {sections.map((s, i) => (
        <div key={i} className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50">
          <div className="flex gap-2 items-start">
            <span className="text-xs font-bold text-slate-400 mt-2 w-4 shrink-0">{i + 1}</span>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={s.title}
                onChange={e => update(i, 'title', e.target.value)}
                placeholder="Section heading (H2)"
                className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <textarea
                value={s.content}
                onChange={e => update(i, 'content', e.target.value)}
                placeholder="Section body content"
                rows={3}
                className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 resize-y"
              />
            </div>
            <button type="button" onClick={() => remove(i)} className="mt-1.5 text-red-400 hover:text-red-600 text-lg leading-none">×</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function FeatureEditor({ features, onChange }: { features: Feature[]; onChange: (f: Feature[]) => void }) {
  const add = () => onChange([...features, { title: '', description: '' }])
  const remove = (i: number) => onChange(features.filter((_, idx) => idx !== i))
  const update = (i: number, field: keyof Feature, val: string) => {
    onChange(features.map((f, idx) => idx === i ? { ...f, [field]: val } : f))
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Features / Highlights</span>
        <button type="button" onClick={add} className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200">
          + Add Feature
        </button>
      </div>
      {features.length === 0 && <p className="text-xs text-slate-400 italic">No features yet.</p>}
      {features.map((f, i) => (
        <div key={i} className="border border-slate-200 rounded-lg p-3 bg-slate-50">
          <div className="flex gap-2 items-start">
            <span className="text-xs font-bold text-slate-400 mt-2 w-4 shrink-0">{i + 1}</span>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={f.title}
                onChange={e => update(i, 'title', e.target.value)}
                placeholder="Feature title"
                className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <textarea
                value={f.description}
                onChange={e => update(i, 'description', e.target.value)}
                placeholder="Feature description"
                rows={2}
                className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
              />
            </div>
            <button type="button" onClick={() => remove(i)} className="mt-1.5 text-red-400 hover:text-red-600 text-lg leading-none">×</button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Content section rendered per template type ────────────────────────────────

function ContentEditor({ editing, setEditing }: { editing: Partial<CmsPage>; setEditing: React.Dispatch<React.SetStateAction<Partial<CmsPage> | null>> }) {
  const content = getContent(editing)
  const updateContent = useContentField(editing, setEditing)

  const str = (key: string) => (content[key] as string) || ''
  const faqs: ContentFaq[] = (content.faqs as ContentFaq[]) || []
  const h2Sections: H2Section[] = (content.h2_sections as H2Section[]) || []
  const features: Feature[] = (content.features as Feature[]) || []

  const templateType = editing.template_type || 'service'

  return (
    <div className="space-y-5">
      <div className="border-t border-slate-200 pt-5">
        <h3 className="text-sm font-bold text-slate-700 mb-4">Page Content</h3>

        {/* Hero fields — all templates */}
        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Hero Title</label>
            <input
              type="text"
              value={str('hero_title')}
              onChange={e => updateContent('hero_title', e.target.value)}
              placeholder="Main hero heading displayed at the top of the page"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          {(templateType === 'service' || templateType === 'landing') && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Hero Subtitle</label>
              <input
                type="text"
                value={str('hero_subtitle')}
                onChange={e => updateContent('hero_subtitle', e.target.value)}
                placeholder="Optional subtitle below the hero heading"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
          )}
        </div>

        {/* Intro / description */}
        {templateType === 'location' ? (
          <div className="space-y-3 mb-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Area Description</label>
              <textarea
                value={str('area_description')}
                onChange={e => updateContent('area_description', e.target.value)}
                rows={3}
                placeholder="Short description of the location/area"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Intro Paragraph</label>
              <textarea
                value={str('intro')}
                onChange={e => updateContent('intro', e.target.value)}
                rows={3}
                placeholder="Opening paragraph for the page body"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 resize-y"
              />
            </div>
          </div>
        ) : templateType !== 'landing' ? (
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Intro Paragraph</label>
            <textarea
              value={str('intro')}
              onChange={e => updateContent('intro', e.target.value)}
              rows={3}
              placeholder="Opening paragraph for the page body"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 resize-y"
            />
          </div>
        ) : null}

        {/* H2 sections — service only */}
        {templateType === 'service' && (
          <div className="mb-5">
            <H2SectionEditor
              sections={h2Sections}
              onChange={val => updateContent('h2_sections', val)}
            />
          </div>
        )}

        {/* Features — service only */}
        {templateType === 'service' && (
          <div className="mb-5">
            <FeatureEditor
              features={features}
              onChange={val => updateContent('features', val)}
            />
          </div>
        )}

        {/* CTA fields — service, location, faq */}
        {templateType !== 'landing' && (
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">CTA Phone</label>
              <input
                type="text"
                value={str('cta_phone')}
                onChange={e => updateContent('cta_phone', e.target.value)}
                placeholder="Phone number for CTA"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">CTA Text</label>
              <input
                type="text"
                value={str('cta_text')}
                onChange={e => updateContent('cta_text', e.target.value)}
                placeholder="Call-to-action button label"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
          </div>
        )}

        {/* FAQs — service, location, faq templates */}
        {templateType !== 'landing' && (
          <FaqEditor
            faqs={faqs}
            onChange={val => updateContent('faqs', val)}
          />
        )}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminPagesPage() {
  const supabase = createClient()
  const [pages, setPages] = useState<CmsPage[]>([])
  const [loading, setLoading] = useState(true)
  const [siteFilter, setSiteFilter] = useState<SiteId | 'all'>('all')
  const [editing, setEditing] = useState<Partial<CmsPage> | null>(null)
  const [saving, setSaving] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  const load = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('pages').select('*').order('site_id').order('slug')
    if (siteFilter !== 'all') q = q.eq('site_id', siteFilter)
    const { data } = await q
    setPages((data as CmsPage[]) || [])
    setLoading(false)
  }, [supabase, siteFilter])

  useEffect(() => { load() }, [load])

  const save = async () => {
    if (!editing) return
    setSaving(true)
    const isNew = !editing.id
    let q
    if (isNew) {
      const { published_at, ...rest } = editing
      const payload = {
        ...rest,
        content: rest.content || {},
        schema_markup: null,
        og_image: null,
        published_at: rest.status === 'published' ? new Date().toISOString() : null,
      }
      q = supabase.from('pages').insert(payload)
    } else {
      const payload: Record<string, unknown> = {
        title: editing.title,
        slug: editing.slug,
        meta_title: editing.meta_title,
        meta_description: editing.meta_description,
        template_type: editing.template_type,
        status: editing.status,
        site_id: editing.site_id,
        content: editing.content || {},
        updated_at: new Date().toISOString(),
      }
      if (editing.status === 'published' && !editing.published_at) {
        payload.published_at = new Date().toISOString()
      }
      q = supabase.from('pages').update(payload).eq('id', editing.id)
    }
    const { error } = await q
    if (error) showToast(`Error: ${error.message}`, false)
    else { showToast(isNew ? 'Page created' : 'Saved'); setEditing(null); load() }
    setSaving(false)
  }

  const toggleStatus = async (page: CmsPage) => {
    const newStatus: PageStatus = page.status === 'published' ? 'draft' : 'published'
    const update: Record<string, unknown> = { status: newStatus }
    if (newStatus === 'published') update.published_at = new Date().toISOString()
    const { error } = await supabase.from('pages').update(update).eq('id', page.id)
    if (error) showToast(`Error: ${error.message}`, false)
    else { showToast(newStatus === 'published' ? 'Published' : 'Unpublished'); load() }
  }

  const deletePage = async (page: CmsPage) => {
    if (!confirm(`Delete "${page.title}"? This cannot be undone.`)) return
    const { error } = await supabase.from('pages').delete().eq('id', page.id)
    if (error) showToast(`Error: ${error.message}`, false)
    else { showToast('Deleted'); load() }
  }

  const handleSeed = async () => {
    setSeeding(true)
    try {
      const res = await fetch('/api/admin/seed-pages', { method: 'POST' })
      const json = await res.json()
      if (json.success) { showToast(json.results.join(' | ')); load() }
      else showToast(json.error || 'Seed failed', false)
    } catch (e) {
      showToast(`Error: ${e}`, false)
    }
    setSeeding(false)
  }

  const pageUrl = (p: CmsPage) => {
    const base = p.site_id === 'alpenglow' ? 'https://aspenalpenglowlimousine.com' : 'https://richvalleyadventures.com'
    return `${base}/${p.slug}`
  }

  return (
    <div className="max-w-6xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${toast.ok ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CMS Pages</h1>
          <p className="text-sm text-slate-500 mt-0.5">Dynamic pages served from the database</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="px-3 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
          >
            {seeding ? 'Seeding…' : 'Seed Pages'}
          </button>
          <button
            onClick={() => setEditing({ ...blank })}
            className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            + New Page
          </button>
        </div>
      </div>

      {/* Site filter */}
      <div className="flex gap-2 mb-5">
        {(['all', 'rva', 'alpenglow'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSiteFilter(s)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${siteFilter === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-300 hover:border-slate-500'}`}
          >
            {s === 'all' ? 'All Sites' : s === 'rva' ? 'Rich Valley Adventures' : 'Aspen Alpenglow'}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500 mb-3">No pages yet.</p>
          <p className="text-slate-400 text-sm">Click "Seed Pages" to load the default content, or "New Page" to create one manually.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Page</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Site</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">SEO Title</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pages.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{p.title}</div>
                    <a href={pageUrl(p)} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                      /{p.slug} ↗
                    </a>
                  </td>
                  <td className="px-4 py-3 text-slate-500 capitalize">{TEMPLATE_LABELS[p.template_type]}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${p.site_id === 'rva' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {SITE_LABELS[p.site_id]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(p)} className={`text-xs font-medium px-2 py-0.5 rounded-full transition-opacity hover:opacity-75 ${STATUS_COLORS[p.status]}`}>
                      {p.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs truncate max-w-xs">{p.meta_title || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setEditing(p)} className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200">Edit</button>
                      <button onClick={() => deletePage(p)} className="text-xs px-2.5 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 px-4 pb-8 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-auto">
            <div className="p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-lg font-bold text-slate-900">{editing.id ? 'Edit Page' : 'New Page'}</h2>
            </div>
            <div className="p-6 space-y-4">
              {/* ── Metadata ── */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Site</label>
                  <select
                    value={editing.site_id}
                    onChange={e => setEditing(prev => ({ ...prev, site_id: e.target.value as SiteId }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="rva">Rich Valley Adventures</option>
                    <option value="alpenglow">Aspen Alpenglow</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Template</label>
                  <select
                    value={editing.template_type}
                    onChange={e => setEditing(prev => ({ ...prev, template_type: e.target.value as TemplateType }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="service">Service Page</option>
                    <option value="location">Location Page</option>
                    <option value="faq">FAQ Page</option>
                    <option value="landing">Landing Page</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Page Title (H1)</label>
                <input
                  type="text"
                  value={editing.title || ''}
                  onChange={e => setEditing(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="e.g. Guided Fly Fishing in Aspen"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={editing.slug || ''}
                  onChange={e => setEditing(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="e.g. fly-fishing or areas/aspen"
                />
                <p className="text-xs text-slate-400 mt-1">Use lowercase, hyphens. For nested paths use areas/aspen.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">SEO Title <span className="font-normal text-slate-400">(50–60 chars)</span></label>
                <input
                  type="text"
                  value={editing.meta_title || ''}
                  onChange={e => setEditing(prev => ({ ...prev, meta_title: e.target.value }))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  maxLength={70}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-slate-400">Appears in Google results. Includes brand name.</p>
                  <span className={`text-xs ${(editing.meta_title?.length || 0) > 60 ? 'text-red-500' : 'text-slate-400'}`}>
                    {editing.meta_title?.length || 0}/60
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Meta Description <span className="font-normal text-slate-400">(130–160 chars)</span></label>
                <textarea
                  value={editing.meta_description || ''}
                  onChange={e => setEditing(prev => ({ ...prev, meta_description: e.target.value }))}
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                  maxLength={200}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-slate-400">Appears as the snippet under the page title in Google.</p>
                  <span className={`text-xs ${(editing.meta_description?.length || 0) > 160 ? 'text-red-500' : 'text-slate-400'}`}>
                    {editing.meta_description?.length || 0}/160
                  </span>
                </div>
              </div>

              {/* SERP Preview */}
              {(editing.meta_title || editing.title) && (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Google Preview</p>
                  <p className="text-[#1a0dab] text-base font-normal hover:underline cursor-pointer truncate">
                    {editing.meta_title || editing.title}
                  </p>
                  <p className="text-[#006621] text-xs">
                    {editing.site_id === 'alpenglow' ? 'aspenalpenglowlimousine.com' : 'richvalleyadventures.com'}/{editing.slug || '…'}
                  </p>
                  {editing.meta_description && (
                    <p className="text-[#545454] text-sm mt-1 line-clamp-2">{editing.meta_description}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                <select
                  value={editing.status || 'draft'}
                  onChange={e => setEditing(prev => ({ ...prev, status: e.target.value as PageStatus }))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* ── Content section ── */}
              <ContentEditor editing={editing} setEditing={setEditing} />
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3 justify-end sticky bottom-0 bg-white rounded-b-2xl">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">Cancel</button>
              <button
                onClick={save}
                disabled={saving || !editing.title || !editing.slug}
                className="px-5 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : 'Save Page'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
