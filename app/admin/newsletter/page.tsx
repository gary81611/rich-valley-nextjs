'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import Toast from '@/components/admin/Toast'

interface Subscriber {
  id: string
  email: string
  site_key: 'rva' | 'alpenglow'
  subscribed_at: string
}

export default function NewsletterPage() {
  const [data, setData] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: rows } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false })
    setData(rows || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async (id: string) => {
    await supabase.from('newsletter_subscribers').delete().eq('id', id)
    setToast({ message: 'Subscriber removed.', type: 'success' })
    fetchData()
  }

  const exportCSV = () => {
    const csv = ['Email,Site,Subscribed At', ...data.map((s) => `${s.email},${s.site_key},${s.subscribed_at}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'newsletter_subscribers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const rvaCount = data.filter((s) => s.site_key === 'rva').length
  const alpCount = data.filter((s) => s.site_key === 'alpenglow').length

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Newsletter Subscribers</h1>
          <p className="text-slate-500 text-sm mt-1">
            {data.length} total — RVA: {rvaCount} · Alpenglow: {alpCount}
          </p>
        </div>
        <button onClick={exportCSV} disabled={data.length === 0} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50">
          Export CSV
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">No subscribers yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Site</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Subscribed</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((sub) => (
                  <tr key={sub.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-900">{sub.email}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${sub.site_key === 'rva' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {sub.site_key === 'rva' ? 'RVA' : 'Alpenglow'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-500">{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                    <td className="px-6 py-3 text-right">
                      <button onClick={() => handleDelete(sub.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
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
