'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Toast from '@/components/admin/Toast'

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
  new: 'bg-yellow-100 text-yellow-800',
  contacted: 'bg-blue-100 text-blue-800',
  booked: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-600',
}

const brandColors: Record<string, string> = {
  rva: 'bg-green-100 text-green-800',
  alpenglow: 'bg-blue-100 text-blue-800',
}

const brandLabels: Record<string, string> = {
  rva: 'RVA',
  alpenglow: 'Alpenglow',
}

const statuses = ['new', 'contacted', 'booked', 'closed']

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterBrand, setFilterBrand] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchContacts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchContacts() {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setToast({ message: 'Failed to load contacts', type: 'error' })
    } else {
      setContacts(data ?? [])
    }
    setLoading(false)
  }

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase
      .from('contact_submissions')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      setToast({ message: 'Failed to update status', type: 'error' })
    } else {
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      )
      setToast({ message: 'Status updated', type: 'success' })
    }
  }

  const filtered = contacts.filter((c) => {
    if (filterBrand !== 'all' && c.brand !== filterBrand) return false
    if (filterStatus !== 'all' && c.status !== filterStatus) return false
    return true
  })

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Contact Submissions</h1>
      <p className="text-slate-500 text-sm mb-6">Manage inquiries from Rich Valley Adventures and Aspen Alpenglow Limousine.</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-700"
        >
          <option value="all">All Brands</option>
          <option value="rva">RVA</option>
          <option value="alpenglow">Alpenglow</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-700"
        >
          <option value="all">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <span className="text-sm text-slate-400 self-center ml-auto">
          {filtered.length} submission{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">No contact submissions found.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Phone</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600 hidden lg:table-cell">Service</th>
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
                      <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{contact.phone || '—'}</td>
                      <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">{contact.service || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${brandColors[contact.brand] || 'bg-slate-100 text-slate-600'}`}>
                          {brandLabels[contact.brand] || contact.brand}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={contact.status}
                          onChange={(e) => {
                            e.stopPropagation()
                            updateStatus(contact.id, e.target.value)
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[contact.status] || 'bg-slate-100 text-slate-600'}`}
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                    {expandedId === contact.id && (
                      <tr key={`${contact.id}-details`} className="bg-slate-50">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-slate-400 text-xs font-medium mb-1">Full Name</p>
                              <p className="text-slate-900">{contact.name}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-xs font-medium mb-1">Email</p>
                              <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">{contact.email}</a>
                            </div>
                            <div>
                              <p className="text-slate-400 text-xs font-medium mb-1">Phone</p>
                              {contact.phone ? (
                                <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">{contact.phone}</a>
                              ) : (
                                <p className="text-slate-400">Not provided</p>
                              )}
                            </div>
                            <div>
                              <p className="text-slate-400 text-xs font-medium mb-1">Service Requested</p>
                              <p className="text-slate-900">{contact.service || 'Not specified'}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-xs font-medium mb-1">Preferred Date</p>
                              <p className="text-slate-900">{contact.preferred_date || 'Not specified'}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-xs font-medium mb-1">Submitted</p>
                              <p className="text-slate-900">{new Date(contact.created_at).toLocaleString()}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-slate-400 text-xs font-medium mb-1">Details / Message</p>
                              <p className="text-slate-900 whitespace-pre-wrap">{contact.details || 'No additional details provided.'}</p>
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
