import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { BlogPost } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function getPost(slug: string): Promise<BlogPost | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || !url.startsWith('http')) return null

  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('site_key', 'alpenglow')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    return data as BlogPost | null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Post Not Found | Aspen Alpenglow Limousine' }

  const canonical = `https://aspenalpenglowlimousine.com/blog/${post.slug}`

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || undefined,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || undefined,
      type: 'article',
      url: canonical,
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
    },
    alternates: { canonical },
  }
}

// ── Simple server-side markdown renderer ──────────────────────────────────────

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>
    return part
  })
}

function renderMarkdown(content: string): React.ReactNode {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="font-playfair text-2xl font-bold text-alp-navy mt-10 mb-4">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="font-playfair text-3xl font-bold text-alp-navy mt-8 mb-4">
          {line.slice(2)}
        </h1>
      )
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="font-playfair text-xl font-semibold text-alp-navy mt-6 mb-3">
          {line.slice(4)}
        </h3>
      )
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={`list-${i}`} className="list-disc list-inside space-y-1.5 my-4 text-slate-600">
          {items.map((item, j) => (
            <li key={j} className="leading-relaxed">{renderInline(item)}</li>
          ))}
        </ul>
      )
      continue
    } else if (line.trim() === '') {
      // skip blank lines
    } else {
      elements.push(
        <p key={i} className="leading-relaxed text-slate-600 mb-4">
          {renderInline(line)}
        </p>
      )
    }
    i++
  }

  return <>{elements}</>
}

// ─────────────────────────────────────────────────────────────────────────────

/** Merged with Supabase `internal_links` for crawl paths to money pages. */
const AAL_BLOG_RELATED: Record<string, { text: string; url: string }[]> = {
  'best-ski-resorts-near-aspen-getting-there-in-style': [
    { text: 'Aspen ↔ Vail private transfers', url: '/areas/vail' },
    { text: 'Snowmass Village car service', url: '/areas/snowmass' },
    { text: 'Ski resort & mountain shuttles', url: '/services/ski-resort-transfers' },
  ],
  'corporate-retreat-transportation-aspen': [
    { text: 'Corporate & executive transportation', url: '/corporate-events' },
    { text: 'Fleet — Suburbans & 14-passenger van', url: '/fleet' },
    { text: 'Request a group quote', url: '/contact' },
  ],
  'aspen-wine-tours-guide-to-local-tastings': [
    { text: 'Wine tours & private chauffeured tastings', url: '/wine-tours' },
    { text: 'Colorado day-trip destinations', url: '/destinations' },
    { text: 'Book a custom itinerary', url: '/reservations' },
  ],
  'airport-transfer-guide-aspen-pitkin-county-airport': [
    { text: 'Book private ASE, EGE & DEN transfers', url: '/airport-transfers' },
    { text: 'Our fleet for airport arrivals', url: '/fleet' },
    { text: 'Snowmass pickup & Aspen runs', url: '/areas/snowmass' },
  ],
  'aspen-airport-transportation-guide': [
    { text: 'Reserve airport car service', url: '/airport-transfers' },
    { text: 'Service areas & regional routes', url: '/service-areas' },
  ],
}

function mergeRelatedLinks(
  slug: string,
  fromDb: { text: string; url: string }[],
): { text: string; url: string }[] {
  const map = new Map<string, { text: string; url: string }>()
  for (const l of [...(AAL_BLOG_RELATED[slug] || []), ...fromDb]) {
    map.set(l.url, l)
  }
  return Array.from(map.values())
}

export default async function AlpenglowBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const relatedLinks = mergeRelatedLinks(post.slug, post.internal_links)

  const defaultArticleImage = 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80'
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.meta_title || post.title,
    description: post.meta_description || undefined,
    image: {
      '@type': 'ImageObject',
      url: defaultArticleImage,
      width: 1200,
      height: 630,
    },
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      '@type': 'Organization',
      name: 'Aspen Alpenglow Limousine',
      url: 'https://aspenalpenglowlimousine.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aspen Alpenglow Limousine',
      url: 'https://aspenalpenglowlimousine.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://aspenalpenglowlimousine.com/images/logos/alpenglow-logo.png',
        width: 300,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://aspenalpenglowlimousine.com/blog/${post.slug}`,
    },
    about: {
      '@type': 'Thing',
      name: 'Luxury private transportation in Aspen, Colorado',
    },
    keywords: [
      post.meta_title || post.title,
      'Aspen Colorado',
      'private car service',
      'limousine',
      'airport transportation',
    ]
      .join(', ')
      .slice(0, 500),
  }

  const faqSchema = post.faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null

  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* Breadcrumb */}
      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-white/60 hover:text-alp-gold-light transition-colors">Home</Link>
            <span className="text-white/40">/</span>
            <Link href="/blog" className="text-white/60 hover:text-alp-gold-light transition-colors">Blog</Link>
            <span className="text-white/40">/</span>
            <span className="text-alp-gold-light truncate max-w-xs">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Article header */}
      <div className="bg-alp-navy-deep pb-16 pt-10 px-6">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="text-alp-gold text-sm font-medium mb-4 space-y-1">
            {post.published_at && (
              <p>
                Published{' '}
                {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            )}
            {post.updated_at &&
              post.published_at &&
              new Date(post.updated_at).getTime() > new Date(post.published_at).getTime() && (
                <p className="text-white/50 text-xs font-normal">
                  Updated{' '}
                  {new Date(post.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              )}
          </div>
          <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-6">
            {post.title}
          </h1>
          {post.meta_description && (
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
              {post.meta_description}
            </p>
          )}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Aspen Alpenglow Limousine
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_280px] gap-12">

          {/* Article body */}
          <article className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-alp-pearl-dark">
            {post.content ? renderMarkdown(post.content) : <p className="text-slate-400">Content coming soon.</p>}

            {/* FAQs inline in article */}
            {post.faqs.length > 0 && (
              <div className="mt-12 pt-8 border-t border-alp-pearl-dark">
                <h2 className="font-playfair text-2xl font-bold text-alp-navy mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {post.faqs.map((faq, i) => (
                    <details key={i} className="group bg-alp-pearl rounded-xl p-5">
                      <summary className="flex items-center justify-between cursor-pointer font-semibold text-alp-navy list-none">
                        <span>{faq.question}</span>
                        <svg className="w-4 h-4 text-alp-gold flex-shrink-0 ml-3 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <p className="mt-3 text-slate-600 leading-relaxed">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Internal links — Related Resources */}
            {relatedLinks.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-alp-pearl-dark">
                <h3 className="font-playfair text-lg font-bold text-alp-navy mb-4">Related Resources</h3>
                <ul className="space-y-2">
                  {relatedLinks.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={link.url}
                        className="flex items-center gap-2 text-sm text-alp-gold hover:text-alp-navy font-medium transition-colors group"
                      >
                        <svg className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA card */}
            <div className="bg-alp-navy rounded-2xl p-6 text-white">
              <h3 className="font-playfair text-lg font-bold mb-2">Book Your Transfer</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                Distinguished private car service in Aspen since 2012. Available 24/7.
              </p>
              <p className="text-alp-gold font-semibold text-lg mb-4">970-456-3666</p>
              <Link
                href="/"
                className="block text-center px-4 py-2.5 bg-alp-gold text-alp-navy text-sm font-semibold rounded-xl hover:bg-alp-gold-light transition-colors"
              >
                View Our Services
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Back to blog */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-alp-gold hover:text-alp-navy transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>
      </div>
    </div>
  )
}
