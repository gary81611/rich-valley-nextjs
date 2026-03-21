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

const emptyGeo: Omit<GeoBlock, 'id'> = {
  site_key: 'rva', block_type: 'fact', question: '', answer: '', source_citation: '',
  target_queries: [], display_on_page: '/', display_order: 0, is_active: true,
}

const blockTypes = [
  { value: 'fact', label: 'Fact' },
  { value: 'statistic', label: 'Statistic' },
  { value: 'definition', label: 'Definition' },
  { value: 'comparison', label: 'Comparison' },
  { value: 'how_to', label: 'How To' },
  { value: 'local_info', label: 'Local Info' },
]

type Tab = 'meta' | 'geo' | 'schema' | 'sitemap'

export default function SeoPage() {
  const [tab, setTab] = useState<Tab>('meta')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Meta state
  const [seoPages, setSeoPages] = useState<SeoPage[]>([])
  const [seoLoading, setSeoLoading] = useState(true)
  const [seoModalOpen, setSeoModalOpen] = useState(false)
  const [seoEditing, setSeoEditing] = useState<SeoPage | null>(null)
  const [seoForm, setSeoForm] = useState(emptySeo)
  const [seoSaving, setSeoSaving] = useState(false)

  // GEO state
  const [geoBlocks, setGeoBlocks] = useState<GeoBlock[]>([])
  const [geoLoading, setGeoLoading] = useState(true)
  const [geoModalOpen, setGeoModalOpen] = useState(false)
  const [geoEditing, setGeoEditing] = useState<GeoBlock | null>(null)
  const [geoForm, setGeoForm] = useState(emptyGeo)
  const [geoSaving, setGeoSaving] = useState(false)
  const [geoFilter, setGeoFilter] = useState<string>('all')
  const [geoTypeFilter, setGeoTypeFilter] = useState<string>('all')
  const [targetQueriesStr, setTargetQueriesStr] = useState('')

  // Schema state
  const [schemaData, setSchemaData] = useState<Record<string, unknown>[]>([])

  const supabase = createClient()

  // Fetch SEO pages
  const fetchSeo = useCallback(async () => {
    const { data } = await supabase.from('seo_pages').select('*').order('site_key').order('page_slug')
    setSeoPages((data as SeoPage[]) || [])
    setSeoLoading(false)
  }, [supabase])

  // Fetch GEO blocks
  const fetchGeo = useCallback(async () => {
    const { data } = await supabase.from('geo_content_blocks').select('*').order('site_key').order('display_order')
    setGeoBlocks((data as GeoBlock[]) || [])
    setGeoLoading(false)
  }, [supabase])

  useEffect(() => { fetchSeo(); fetchGeo() }, [fetchSeo, fetchGeo])

  // Build schema preview
  useEffect(() => {
    const schemas: Record<string, unknown>[] = [
      { '@type': 'LocalBusiness (RVA)', status: 'Auto-generated from site_settings + adventures' },
      { '@type': 'LocalBusiness (Alpenglow)', status: 'Auto-generated from site_settings + services + fleet' },
      { '@type': 'FAQPage (RVA)', status: 'Auto-generated from FAQs' },
      { '@type': 'FAQPage (Alpenglow)', status: 'Auto-generated from FAQs' },
      { '@type': 'Vehicle (Escalade)', status: 'Auto-generated from fleet_vehicles' },
      { '@type': 'Vehicle (Sprinter)', status: 'Auto-generated from fleet_vehicles' },
      { '@type': 'OfferCatalog (RVA)', status: 'Auto-generated from adventures' },
      { '@type': 'OfferCatalog (Alpenglow)', status: 'Auto-generated from services' },
    ]
    setSchemaData(schemas)
  }, [])

  // SEO handlers
  const openSeoAdd = () => { setSeoEditing(null); setSeoForm(emptySeo); setSeoModalOpen(true) }
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
      setToast(error ? { message: error.message, type: 'error' } : { message: 'SEO page updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('seo_pages').insert(seoForm)
      setToast(error ? { message: error.message, type: 'error' } : { message: 'SEO page created!', type: 'success' })
    }
    setSeoSaving(false); setSeoModalOpen(false); fetchSeo()
  }
  const handleSeoDelete = async (id: string) => {
    await supabase.from('seo_pages').delete().eq('id', id)
    setToast({ message: 'SEO page deleted.', type: 'success' }); fetchSeo()
  }
  const updateSeoForm = (name: string, value: string | number | boolean) => setSeoForm((prev) => ({ ...prev, [name]: value }))

  // GEO handlers
  const openGeoAdd = () => { setGeoEditing(null); setGeoForm(emptyGeo); setTargetQueriesStr(''); setGeoModalOpen(true) }
  const openGeoEdit = (item: GeoBlock) => {
    setGeoEditing(item)
    setGeoForm({ site_key: item.site_key, block_type: item.block_type, question: item.question, answer: item.answer, source_citation: item.source_citation, target_queries: item.target_queries, display_on_page: item.display_on_page, display_order: item.display_order, is_active: item.is_active })
    setTargetQueriesStr((item.target_queries || []).join(', '))
    setGeoModalOpen(true)
  }
  const handleGeoSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setGeoSaving(true)
    const payload = { ...geoForm, target_queries: targetQueriesStr.split(',').map((s) => s.trim()).filter(Boolean) }
    if (geoEditing) {
      const { error } = await supabase.from('geo_content_blocks').update(payload).eq('id', geoEditing.id)
      setToast(error ? { message: error.message, type: 'error' } : { message: 'GEO block updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('geo_content_blocks').insert(payload)
      setToast(error ? { message: error.message, type: 'error' } : { message: 'GEO block created!', type: 'success' })
    }
    setGeoSaving(false); setGeoModalOpen(false); fetchGeo()
  }
  const handleGeoDelete = async (id: string) => {
    await supabase.from('geo_content_blocks').delete().eq('id', id)
    setToast({ message: 'GEO block deleted.', type: 'success' }); fetchGeo()
  }
  const updateGeoForm = (name: string, value: string | number | boolean) => setGeoForm((prev) => ({ ...prev, [name]: value }))

  const filteredGeo = geoBlocks.filter((b) => {
    if (geoFilter !== 'all' && b.site_key !== geoFilter) return false
    if (geoTypeFilter !== 'all' && b.block_type !== geoTypeFilter) return false
    return true
  })

  const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

  const tabs: { key: Tab; label: string }[] = [
    { key: 'meta', label: 'Page Meta Tags' },
    { key: 'geo', label: 'GEO Content Blocks' },
    { key: 'schema', label: 'Schema Markup' },
    { key: 'sitemap', label: 'Sitemap & Robots' },
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-slate-900 mb-1">SEO & Discovery</h1>
      <p className="text-slate-500 text-sm mb-6">Manage search engine, AI engine, and answer engine optimization.</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Meta Tags */}
      {tab === 'meta' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Page Meta Tags</h2>
            <button onClick={openSeoAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">Add Page</button>
          </div>
          {seoLoading ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
          ) : seoPages.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-slate-400 text-sm border border-slate-200">No SEO pages configured. Click &quot;Add Page&quot; to start.</div>
          ) : (
            <div className="space-y-4">
              {seoPages.map((page) => (
                <div key={page.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${page.site_key === 'rva' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {page.site_key === 'rva' ? 'RVA' : 'Alpenglow'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{page.page_slug}</span>
                        {page.no_index && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">noindex</span>}
                        {page.no_follow && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">nofollow</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openSeoEdit(page)} className="text-xs text-slate-600 hover:text-slate-900 font-medium">Edit</button>
                      <button onClick={() => handleSeoDelete(page.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
                    </div>
                  </div>
                  {/* Snippet Preview */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-400 mb-1">Google Preview</p>
                    <p className="text-blue-700 text-lg font-medium leading-tight truncate">
                      {page.meta_title || 'Page Title'}
                      {page.meta_title && <span className={page.meta_title.length > 60 ? ' text-red-500' : ''}> ({page.meta_title.length}/60)</span>}
                    </p>
                    <p className="text-green-700 text-xs mt-0.5">{page.canonical_url || `https://example.com${page.page_slug}`}</p>
                    <p className="text-slate-600 text-sm mt-1 line-clamp-2">
                      {page.meta_description || 'No description set.'}
                      {page.meta_description && <span className={page.meta_description.length > 160 ? ' text-red-500 font-medium' : ' text-slate-400'}> ({page.meta_description.length}/160)</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <AdminFormModal isOpen={seoModalOpen} title={seoEditing ? 'Edit Page SEO' : 'Add Page SEO'} onSubmit={handleSeoSubmit} onClose={() => setSeoModalOpen(false)} loading={seoSaving}>
            <FormField label="Site" name="site_key" type="select" value={seoForm.site_key} onChange={updateSeoForm} options={[{ value: 'rva', label: 'RVA' }, { value: 'alpenglow', label: 'Alpenglow' }]} />
            <FormField label="Page Slug" name="page_slug" value={seoForm.page_slug} onChange={updateSeoForm} required />
            <div>
              <FormField label="Meta Title" name="meta_title" value={seoForm.meta_title} onChange={updateSeoForm} />
              <p className={`text-xs mt-1 ${seoForm.meta_title.length > 60 ? 'text-red-500' : 'text-slate-400'}`}>{seoForm.meta_title.length}/60 characters</p>
            </div>
            <div>
              <FormField label="Meta Description" name="meta_description" type="textarea" value={seoForm.meta_description} onChange={updateSeoForm} />
              <p className={`text-xs mt-1 ${seoForm.meta_description.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>{seoForm.meta_description.length}/160 characters</p>
            </div>
            <FormField label="Keywords" name="meta_keywords" value={seoForm.meta_keywords} onChange={updateSeoForm} />
            <FormField label="OG Title" name="og_title" value={seoForm.og_title} onChange={updateSeoForm} />
            <FormField label="OG Description" name="og_description" type="textarea" value={seoForm.og_description} onChange={updateSeoForm} />
            <FormField label="OG Image URL" name="og_image_url" value={seoForm.og_image_url} onChange={updateSeoForm} />
            <FormField label="Canonical URL" name="canonical_url" value={seoForm.canonical_url} onChange={updateSeoForm} />
            <FormField label="No Index" name="no_index" type="checkbox" value={seoForm.no_index} onChange={updateSeoForm} />
            <FormField label="No Follow" name="no_follow" type="checkbox" value={seoForm.no_follow} onChange={updateSeoForm} />
          </AdminFormModal>
        </div>
      )}

      {/* TAB 2: GEO Content Blocks */}
      {tab === 'geo' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-slate-900">GEO Content Blocks</h2>
              <select value={geoFilter} onChange={(e) => setGeoFilter(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 py-1">
                <option value="all">All Sites</option>
                <option value="rva">RVA</option>
                <option value="alpenglow">Alpenglow</option>
              </select>
              <select value={geoTypeFilter} onChange={(e) => setGeoTypeFilter(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 py-1">
                <option value="all">All Types</option>
                {blockTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <button onClick={openGeoAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">Add Block</button>
          </div>
          {geoLoading ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
          ) : filteredGeo.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-slate-400 text-sm border border-slate-200">No GEO content blocks. Click &quot;Add Block&quot; to create citation-worthy content for AI engines.</div>
          ) : (
            <div className="space-y-3">
              {filteredGeo.map((block) => (
                <div key={block.id} className={`bg-white rounded-xl p-5 shadow-sm border ${block.is_active ? 'border-slate-200' : 'border-red-200 opacity-60'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${block.site_key === 'rva' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {block.site_key === 'rva' ? 'RVA' : 'Alpenglow'}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">{block.block_type}</span>
                      <span className="text-xs text-slate-400 font-mono">{block.display_on_page}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openGeoEdit(block)} className="text-xs text-slate-600 hover:text-slate-900 font-medium">Edit</button>
                      <button onClick={() => handleGeoDelete(block.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
                    </div>
                  </div>
                  {block.question && <p className="text-sm font-semibold text-slate-800 mb-1">{block.question}</p>}
                  <p className="text-sm text-slate-600">{block.answer}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs ${wordCount(block.answer) > 50 ? 'text-red-500' : 'text-slate-400'}`}>{wordCount(block.answer)} words</span>
                    {block.source_citation && <span className="text-xs text-slate-400">Source: {block.source_citation}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
          <AdminFormModal isOpen={geoModalOpen} title={geoEditing ? 'Edit GEO Block' : 'Add GEO Block'} onSubmit={handleGeoSubmit} onClose={() => setGeoModalOpen(false)} loading={geoSaving}>
            <FormField label="Site" name="site_key" type="select" value={geoForm.site_key} onChange={updateGeoForm} options={[{ value: 'rva', label: 'RVA' }, { value: 'alpenglow', label: 'Alpenglow' }]} />
            <FormField label="Block Type" name="block_type" type="select" value={geoForm.block_type} onChange={updateGeoForm} options={blockTypes} />
            <FormField label="Question" name="question" value={geoForm.question} onChange={updateGeoForm} />
            <div>
              <FormField label="Answer" name="answer" type="textarea" value={geoForm.answer} onChange={updateGeoForm} required />
              <p className={`text-xs mt-1 ${wordCount(geoForm.answer) > 50 ? 'text-red-500 font-medium' : 'text-slate-400'}`}>{wordCount(geoForm.answer)} words {wordCount(geoForm.answer) > 50 ? '(aim for under 40)' : ''}</p>
            </div>
            <FormField label="Source Citation" name="source_citation" value={geoForm.source_citation} onChange={updateGeoForm} />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target AI Queries (comma-separated)</label>
              <input
                type="text"
                value={targetQueriesStr}
                onChange={(e) => setTargetQueriesStr(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="e.g., best limo aspen, aspen airport transfer"
              />
            </div>
            <FormField label="Display Page" name="display_on_page" value={geoForm.display_on_page} onChange={updateGeoForm} />
            <FormField label="Display Order" name="display_order" type="number" value={geoForm.display_order} onChange={updateGeoForm} />
            <FormField label="Active" name="is_active" type="checkbox" value={geoForm.is_active} onChange={updateGeoForm} />
          </AdminFormModal>
        </div>
      )}

      {/* TAB 3: Schema Markup */}
      {tab === 'schema' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Schema Markup</h2>
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200"
            >
              Test in Google Rich Results
            </a>
          </div>
          <p className="text-slate-500 text-sm mb-6">JSON-LD structured data is auto-generated from your admin data. Below is a summary of active schemas.</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {schemaData.map((schema, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-sm font-semibold text-slate-900">{schema['@type'] as string}</span>
                </div>
                <p className="text-xs text-slate-500">{schema.status as string}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Schema Summary</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div><div className="text-2xl font-bold text-slate-900">2</div><div className="text-xs text-slate-500">LocalBusiness</div></div>
              <div><div className="text-2xl font-bold text-slate-900">2</div><div className="text-xs text-slate-500">FAQPage</div></div>
              <div><div className="text-2xl font-bold text-slate-900">2</div><div className="text-xs text-slate-500">Vehicle</div></div>
              <div><div className="text-2xl font-bold text-slate-900">2</div><div className="text-xs text-slate-500">OfferCatalog</div></div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Sitemap & Robots */}
      {tab === 'sitemap' && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Sitemap & Robots</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">sitemap.xml</h3>
              <pre className="text-xs text-slate-600 bg-slate-50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://richvalleyadventures.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://aspenalpenglow.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://richvalleyadventures.com/terms</loc>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://richvalleyadventures.com/privacy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`}</pre>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">robots.txt</h3>
              <pre className="text-xs text-slate-600 bg-slate-50 p-4 rounded-lg whitespace-pre-wrap">{`User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://richvalleyadventures.com/sitemap.xml
Sitemap: https://aspenalpenglow.com/sitemap.xml`}</pre>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-semibold text-slate-700 mb-2">Crawl Status</h4>
                <p className="text-xs text-slate-400">Last crawl dates will appear when Google Search Console is connected.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
