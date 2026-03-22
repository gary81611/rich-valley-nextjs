import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { BlogPost } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog | Rich Valley Adventures — Aspen Outdoor Adventure Tips & Guides',
  description: 'Expert outdoor adventure guides, fly fishing tips, hiking routes, and local insights from our team at Rich Valley Adventures in Aspen, Colorado.',
  openGraph: {
    title: 'Blog | Rich Valley Adventures',
    description: 'Outdoor adventure guides and local tips from Aspen, Colorado.',
    type: 'website',
    url: 'https://richvalleyadventures.com/blog',
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
      .eq('site_key', 'rva')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
    return (data as BlogPost[]) || []
  } catch {
    return []
  }
}

export default async function RVABlogPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-rva-cream font-inter">
      {/* Breadcrumb */}
      <div className="bg-rva-forest-dark">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-white/60 hover:text-rva-copper-light transition-colors">Home</Link>
            <span className="text-white/40">/</span>
            <span className="text-rva-copper-light">Blog</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-rva-forest-dark py-16 px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <p className="font-cormorant text-rva-sage text-lg tracking-widest uppercase mb-3">
            Local Insights
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Adventures &amp; Guides
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
            Tips, guides, and local knowledge from our team of Aspen outdoor experts. Fly fishing,
            hiking, mountain biking, and more in the Roaring Fork Valley.
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
              <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-rva-cream-dark hover:shadow-md transition-shadow group">
                <Link href={`/blog/${post.slug}`}>
                  <div className="p-6">
                    <div className="text-xs text-rva-copper font-semibold uppercase tracking-wide mb-2">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                        : ''}
                    </div>
                    <h2 className="font-playfair text-lg font-bold text-rva-forest leading-snug mb-3 group-hover:text-rva-copper transition-colors">
                      {post.title}
                    </h2>
                    {post.meta_description && (
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                        {post.meta_description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-rva-copper group-hover:gap-2 transition-all">
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
      <div className="bg-rva-forest-dark py-16 px-6">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="font-playfair text-3xl font-bold mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-white/70 mb-8">
            Book a guided fly fishing, hiking, or biking experience with Rich Valley Adventures.
            Small groups, expert guides, all gear included.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-rva-copper text-white font-semibold rounded-full hover:bg-rva-copper-light transition-colors"
          >
            View All Adventures
          </Link>
        </div>
      </div>
    </div>
  )
}
