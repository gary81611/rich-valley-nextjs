import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { syncAlpenglowDestinations } from '@/lib/sync-alpenglow-destinations'

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl?.startsWith('http') || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const message = await syncAlpenglowDestinations(supabase)
    const ok = !message.includes('ERROR')
    return NextResponse.json({ success: ok, message })
  } catch (err) {
    console.error('sync-destinations error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
