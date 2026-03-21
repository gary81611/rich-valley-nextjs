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
