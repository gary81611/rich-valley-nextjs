import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'FAQ | Aspen Alpenglow Limousine — Transportation Questions Answered',
  description: 'Frequently asked questions about Aspen transportation, airport transfers, car service pricing, and getting to Aspen from Denver, Eagle, and Grand Junction airports.',
  alternates: { canonical: 'https://aspenalpenglowlimousine.com/alpenglow/faq' },
}

async function getFaqs() {
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

  return data ?? []
}

export default async function FAQPage() {
  const faqs = await getFaqs()
  const FAQS = faqs.map((faq) => ({ q: faq.question, a: faq.answer }))

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
                <svg className="w-5 h-5 text-alp-gold flex-shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <a href="tel:+19704563666" className="inline-block bg-alp-gold hover:bg-alp-gold-light text-alp-navy-deep px-8 py-3 rounded-full font-semibold transition-colors">
            970-456-3666
          </a>
        </div>
      </div>

      {FAQS.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQS.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        })}} />
      )}
    </div>
  )
}
