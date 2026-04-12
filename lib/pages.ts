import { createClient } from '@supabase/supabase-js'

export type TemplateType = 'service' | 'location' | 'faq' | 'landing'
export type PageStatus = 'draft' | 'published'
export type SiteId = 'rva' | 'alpenglow'

export interface PopularHike {
  name: string
  description: string
  /** e.g. "3.6 mi round trip" */
  mileage: string
  /** e.g. "2–4 hours" — typical moving time for an average hiker */
  duration: string
}

export interface ServiceContent {
  hero_title: string
  hero_subtitle?: string
  intro: string
  /** Optional reference list (e.g. guided hiking page) */
  popular_hikes?: PopularHike[]
  h2_sections?: { title: string; content: string }[]
  features?: { title: string; description: string }[]
  faqs?: { question: string; answer: string }[]
  cta_phone?: string
  cta_text?: string
  gallery_images?: string[]
}

export interface LocationContent {
  hero_title: string
  area_description: string
  intro: string
  services_available?: string[]
  local_tips?: { title: string; description: string }[]
  faqs?: { question: string; answer: string }[]
  cta_phone?: string
  cta_text?: string
}

export interface FaqContent {
  hero_title: string
  intro?: string
  faqs: { question: string; answer: string; category?: string }[]
  cta_phone?: string
  cta_text?: string
}

export interface LandingContent {
  hero_title: string
  hero_subtitle?: string
  sections?: { type: 'text' | 'features' | 'cta'; title?: string; content?: string; items?: { title: string; description: string }[] }[]
}

export type PageContent = ServiceContent | LocationContent | FaqContent | LandingContent

export interface CmsPage {
  id: string
  site_id: SiteId
  slug: string
  title: string
  meta_title: string | null
  meta_description: string | null
  template_type: TemplateType
  content: PageContent
  status: PageStatus
  schema_markup: Record<string, unknown> | null
  og_image: string | null
  created_at: string
  updated_at: string
  published_at: string | null
}

export interface NavItem {
  id: string
  site_id: SiteId
  label: string
  href: string
  position: number
  parent_id: string | null
  is_visible: boolean
}

function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  if (!url.startsWith('http')) return null
  return createClient(url, key)
}

export async function getPageBySlug(siteId: SiteId, slug: string): Promise<CmsPage | null> {
  const supabase = getServerClient()
  if (!supabase) return null

  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('site_id', siteId)
      .eq('slug', slug)
      .eq('status', 'published')
      .abortSignal(AbortSignal.timeout(8000))
      .single()

    if (error || !data) return null
    return data as CmsPage
  } catch {
    return null
  }
}

export async function getAllPublishedPages(siteId: SiteId): Promise<CmsPage[]> {
  const supabase = getServerClient()
  if (!supabase) return []

  try {
    const { data } = await supabase
      .from('pages')
      .select('*')
      .eq('site_id', siteId)
      .eq('status', 'published')
      .order('slug')
      .abortSignal(AbortSignal.timeout(8000))

    return (data as CmsPage[]) || []
  } catch {
    return []
  }
}

export async function getAllPagesAdmin(siteId?: SiteId): Promise<CmsPage[]> {
  const supabase = getServerClient()
  if (!supabase) return []

  let query = supabase.from('pages').select('*').order('site_id').order('slug')
  if (siteId) query = query.eq('site_id', siteId)

  const { data } = await query
  return (data as CmsPage[]) || []
}

export async function upsertPage(page: Omit<CmsPage, 'id' | 'created_at' | 'updated_at'>): Promise<CmsPage | null> {
  const supabase = getServerClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('pages')
    .upsert({ ...page, updated_at: new Date().toISOString() }, { onConflict: 'site_id,slug' })
    .select()
    .single()

  if (error) { console.error('upsertPage error:', error); return null }
  return data as CmsPage
}

export async function updatePageStatus(id: string, status: PageStatus): Promise<boolean> {
  const supabase = getServerClient()
  if (!supabase) return false

  const update: Record<string, unknown> = { status }
  if (status === 'published') update.published_at = new Date().toISOString()

  const { error } = await supabase.from('pages').update(update).eq('id', id)
  return !error
}

export async function deletePage(id: string): Promise<boolean> {
  const supabase = getServerClient()
  if (!supabase) return false
  const { error } = await supabase.from('pages').delete().eq('id', id)
  return !error
}

export async function getNavigation(siteId: SiteId): Promise<NavItem[]> {
  const supabase = getServerClient()
  if (!supabase) return []

  const { data } = await supabase
    .from('navigation')
    .select('*')
    .eq('site_id', siteId)
    .order('position')

  return (data as NavItem[]) || []
}

export async function upsertNavItem(item: Omit<NavItem, 'id'>): Promise<NavItem | null> {
  const supabase = getServerClient()
  if (!supabase) return null

  const { data, error } = await supabase.from('navigation').insert(item).select().single()
  if (error) { console.error('upsertNavItem error:', error); return null }
  return data as NavItem
}

export async function updateNavItem(id: string, updates: Partial<NavItem>): Promise<boolean> {
  const supabase = getServerClient()
  if (!supabase) return false
  const { error } = await supabase.from('navigation').update(updates).eq('id', id)
  return !error
}

export async function deleteNavItem(id: string): Promise<boolean> {
  const supabase = getServerClient()
  if (!supabase) return false
  const { error } = await supabase.from('navigation').delete().eq('id', id)
  return !error
}
