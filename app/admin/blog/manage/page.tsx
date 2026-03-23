'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { BlogPost } from '@/lib/types'
import Toast from '@/components/admin/Toast'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'

const STATUS_LABELS: Record<BlogPost['status'], string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  published: 'Published',
}

const STATUS_COLORS: Record<BlogPost['status'], string> = {
  draft: 'bg-slate-100 text-slate-600',
  scheduled: 'bg-violet-100 text-violet-700',
  published: 'bg-green-100 text-green-700',
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function BlogManagePage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'rva' | 'alpenglow'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | BlogPost['status']>('all')
  const [deleteItem, setDeleteItem] = useState<BlogPost | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const supabase = createClient()

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'all') query = query.eq('site_key', filter)
    if (statusFilter !== 'all') query = query.eq('status', statusFilter)

    const { data, error } = await query
    if (error) {
      setToast({ message: error.message, type: 'error' })
    } else {
      setPosts(data || [])
    }
    setLoading(false)
  }, [supabase, filter, statusFilter])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const handleDelete = async () => {
    if (!deleteItem) return
    const { error } = await supabase.from('blog_posts').delete().eq('id', deleteItem.id)
    if (error) {
      setToast({ message: error.message, type: 'error' })
    } else {
      setToast({ message: 'Post deleted.', type: 'success' })
      fetchPosts()
    }
    setDeleteItem(null)
  }

  const togglePublish = async (post: BlogPost) => {
    setTogglingId(post.id)
    const newStatus = post.status === 'published' ? 'draft' : 'published'
    const { error } = await supabase
      .from('blog_posts')
      .update({
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : null,
      })
      .eq('id', post.id)

    if (error) {
      setToast({ message: error.message, type: 'error' })
    } else {
      setToast({ message: newStatus === 'published' ? 'Post published!' : 'Post unpublished.', type: 'success' })
      fetchPosts()
    }
    setTogglingId(null)
  }

  const blogUrl = (post: BlogPost) =>
    post.site_key === 'rva'
      ? `https://richvalleyadventures.com/blog/${post.slug}`
      : `https://aspenalpenglowlimosine.com/blog/${post.slug}`

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DeleteConfirmDialog
        isOpen={!!deleteItem}
        onConfirm={handleDelete}
        onCancel={() => setDeleteItem(null)}
        itemName={deleteItem ? `"${deleteItem.title}"` : 'this post'}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Blog Posts</h1>
          <p className="text-sm text-slate-500 mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'rva' | 'alpenglow')}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
          >
            <option value="all">All Sites</option>
            <option value="rva">RVA Only</option>
            <option value="alpenglow">Alpenglow Only</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | BlogPost['status'])}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Draft</option>
          </select>
          <a
            href="/admin/blog"
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            + New Post
          </a>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <svg className="w-10 h-10 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <p className="text-slate-500 text-sm font-medium">No blog posts yet</p>
            <p className="text-slate-400 text-xs mt-1">Generate and publish your first post from the Blog Generator.</p>
            <a href="/admin/blog" className="mt-4 px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800">
              Open Blog Generator
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Site</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Published / Scheduled</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 truncate max-w-xs">{post.title}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">/blog/{post.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        post.site_key === 'rva' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {post.site_key === 'rva' ? 'RVA' : 'AAL'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[post.status]}`}>
                        {STATUS_LABELS[post.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {post.status === 'scheduled'
                        ? formatDate(post.scheduled_for)
                        : formatDate(post.published_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {/* View link (published only) */}
                        {post.status === 'published' && (
                          <a
                            href={blogUrl(post)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                            title="View post"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}

                        {/* Publish/Unpublish toggle */}
                        <button
                          onClick={() => togglePublish(post)}
                          disabled={togglingId === post.id || post.status === 'scheduled'}
                          title={post.status === 'published' ? 'Unpublish' : 'Publish now'}
                          className={`p-1.5 transition-colors disabled:opacity-40 ${
                            post.status === 'published'
                              ? 'text-green-600 hover:text-slate-500'
                              : 'text-slate-400 hover:text-green-600'
                          }`}
                        >
                          {togglingId === post.id ? (
                            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                                post.status === 'published'
                                  ? 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636'
                                  : 'M5 13l4 4L19 7'
                              } />
                            </svg>
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteItem(post)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete post"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
