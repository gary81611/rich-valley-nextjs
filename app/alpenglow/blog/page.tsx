import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { BlogPost } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog | Aspen Alpenglow Limousine — Luxury Transportation Tips & Guides',
  description: 'Insider guides on Aspen transportation, airport transfers, ski season travel tips, and luxury car service advice from Aspen Alpenglow Limousine.',
  openGraph: {
    title: 'Blog | Aspen Alpenglow Limousine',
    description: 'Luxury transportation guides and Aspen travel tips.',
    type: 'website',
    url: 'https://aspenalpenglowlimosine.com/blog',
  },
}

async function getPosts(): Promise<BlogPost[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || !url.startsWith('http')) return []

  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('site_key', 'alpenglow')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
    return (data as BlogPost[]) || []
  } catch {
    return []
  }
}

export default async function AlpenglowBlogPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      {/* Breadcrumb */}
      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-white/60 hover:text-alp-gold-light transition-colors">Home</Link>
            <span className="text-white/40">/</span>
            <span className="text-alp-gold-light">Blog</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-alp-navy-deep py-16 px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <p className="font-cormorant text-alp-gold text-lg tracking-widest uppercase mb-3">
            Travel Guides
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Aspen Travel &amp; Luxury Transportation
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
            Expert guides on airport transfers, ski resort transfers, Aspen travel tips,
            and luxury private car service from our experienced chauffeur team.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No posts published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-alp-pearl-dark hover:shadow-md transition-shadow group">
                <Link href={`/blog/${post.slug}`}>
                  <div className="p-6">
                    <div className="text-xs text-alp-gold font-semibold uppercase tracking-wide mb-2">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                        : ''}
                    </div>
                    <h2 className="font-playfair text-lg font-bold text-alp-navy leading-snug mb-3 group-hover:text-alp-gold transition-colors">
                      {post.title}
                    </h2>
                    {post.meta_description && (
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                        {post.meta_description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-alp-gold group-hover:gap-2 transition-all">
                      Read More
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* CTA */}
      <div className="bg-alp-navy-deep py-16 px-6">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="font-playfair text-3xl font-bold mb-4">Ready to Book Your Transfer?</h2>
          <p className="text-white/70 mb-8">
            Luxury private car service throughout Aspen and the Roaring Fork Valley.
            Available 24/7 since 2012.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-alp-gold text-alp-navy font-semibold rounded-full hover:bg-alp-gold-light transition-colors"
          >
            View Our Services
          </Link>
        </div>
      </div>
    </div>
  )
}
