import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// SQL to create the review_requests table:
// See /supabase/review_requests.sql

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, customerName, brand, adventureName, templateId, subject, html } = body

    if (!to || !customerName || !brand || !templateId || !subject || !html) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['rva', 'alpenglow'].includes(brand)) {
      return NextResponse.json({ error: 'Invalid brand' }, { status: 400 })
    }

    // Send email via Resend
    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const fromName = brand === 'alpenglow' ? 'Aspen Alpenglow Limousine' : 'Rich Valley Adventures'
    const fromEmail = 'noreply@richvalleyadventures.com'

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [to],
        subject,
        html,
      }),
    })

    if (!emailRes.ok) {
      const err = await emailRes.text()
      return NextResponse.json({ error: `Email send failed: ${err}` }, { status: 502 })
    }

    // Log to Supabase (best-effort — don't fail if DB insert fails)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey)
        await supabase.from('review_requests').insert({
          brand,
          customer_name: customerName,
          customer_email: to,
          adventure_name: adventureName || null,
          template_id: templateId,
          subject,
          status: 'sent',
        })
      } catch {
        // DB logging is best-effort
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send review request' }, { status: 500 })
  }
}
