/** Home FAQ is the first four items of the ordered list. /faq keeps the full set. */

export type HomeFaq = { q: string; a: string }

export const HOME_FAQ_LIMIT = 4

export function selectHomeFaqs(faqs: HomeFaq[]): HomeFaq[] {
  return faqs.slice(0, HOME_FAQ_LIMIT)
}

/** One FAQPage, containing only the questions the home page renders. */
export function homeFaqPageJsonLd(faqs: HomeFaq[]) {
  const visible = selectHomeFaqs(faqs)
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: visible.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}
