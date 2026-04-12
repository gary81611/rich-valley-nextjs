'use client'
import { useState } from 'react'
import { useBrand } from '../contexts/BrandContext'
import { createClient } from '@/lib/supabase'

interface BlogOutput {
  metaTitle: string
  metaDescription: string
  content: string
  internalLinks: string[]
  faqs: { q: string; a: string }[]
}

interface ParsedLink {
  text: string
  url: string
}

const RVA_KEYWORDS = [
  'best fly fishing guide in Aspen',
  'summer activities in Aspen for families',
  'guided hiking tours Roaring Fork Valley',
  'Aspen whitewater rafting trips',
  'Colorado mountain biking Aspen trails',
  'Aspen elevated camping glamping adventures',
  'winter snowshoeing tours Aspen',
  'bachelor party activities Aspen Colorado',
  'corporate team building Aspen outdoors',
  'Aspen wildlife tours and nature experiences',
]

const AAL_KEYWORDS = [
  'Aspen airport limo service',
  'luxury car service Aspen to Denver',
  'Aspen wedding transportation',
  'Snowmass Village shuttle service',
  'private ski resort transfers Aspen',
  'Aspen corporate event transportation',
  'Roaring Fork Valley limousine service',
  'Aspen to Vail private car',
  'luxury Sprinter van rental Aspen',
  "New Year's Eve limo Aspen Colorado",
]

const BLOG_SYSTEM_PROMPT = `You are an expert content writer for two Aspen, Colorado-based businesses:
- Rich Valley Adventures (RVA): guided outdoor adventures — fly fishing, hiking, biking, snowshoeing, glamping, scenic Chauffeur Guided Tours
- Aspen Alpenglow Limousine (AAL): luxury private car and limousine service — airport transfers, weddings, ski resort shuttles, corporate travel

Write an SEO-optimized blog post (800-1200 words) that positions the business as a trusted local authority. The writing should be conversational and knowledgeable, written by someone who lives and works in the Aspen area.

Naturally weave in references to specific local landmarks and places: Maroon Bells, Independence Pass, Snowmass Village, Basalt, Carbondale, Glenwood Springs, the Roaring Fork River, Elk Mountains, Castle Creek, Hunter Creek, and Aspen Mountain.

The content should naturally answer questions someone might ask an AI assistant (ChatGPT, Perplexity, Google AI Overview). Include specific details that build trust: years in operation (since 2012), small group sizes (RVA: 2-6 guests), vehicle types (AAL: Cadillac Escalade, Mercedes Sprinter), phone number (970-456-3666).

Return ONLY a JSON object (no markdown fences) with this exact structure. Every string value must be valid JSON: escape internal double quotes as \\" and newlines inside strings as \\n — do not paste raw line breaks inside a JSON string value.
{
  "metaTitle": "SEO page title, max 60 chars, include location",
  "metaDescription": "Compelling meta description, max 155 chars",
  "content": "Full blog post in markdown format (use ## for headings, **bold**, etc.)",
  "internalLinks": ["Suggested internal link anchor text and URL, e.g. 'Fly Fishing Tours → /fly-fishing'"],
  "faqs": [
    {"q": "Question someone might ask an AI", "a": "Concise factual answer, 30-50 words"},
    {"q": "...", "a": "..."},
    {"q": "...", "a": "..."}
  ]
}`

function stripJsonMarkdownFence(raw: string): string {
  let s = raw.trim()
  if (!s.startsWith('```')) return s
  s = s.replace(/^```(?:json)?\s*\n?/i, '')
  const end = s.lastIndexOf('```')
  if (end !== -1) s = s.slice(0, end)
  return s.trim()
}

function parseBlogJson(raw: string): BlogOutput {
  const cleaned = stripJsonMarkdownFence(raw)
  try {
    const parsed = JSON.parse(cleaned) as BlogOutput
    if (
      typeof parsed.metaTitle === 'string' &&
      typeof parsed.metaDescription === 'string' &&
      typeof parsed.content === 'string' &&
      Array.isArray(parsed.internalLinks) &&
      Array.isArray(parsed.faqs)
    ) {
      return parsed
    }
  } catch {
    // fall through
  }

  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start !== -1 && end > start) {
    try {
      const parsed = JSON.parse(cleaned.slice(start, end + 1)) as BlogOutput
      if (typeof parsed.content === 'string' && typeof parsed.metaTitle === 'string') {
        return parsed
      }
    } catch {
      // fall through
    }
  }

  throw new Error(
    'Could not parse AI response as JSON. If the topic produced a very long post, try again or shorten the ask. ' +
      'If this persists, the model may have returned invalid JSON (unescaped quotes in the article body).',
  )
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

function parseInternalLink(link: string): ParsedLink {
  const arrowIdx = link.indexOf('→')
  if (arrowIdx !== -1) {
    return { text: link.slice(0, arrowIdx).trim(), url: link.slice(arrowIdx + 1).trim() }
  }
  // Try plain " - /path" fallback
  const dashIdx = link.lastIndexOf(' - /')
  if (dashIdx !== -1) {
    return { text: link.slice(0, dashIdx).trim(), url: link.slice(dashIdx + 3).trim() }
  }
  return { text: link, url: '#' }
}

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-600">Copied!</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  )
}

function MarkdownPreview({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <div className="prose prose-sm max-w-none text-slate-700">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) return <h2 key={i} className="text-base font-semibold text-slate-900 mt-4 mb-1">{line.slice(3)}</h2>
        if (line.startsWith('# ')) return <h1 key={i} className="text-lg font-bold text-slate-900 mt-4 mb-2">{line.slice(2)}</h1>
        if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-semibold text-slate-900 mt-3 mb-1">{line.slice(4)}</h3>
        if (line.trim() === '') return <div key={i} className="h-2" />
        const parts = line.split(/(\*\*[^*]+\*\*)/)
        return (
          <p key={i} className="text-sm leading-relaxed mb-1">
            {parts.map((part, j) =>
              part.startsWith('**') && part.endsWith('**')
                ? <strong key={j}>{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        )
      })}
    </div>
  )
}

export default function BlogGeneratorPage() {
  const { brand } = useBrand()
  const [selectedKeyword, setSelectedKeyword] = useState('')
  const [customTopic, setCustomTopic] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<'rva' | 'alpenglow'>('rva')
  const [generating, setGenerating] = useState(false)
  const [output, setOutput] = useState<BlogOutput | null>(null)
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState<'preview' | 'raw'>('preview')

  // Publish state
  const [slugValue, setSlugValue] = useState('')
  const [publishStatus, setPublishStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [publishMessage, setPublishMessage] = useState('')
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [scheduledFor, setScheduledFor] = useState('')

  // FAQ selection state
  const [selectedFaqIndexes, setSelectedFaqIndexes] = useState<Set<number>>(new Set())
  const [faqSaving, setFaqSaving] = useState(false)
  const [faqMessage, setFaqMessage] = useState('')

  const showRva = brand === 'all' || brand === 'rva'
  const showAal = brand === 'all' || brand === 'alpenglow'

  const handleKeywordClick = (kw: string, brandKey: 'rva' | 'alpenglow') => {
    setSelectedKeyword(kw)
    setCustomTopic('')
    setSelectedBrand(brandKey)
    setOutput(null)
    setError('')
    resetPublishState()
  }

  const resetPublishState = () => {
    setPublishStatus('idle')
    setPublishMessage('')
    setShowScheduleForm(false)
    setScheduledFor('')
    setSelectedFaqIndexes(new Set())
    setFaqMessage('')
  }

  const activeTopic = customTopic.trim() || selectedKeyword

  const handleGenerate = async () => {
    if (!activeTopic) return
    setGenerating(true)
    setError('')
    setOutput(null)
    resetPublishState()

    const brandLabel = selectedBrand === 'rva' ? 'Rich Valley Adventures (RVA)' : 'Aspen Alpenglow Limousine (AAL)'

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Write a blog post targeting this keyword/topic: "${activeTopic}"\n\nBusiness: ${brandLabel}`,
          type: 'free_form',
          brand: selectedBrand,
          system_prompt_override: BLOG_SYSTEM_PROMPT,
          max_tokens: 8192,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')

      const raw = data.result?.trim() || ''
      const parsed: BlogOutput = parseBlogJson(raw)
      setOutput(parsed)
      setSlugValue(slugify(parsed.metaTitle))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate blog post')
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async (status: 'draft' | 'scheduled' | 'published') => {
    if (!output || !slugValue.trim()) return
    if (status === 'scheduled' && !scheduledFor) {
      setPublishMessage('Please select a date and time to schedule.')
      return
    }

    setPublishStatus('saving')
    setPublishMessage('')

    const parsedLinks = output.internalLinks.map(parseInternalLink)
    const parsedFaqs = output.faqs.map(f => ({ question: f.q, answer: f.a }))

    try {
      const res = await fetch('/api/blog/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_key: selectedBrand,
          slug: slugValue.trim(),
          title: output.metaTitle,
          meta_title: output.metaTitle,
          meta_description: output.metaDescription,
          content: output.content,
          internal_links: parsedLinks,
          faqs: parsedFaqs,
          status,
          scheduled_for: status === 'scheduled' ? scheduledFor : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')

      const messages = {
        draft: 'Saved as draft.',
        scheduled: `Scheduled for ${new Date(scheduledFor).toLocaleString()}.`,
        published: 'Published successfully! View it at /blog/' + slugValue,
      }
      setPublishStatus('success')
      setPublishMessage(messages[status])
      if (status === 'scheduled') setShowScheduleForm(false)
    } catch (err) {
      setPublishStatus('error')
      setPublishMessage(err instanceof Error ? err.message : 'Save failed')
    }
  }

  const toggleFaq = (idx: number) => {
    setSelectedFaqIndexes(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const handleAddFaqsToPage = async () => {
    if (!output || selectedFaqIndexes.size === 0) return
    setFaqSaving(true)
    setFaqMessage('')

    const supabase = createClient()
    const selectedFaqs = output.faqs
      .filter((_, i) => selectedFaqIndexes.has(i))
      .map((f, i) => ({
        question: f.q,
        answer: f.a,
        site_key: selectedBrand,
        display_order: 100 + i, // append at end
        is_active: true,
      }))

    const { error } = await supabase.from('faqs').insert(selectedFaqs)
    if (error) {
      setFaqMessage('Error: ' + error.message)
    } else {
      setFaqMessage(`Added ${selectedFaqs.length} FAQ${selectedFaqs.length > 1 ? 's' : ''} to the FAQ page.`)
      setSelectedFaqIndexes(new Set())
    }
    setFaqSaving(false)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog Generator</h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate SEO-optimized blog posts targeting high-value keywords for Aspen-area search traffic.
          </p>
        </div>
        <a
          href="/admin/blog/manage"
          className="px-4 py-2 text-sm font-medium bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Manage Posts →
        </a>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT: Keyword selection + controls */}
        <div className="space-y-5">
          {/* Keyword cards — RVA */}
          {showRva && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">RVA</span>
                <h2 className="text-sm font-semibold text-slate-900">Rich Valley Adventures Keywords</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {RVA_KEYWORDS.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => handleKeywordClick(kw, 'rva')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                      selectedKeyword === kw && selectedBrand === 'rva'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-green-50 hover:border-green-300 hover:text-green-800'
                    }`}
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Keyword cards — AAL */}
          {showAal && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">AAL</span>
                <h2 className="text-sm font-semibold text-slate-900">Aspen Alpenglow Limousine Keywords</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {AAL_KEYWORDS.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => handleKeywordClick(kw, 'alpenglow')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                      selectedKeyword === kw && selectedBrand === 'alpenglow'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800'
                    }`}
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom topic input */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Or enter a custom topic</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => {
                  setCustomTopic(e.target.value)
                  setSelectedKeyword('')
                  setOutput(null)
                  setError('')
                  resetPublishState()
                }}
                placeholder="e.g. best fall foliage hikes near Aspen"
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-slate-600 font-medium">Brand:</label>
              <div className="flex gap-2">
                {(['rva', 'alpenglow'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      selectedBrand === b
                        ? b === 'rva' ? 'bg-green-600 text-white border-green-600' : 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {b === 'rva' ? 'RVA' : 'AAL'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate button */}
          <div>
            {activeTopic && (
              <div className="mb-3 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <span className="font-medium">Topic:</span> {activeTopic}{' '}
                <span className={`ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  selectedBrand === 'rva' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {selectedBrand === 'rva' ? 'RVA' : 'AAL'}
                </span>
              </div>
            )}
            <button
              onClick={handleGenerate}
              disabled={!activeTopic || generating}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Generating blog post…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Blog Post
                </>
              )}
            </button>
            {error && (
              <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg">{error}</div>
            )}
          </div>
        </div>

        {/* RIGHT: Output */}
        <div>
          {!output && !generating && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
              <svg className="w-10 h-10 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <p className="text-sm text-slate-400">Select a keyword or enter a custom topic, then click Generate</p>
            </div>
          )}

          {generating && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin mb-4" />
              <p className="text-sm text-slate-500">Writing your blog post…</p>
              <p className="text-xs text-slate-400 mt-1">This usually takes 10–20 seconds</p>
            </div>
          )}

          {output && (
            <div className="space-y-4">
              {/* Meta section */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900">SEO Meta Tags</h3>
                  <CopyButton text={`Title: ${output.metaTitle}\nDescription: ${output.metaDescription}`} label="Copy Both" />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Meta Title ({output.metaTitle.length}/60)</span>
                      <CopyButton text={output.metaTitle} />
                    </div>
                    <p className="text-sm text-slate-800 bg-slate-50 px-3 py-2 rounded-lg font-medium">{output.metaTitle}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Meta Description ({output.metaDescription.length}/155)</span>
                      <CopyButton text={output.metaDescription} />
                    </div>
                    <p className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">{output.metaDescription}</p>
                  </div>
                </div>
              </div>

              {/* Blog content */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900">Blog Post</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex rounded-lg overflow-hidden border border-slate-200 text-xs">
                      <button
                        onClick={() => setActiveSection('preview')}
                        className={`px-3 py-1 ${activeSection === 'preview' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                      >Preview</button>
                      <button
                        onClick={() => setActiveSection('raw')}
                        className={`px-3 py-1 ${activeSection === 'raw' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                      >Markdown</button>
                    </div>
                    <CopyButton text={output.content} label="Copy" />
                  </div>
                </div>
                {activeSection === 'preview' ? (
                  <div className="max-h-80 overflow-y-auto">
                    <MarkdownPreview content={output.content} />
                  </div>
                ) : (
                  <pre className="text-xs text-slate-600 bg-slate-50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-80 overflow-y-auto">{output.content}</pre>
                )}
              </div>

              {/* Internal links */}
              {output.internalLinks.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-900">Suggested Internal Links</h3>
                    <CopyButton text={output.internalLinks.join('\n')} />
                  </div>
                  <ul className="space-y-1">
                    {output.internalLinks.map((link, i) => {
                      const parsed = parseInternalLink(link)
                      return (
                        <li key={i} className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <span className="font-medium text-slate-800">{parsed.text}</span>
                          <span className="text-slate-400">→</span>
                          <span className="text-blue-600 font-mono">{parsed.url}</span>
                        </li>
                      )
                    })}
                  </ul>
                  <p className="mt-2 text-[10px] text-slate-400">These links will be embedded automatically when you publish this post.</p>
                </div>
              )}

              {/* FAQs with checkboxes */}
              {output.faqs.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-900">
                      FAQ Section <span className="text-[10px] text-slate-400 font-normal ml-1">(for featured snippets)</span>
                    </h3>
                    <CopyButton text={output.faqs.map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')} />
                  </div>
                  <div className="space-y-2">
                    {output.faqs.map((faq, i) => (
                      <label
                        key={i}
                        className={`flex items-start gap-3 bg-slate-50 rounded-lg p-3 cursor-pointer transition-colors ${
                          selectedFaqIndexes.has(i) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFaqIndexes.has(i)}
                          onChange={() => toggleFaq(i)}
                          className="mt-0.5 flex-shrink-0 accent-blue-600"
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-800 mb-1">{faq.q}</p>
                          <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Add to FAQ Page button */}
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={handleAddFaqsToPage}
                      disabled={selectedFaqIndexes.size === 0 || faqSaving}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {faqSaving ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                      Add Selected to FAQ Page ({selectedFaqIndexes.size})
                    </button>
                    {faqMessage && (
                      <span className={`text-xs ${faqMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
                        {faqMessage}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 text-[10px] text-slate-400 bg-blue-50 border border-blue-100 rounded-lg p-2">
                    Check the FAQs you want to add to your site's FAQ page, then click the button above.
                  </div>
                </div>
              )}

              {/* ── PUBLISH SECTION ── */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Publish to Blog</h3>

                {/* Slug editor */}
                <div className="mb-4">
                  <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                    URL Slug
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400 font-mono">/blog/</span>
                    <input
                      type="text"
                      value={slugValue}
                      onChange={(e) => setSlugValue(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'))}
                      className="flex-1 px-3 py-1.5 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {selectedBrand === 'rva' ? 'richvalleyadventures.com' : 'aspenalpenglowlimousine.com'}/blog/{slugValue || '…'}
                  </p>
                </div>

                {/* Publish buttons */}
                {publishStatus === 'success' ? (
                  <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="text-xs font-semibold text-green-800">Success</p>
                      <p className="text-xs text-green-700">{publishMessage}</p>
                    </div>
                    <button onClick={resetPublishState} className="ml-auto text-[10px] text-green-600 underline">Save again</button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleSave('draft')}
                        disabled={publishStatus === 'saving' || !slugValue.trim()}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        Save as Draft
                      </button>

                      <button
                        onClick={() => setShowScheduleForm(!showScheduleForm)}
                        disabled={publishStatus === 'saving' || !slugValue.trim()}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                          showScheduleForm
                            ? 'bg-violet-100 text-violet-700 border border-violet-300'
                            : 'bg-violet-600 text-white hover:bg-violet-700'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Schedule
                      </button>

                      <button
                        onClick={() => handleSave('published')}
                        disabled={publishStatus === 'saving' || !slugValue.trim()}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        {publishStatus === 'saving' ? (
                          <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        Publish Now
                      </button>
                    </div>

                    {/* Schedule form */}
                    {showScheduleForm && (
                      <div className="mt-3 p-3 bg-violet-50 border border-violet-200 rounded-lg">
                        <label className="block text-[10px] font-semibold uppercase tracking-wide text-violet-700 mb-1.5">
                          Publish Date &amp; Time
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="datetime-local"
                            value={scheduledFor}
                            min={new Date().toISOString().slice(0, 16)}
                            onChange={(e) => setScheduledFor(e.target.value)}
                            className="flex-1 px-3 py-1.5 text-xs border border-violet-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                          />
                          <button
                            onClick={() => handleSave('scheduled')}
                            disabled={!scheduledFor || publishStatus === 'saving'}
                            className="px-3 py-1.5 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            Confirm Schedule
                          </button>
                        </div>
                      </div>
                    )}

                    {publishStatus === 'error' && publishMessage && (
                      <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {publishMessage}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
