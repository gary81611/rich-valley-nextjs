import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'FAQ | Aspen Alpenglow Limousine — Transportation Questions Answered',
  description:
    'Frequently asked questions about Aspen transportation, airport transfers, car service pricing, and getting to Aspen from Denver, Eagle, and Grand Junction airports.',
  alternates: { canonical: 'https://aspenalpenglowlimousine.com/alpenglow/faq' },
}

const VEHICLE_ANSWER =
  'Our fleet includes two late-model Chevrolet Suburbans (up to 7 passengers each) and a Ford Transit Van (up to 14 passengers). All vehicles are equipped with WiFi (Starlink), XM Radio, complimentary water, and Myers ski racks. The Suburbans also feature Yakima roof racks for luggage. All vehicles are professionally chauffeured and meticulously maintained.'

const DEN_COST_ANSWER =
  'Our Aspen to Denver International Airport (DEN) transfer is $1,475 all-inclusive — no service charge or gratuity added on top. The drive is approximately 3.5–4 hours. We serve Denver (DEN), Eagle/Vail (EGE), Rifle (KRIL), Grand Junction (GJT), and Aspen (ASE) airports.'

const CHARTER_MIN_FAQ = {
  q: 'Is there a minimum for charter bookings?',
  a: 'Chartered services require a 4-hour minimum. Cancellation: 24 hours standard, 7 days for events.',
}

const ALL_INCLUSIVE_FAQ = {
  q: 'Is your pricing all-inclusive?',
  a: 'Yes — all rates are fully all-inclusive. No service charges, no gratuity, no hidden fees.',
}

const DEN_TRANSFER_SCHEMA_FAQ = {
  q: 'How much does a transfer from Aspen to Denver airport cost?',
  a: 'The Aspen to Denver International Airport transfer is $1,475 all-inclusive. Drive time is approximately 3.5 to 4 hours.',
}

async function getFaqsFromDb(): Promise<{ q: string; a: string }[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('faqs')
    .select('question, answer')
    .eq('site_key', 'alpenglow')
    .eq('is_active', true)
    .order('display_order')

  if (error) {
    console.error('Error fetching FAQs:', error)
    return []
  }

  return (data ?? []).map((f) => ({ q: f.question, a: f.answer }))
}

/** Baseline FAQs when CMS has no rows — still applies client answer overrides. */
const FALLBACK_FAQS: { q: string; a: string }[] = [
  {
    q: 'What vehicles does Aspen Alpenglow Limousine use?',
    a: '',
  },
  {
    q: 'How much does a limo from Aspen to Denver airport cost?',
    a: '',
  },
  {
    q: 'How far in advance should I book airport transportation?',
    a: 'We recommend booking airport transfers at least 48–72 hours ahead during peak season. For events and charters, reserve as early as possible.',
  },
]

/** Normalize legacy CMS copy that still references Escalade / Sprinter. */
function normalizeVehicleAnswerText(a: string): string {
  let t = a
  if (/both our escalade/i.test(t) && /sprinter/i.test(t)) {
    t = t.replace(
      /both our escalade and sprinter van are available\.?/i,
      'Both our Suburban SUVs and Ford Transit Van are available.',
    )
  }
  t = t.replace(/\bour luxury sprinter van seats\b/gi, 'Our Ford Transit Van seats')
  t = t.replace(/\bluxury sprinter van seats\b/gi, 'Ford Transit Van seats')
  return t
}

function applyClientContent(faqs: { q: string; a: string }[]) {
  const rows = faqs.length > 0 ? faqs : FALLBACK_FAQS

  const patched = rows.map(({ q, a }) => {
    const ql = q.toLowerCase()
    if (ql.includes('what vehicles') && ql.includes('alpenglow')) return { q, a: VEHICLE_ANSWER }
    if (ql.includes('denver airport') && (ql.includes('cost') || ql.includes('limo'))) return { q, a: DEN_COST_ANSWER }
    return { q, a: normalizeVehicleAnswerText(a) }
  })

  const alreadyCharter = patched.some((f) => f.q.toLowerCase().includes('minimum for charter'))
  const alreadyAllIncl = patched.some((f) => f.q.toLowerCase().includes('pricing all-inclusive'))

  const leadIdx = patched.findIndex((f) =>
    /lead time|how far in advance|advance.*book|book.*advance/i.test(f.q),
  )

  let out = [...patched]
  if (!alreadyCharter && !alreadyAllIncl) {
    const toInsert = [CHARTER_MIN_FAQ, ALL_INCLUSIVE_FAQ]
    if (leadIdx >= 0) {
      out = [...out.slice(0, leadIdx + 1), ...toInsert, ...out.slice(leadIdx + 1)]
    } else {
      out = [...out, ...toInsert]
    }
  } else if (!alreadyCharter) {
    out = [...out, CHARTER_MIN_FAQ]
  } else if (!alreadyAllIncl) {
    out = [...out, ALL_INCLUSIVE_FAQ]
  }

  return out
}

/** Canonical answers for JSON-LD when the visible question matches (CMS text may lag). */
function canonicalAnswerForSchema(question: string): string | null {
  const ql = question.toLowerCase()
  if (ql.includes('pricing all-inclusive') || (ql.includes('all-inclusive') && ql.includes('pricing'))) {
    return ALL_INCLUSIVE_FAQ.a
  }
  if (ql.includes('minimum for charter')) {
    return CHARTER_MIN_FAQ.a
  }
  if (ql.includes('denver') && (ql.includes('cost') || ql.includes('how much') || ql.includes('limo'))) {
    return DEN_TRANSFER_SCHEMA_FAQ.a
  }
  if (ql.includes('what vehicles') && ql.includes('alpenglow')) {
    return VEHICLE_ANSWER
  }
  return null
}

const SCHEMA_EXTRA_FAQS: { q: string; a: string }[] = [
  ALL_INCLUSIVE_FAQ,
  CHARTER_MIN_FAQ,
  DEN_TRANSFER_SCHEMA_FAQ,
]

function buildFaqPageJsonLd(visibleFaqs: { q: string; a: string }[]) {
  const merged: { q: string; a: string }[] = visibleFaqs.map((f) => {
    const c = canonicalAnswerForSchema(f.q)
    return c ? { q: f.q, a: c } : f
  })
  const seen = new Set(merged.map((f) => f.q.trim().toLowerCase()))
  for (const s of SCHEMA_EXTRA_FAQS) {
    if (!seen.has(s.q.trim().toLowerCase())) {
      merged.push(s)
      seen.add(s.q.trim().toLowerCase())
    }
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: merged.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export default async function FAQPage() {
  const faqs = applyClientContent(await getFaqsFromDb())
  const FAQS = faqs.map((faq) => ({ q: faq.q, a: faq.a }))

  return (
    <div className="min-h-screen bg-white font-inter">
      <div className="bg-alp-navy pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-alp-gold text-sm font-semibold uppercase tracking-[0.2em] mb-3">Questions &amp; Answers</p>
          <h1 className="font-playfair text-4xl md:text-5xl text-white font-light mb-4">Frequently Asked Questions</h1>
          <p className="text-white/60">Everything you need to know about Aspen transportation</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {FAQS.length === 0 ? (
          <p className="text-center text-alp-navy/60 py-12">No FAQs available at the moment. Please check back later.</p>
        ) : (
          FAQS.map((faq) => (
            <details key={faq.q} className="group mb-4 border border-alp-pearl rounded-lg">
              <summary className="flex items-center justify-between p-5 cursor-pointer text-alp-navy font-medium hover:bg-alp-pearl/50 transition-colors rounded-lg">
                <span className="pr-4">{faq.q}</span>
                <svg
                  className="w-5 h-5 text-alp-gold flex-shrink-0 group-open:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-5 pb-5 text-sm text-alp-navy/70 leading-relaxed">{faq.a}</p>
            </details>
          ))
        )}

        <div className="mt-12 text-center bg-alp-pearl rounded-xl p-8">
          <h2 className="font-playfair text-xl text-alp-navy mb-3">Still have questions?</h2>
          <p className="text-sm text-alp-navy/60 mb-5">Call or text us anytime.</p>
          <a
            href="tel:+19704563666"
            className="inline-block bg-alp-gold hover:bg-alp-gold-light text-alp-navy-deep px-8 py-3 rounded-full font-semibold transition-colors"
          >
            970-456-3666
          </a>
          <p className="mt-6 text-sm text-alp-navy/60">
            Or{' '}
            <Link href="/contact" className="text-alp-gold font-semibold hover:underline">
              contact us online
            </Link>
            .
          </p>
        </div>
      </div>

      {FAQS.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildFaqPageJsonLd(FAQS)),
          }}
        />
      )}
    </div>
  )
}
