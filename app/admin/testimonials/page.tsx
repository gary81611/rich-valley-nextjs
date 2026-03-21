'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import type { Testimonial } from '@/lib/types'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'
import EmptyState from '@/components/admin/EmptyState'

const emptyTestimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'> = {
  author: '', quote: '', rating: 5, site_key: 'rva', is_active: true,
}

export default function TestimonialsPage() {
  const [data, setData] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'rva' | 'alpenglow'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState(emptyTestimonial)
  const [saving, setSaving] = useState(false)
  const [deleteItem, setDeleteItem] = useState<Testimonial | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    let query = supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('site_key', filter)
    const { data: rows } = await query
    setData(rows || [])
    setLoading(false)
  }, [supabase, filter])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => { setEditing(null); setForm(emptyTestimonial); setModalOpen(true) }
  const openEdit = (item: Testimonial) => {
    setEditing(item)
    setForm({ author: item.author, quote: item.quote, rating: item.rating, site_key: item.site_key, is_active: item.is_active })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('testimonials').update(form).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Testimonial updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('testimonials').insert(form)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Testimonial created!', type: 'success' })
    }
    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    await supabase.from('testimonials').delete().eq('id', deleteItem.id)
    setDeleteItem(null)
    setToast({ message: 'Testimonial deleted.', type: 'success' })
    fetchData()
  }

  const toggleActive = async (item: Testimonial) => {
    await supabase.from('testimonials').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchData()
  }

  const updateForm = (name: string, value: string | number | boolean) => setForm((prev) => ({ ...prev, [name]: value }))

  const columns: Column<Testimonial>[] = [
    { key: 'author', label: 'Author' },
    { key: 'rating', label: 'Rating', render: (item) => `${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}` },
    { key: 'site_key', label: 'Site', render: (item) => item.site_key === 'rva' ? 'RVA' : 'Alpenglow' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
        <div className="flex gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value as 'all' | 'rva' | 'alpenglow')} className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
            <option value="all">All</option>
            <option value="rva">RVA Only</option>
            <option value="alpenglow">Alpenglow Only</option>
          </select>
          <button onClick={openAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">Add Testimonial</button>
        </div>
      </div>
      {!loading && data.length === 0 && <EmptyState entity="testimonials" />}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : (
          <AdminTable columns={columns} data={data} onEdit={openEdit} onDelete={setDeleteItem} onToggleActive={toggleActive} />
        )}
      </div>
      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit Testimonial' : 'Add Testimonial'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Author" name="author" value={form.author} onChange={updateForm} required />
        <FormField label="Quote" name="quote" type="textarea" value={form.quote} onChange={updateForm} required />
        <FormField label="Rating" name="rating" type="select" value={String(form.rating)} onChange={(n, v) => updateForm(n, Number(v))} options={[
          { value: '5', label: '5 Stars' }, { value: '4', label: '4 Stars' }, { value: '3', label: '3 Stars' },
          { value: '2', label: '2 Stars' }, { value: '1', label: '1 Star' },
        ]} />
        <FormField label="Site" name="site_key" type="select" value={form.site_key} onChange={updateForm} options={[
          { value: 'rva', label: 'Rich Valley Adventures' }, { value: 'alpenglow', label: 'Aspen Alpenglow Limousine' },
        ]} />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} />
      </AdminFormModal>
      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName={deleteItem?.author || 'this testimonial'} />
    </div>
  )
}
