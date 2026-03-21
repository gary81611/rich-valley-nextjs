'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Toast from '@/components/admin/Toast'
import EmptyState from '@/components/admin/EmptyState'

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string
  service: string
  preferred_date: string
  details: string
  brand: string
  status: string
  created_at: string
}

const statusColors: Record<string, string> = {
  new: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  contacted: 'bg-blue-100 text-blue-800 border-blue-200',
  booked: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-gray-100 text-gray-500 border-gray-200',
}

const statuses = ['new', 'contacted', 'booked', 'closed'] as const

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'pipeline' | 'list'>('pipeline')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterBrand, setFilterBrand] = useState('all')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchContacts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchContacts() {
    const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
    if (error) setToast({ message: 'Failed to load contacts', type: 'error' })
    else setContacts(data ?? [])
    setLoading(false)
  }

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase.from('contact_submissions').update({ status: newStatus }).eq('id', id)
    if (error) {
      setToast({ message: 'Failed to update status', type: 'error' })
    } else {
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)))
      setToast({ message: 'Status updated', type: 'success' })
    }
  }

  const filtered = contacts.filter((c) => filterBrand === 'all' || c.brand === filterBrand)

  const byStatus = (status: string) => filtered.filter((c) => c.status === status)

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contact Inquiries</h1>
          <p className="text-slate-500 text-sm mt-0.5">{filtered.length} total submissions</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white">
            <option value="all">All Brands</option>
            <option value="rva">RVA</option>
            <option value="alpenglow">Alpenglow</option>
          </select>
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button onClick={() => setView('pipeline')} className={`px-3 py-1.5 text-xs font-medium rounded-md ${view === 'pipeline' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Pipeline</button>
            <button onClick={() => setView('list')} className={`px-3 py-1.5 text-xs font-medium rounded-md ${view === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>List</button>
          </div>
        </div>
      </div>

      {contacts.length === 0 ? (
        <EmptyState entity="contacts" />
      ) : view === 'pipeline' ? (
        /* PIPELINE VIEW */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statuses.map((status) => {
            const items = byStatus(status)
            return (
              <div key={status} className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{status}</h3>
                  <span className="text-xs font-medium bg-white px-2 py-0.5 rounded-full text-slate-600 border border-slate-200">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((contact) => (
                    <div key={contact.id} className="bg-white rounded-lg p-3 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm font-medium text-slate-900 truncate">{contact.name}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${contact.brand === 'rva' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {contact.brand === 'rva' ? 'RVA' : 'ALP'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{contact.service || contact.email}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{new Date(contact.created_at).toLocaleDateString()}</p>
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                        {statuses.filter((s) => s !== status).map((s) => (
                          <button key={s} onClick={() => updateStatus(contact.id, s)} className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColors[s]} hover:opacity-80`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-6">No {status} inquiries</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Service</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Brand</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((contact) => (
                  <>
                    <tr
                      key={contact.id}
                      className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${expandedId === contact.id ? 'bg-slate-50' : ''}`}
                      onClick={() => setExpandedId(expandedId === contact.id ? null : contact.id)}
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">{contact.name}</td>
                      <td className="px-4 py-3 text-slate-600">{contact.email}</td>
                      <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{contact.service || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${contact.brand === 'rva' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {contact.brand === 'rva' ? 'RVA' : 'Alpenglow'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={contact.status}
                          onChange={(e) => { e.stopPropagation(); updateStatus(contact.id, e.target.value) }}
                          onClick={(e) => e.stopPropagation()}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[contact.status] || 'bg-slate-100'}`}
                        >
                          {statuses.map((s) => (<option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{new Date(contact.created_at).toLocaleDateString()}</td>
                    </tr>
                    {expandedId === contact.id && (
                      <tr key={`${contact.id}-detail`} className="bg-slate-50">
                        <td colSpan={6} className="px-4 py-4">
                          <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-slate-400 text-xs font-medium mb-1">Phone</p>
                              {contact.phone ? <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">{contact.phone}</a> : <p className="text-slate-400">Not provided</p>}
                            </div>
                            <div>
                              <p className="text-slate-400 text-xs font-medium mb-1">Preferred Date</p>
                              <p className="text-slate-900">{contact.preferred_date || 'Not specified'}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-slate-400 text-xs font-medium mb-1">Details</p>
                              <p className="text-slate-900 whitespace-pre-wrap">{contact.details || 'No details provided.'}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
