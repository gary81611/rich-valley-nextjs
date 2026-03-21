'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import Toast from '@/components/admin/Toast'

interface SeoPage {
  id: string
  site_key: 'rva' | 'alpenglow'
  page_slug: string
  meta_title: string
  meta_description: string
  meta_keywords: string
  og_title: string
  og_description: string
  og_image_url: string
  canonical_url: string
  no_index: boolean
  no_follow: boolean
}

interface GeoBlock {
  id: string
  site_key: 'rva' | 'alpenglow'
  block_type: string
  question: string
  answer: string
  source_citation: string
  target_queries: string[]
  display_on_page: string
  display_order: number
  is_active: boolean
}

const emptySeo: Omit<SeoPage, 'id'> = {
  site_key: 'rva', page_slug: '/', meta_title: '', meta_description: '', meta_keywords: '',
  og_title: '', og_description: '', og_image_url: '', canonical_url: '', no_index: false, no_follow: false,
}

type Tab = 'answers' | 'meta' | 'schema' | 'sitemap' | 'nextsteps'

// ─── MAIN COMPONENT ───────────────────────────────
export default function SeoAdminPage() {
  const [tab, setTab] = useState<Tab>('answers')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Shared
  const supabase = createClient()

  // ─── AEO/GEO Tab State ───
  const [geoBlocks, setGeoBlocks] = useState<GeoBlock[]>([])
  const [geoLoading, setGeoLoading] = useState(true)
  const [queryInput, setQueryInput] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<'rva' | 'alpenglow'>('rva')
  const [generating, setGenerating] = useState(false)
  const [generatedPreview, setGeneratedPreview] = useState<{
    question: string; answer: string; block_type: string; source_citation: string;
    target_queries: string[]; meta_title?: string; meta_description?: string
  } | null>(null)
  const [savingGenerated, setSavingGenerated] = useState(false)
  const [batchInput, setBatchInput] = useState('')
  const [batchGenerating, setBatchGenerating] = useState(false)
  const [batchResults, setBatchResults] = useState<Array<{
    question: string; answer: string; block_type: string; source_citation: string; target_queries: string[]; saved?: boolean
  }>>([])

  // ─── Meta Tab State ───
  const [seoPages, setSeoPages] = useState<SeoPage[]>([])
  const [seoLoading, setSeoLoading] = useState(true)
  const [seoModalOpen, setSeoModalOpen] = useState(false)
  const [seoEditing, setSeoEditing] = useState<SeoPage | null>(null)
  const [seoForm, setSeoForm] = useState(emptySeo)
  const [seoSaving, setSeoSaving] = useState(false)
  const [metaGenerating, setMetaGenerating] = useState(false)

  // ─── Fetchers ───
  const fetchGeo = useCallback(async () => {
    const { data } = await supabase.from('geo_content_blocks').select('*').order('site_key').order('display_order')
    setGeoBlocks((data as GeoBlock[]) || [])
    setGeoLoading(false)
  }, [supabase])

  const fetchSeo = useCallback(async () => {
    const { data } = await supabase.from('seo_pages').select('*').order('site_key').order('page_slug')
    setSeoPages((data as SeoPage[]) || [])
    setSeoLoading(false)
  }, [supabase])

  useEffect(() => { fetchGeo(); fetchSeo() }, [fetchGeo, fetchSeo])

  // Strip markdown fences from AI responses before JSON.parse
  const cleanJsonResponse = (raw: string): string => {
    let s = raw.trim()
    if (s.startsWith('```')) {
      s = s.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
    }
    return s.trim()
  }

  // ─── AI Generate from single query ───
  const handleGenerate = async () => {
    if (!queryInput.trim()) return
    setGenerating(true)
    setGeneratedPreview(null)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Search query: "${queryInput}"`, type: 'aeo_from_query', brand: selectedBrand }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const parsed = JSON.parse(cleanJsonResponse(data.result))
      setGeneratedPreview(parsed)
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'AI generation failed', type: 'error' })
    }
    setGenerating(false)
  }

  // ─── Save generated block ───
  const handleSaveGenerated = async () => {
    if (!generatedPreview) return
    setSavingGenerated(true)
    const nextOrder = geoBlocks.filter(b => b.site_key === selectedBrand).length
    const { error } = await supabase.from('geo_content_blocks').insert({
      site_key: selectedBrand,
      block_type: generatedPreview.block_type || 'fact',
      question: generatedPreview.question,
      answer: generatedPreview.answer,
      source_citation: generatedPreview.source_citation || '',
      target_queries: generatedPreview.target_queries || [],
      display_on_page: '/',
      display_order: nextOrder,
      is_active: true,
    })
    if (error) {
      setToast({ message: error.message, type: 'error' })
    } else {
      setToast({ message: 'Answer block saved! It will appear on your site.', type: 'success' })
      setGeneratedPreview(null)
      setQueryInput('')
      fetchGeo()
    }
    setSavingGenerated(false)
  }

  // ─── Batch generate ───
  const handleBatchGenerate = async () => {
    const queries = batchInput.split('\n').map(q => q.trim()).filter(Boolean)
    if (queries.length === 0) return
    setBatchGenerating(true)
    setBatchResults([])
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate answer blocks for these search queries:\n${queries.map((q, i) => `${i + 1}. "${q}"`).join('\n')}`,
          type: 'aeo_batch',
          brand: selectedBrand,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const parsed = JSON.parse(cleanJsonResponse(data.result))
      setBatchResults(Array.isArray(parsed) ? parsed : [parsed])
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Batch generation failed', type: 'error' })
    }
    setBatchGenerating(false)
  }

  const handleSaveBatchItem = async (item: typeof batchResults[0], index: number) => {
    const nextOrder = geoBlocks.filter(b => b.site_key === selectedBrand).length + index
    const { error } = await supabase.from('geo_content_blocks').insert({
      site_key: selectedBrand, block_type: item.block_type || 'fact',
      question: item.question, answer: item.answer,
      source_citation: item.source_citation || '',
      target_queries: item.target_queries || [],
      display_on_page: '/', display_order: nextOrder, is_active: true,
    })
    if (error) {
      setToast({ message: error.message, type: 'error' })
    } else {
      setBatchResults(prev => prev.map((r, i) => i === index ? { ...r, saved: true } : r))
      fetchGeo()
    }
  }

  const handleSaveAllBatch = async () => {
    for (let i = 0; i < batchResults.length; i++) {
      if (!batchResults[i].saved) await handleSaveBatchItem(batchResults[i], i)
    }
    setToast({ message: `${batchResults.length} answer blocks saved!`, type: 'success' })
    setBatchInput('')
  }

  // ─── GEO Block Delete ───
  const handleGeoDelete = async (id: string) => {
    await supabase.from('geo_content_blocks').delete().eq('id', id)
    setToast({ message: 'Answer block deleted.', type: 'success' })
    fetchGeo()
  }

  // ─── Meta Tag handlers ───
  const openSeoEdit = (item: SeoPage) => {
    setSeoEditing(item)
    setSeoForm({ site_key: item.site_key, page_slug: item.page_slug, meta_title: item.meta_title, meta_description: item.meta_description, meta_keywords: item.meta_keywords, og_title: item.og_title, og_description: item.og_description, og_image_url: item.og_image_url, canonical_url: item.canonical_url, no_index: item.no_index, no_follow: item.no_follow })
    setSeoModalOpen(true)
  }
  const handleSeoSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSeoSaving(true)
    if (seoEditing) {
      const { error } = await supabase.from('seo_pages').update(seoForm).eq('id', seoEditing.id)
      setToast(error ? { message: error.message, type: 'error' } : { message: 'Meta tags updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('seo_pages').insert(seoForm)
      setToast(error ? { message: error.message, type: 'error' } : { message: 'Meta tags created!', type: 'success' })
    }
    setSeoSaving(false); setSeoModalOpen(false); fetchSeo()
  }
  const handleAutoGenerateMeta = async (page: SeoPage) => {
    setMetaGenerating(true)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate SEO meta tags for the ${page.page_slug === '/' ? 'homepage' : page.page_slug + ' page'} of ${page.site_key === 'rva' ? 'Rich Valley Adventures' : 'Aspen Alpenglow Limousine'}`,
          type: 'meta_tags',
          brand: page.site_key,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const parsed = JSON.parse(cleanJsonResponse(data.result))
      const { error } = await supabase.from('seo_pages').update({
        meta_title: parsed.meta_title || page.meta_title,
        meta_description: parsed.meta_description || page.meta_description,
        meta_keywords: parsed.meta_keywords || page.meta_keywords,
        og_title: parsed.og_title || page.og_title,
        og_description: parsed.og_description || page.og_description,
      }).eq('id', page.id)
      if (error) throw new Error(error.message)
      setToast({ message: 'Meta tags auto-generated!', type: 'success' })
      fetchSeo()
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Failed to generate', type: 'error' })
    }
    setMetaGenerating(false)
  }
  const updateSeoForm = (name: string, value: string | number | boolean) => setSeoForm((prev) => ({ ...prev, [name]: value }))

  const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

  // ─── Next Steps Tab State ───
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {}
    try { return JSON.parse(localStorage.getItem('seo_nextsteps_checked') || '{}') } catch { return {} }
  })

  const toggleChecked = (id: string) => {
    setCheckedItems(prev => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem('seo_nextsteps_checked', JSON.stringify(next))
      return next
    })
  }

  const tabs: { key: Tab; label: string; desc: string }[] = [
    { key: 'answers', label: 'AI Answers', desc: 'Get your business cited by AI search' },
    { key: 'meta', label: 'Google SEO', desc: 'Traditional search results' },
    { key: 'schema', label: 'Schema', desc: 'Structured data' },
    { key: 'sitemap', label: 'Sitemap', desc: 'Crawl settings' },
    { key: 'nextsteps', label: 'Next Steps', desc: 'Action checklist' },
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Search & AI Visibility</h1>
      <p className="text-slate-500 text-sm mb-6">Control how your business appears in Google, ChatGPT, Perplexity, Siri, and other AI search engines.</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-slate-100 p-1 rounded-lg w-fit">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 rounded-md transition-colors ${tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <span className="text-sm font-medium">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════
          TAB 1: AI ANSWERS (AEO/GEO) — The main event
          ════════════════════════════════════════════ */}
      {tab === 'answers' && (
        <div>
          {/* Explainer */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">How AI Answers Work</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              When someone asks ChatGPT, Perplexity, Google AI, or Siri a question like <em>&ldquo;best limo service in Aspen&rdquo;</em>,
              these AI engines scan the web for <strong>factual, authoritative answers</strong> to cite.
              The blocks below are designed to be picked up and quoted by AI engines as the definitive answer.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>How to use:</strong> Type a search query you want your business to show up for.
              AI will generate the perfect answer block. Review it, then save. That&apos;s it.
            </p>
          </div>

          {/* Brand selector */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium text-slate-700">Generate for:</span>
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              <button onClick={() => setSelectedBrand('rva')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${selectedBrand === 'rva' ? 'bg-white shadow-sm text-green-700' : 'text-slate-500'}`}>
                Rich Valley Adventures
              </button>
              <button onClick={() => setSelectedBrand('alpenglow')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${selectedBrand === 'alpenglow' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500'}`}>
                Aspen Alpenglow Limo
              </button>
            </div>
          </div>

          {/* ─── Single Query Generator ─── */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Enter a search query you want to rank for</h3>
            <p className="text-xs text-slate-400 mb-4">
              Type it exactly as a customer would search — e.g., &ldquo;best fly fishing guide in Aspen&rdquo; or &ldquo;Aspen airport limo cost&rdquo;
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder={selectedBrand === 'rva' ? 'e.g., best guided fly fishing near Aspen Colorado' : 'e.g., private car service Aspen to Denver airport'}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={handleGenerate}
                disabled={generating || !queryInput.trim()}
                className="px-6 py-3 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {generating ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    Generating...
                  </span>
                ) : 'Generate Answer'}
              </button>
            </div>
          </div>

          {/* ─── Generated Preview ─── */}
          {generatedPreview && (
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-purple-200 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-purple-700">Generated Answer — Review Before Saving</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">{generatedPreview.block_type}</span>
              </div>

              {/* What AI engines will see */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-4">
                <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-medium">How this appears when AI answers the query</p>
                <p className="text-sm font-semibold text-slate-800 mb-2">{generatedPreview.question}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{generatedPreview.answer}</p>
                {generatedPreview.source_citation && (
                  <p className="text-xs text-slate-400 mt-2 italic">Source: {generatedPreview.source_citation}</p>
                )}
              </div>

              {/* Related queries */}
              {generatedPreview.target_queries && generatedPreview.target_queries.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-1.5">Also targets these searches:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedPreview.target_queries.map((q, i) => (
                      <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{q}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Google preview if meta was generated */}
              {generatedPreview.meta_title && (
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-4">
                  <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-medium">Google search preview (bonus)</p>
                  <p className="text-blue-700 text-base font-medium truncate">{generatedPreview.meta_title}</p>
                  <p className="text-green-700 text-xs mt-0.5">richvalleyadventures.com</p>
                  <p className="text-slate-600 text-sm mt-1">{generatedPreview.meta_description}</p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveGenerated}
                  disabled={savingGenerated}
                  className="px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {savingGenerated ? 'Saving...' : 'Save to Site'}
                </button>
                <button onClick={handleGenerate} disabled={generating} className="px-5 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                  Regenerate
                </button>
                <button onClick={() => setGeneratedPreview(null)} className="px-5 py-2.5 text-slate-500 text-sm font-medium hover:text-slate-700 transition-colors">
                  Discard
                </button>
              </div>
            </div>
          )}

          {/* ─── Batch Generator ─── */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Batch: Multiple queries at once</h3>
            <p className="text-xs text-slate-400 mb-4">Enter one search query per line. AI will generate an answer block for each one.</p>
            <textarea
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              rows={4}
              placeholder={selectedBrand === 'rva'
                ? "best fly fishing guide Aspen\nhow much does guided fishing cost in Colorado\noutdoor adventures near Snowmass Village\nfamily activities in Roaring Fork Valley"
                : "limo service Aspen to Denver airport\nwedding transportation Aspen Colorado\nprivate car service Eagle airport to Aspen\nhow much is a limo in Aspen"
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3"
            />
            <button
              onClick={handleBatchGenerate}
              disabled={batchGenerating || !batchInput.trim()}
              className="px-5 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {batchGenerating ? 'Generating all...' : `Generate ${batchInput.split('\n').filter(l => l.trim()).length || 0} Answers`}
            </button>
          </div>

          {/* ─── Batch Results ─── */}
          {batchResults.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900">{batchResults.length} answers generated</h3>
                <button
                  onClick={handleSaveAllBatch}
                  disabled={batchResults.every(r => r.saved)}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  Save All to Site
                </button>
              </div>
              <div className="space-y-3">
                {batchResults.map((item, i) => (
                  <div key={i} className={`bg-white rounded-xl p-5 shadow-sm border ${item.saved ? 'border-green-200 bg-green-50' : 'border-slate-200'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800 mb-1">{item.question}</p>
                        <p className="text-sm text-slate-600">{item.answer}</p>
                        {item.target_queries?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.target_queries.map((q, qi) => (
                              <span key={qi} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{q}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      {item.saved ? (
                        <span className="text-xs text-green-600 font-medium whitespace-nowrap flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Saved
                        </span>
                      ) : (
                        <button onClick={() => handleSaveBatchItem(item, i)} className="text-xs text-purple-600 hover:text-purple-800 font-medium whitespace-nowrap">
                          Save
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Existing Answer Blocks ─── */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Your Published Answer Blocks</h3>
            <p className="text-xs text-slate-400 mb-4">These are live on your site and being indexed by AI search engines right now.</p>
            {geoLoading ? (
              <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
            ) : geoBlocks.length === 0 ? (
              <div className="bg-slate-50 rounded-xl p-8 text-center border border-dashed border-slate-300">
                <p className="text-slate-500 text-sm mb-1">No answer blocks yet</p>
                <p className="text-slate-400 text-xs">Use the search query input above to generate your first one.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {geoBlocks.map((block) => (
                  <div key={block.id} className={`bg-white rounded-xl p-5 shadow-sm border ${block.is_active ? 'border-slate-200' : 'border-red-200 opacity-60'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${block.site_key === 'rva' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {block.site_key === 'rva' ? 'RVA' : 'Alpenglow'}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">{block.block_type}</span>
                      </div>
                      <button onClick={() => handleGeoDelete(block.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
                    </div>
                    {block.question && <p className="text-sm font-semibold text-slate-800 mb-1">{block.question}</p>}
                    <p className="text-sm text-slate-600">{block.answer}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-xs ${wordCount(block.answer) > 50 ? 'text-amber-500' : 'text-slate-400'}`}>{wordCount(block.answer)} words</span>
                      {block.target_queries?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {block.target_queries.slice(0, 3).map((q, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{q}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          TAB 2: GOOGLE SEO (Meta Tags)
          ════════════════════════════════════════════ */}
      {tab === 'meta' && (
        <div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-1">What are meta tags?</h3>
            <p className="text-xs text-blue-700 leading-relaxed">
              Meta tags control how your pages look in Google search results — the blue title, the description snippet, and the image shown when someone shares your link on Facebook/iMessage.
              These are already set up with good defaults. You can click <strong>&ldquo;Auto-Generate&rdquo;</strong> on any page to have AI optimize them further.
            </p>
          </div>

          {seoLoading ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
          ) : seoPages.length === 0 ? (
            <div className="bg-slate-50 rounded-xl p-8 text-center border border-dashed border-slate-300">
              <p className="text-slate-500 text-sm">Meta tags will appear here after seeding default data.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {seoPages.map((page) => (
                <div key={page.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${page.site_key === 'rva' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {page.site_key === 'rva' ? 'RVA' : 'Alpenglow'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{page.page_slug}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAutoGenerateMeta(page)} disabled={metaGenerating} className="text-xs text-purple-600 hover:text-purple-800 font-medium disabled:opacity-50">
                        {metaGenerating ? 'Generating...' : 'Auto-Generate'}
                      </button>
                      <button onClick={() => openSeoEdit(page)} className="text-xs text-slate-600 hover:text-slate-900 font-medium">Edit</button>
                    </div>
                  </div>
                  {/* Google Preview */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider font-medium">Google search preview</p>
                    <p className="text-blue-700 text-base font-medium leading-tight truncate">{page.meta_title || 'Untitled Page'}</p>
                    <p className="text-green-700 text-xs mt-0.5">{page.canonical_url || `${page.site_key === 'rva' ? 'richvalleyadventures.com' : 'aspenalpenglow.com'}${page.page_slug}`}</p>
                    <p className="text-slate-600 text-sm mt-1 line-clamp-2">{page.meta_description || 'No description set.'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <AdminFormModal isOpen={seoModalOpen} title={seoEditing ? 'Edit Page Meta Tags' : 'Add Page Meta Tags'} onSubmit={handleSeoSubmit} onClose={() => setSeoModalOpen(false)} loading={seoSaving}>
            <FormField label="Site" name="site_key" type="select" value={seoForm.site_key} onChange={updateSeoForm} options={[{ value: 'rva', label: 'Rich Valley Adventures' }, { value: 'alpenglow', label: 'Aspen Alpenglow Limousine' }]} help="Which site these meta tags apply to." />
            <FormField label="Page" name="page_slug" value={seoForm.page_slug} onChange={updateSeoForm} required help="Which page — use '/' for homepage, '/about' for about page, etc." />
            <FormField label="Title Tag" name="meta_title" value={seoForm.meta_title} onChange={updateSeoForm} maxLength={60} help="The clickable blue headline in Google results. Most important SEO field. Keep it under 60 characters." preview="Google search result title + browser tab" />
            <FormField label="Description" name="meta_description" type="textarea" value={seoForm.meta_description} onChange={updateSeoForm} maxLength={160} help="The text snippet under your title in Google. Write it like a mini sales pitch." preview="Google search result snippet" />
            <FormField label="Keywords" name="meta_keywords" value={seoForm.meta_keywords} onChange={updateSeoForm} help="Comma-separated keywords. Less important today, but still used by some engines." />
            <FormField label="Social Share Title" name="og_title" value={seoForm.og_title} onChange={updateSeoForm} help="Title shown when someone shares your link on Facebook, LinkedIn, or iMessage." preview="Social media link previews" />
            <FormField label="Social Share Description" name="og_description" type="textarea" value={seoForm.og_description} onChange={updateSeoForm} help="Description shown in social media link previews." preview="Social media link previews" />
            <FormField label="Social Share Image" name="og_image_url" value={seoForm.og_image_url} onChange={updateSeoForm} help="Image shown when your link is shared on social media. Best size: 1200x630px." preview="Social media card image" />
            <FormField label="Canonical URL" name="canonical_url" value={seoForm.canonical_url} onChange={updateSeoForm} help="The 'official' URL for this page. Prevents duplicate content penalties." />
            <FormField label="Hide from Google" name="no_index" type="checkbox" value={seoForm.no_index} onChange={updateSeoForm} help="Check this to tell Google NOT to show this page in search results." />
            <FormField label="Don't follow links" name="no_follow" type="checkbox" value={seoForm.no_follow} onChange={updateSeoForm} help="Check this to tell Google not to follow links on this page." />
          </AdminFormModal>
        </div>
      )}

      {/* ════════════════════════════════════════════
          TAB 3: SCHEMA MARKUP
          ════════════════════════════════════════════ */}
      {tab === 'schema' && (
        <div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-green-900 mb-1">What is schema markup?</h3>
            <p className="text-xs text-green-700 leading-relaxed">
              Schema is invisible code on your site that tells Google exactly what your business is — your name, location, services, vehicles, ratings, and FAQs.
              It&apos;s why some Google results show star ratings, FAQ dropdowns, or business info boxes.
              <strong> Yours is fully automated</strong> — it updates automatically when you change anything in the admin panel.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              { type: 'LocalBusiness', desc: 'Business name, phone, address, hours', sites: 'Both sites', auto: true },
              { type: 'FAQPage', desc: 'All your FAQs, eligible for Google dropdowns', sites: 'Both sites', auto: true },
              { type: 'Vehicle', desc: 'Escalade + Sprinter specs and capacity', sites: 'Alpenglow', auto: true },
              { type: 'OfferCatalog', desc: 'Adventures + transportation packages', sites: 'Both sites', auto: true },
              { type: 'AggregateRating', desc: 'Star ratings from testimonials', sites: 'Both sites', auto: true },
              { type: 'GeoCoordinates', desc: 'Aspen, CO location for map results', sites: 'Both sites', auto: true },
            ].map((s) => (
              <div key={s.type} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-sm font-semibold text-slate-900">{s.type}</span>
                </div>
                <p className="text-xs text-slate-500 mb-1">{s.desc}</p>
                <p className="text-[10px] text-green-600">Auto-generated from your admin data</p>
              </div>
            ))}
          </div>

          <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            Test Your Schema in Google
          </a>
        </div>
      )}

      {/* ════════════════════════════════════════════
          TAB 4: SITEMAP & ROBOTS
          ════════════════════════════════════════════ */}
      {tab === 'sitemap' && (
        <div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">What are sitemaps and robots.txt?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              A <strong>sitemap</strong> is a list of all your pages that you submit to Google so it knows what to index.
              <strong>robots.txt</strong> tells search engines which pages they&apos;re allowed to visit.
              Both are <strong>auto-generated</strong> — you don&apos;t need to do anything here.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <h3 className="text-sm font-semibold text-slate-900">sitemap.xml</h3>
                <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Auto-generated</span>
              </div>
              <pre className="text-xs text-slate-500 bg-slate-50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-48">{`richvalleyadventures.com/
richvalleyadventures.com/about
richvalleyadventures.com/adventures
richvalleyadventures.com/gallery
richvalleyadventures.com/contact
richvalleyadventures.com/terms
richvalleyadventures.com/privacy
aspenalpenglow.com/
aspenalpenglow.com/services
aspenalpenglow.com/fleet
aspenalpenglow.com/destinations
aspenalpenglow.com/contact`}</pre>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <h3 className="text-sm font-semibold text-slate-900">robots.txt</h3>
                <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Auto-generated</span>
              </div>
              <pre className="text-xs text-slate-500 bg-slate-50 p-4 rounded-lg whitespace-pre-wrap">{`User-agent: *
Allow: /
Disallow: /admin/

Sitemap: richvalleyadventures.com/sitemap.xml
Sitemap: aspenalpenglow.com/sitemap.xml`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          TAB 5: NEXT STEPS CHECKLIST
          ════════════════════════════════════════════ */}
      {tab === 'nextsteps' && (() => {
        const checklistItems = [
          // HIGH PRIORITY
          {
            id: 'google-business', priority: 'HIGH' as const,
            title: 'Claim Google Business Profile',
            desc: 'Create listings for both Rich Valley Adventures and Aspen Alpenglow Limousine.',
            why: "Google's AI Overview and ChatGPT both pull from Google Business listings as a primary source for local recommendations.",
            links: [{ label: 'Open Google Business', href: 'https://business.google.com' }],
            time: '~30 min',
          },
          {
            id: 'bing-webmaster', priority: 'HIGH' as const,
            title: 'Submit to Bing Webmaster Tools',
            desc: 'Add both sitemaps (richvalleyadventures.com/sitemap.xml, aspenalpenglow.com/sitemap.xml).',
            why: "ChatGPT uses Bing for real-time search. If Bing can't find you, ChatGPT can't recommend you.",
            links: [{ label: 'Open Bing Webmaster', href: 'https://www.bing.com/webmasters' }],
            time: '~15 min',
          },
          {
            id: 'tripadvisor', priority: 'HIGH' as const,
            title: 'Create TripAdvisor Listings',
            desc: 'List both businesses with photos, services, and pricing.',
            why: 'AI models cite TripAdvisor heavily for travel and activity recommendations. A complete profile with reviews is gold.',
            links: [{ label: 'Open TripAdvisor for Owners', href: 'https://www.tripadvisor.com/Owners' }],
            time: '~45 min',
          },
          {
            id: 'yelp', priority: 'HIGH' as const,
            title: 'Claim Yelp Business Pages',
            desc: 'Create/claim listings for both brands.',
            why: 'Another authoritative source AI models trust for local business information and reviews.',
            links: [{ label: 'Open Yelp for Business', href: 'https://biz.yelp.com' }],
            time: '~20 min',
          },
          {
            id: 'viator', priority: 'HIGH' as const,
            title: "List Adventures on Viator / GetYourGuide",
            desc: "List RVA's fly fishing, hiking, biking, and camping experiences on both booking platforms.",
            why: 'AI models recommend activities from booking platforms. Being listed here dramatically increases chances of being suggested.',
            links: [
              { label: 'Viator Supplier', href: 'https://supplier.viator.com' },
              { label: 'GetYourGuide Supplier', href: 'https://supplier.getyourguide.com' },
            ],
            time: '~1 hour',
          },
          // MEDIUM PRIORITY
          {
            id: 'chamber', priority: 'MEDIUM' as const,
            title: 'Join Aspen Chamber of Commerce',
            desc: 'Get listed in the local business directory.',
            why: 'Local authority signals matter for both traditional and AI search. Chamber membership adds credibility.',
            links: [{ label: 'Aspen Chamber', href: 'https://www.aspenchamber.org' }],
            time: '~30 min',
          },
          {
            id: 'reviews', priority: 'MEDIUM' as const,
            title: 'Launch Review Collection Campaign',
            desc: 'Ask 10–20 satisfied customers to leave Google and TripAdvisor reviews. That 4.9 rating is incredible — but it needs to be documented on third-party platforms, not just your own site.',
            why: 'AI models surface businesses with verified third-party reviews far more often than those without.',
            links: [],
            time: '~2 hours over a few weeks',
          },
          {
            id: 'blog', priority: 'MEDIUM' as const,
            title: 'Publish 5–10 Blog Posts',
            desc: 'Write posts answering the exact questions people ask AI: "Best fly fishing guides in Aspen", "Aspen airport limo service", "Summer activities in Aspen for families", "Private car service Aspen to Denver", "Guided hiking tours near Snowmass".',
            why: 'AI models surface pages that directly answer conversational queries.',
            links: [],
            time: '~3–4 hours total',
          },
          {
            id: 'schema-check', priority: 'MEDIUM' as const,
            title: 'Verify Schema Markup is Complete',
            desc: 'Check the Schema tab in this admin panel. Make sure FAQ, LocalBusiness, TouristAttraction, AggregateRating, and Offer schema types are all configured for both sites.',
            why: 'Structured data gives AI models concrete, citable facts.',
            links: [],
            time: '~30 min',
          },
          // ALREADY DONE
          {
            id: 'llms-txt', priority: 'DONE' as const,
            title: 'llms.txt Created',
            desc: '✅ Your llms.txt file is live at /llms.txt on both domains. This tells AI crawlers about your business, services, and differentiators.',
            why: 'AI crawlers read llms.txt to understand your business without needing to parse your full site.',
            links: [],
            time: 'No action needed',
          },
        ]

        const totalActionable = checklistItems.filter(i => i.priority !== 'DONE').length
        const completedCount = checklistItems.filter(i => checkedItems[i.id]).length
        const pct = Math.round((completedCount / (totalActionable + 1)) * 100) // +1 for the already-done item

        const groups: { label: string; priority: 'HIGH' | 'MEDIUM' | 'DONE'; color: string; bg: string }[] = [
          { label: 'HIGH PRIORITY', priority: 'HIGH', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
          { label: 'MEDIUM PRIORITY', priority: 'MEDIUM', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
          { label: 'ALREADY DONE', priority: 'DONE', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
        ]

        return (
          <div>
            {/* Intro */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Your AI Visibility Action Plan</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your site&apos;s technical SEO and schema are solid. These are the <strong>off-site actions</strong> that will get you
                cited by ChatGPT, Perplexity, Google AI Overview, and Siri. Work through these in order.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-900">{completedCount} of 10 completed</span>
                <span className="text-sm text-slate-500">{pct}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Checklist Groups */}
            {groups.map(group => (
              <div key={group.priority} className="mb-8">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-4 border ${group.bg} ${group.color}`}>
                  {group.label}
                </div>
                <div className="space-y-3">
                  {checklistItems.filter(item => item.priority === group.priority).map(item => {
                    const done = !!checkedItems[item.id] || item.priority === 'DONE'
                    return (
                      <div key={item.id} className={`bg-white border rounded-xl p-5 shadow-sm transition-opacity ${done ? 'opacity-60' : 'opacity-100'} border-slate-200`}>
                        <div className="flex gap-4">
                          {item.priority !== 'DONE' && (
                            <button
                              onClick={() => toggleChecked(item.id)}
                              className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${checkedItems[item.id] ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 hover:border-indigo-400'}`}
                              aria-label={checkedItems[item.id] ? 'Mark incomplete' : 'Mark complete'}
                            >
                              {checkedItems[item.id] && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          )}
                          {item.priority === 'DONE' && (
                            <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 bg-green-500 border-green-500 flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                              <h3 className={`text-sm font-semibold ${done ? 'line-through text-slate-400' : 'text-slate-900'}`}>{item.title}</h3>
                              <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{item.time}</span>
                            </div>
                            <p className="text-xs text-slate-600 mb-2 leading-relaxed">{item.desc}</p>
                            <div className="flex items-start gap-1.5 mb-3">
                              <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              <p className="text-[11px] text-amber-800 leading-relaxed"><strong>Why it matters:</strong> {item.why}</p>
                            </div>
                            {item.links.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {item.links.map(link => (
                                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    {link.label}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )
      })()}
    </div>
  )
}
