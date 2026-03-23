import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { seedPages } from '@/lib/seed-pages'

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl?.startsWith('http') || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const results = await seedPages(supabase)
    return NextResponse.json({ success: true, results })
  } catch (err) {
    console.error('seed-pages error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
