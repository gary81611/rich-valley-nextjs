import Image from 'next/image'
import Link from 'next/link'
import { aalDisplayTitle, aalTitlePrice } from '@/lib/aal-display-title'

export type AalGuideSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type AalGuideFaq = { question: string; answer: string }

export type AalGuideLink = { href: string; label: string }

type Props = {
  path: string
  eyebrow: string
  title: string
  lede: string
  imageSrc?: string
  imageAlt?: string
  facts?: string[]
  sections: AalGuideSection[]
  faqs: AalGuideFaq[]
  links: AalGuideLink[]
  source?: { href: string; label: string }
}

export default function AalGuidePage({
  path,
  eyebrow,
  title,
  lede,
  imageSrc,
  imageAlt,
  facts,
  sections,
  faqs,
  links,
  source,
}: Props) {
  const pageUrl = `https://aspenalpenglowlimousine.com${path}`
  const visibleTitle = aalDisplayTitle(title)
  const price = aalTitlePrice(title)
  const factItems = facts && facts.length > 0 ? facts : price ? [price] : []
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aspenalpenglowlimousine.com' },
      { '@type': 'ListItem', position: 2, name: visibleTitle, item: pageUrl },
    ],
  }

  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-alp-pearl/70">
            <Link href="/" className="hover:text-alp-gold transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-alp-gold">{visibleTitle}</span>
          </nav>
        </div>
      </div>

      <section className="aal-hero-photo bg-alp-navy-deep text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <p className="text-alp-gold text-sm tracking-widest uppercase mb-4 font-semibold">{eyebrow}</p>
          <h1 className="font-playfair font-bold mb-6 max-w-4xl">{visibleTitle}</h1>
          <p className="text-lg text-alp-pearl/80 max-w-3xl leading-relaxed">{lede}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/reservations" className="inline-flex items-center justify-center bg-alp-gold text-alp-navy font-semibold px-6 py-3 rounded-full">Book online</Link>
            <Link href="/contact" className="inline-flex items-center justify-center border-2 border-alp-gold text-alp-gold font-semibold px-6 py-3 rounded-full">Request a quote</Link>
          </div>
        </div>
      </section>

      {factItems.length > 0 && (
        <section className="bg-white border-b border-alp-pearl-dark">
          <ul className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-alp-navy">
            {factItems.map((fact) => (
              <li key={fact} className="font-semibold">{fact}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {imageSrc && imageAlt && (
            <div className="mb-12 rounded-2xl bg-alp-navy-deep flex items-center justify-center">
              <Image src={imageSrc} alt={imageAlt} width={800} height={450} className="max-w-full h-auto object-contain" />
            </div>
          )}
          {sections.map((section) => (
            <article key={section.heading} className="mb-12">
              <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-alp-navy mb-4">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-alp-slate leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="list-disc list-inside space-y-2 text-alp-slate mb-4">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}

          {source && (
            <p className="text-alp-slate leading-relaxed mb-12">
              Source:{' '}
              <a href={source.href} className="text-alp-gold font-semibold hover:underline" rel="noopener noreferrer">
                {source.label}
              </a>
              . Check that page for updates.
            </p>
          )}

          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-alp-navy mb-6">Questions</h2>
          {faqs.map((faq) => (
            <details key={faq.question} className="group mb-4 border border-alp-pearl-dark rounded-lg bg-white">
              <summary className="flex items-center justify-between p-5 cursor-pointer text-alp-navy font-medium">
                <span className="pr-4">{faq.question}</span>
                <svg className="w-5 h-5 text-alp-gold flex-shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-5 pb-5 text-sm text-alp-slate leading-relaxed">{faq.answer}</p>
            </details>
          ))}

          <h2 className="font-playfair text-2xl font-bold text-alp-navy mt-12 mb-4">Related</h2>
          <ul className="space-y-2 mb-12">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-alp-gold font-semibold hover:text-alp-navy">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-alp-navy-deep text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl font-bold mb-4">
            Book a <span className="text-alp-gold">private car</span>
          </h2>
          <p className="text-alp-pearl/80 mb-8">Call 970-456-3666. No shared rides are offered.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservations" className="inline-block bg-alp-gold text-alp-navy font-bold px-8 py-3 rounded-full hover:bg-alp-gold-light transition-colors">
              Book Now
            </Link>
            <a href="tel:+19704563666" className="inline-block border-2 border-alp-gold text-alp-gold font-bold px-8 py-3 rounded-full hover:bg-alp-gold hover:text-alp-navy transition-colors">
              Call 970-456-3666
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
