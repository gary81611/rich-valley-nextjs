import type { LandingContent, SiteId } from '@/lib/pages'

interface Props {
  site: SiteId
  title: string
  content: LandingContent
}

const isRva = (site: SiteId) => site === 'rva'

export default function LandingPageTemplate({ site, title, content }: Props) {
  const rva = isRva(site)

  return (
    <div className={rva ? 'font-inter text-rva-forest' : 'font-inter text-alp-navy'}>
      {/* Hero */}
      <section className={`py-20 px-6 text-center ${rva ? 'bg-rva-forest text-rva-cream' : 'bg-alp-navy text-alp-pearl'}`}>
        <div className="max-w-3xl mx-auto">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4 leading-tight">{title}</h1>
          {content.hero_subtitle && (
            <p className="text-lg md:text-xl opacity-80 mt-2">{content.hero_subtitle}</p>
          )}
        </div>
      </section>

      {/* Sections */}
      {content.sections?.map((section, i) => {
        const bg = i % 2 === 0
          ? (rva ? 'bg-rva-cream' : 'bg-alp-pearl')
          : 'bg-white'

        if (section.type === 'text') {
          return (
            <section key={i} className={`py-14 px-6 ${bg}`}>
              <div className="max-w-3xl mx-auto">
                {section.title && (
                  <h2 className={`font-playfair text-3xl font-bold mb-6 ${rva ? 'text-rva-forest' : 'text-alp-navy'}`}>
                    {section.title}
                  </h2>
                )}
                {section.content?.split('\n\n').map((para, j) => (
                  <p key={j} className="text-lg leading-relaxed mb-5 last:mb-0 opacity-85">{para}</p>
                ))}
              </div>
            </section>
          )
        }

        if (section.type === 'features') {
          return (
            <section key={i} className={`py-14 px-6 ${bg}`}>
              <div className="max-w-5xl mx-auto">
                {section.title && (
                  <h2 className={`font-playfair text-3xl font-bold mb-10 text-center ${rva ? 'text-rva-forest' : 'text-alp-navy'}`}>
                    {section.title}
                  </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items?.map((item, j) => (
                    <div key={j} className={`p-6 rounded-xl border ${rva ? 'border-rva-sage/30 bg-white' : 'border-alp-slate/20 bg-white'}`}>
                      <div className={`w-8 h-8 rounded-full mb-3 flex items-center justify-center ${rva ? 'bg-rva-copper' : 'bg-alp-gold'}`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className={`font-semibold text-base mb-1 ${rva ? 'text-rva-forest' : 'text-alp-navy'}`}>{item.title}</h3>
                      <p className="text-sm opacity-75 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )
        }

        if (section.type === 'cta') {
          return (
            <section key={i} className={`py-16 px-6 text-center ${rva ? 'bg-rva-copper text-white' : 'bg-alp-gold text-alp-navy-deep'}`}>
              <div className="max-w-xl mx-auto">
                {section.title && (
                  <h2 className="font-playfair text-3xl font-bold mb-4">{section.title}</h2>
                )}
                {section.content && <p className="mb-8 opacity-90">{section.content}</p>}
              </div>
            </section>
          )
        }

        return null
      })}
    </div>
  )
}
