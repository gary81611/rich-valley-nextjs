export interface ReviewTemplate {
  id: string
  brand: 'rva' | 'alpenglow'
  label: string
  subject: string
  body: string
}

export const DEFAULT_TEMPLATES: Record<string, ReviewTemplate> = {
  rva_initial: {
    id: 'rva_initial',
    brand: 'rva',
    label: 'RVA — Initial Request',
    subject: 'How was your {{adventure_name}} with Rich Valley Adventures?',
    body: `<p>Hi {{customer_name}},</p>
<p>Thank you so much for joining us on your <strong>{{adventure_name}}</strong> adventure! It was a pleasure having you with us, and we hope the experience exceeded your expectations.</p>
<p>We'd love to hear how we did! If you have a moment, we'd truly appreciate an honest Google review — it helps other adventurers find us and helps us keep improving.</p>
<p style="margin: 24px 0;"><a href="{{google_review_link}}" style="display:inline-block;background:#2d6a4f;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Leave a Google Review ⭐</a></p>
<p>It only takes a minute, and it means the world to our small team!</p>
<p>Thanks again for adventuring with us,<br><strong>The Rich Valley Adventures Team</strong></p>`,
  },
  rva_followup: {
    id: 'rva_followup',
    brand: 'rva',
    label: 'RVA — Follow-up (3 days)',
    subject: 'Just checking in — how was your {{adventure_name}}?',
    body: `<p>Hi {{customer_name}},</p>
<p>We just wanted to follow up on your recent <strong>{{adventure_name}}</strong> experience with Rich Valley Adventures. We hope you had an amazing time!</p>
<p>If you haven't had a chance yet, we'd love it if you could share a quick Google review. Your feedback helps us serve future guests even better.</p>
<p style="margin: 24px 0;"><a href="{{google_review_link}}" style="display:inline-block;background:#2d6a4f;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Share Your Experience ⭐</a></p>
<p>Only takes a minute — we really appreciate it!</p>
<p>Warm regards,<br><strong>The Rich Valley Adventures Team</strong></p>`,
  },
  aal_initial: {
    id: 'aal_initial',
    brand: 'alpenglow',
    label: 'AAL — Initial Request',
    subject: 'Thank you for riding with Aspen Alpenglow Limousine',
    body: `<p>Hi {{customer_name}},</p>
<p>Thank you for choosing Aspen Alpenglow Limousine for your recent transportation. We hope your experience was nothing short of exceptional.</p>
<p>We take great pride in providing premium luxury transportation, and your comfort and satisfaction are our highest priorities. We'd be honored if you could share your experience with a Google review — it helps other guests discover us.</p>
<p style="margin: 24px 0;"><a href="{{google_review_link}}" style="display:inline-block;background:#1e40af;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Leave a Google Review ⭐</a></p>
<p>Your kind words make a tremendous difference for our small business.</p>
<p>With gratitude,<br><strong>The Aspen Alpenglow Limousine Team</strong></p>`,
  },
  aal_followup: {
    id: 'aal_followup',
    brand: 'alpenglow',
    label: 'AAL — Follow-up (3 days)',
    subject: "We'd love to hear about your Alpenglow experience",
    body: `<p>Hi {{customer_name}},</p>
<p>We hope you've been doing well since your recent ride with Aspen Alpenglow Limousine!</p>
<p>If you enjoyed your experience, we'd sincerely appreciate a quick Google review. It truly helps our small business grow and lets others know they can count on us for premium transportation.</p>
<p style="margin: 24px 0;"><a href="{{google_review_link}}" style="display:inline-block;background:#1e40af;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Share Your Experience ⭐</a></p>
<p>It only takes a minute and means everything to our team!</p>
<p>Warmly,<br><strong>The Aspen Alpenglow Limousine Team</strong></p>`,
  },
}

export function renderTemplate(
  template: ReviewTemplate,
  vars: { customerName: string; adventureName?: string; googleReviewLink: string }
): { subject: string; html: string } {
  const replace = (s: string) =>
    s
      .replace(/\{\{customer_name\}\}/g, vars.customerName)
      .replace(/\{\{adventure_name\}\}/g, vars.adventureName || 'your experience')
      .replace(/\{\{google_review_link\}\}/g, vars.googleReviewLink)
  return { subject: replace(template.subject), html: replace(template.body) }
}
