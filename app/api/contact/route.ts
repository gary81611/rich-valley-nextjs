import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, service, preferred_date, details, brand } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase.from('contact_submissions').insert({
      name, email, phone: phone || null,
      service: service || null,
      preferred_date: preferred_date || null,
      details: details || null,
      brand: brand || 'rva',
      status: 'new',
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send notification email via Resend if configured
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Rich Valley <noreply@richvalleyadventures.com>',
            to: ['kit@richvalleyadventures.com'],
            subject: `New ${brand === 'alpenglow' ? 'Transportation' : 'Adventure'} Inquiry from ${name}`,
            html: `<h2>New Contact Form Submission</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || 'N/A'}</p><p><strong>Service:</strong> ${service || 'N/A'}</p><p><strong>Preferred Date:</strong> ${preferred_date || 'N/A'}</p><p><strong>Details:</strong> ${details || 'N/A'}</p>`,
          }),
        })
        // Send confirmation to customer
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Rich Valley <noreply@richvalleyadventures.com>',
            to: [email],
            subject: `We received your inquiry — ${brand === 'alpenglow' ? 'Aspen Alpenglow Limousine' : 'Rich Valley Adventures'}`,
            html: `<h2>Thanks for reaching out, ${name}!</h2><p>We've received your inquiry and will get back to you within 24 hours.</p><p>In the meantime, feel free to call us at <strong>970-456-3666</strong>.</p><p>— The ${brand === 'alpenglow' ? 'Aspen Alpenglow Limousine' : 'Rich Valley Adventures'} Team</p>`,
          }),
        })
      } catch {
        // Email sending is best-effort
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 })
  }
}
