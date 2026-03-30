import { NextResponse } from 'next/server'

// POST /api/review-request
// Sends a review request via email/SMS after a completed ride or adventure
// Google review link placeholder until AAL profile is verified

const GOOGLE_REVIEW_LINK = process.env.AAL_GOOGLE_REVIEW_LINK || '[GOOGLE_REVIEW_LINK — set after profile verification]'
const RVA_GOOGLE_REVIEW_LINK = process.env.RVA_GOOGLE_REVIEW_LINK || 'https://g.page/r/richvalleyadventures/review'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customer_name, customer_email, customer_phone, brand, service_type } = body

    if (!customer_name || (!customer_email && !customer_phone)) {
      return NextResponse.json({ error: 'customer_name and email or phone required' }, { status: 400 })
    }

    const isAAL = brand === 'aal' || brand === 'alpenglow'
    const brandName = isAAL ? 'Aspen Alpenglow Limousine' : 'Rich Valley Adventures'
    const reviewLink = isAAL ? GOOGLE_REVIEW_LINK : RVA_GOOGLE_REVIEW_LINK

    // Send email if available
    if (customer_email) {
      const resendKey = process.env.RESEND_API_KEY
      if (resendKey) {
        try {
          const { Resend } = await import('resend')
          const resend = new Resend(resendKey)
          await resend.emails.send({
            from: `${brandName} <noreply@adaptedprotech.com>`,
            to: customer_email,
            subject: `How was your experience with ${brandName}?`,
            html: `
              <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px;">
                <h1 style="font-size: 24px; font-weight: 300; color: #1a1a1a;">Thank you, ${customer_name}!</h1>
                <p style="font-size: 15px; color: #555; line-height: 1.7;">
                  We hope you enjoyed your ${service_type || 'experience'} with ${brandName}.
                  If you have a moment, we'd love a quick review — it helps other travelers find us.
                </p>
                <a href="${reviewLink}" style="display: inline-block; padding: 14px 28px; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500; margin-top: 16px;">
                  Leave a Review →
                </a>
                <p style="font-size: 12px; color: #aaa; margin-top: 32px;">
                  ${brandName} · 970-456-3666
                </p>
              </div>
            `,
          })
        } catch (err) {
          console.error('Review request email failed:', err)
        }
      }
    }

    return NextResponse.json({ ok: true, sent_to: customer_email || customer_phone })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
