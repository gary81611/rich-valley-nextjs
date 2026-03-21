import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, site_key } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { error } = await supabase.from('newsletter_subscribers').insert({
      email,
      site_key: site_key || 'rva',
    })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Already subscribed' })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send welcome email via Resend if configured
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      try {
        const brandName = site_key === 'alpenglow' ? 'Aspen Alpenglow Limousine' : 'Rich Valley Adventures'
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: `${brandName} <noreply@richvalleyadventures.com>`,
            to: [email],
            subject: `Welcome to ${brandName}!`,
            html: `<h2>Thanks for subscribing!</h2><p>You'll be the first to know about exclusive offers, new adventures, and seasonal specials from ${brandName}.</p><p>— The Team in Aspen, Colorado</p>`,
          }),
        })
      } catch {
        // Best effort
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
