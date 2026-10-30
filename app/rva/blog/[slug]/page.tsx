import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { absolutePublicImageUrl, canonicalUrl } from '@/lib/seo/canonical'
import { normalizeRvaLegacyPath } from '@/lib/seo/legacy-routes'
import { mergeRvaBlogSidebarLinks } from '@/lib/rva-blog-pillars'
import { rvaBlogSlugShouldRedirectToBlogIndex } from '@/lib/rva-blog-seo-redirect'
import { seoAlt } from '@/lib/seo/alt-text'
import type { BlogPost } from '@/lib/types'
import { withPrivateRanchFishingLink, withYearRoundFishingNote } from '@/lib/rva-fly-fishing-content'
import { stripEscaladeCopy } from '@/lib/rva-confirmed'
import { blogImageSrcForNext, isBlogPostPubliclyVisible } from '@/lib/blog-visibility'
import RvaButton from '@/components/rva/Button'

export const dynamic = 'force-dynamic'

async function getPost(slug: string): Promise<BlogPost | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || !url.startsWith('http')) return null

  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('site_key', 'rva')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    if (!data || !isBlogPostPubliclyVisible(data as BlogPost)) return null
    return data as BlogPost
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  if (await rvaBlogSlugShouldRedirectToBlogIndex(slug)) {
    permanentRedirect('/blog')
  }
  const post = await getPost(slug)
  if (!post) return { title: 'Post Not Found | Rich Valley Adventures' }

  const ogImage = absolutePublicImageUrl('rva', blogImageSrcForNext(post.featured_image_url))
  const title = stripEscaladeCopy(post.meta_title || post.title)
  const description = post.meta_description ? stripEscaladeCopy(post.meta_description) : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonicalUrl('rva', `/blog/${post.slug}`),
      publishedTime: post.published_at || undefined,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    ...(ogImage
      ? { twitter: { card: 'summary_large_image' as const, images: [ogImage] } }
      : {}),
    alternates: { canonical: canonicalUrl('rva', `/blog/${post.slug}`) },
  }
}

// ── Simple server-side markdown renderer ──────────────────────────────────────

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part)
    if (link) {
      const href = link[2]
      if (href.startsWith('/') && !href.startsWith('//')) {
        return (
          <Link key={i} href={href} className="text-rva-copper-700 hover:text-rva-forest font-medium underline">
            {link[1]}
          </Link>
        )
      }
      return link[1]
    }
    return part
  })
}

function renderMarkdown(content: string, pageTitle?: string): React.ReactNode {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0
  const normalizedTitle = (pageTitle || '').replace(/\s+/g, ' ').trim().toLowerCase()

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="font-playfair text-2xl font-bold text-rva-forest mt-10 mb-4">
          {renderInline(line.slice(3))}
        </h2>
      )
    } else if (line.startsWith('# ')) {
      const heading = line.slice(2).trim()
      const sameAsTitle = normalizedTitle.length > 0 && heading.replace(/\s+/g, ' ').toLowerCase() === normalizedTitle
      if (!sameAsTitle) {
        elements.push(
          <h2 key={i} className="font-playfair text-2xl font-bold text-rva-forest mt-8 mb-4">
            {renderInline(heading)}
          </h2>
        )
      }
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="font-playfair text-xl font-semibold text-rva-forest mt-6 mb-3">
          {renderInline(line.slice(4))}
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
      // skip blank lines between block elements
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

export default async function RVABlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (await rvaBlogSlugShouldRedirectToBlogIndex(slug)) {
    permanentRedirect('/blog')
  }
  const post = await getPost(slug)
  if (!post) notFound()

  const sidebarLinks = mergeRvaBlogSidebarLinks(
    post.slug,
    (post.internal_links ?? []).map((link) => ({
      ...link,
      text: stripEscaladeCopy(link.text || ''),
      url: /scenic-drives|escalade/i.test(link.url || '')
        ? '/adventures/scenic-wildlife-tours'
        : link.url,
    })),
  )
  const ranchMention = /spring creek ranch/i.test(
    [post.content, ...(post.faqs ?? []).flatMap((f) => [f.question, f.answer])].filter(Boolean).join('\n'),
  )
  if (ranchMention && !sidebarLinks.some((l) => l.url.includes('/private-ranch-fishing'))) {
    sidebarLinks.unshift({ text: 'Private ranch fishing at Spring Creek Ranch', url: '/private-ranch-fishing' })
  }

  const coverImageAbsolute = absolutePublicImageUrl('rva', blogImageSrcForNext(post.featured_image_url))
  const coverImageSrc = blogImageSrcForNext(post.featured_image_url)

  const articleUrl = canonicalUrl('rva', `/blog/${post.slug}`)
  const publisherLogoUrl = 'https://www.richvalleyadventures.com/images/logos/rva-logo.png'
  const defaultArticleImage = publisherLogoUrl
  const heroImageUrl = coverImageAbsolute || defaultArticleImage
  const description =
    post.meta_description ||
    (post.content ? stripEscaladeCopy(post.content).replace(/\s+/g, ' ').trim().slice(0, 200) : '') ||
    post.title
  const articleBody = post.content
    ? stripEscaladeCopy(withPrivateRanchFishingLink(withYearRoundFishingNote(post.content)))
    : ''
  const sanitizedFaqs = (post.faqs ?? [])
    .map((f) => ({
      question: typeof f.question === 'string' ? f.question.trim() : '',
      answer: typeof f.answer === 'string' ? stripEscaladeCopy(withPrivateRanchFishingLink(withYearRoundFishingNote(f.answer.trim()), true)) : '',
    }))
    .filter((f) => f.question.length > 0 && f.answer.length > 0)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description,
    image: {
      '@type': 'ImageObject',
      url: heroImageUrl,
      width: 1200,
      height: 630,
    },
    author: {
      '@type': 'Organization',
      name: 'Rich Valley Adventures',
      url: 'https://www.richvalleyadventures.com/guides',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rich Valley Adventures',
      url: 'https://www.richvalleyadventures.com',
      logo: {
        '@type': 'ImageObject',
        url: publisherLogoUrl,
        width: 300,
        height: 60,
      },
    },
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    about: {
      '@type': 'Thing',
      name: 'Outdoor adventures and guided experiences in Aspen, Colorado',
    },
  }

  const faqSchema = sanitizedFaqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: sanitizedFaqs.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.richvalleyadventures.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.richvalleyadventures.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: articleUrl },
    ],
  }

  return (
    <div className="min-h-screen bg-rva-cream font-inter">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* Breadcrumb */}
      <div className="bg-rva-forest-dark">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-white/60 hover:text-rva-copper-light transition-colors">Home</Link>
            <span className="text-white/40">/</span>
            <Link href="/blog" className="text-white/60 hover:text-rva-copper-light transition-colors">Blog</Link>
            <span className="text-white/40">/</span>
            <span className="text-rva-copper-light truncate max-w-xs">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Article header */}
      <div className="bg-rva-forest-dark pb-16 pt-10 px-6">
        <div className="max-w-3xl mx-auto text-center text-white">
          {post.published_at && (
            <p className="text-rva-sage text-sm font-medium mb-4">
              {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          )}
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
            Rich Valley Adventures
          </div>
          {coverImageAbsolute && (
            <div className="relative mt-10 max-w-4xl mx-auto aspect-[2/1] rounded-xl overflow-hidden shadow-xl border border-white/10">
              <Image
                src={coverImageSrc || coverImageAbsolute}
                alt={seoAlt({
                  subject: post.title,
                  location: 'Aspen and Roaring Fork Valley',
                  context: 'blog article',
                  brand: 'Rich Valley Adventures',
                })}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_280px] gap-12">

          {/* Article body */}
          <article className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-rva-cream-dark">
            {articleBody ? renderMarkdown(articleBody, post.title) : <p className="text-slate-400">This article has no body text yet.</p>}

            {/* FAQs inline in article */}
            {sanitizedFaqs.length > 0 && (
              <div className="mt-12 pt-8 border-t border-rva-cream-dark">
                <h2 className="font-playfair text-2xl font-bold text-rva-forest mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {sanitizedFaqs.map((faq, i) => (
                    <details key={i} className="group bg-rva-cream rounded-xl p-5">
                      <summary className="flex items-center justify-between cursor-pointer font-semibold text-rva-forest list-none">
                        <span>{faq.question}</span>
                        <svg className="w-4 h-4 text-rva-copper-700 flex-shrink-0 ml-3 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <p className="mt-3 text-slate-600 leading-relaxed">{renderInline(faq.answer)}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Internal links — Related Resources (+ pillar deep links) */}
            {sidebarLinks.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-rva-cream-dark">
                <h3 className="font-playfair text-lg font-bold text-rva-forest mb-4">Related Resources</h3>
                <ul className="space-y-2">
                  {sidebarLinks.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={normalizeRvaLegacyPath(link.url)}
                        className="flex items-center gap-2 text-sm text-rva-copper-700 hover:text-rva-forest font-medium transition-colors group"
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
            <div className="bg-rva-forest rounded-2xl p-6 text-white">
              <h3 className="font-playfair text-lg font-bold mb-2">Ready to Book?</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                Expert-guided adventures in Aspen since 2012. Small groups, all gear included.
              </p>
              <p className="text-rva-copper-light font-semibold text-lg mb-4">970-456-3666</p>
              <div className="flex flex-col gap-2">
                <RvaButton href="/adventures" size="md" tone="on-dark" className="w-full">
                  Browse guided adventures
                </RvaButton>
                <RvaButton href="/contact" variant="secondary" size="md" tone="on-dark" className="w-full">
                  Contact us to book
                </RvaButton>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Back to blog */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-rva-copper-700 hover:text-rva-forest transition-colors"
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
