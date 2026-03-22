export interface SiteSettings {
  id: string
  site_key: 'rva' | 'alpenglow'
  brand_name: string
  tagline: string
  phone: string
  email: string
  address: string
  social_links: Record<string, string>
  colors: Record<string, string>
  logo_url: string
  created_at: string
  updated_at: string
}

export interface Adventure {
  id: string
  name: string
  description: string
  duration: string
  price: number
  difficulty: string
  image_url: string
  display_order: number
  is_active: boolean
  season: 'summer' | 'winter' | 'year-round'
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  description: string
  price_from: number
  image_url: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FleetVehicle {
  id: string
  name: string
  type: string
  capacity: number
  description: string
  image_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  author: string
  quote: string
  rating: number
  site_key: 'rva' | 'alpenglow'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  url: string
  alt_text: string
  caption: string
  site_key: 'rva' | 'alpenglow'
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  site_key: 'rva' | 'alpenglow'
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ServiceArea {
  id: string
  name: string
  description: string
  site_key: 'rva' | 'alpenglow'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SeoPage {
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
  created_at: string
  updated_at: string
}

export interface GeoContentBlock {
  id: string
  site_key: 'rva' | 'alpenglow'
  block_type: 'fact' | 'statistic' | 'definition' | 'comparison' | 'how_to' | 'local_info'
  question: string
  answer: string
  source_citation: string
  target_queries: string[]
  display_on_page: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  site_key: 'rva' | 'alpenglow'
  subscribed_at: string
}

export interface BlogPost {
  id: string
  site_key: 'rva' | 'alpenglow'
  slug: string
  title: string
  meta_title: string | null
  meta_description: string | null
  content: string | null
  internal_links: { text: string; url: string }[]
  faqs: { question: string; answer: string }[]
  status: 'draft' | 'scheduled' | 'published'
  scheduled_for: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}
