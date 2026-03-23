import type { LocationContent, SiteId } from '@/lib/pages'

interface Props {
  site: SiteId
  title: string
  content: LocationContent
}

const isRva = (site: SiteId) => site === 'rva'

export default function LocationPageTemplate({ site, title, content }: Props) {
  const rva = isRva(site)
  const phone = content.cta_phone || (rva ? '(970) 948-7474' : '(970) 925-8000')

  return (
    <div className={rva ? 'font-inter text-rva-forest' : 'font-inter text-alp-navy'}>
      {/* Hero */}
      <section className={`py-20 px-6 text-center ${rva ? 'bg-rva-forest text-rva-cream' : 'bg-alp-navy text-alp-pearl'}`}>
        <div className="max-w-3xl mx-auto">
          <p className={`text-sm font-semibold tracking-widest uppercase mb-3 ${rva ? 'text-rva-copper-light' : 'text-alp-gold-light'}`}>
            {content.area_description}
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold leading-tight">{title}</h1>
        </div>
      </section>

      {/* Intro */}
      <section className={`py-14 px-6 ${rva ? 'bg-rva-cream' : 'bg-alp-pearl'}`}>
        <div className="max-w-3xl mx-auto">
          {content.intro.split('\n\n').map((para, i) => (
            <p key={i} className="text-lg leading-relaxed mb-5 last:mb-0">{para}</p>
          ))}
        </div>
      </section>

      {/* Services Available */}
      {content.services_available && content.services_available.length > 0 && (
        <section className={`py-14 px-6 ${rva ? 'bg-white' : 'bg-white'}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className={`font-playfair text-3xl font-bold mb-8 ${rva ? 'text-rva-forest' : 'text-alp-navy'}`}>
              {rva ? 'Adventures Available' : 'Services Available'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.services_available.map((svc, i) => (
                <div key={i} className={`flex items-center gap-3 p-4 rounded-lg ${rva ? 'bg-rva-cream border border-rva-sage/30' : 'bg-alp-pearl border border-alp-slate/20'}`}>
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${rva ? 'bg-rva-copper' : 'bg-alp-gold'}`}>
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium text-sm">{svc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Local Tips */}
      {content.local_tips && content.local_tips.length > 0 && (
        <section className={`py-14 px-6 ${rva ? 'bg-rva-cream' : 'bg-alp-pearl'}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className={`font-playfair text-3xl font-bold mb-8 ${rva ? 'text-rva-forest' : 'text-alp-navy'}`}>
              Local Tips & Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.local_tips.map((tip, i) => (
                <div key={i} className={`p-6 rounded-xl ${rva ? 'bg-white border border-rva-sage/20' : 'bg-white border border-alp-slate/15'}`}>
                  <h3 className={`font-semibold text-base mb-2 ${rva ? 'text-rva-copper' : 'text-alp-gold'}`}>{tip.title}</h3>
                  <p className="text-sm leading-relaxed opacity-80">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {content.faqs && content.faqs.length > 0 && (
        <section className="py-14 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className={`font-playfair text-3xl font-bold mb-8 ${rva ? 'text-rva-forest' : 'text-alp-navy'}`}>
              Common Questions
            </h2>
            <div className="space-y-5">
              {content.faqs.map((faq, i) => (
                <details key={i} className={`group rounded-xl border p-5 ${rva ? 'border-rva-sage/30' : 'border-alp-slate/20'}`}>
                  <summary className={`cursor-pointer font-semibold text-base flex justify-between items-start gap-3 ${rva ? 'text-rva-forest' : 'text-alp-navy'}`}>
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
        </section>
      )}

      {/* CTA */}
      <section className={`py-16 px-6 text-center ${rva ? 'bg-rva-copper text-white' : 'bg-alp-gold text-alp-navy-deep'}`}>
        <div className="max-w-xl mx-auto">
          <h2 className="font-playfair text-3xl font-bold mb-4">{content.cta_text || 'Ready to Book?'}</h2>
          <p className="mb-8 opacity-90">Get in touch to plan your perfect experience.</p>
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
