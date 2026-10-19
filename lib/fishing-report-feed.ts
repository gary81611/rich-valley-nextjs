import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { formatFishingReportTime } from '@/lib/fishing-report-intake'

/** One featured item plus about eight older reports. */
export const FISHING_REPORT_FEED_SIZE = 9

export type FishingReportDetail = {
  label: string
  value: string
}

export type FishingReportFeedItem = {
  source: 'cms' | 'voice'
  id: string
  /** ISO timestamp, or a date-only `YYYY-MM-DD` for CMS rows with no time. */
  date: string
  /** False when a CMS timestamp is only a calendar date. Voice rows always have a time. */
  showTime: boolean
  river: string
  title?: string
  body: string
  details: FishingReportDetail[]
  /** First name only. Omitted when the source has no usable name. */
  reporter_display?: string
  imageUrl?: string
}

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
const PHONE_RE = /(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]*)\d{3}[\s.-]*\d{4}/g

function anonClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || !url.startsWith('http')) return null
  // Next.js caches fetch() on the server. These rows change on every call-in.
  const fetchNoStore: typeof fetch = (input, init) => fetch(input, { ...init, cache: 'no-store' })
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: fetchNoStore },
  })
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

/** First whitespace-separated token, after emails and phone numbers are removed. */
export function fishingReportFirstName(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined
  const cleaned = raw.replace(EMAIL_RE, ' ').replace(PHONE_RE, ' ').replace(/\s+/g, ' ').trim()
  if (!cleaned) return undefined
  const token = cleaned.split(' ')[0]?.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '')
  if (!token) return undefined
  if (token.includes('@')) return undefined
  if (/^\+?\d[\d().-]{6,}$/.test(token)) return undefined
  return token
}

function detail(label: string, value: unknown): FishingReportDetail | null {
  const trimmed = text(value)
  if (!trimmed) return null
  return { label, value: trimmed }
}

/** Date-only CMS values stay date-only. A real clock time is kept. */
export function cmsDateHasTime(raw: string): boolean {
  const trimmed = raw.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return false
  if (/[T ]00:00:00(?:\.0+)?(?:Z|[+-]\d{2}:?\d{2})?$/.test(trimmed)) return false
  const date = new Date(trimmed)
  if (Number.isNaN(date.getTime())) return false
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const hour = parts.find((part) => part.type === 'hour')?.value
  const minute = parts.find((part) => part.type === 'minute')?.value
  const midnight = (hour === '00' || hour === '24') && minute === '00'
  return !midnight
}

export function formatFishingReportFeedDate(item: Pick<FishingReportFeedItem, 'date' | 'showTime'>): string {
  if (!item.showTime) {
    const match = item.date.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (match) {
      const noonUtc = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12))
      return new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(noonUtc)
    }
  }
  return formatFishingReportTime(item.date)
}

function guideName(guides: unknown): string | undefined {
  if (!guides) return undefined
  if (Array.isArray(guides)) {
    const first = guides[0]
    if (first && typeof first === 'object' && 'name' in first) {
      const name = (first as { name?: unknown }).name
      return typeof name === 'string' ? name : undefined
    }
    return undefined
  }
  if (typeof guides === 'object' && 'name' in guides) {
    const name = (guides as { name?: unknown }).name
    return typeof name === 'string' ? name : undefined
  }
  return undefined
}

type CmsRow = {
  id?: unknown
  title?: unknown
  content?: unknown
  river_name?: unknown
  hatch_info?: unknown
  fly_recommendations?: unknown
  water_clarity?: unknown
  published_at?: unknown
  created_at?: unknown
  featured_image_url?: unknown
  guides?: unknown
}

function normalizeCms(row: CmsRow): FishingReportFeedItem | null {
  const id = text(row.id)
  const body = text(row.content)
  const date = text(row.published_at) || text(row.created_at)
  if (!id || !body || !date) return null
  const title = text(row.title)
  const imageUrl = text(row.featured_image_url)
  const reporter = fishingReportFirstName(guideName(row.guides))
  const details = [
    detail('Hatch report', row.hatch_info),
    detail('Fly recommendations', row.fly_recommendations),
    detail('Water clarity', row.water_clarity),
  ].filter((item): item is FishingReportDetail => item !== null)

  return {
    source: 'cms',
    id,
    date,
    showTime: cmsDateHasTime(date),
    river: text(row.river_name),
    title: title || undefined,
    body,
    details,
    reporter_display: reporter,
    imageUrl: imageUrl || undefined,
  }
}

type VoiceRow = {
  id?: unknown
  created_at?: unknown
  reporter?: unknown
  river_or_section?: unknown
  flows?: unknown
  water_temp?: unknown
  hatches_and_flies?: unknown
  what_is_working?: unknown
  summary?: unknown
}

function normalizeVoice(row: VoiceRow): FishingReportFeedItem | null {
  const id = text(row.id)
  const body = text(row.summary)
  const date = text(row.created_at)
  const river = text(row.river_or_section)
  if (!id || !body || !date || !river) return null
  const reporter = fishingReportFirstName(text(row.reporter))
  const details = [
    detail('Flows', row.flows),
    detail('Water temp', row.water_temp),
    detail('Hatches & flies', row.hatches_and_flies),
    detail("What's working", row.what_is_working),
  ].filter((item): item is FishingReportDetail => item !== null)

  return {
    source: 'voice',
    id,
    date,
    showTime: true,
    river,
    body,
    details,
    reporter_display: reporter,
  }
}

function byDateDesc(a: FishingReportFeedItem, b: FishingReportFeedItem): number {
  const left = Date.parse(a.date)
  const right = Date.parse(b.date)
  return (Number.isNaN(right) ? 0 : right) - (Number.isNaN(left) ? 0 : left)
}

async function loadCms(supabase: SupabaseClient): Promise<FishingReportFeedItem[]> {
  const { data, error } = await supabase
    .from('fishing_reports')
    .select(
      'id, title, content, river_name, hatch_info, fly_recommendations, water_clarity, published_at, created_at, featured_image_url, guides(name)',
    )
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(24)

  if (error || !data) return []
  return (data as CmsRow[]).flatMap((row) => {
    const item = normalizeCms(row)
    return item ? [item] : []
  })
}

async function loadVoice(supabase: SupabaseClient): Promise<FishingReportFeedItem[]> {
  const { data, error } = await supabase
    .from('voice_fishing_reports')
    .select('id, created_at, reporter, river_or_section, flows, water_temp, hatches_and_flies, what_is_working, summary')
    .order('created_at', { ascending: false })
    .limit(FISHING_REPORT_FEED_SIZE)

  if (error || !data) return []
  return (data as VoiceRow[]).flatMap((row) => {
    const item = normalizeVoice(row)
    return item ? [item] : []
  })
}

/** Published CMS reports and voice call-ins, newest first. Either source can fail on its own. */
export async function loadFishingReportFeed(limit = FISHING_REPORT_FEED_SIZE): Promise<FishingReportFeedItem[]> {
  const supabase = anonClient()
  if (!supabase) return []

  const [cms, voice] = await Promise.all([
    loadCms(supabase).catch(() => [] as FishingReportFeedItem[]),
    loadVoice(supabase).catch(() => [] as FishingReportFeedItem[]),
  ])

  return [...cms, ...voice].sort(byDateDesc).slice(0, Math.max(0, limit))
}
