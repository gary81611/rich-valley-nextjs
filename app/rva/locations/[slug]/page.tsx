import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import LocationDetailView from '@/components/rva/LocationDetailView'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const { data: loc } = await supabase.from('locations').select('*').eq('slug', slug).eq('is_active', true).single()
  if (!loc) return {}
  return {
    title: `${loc.name} Adventures | Rich Valley Adventures — Guided Outdoor Experiences`,
    description: (loc.description || '').slice(0, 160),
    alternates: { canonical: `https://www.richvalleyadventures.com/locations/${slug}` },
  }
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const { data: loc } = await supabase.from('locations').select('*').eq('slug', slug).eq('is_active', true).single()
  if (!loc) notFound()

  return (
    <LocationDetailView
      loc={loc}
      backLink={{ href: '/locations', label: '← All Locations' }}
    />
  )
}
