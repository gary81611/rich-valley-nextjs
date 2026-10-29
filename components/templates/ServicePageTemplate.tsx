import Image from 'next/image'
import Link from 'next/link'
import type { ServiceContent, SiteId } from '@/lib/pages'
import { isPortraitAdventureImage } from '@/lib/rva-adventure-public'
import RvaButton, { RVA_BOOKING_LABEL, RVA_PHONE_LABEL } from '@/components/rva/Button'

interface Props {
  site: SiteId
  title: string
  content: ServiceContent
  /** Optional contextual internal links (AAL SEO). */
  relatedLinks?: { href: string; label: string }[]
  /** Existing public image. Omitted pages keep the text hero. */
  heroImage?: string
  heroImageAlt?: string
  /** CSS object-position for a portrait hero. Omitted pages stay at the default cover crop. */
  heroObjectPosition?: string
  /** Overrides the shared RVA photo-hero height. AAL heroes ignore this. */
  heroHeightClass?: string
  /** Booking form path, including a service query when the form can preselect it. */
  bookingHref?: string
  bookingLabel?: string
}

const isRva = (site: SiteId) => site === 'rva'

export default function ServicePageTemplate({
  site,
  title,
  content,
  relatedLinks,
  heroImage,
  heroImageAlt,
  heroObjectPosition,
  heroHeightClass,
  bookingHref,
  bookingLabel,
}: Props) {
  const rva = isRva(site)
  const phone = content.cta_phone || (rva ? '(970) 456-3666' : '(970) 456-3666')
  const linkClass = rva
    ? 'text-rva-copper-700 font-semibold hover:text-rva-forest'
    : 'text-alp-gold-700 font-semibold hover:text-alp-navy'
  const portraitHero = rva && !!heroImage && isPortraitAdventureImage(heroImage)
  const rvaHeroClass = heroImage
    ? `relative ${heroHeightClass || 'h-[70svh] md:h-[560px]'} flex items-end overflow-hidden text-rva-cream ${portraitHero ? 'bg-rva-forest-dark' : ''}`
    : 'relative h-[280px] flex items-center justify-center text-center px-6 bg-rva-forest text-rva-cream'

  return (
    <div className={rva ? 'font-inter text-rva-forest' : 'font-inter text-alp-navy'}>
      {/* Hero. RVA photo heroes share one height. Portraits letterbox; AAL markup stays. */}
      <section
        className={
          rva
            ? `text-center ${rvaHeroClass}`
            : 'aal-hero-photo relative overflow-hidden bg-alp-navy text-white'
        }
      >
        {heroImage && (
          <>
            <Image
              src={heroImage}
              alt={heroImageAlt || title}
              fill
              priority
              unoptimized
              className={portraitHero ? 'object-contain' : 'object-cover'}
              style={heroObjectPosition ? { objectPosition: heroObjectPosition } : undefined}
              sizes="100vw"
            />
            <div className={`absolute inset-0 ${portraitHero ? 'bg-gradient-to-b from-rva-forest-dark/35 via-transparent to-rva-forest-dark/75' : 'bg-gradient-to-b from-rva-forest-dark/55 via-rva-forest-dark/45 to-rva-forest-dark/80'}`} />
          </>
        )}
        <div className={`max-w-7xl mx-auto w-full px-6 pb-10 ${heroImage ? 'relative z-10' : ''} ${rva ? 'max-w-3xl text-center' : 'text-left'}`}>
          <h1 className={rva ? 'font-playfair font-semibold mb-4 leading-[1.1]' : 'font-playfair font-bold mb-4 leading-tight'}>{title}</h1>
          {content.hero_subtitle && (
            <p className="text-lg md:text-xl opacity-80 mt-2">{content.hero_subtitle}</p>
          )}
          {!rva && (
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href={bookingHref || '/reservations'} className="inline-flex items-center justify-center bg-alp-gold text-alp-navy font-semibold px-6 py-3 rounded-full">Book online</Link>
              <Link href="/contact" className="inline-flex items-center justify-center border-2 border-alp-gold text-alp-gold font-semibold px-6 py-3 rounded-full">Request a quote</Link>
            </div>
          )}
        </div>
      </section>

      {content.lead && (content.lead.paragraphs.length > 0 || (content.lead.facts && content.lead.facts.length > 0)) && (
        <section className={`py-10 px-6 border-b ${rva ? 'bg-white border-rva-sage/20' : 'bg-white border-alp-slate/15'}`}>
          <div className="max-w-3xl mx-auto">
            {content.lead.heading && (
              <h2 className={`font-playfair text-2xl md:text-3xl font-bold mb-4 ${rva ? 'text-rva-forest' : 'text-alp-navy'}`}>
                {content.lead.heading}
              </h2>
            )}
            {content.lead.paragraphs.map((para, i) => (
              <p key={i} className="text-base md:text-lg leading-relaxed mb-4 last:mb-0">{para}</p>
            ))}
            {content.lead.links && content.lead.links.length > 0 && (
              <ul className="mt-4 space-y-2">
                {content.lead.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {content.lead.facts && content.lead.facts.length > 0 && (
              <table className="w-full text-sm md:text-base mt-6 border-collapse">
                <tbody>
                  {content.lead.facts.map((fact) => (
                    <tr key={fact.label} className={rva ? 'border-b border-rva-sage/30' : 'border-b border-alp-slate/20'}>
                      <th className={`text-left py-2 pr-4 font-semibold align-top w-[34%] ${rva ? 'text-rva-forest' : 'text-alp-navy'}`}>
                        {fact.label}
                      </th>
                      <td className="py-2 align-top">{fact.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      {/* Intro */}
      <section className={`py-14 px-6 ${rva ? 'bg-rva-cream' : 'bg-alp-pearl'}`}>
        <div className="max-w-3xl mx-auto">
          {content.intro.split('\n\n').map((para, i) => (
            <p key={i} className="text-lg leading-relaxed mb-5 last:mb-0">{para}</p>
          ))}
        </div>
      </section>

      {/* Popular hikes — optional structured list */}
      {content.popular_hikes && content.popular_hikes.length > 0 && (
        <section className={`py-14 px-6 ${rva ? 'bg-white' : 'bg-white'}`}>
          <div className="max-w-5xl mx-auto">
            <h2 className={`font-playfair text-3xl font-bold mb-3 text-center ${rva ? 'text-rva-forest' : 'text-alp-navy'}`}>
              {content.popular_hikes.length} popular hikes near Aspen
            </h2>
            <p className={`text-center text-sm md:text-base mb-10 max-w-2xl mx-auto ${rva ? 'text-rva-forest/75' : 'text-alp-navy/70'}`}>
              Mileage and times are typical round trips for an average pace; your guide will match routes to conditions, permits, and your group. Strenuous and high-alpine hikes require fitness and acclimation.
            </p>
            <div className="space-y-4">
              {content.popular_hikes.map((hike, i) => (
                <article
                  key={`${hike.name}-${i}`}
                  className={`rounded-xl border p-5 md:p-6 ${rva ? 'border-rva-sage/30 bg-rva-cream/60' : 'border-alp-slate/20 bg-alp-pearl'}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-6">
                    <h3 className={`font-playfair text-lg md:text-xl font-bold ${rva ? 'text-rva-forest' : 'text-alp-navy'}`}>
                      {i + 1}. {hike.name}
                    </h3>
                    <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm shrink-0 md:text-right">
                      <div>
                        <dt className={`inline font-semibold ${rva ? 'text-rva-forest' : 'text-alp-navy'}`}>Distance: </dt>
                        <dd className="inline opacity-85">{hike.mileage}</dd>
                      </div>
                      <div>
                        <dt className={`inline font-semibold ${rva ? 'text-rva-forest' : 'text-alp-navy'}`}>Typical time: </dt>
                        <dd className="inline opacity-85">{hike.duration}</dd>
                      </div>
                    </dl>
                  </div>
                  <p className={`mt-3 text-sm md:text-base leading-relaxed ${rva ? 'text-rva-forest/85' : 'text-alp-navy/80'}`}>
                    {hike.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {content.features && content.features.length > 0 && (
        <section className={`py-14 px-6 ${rva ? 'bg-white' : 'bg-white'}`}>
          <div className="max-w-5xl mx-auto">
            <h2 className={`font-playfair text-3xl font-bold mb-10 text-center ${rva ? 'text-rva-forest' : 'text-alp-navy'}`}>
              What's Included
            </h2>
            {rva ? (
              <ul className="max-w-3xl mx-auto space-y-4">
                {content.features.map((f, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rva-copper-700 text-white" aria-hidden>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <div>
                      <h3 className="font-playfair text-lg font-semibold text-rva-forest">{f.title}</h3>
                      {f.description ? <p className="text-[17px] leading-7 text-rva-forest/80">{f.description}</p> : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.features.map((f, i) => (
                <div key={i} className="p-6 rounded-xl border border-alp-slate/20 bg-alp-pearl">
                  <div className="w-8 h-8 rounded-full mb-3 flex items-center justify-center bg-alp-gold">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-base mb-1 text-alp-navy">{f.title}</h3>
                  <p className="text-sm opacity-75 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
            )}
          </div>
        </section>
      )}

      {/* H2 Sections */}
      {content.h2_sections && content.h2_sections.length > 0 && (
        <section className={`py-14 px-6 ${rva ? 'bg-rva-cream' : 'bg-alp-pearl'}`}>
          <div className="max-w-3xl mx-auto space-y-12">
            {content.h2_sections.map((s, i) => (
              <div key={i}>
                {s.image ? (
                  <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-xl border border-rva-forest/15">
                    <Image src={s.image} alt={s.imageAlt || s.title} fill className="object-cover" unoptimized sizes="(min-width: 768px) 720px, 100vw" />
                  </div>
                ) : null}
                <h2 id={s.id} className={`font-playfair text-2xl md:text-3xl font-bold mb-4 ${rva ? 'text-rva-forest' : 'text-alp-navy'}`}>
                  {s.title}
                </h2>
                {s.content.split('\n\n').map((para, j) => (
                  <p key={j} className="text-base leading-relaxed mb-4 last:mb-0 opacity-85">{para}</p>
                ))}
                {s.link && (
                  <p className="mt-4">
                    <Link href={s.link.href} className={linkClass}>
                      {s.link.label}
                    </Link>
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {rva && relatedLinks && relatedLinks.length > 0 && (
        <section className="py-14 px-6 bg-rva-cream border-y border-rva-cream-dark">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-6 text-rva-forest">
              Planning guides &amp; local intel
            </h2>
            <ul className="space-y-3">
              {relatedLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-rva-copper-700 font-medium hover:text-rva-forest underline-offset-2 hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {!rva && relatedLinks && relatedLinks.length > 0 && (
        <section className="py-14 px-6 bg-alp-pearl border-y border-alp-pearl-dark">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-6 text-alp-navy">
              Explore related services &amp; routes
            </h2>
            <ul className="space-y-3">
              {relatedLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-alp-gold font-medium hover:text-alp-navy underline-offset-2 hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {content.faqs && content.faqs.length > 0 && (
        <section className={`py-14 px-6 ${rva ? 'bg-white' : 'bg-white'}`}>
          <div className="max-w-3xl mx-auto">
            <h2 className={`font-playfair text-3xl font-bold mb-8 ${rva ? 'text-rva-forest' : 'text-alp-navy'}`}>
              Frequently Asked Questions
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

      {/* CTA. RVA uses the forest band and copper-700 buttons. AAL stays on gold. */}
      {rva ? (
        <section className="py-16 px-6 text-center bg-rva-forest text-white">
          <div className="max-w-xl mx-auto">
            <h2 className="font-playfair text-3xl font-bold mb-4">{content.cta_text || 'Ready to book?'}</h2>
            {content.cta_note && <p className="mb-4 text-base font-medium">{content.cta_note}</p>}
            <p className="mb-8 text-white/80">Call or send a note to check availability.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <RvaButton href={bookingHref || '/contact'} size="lg" tone="on-dark">
                {RVA_BOOKING_LABEL}
              </RvaButton>
              <RvaButton href={`tel:${phone.replace(/\D/g, '')}`} variant="secondary" size="lg" tone="on-dark">
                {RVA_PHONE_LABEL}
              </RvaButton>
            </div>
          </div>
        </section>
      ) : (
      <section className="py-16 px-6 text-center bg-alp-gold text-alp-navy-deep">
        <div className="max-w-xl mx-auto">
          <h2 className="font-playfair text-3xl font-bold mb-4">{content.cta_text || 'Ready to Book?'}</h2>
          {content.cta_note && <p className="mb-4 text-base font-medium">{content.cta_note}</p>}
          <p className="mb-8 opacity-90">
            {bookingHref
              ? 'Send a booking request, or call to check availability and reserve your spot.'
              : 'Call us to check availability and reserve your spot.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {bookingHref && (
              <Link
                href={bookingHref}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 bg-alp-navy text-white"
              >
                {bookingLabel || 'Book online'}
              </Link>
            )}
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 ${
                bookingHref
                  ? 'border-2 border-alp-navy text-alp-navy-deep'
                  : 'bg-alp-navy text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {phone}
            </a>
          </div>
        </div>
      </section>
      )}
    </div>
  )
}
