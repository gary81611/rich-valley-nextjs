import type { FaqContent, SiteId } from '@/lib/pages'

interface Props {
  site: SiteId
  title: string
  content: FaqContent
}

const isRva = (site: SiteId) => site === 'rva'

export default function FaqPageTemplate({ site, title, content }: Props) {
  const rva = isRva(site)
  const phone = content.cta_phone || (rva ? '(970) 948-7474' : '(970) 925-8000')

  // Group by category
  const categories = Array.from(new Set(content.faqs.map(f => f.category || 'General')))
  const grouped = categories.map(cat => ({
    category: cat,
    faqs: content.faqs.filter(f => (f.category || 'General') === cat),
  }))

  return (
    <div className={rva ? 'font-inter text-rva-forest' : 'font-inter text-alp-navy'}>
      {/* Hero */}
      <section className={`py-20 px-6 text-center ${rva ? 'bg-rva-forest text-rva-cream' : 'bg-alp-navy text-alp-pearl'}`}>
        <div className="max-w-3xl mx-auto">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4 leading-tight">{title}</h1>
          {content.intro && (
            <p className="text-lg opacity-80 mt-2 max-w-2xl mx-auto">{content.intro}</p>
          )}
        </div>
      </section>

      {/* FAQ Groups */}
      <section className={`py-14 px-6 ${rva ? 'bg-rva-cream' : 'bg-alp-pearl'}`}>
        <div className="max-w-3xl mx-auto space-y-12">
          {grouped.map((group, gi) => (
            <div key={gi}>
              {categories.length > 1 && (
                <h2 className={`font-playfair text-2xl font-bold mb-6 pb-3 border-b ${rva ? 'text-rva-forest border-rva-sage/30' : 'text-alp-navy border-alp-slate/20'}`}>
                  {group.category}
                </h2>
              )}
              <div className="space-y-4">
                {group.faqs.map((faq, i) => (
                  <details key={i} className={`group rounded-xl border p-5 bg-white ${rva ? 'border-rva-sage/30' : 'border-alp-slate/20'}`}>
                    <summary className={`cursor-pointer font-semibold text-base flex justify-between items-start gap-3 list-none ${rva ? 'text-rva-forest' : 'text-alp-navy'}`}>
                      <span>{faq.question}</span>
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed opacity-80">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={`py-16 px-6 text-center ${rva ? 'bg-rva-copper text-white' : 'bg-alp-gold text-alp-navy-deep'}`}>
        <div className="max-w-xl mx-auto">
          <h2 className="font-playfair text-3xl font-bold mb-4">{content.cta_text || 'Still have questions?'}</h2>
          <p className="mb-8 opacity-90">Call us — we're happy to help you plan the perfect experience.</p>
          <a
            href={`tel:${phone.replace(/\D/g, '')}`}
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 ${rva ? 'bg-white text-rva-forest' : 'bg-alp-navy text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {phone}
          </a>
        </div>
      </section>
    </div>
  )
}
