'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import type { FAQ } from '@/lib/types'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'

const emptyFAQ: Omit<FAQ, 'id' | 'created_at' | 'updated_at'> = {
  question: '', answer: '', site_key: 'rva', display_order: 0, is_active: true,
}

export default function FAQsPage() {
  const [data, setData] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'rva' | 'alpenglow'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<FAQ | null>(null)
  const [form, setForm] = useState(emptyFAQ)
  const [saving, setSaving] = useState(false)
  const [deleteItem, setDeleteItem] = useState<FAQ | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    let query = supabase.from('faqs').select('*').order('display_order')
    if (filter !== 'all') query = query.eq('site_key', filter)
    const { data: rows } = await query
    setData(rows || [])
    setLoading(false)
  }, [supabase, filter])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => { setEditing(null); setForm(emptyFAQ); setModalOpen(true) }
  const openEdit = (item: FAQ) => {
    setEditing(item)
    setForm({ question: item.question, answer: item.answer, site_key: item.site_key, display_order: item.display_order, is_active: item.is_active })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('faqs').update(form).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'FAQ updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('faqs').insert(form)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'FAQ created!', type: 'success' })
    }
    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    await supabase.from('faqs').delete().eq('id', deleteItem.id)
    setDeleteItem(null)
    setToast({ message: 'FAQ deleted.', type: 'success' })
    fetchData()
  }

  const toggleActive = async (item: FAQ) => {
    await supabase.from('faqs').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchData()
  }

  const updateForm = (name: string, value: string | number | boolean) => setForm((prev) => ({ ...prev, [name]: value }))

  const columns: Column<FAQ>[] = [
    { key: 'question', label: 'Question', render: (item) => <span className="truncate block max-w-xs">{item.question}</span> },
    { key: 'site_key', label: 'Site', render: (item) => item.site_key === 'rva' ? 'RVA' : 'Alpenglow' },
    { key: 'display_order', label: 'Order' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">FAQs</h1>
        <div className="flex gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value as 'all' | 'rva' | 'alpenglow')} className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
            <option value="all">All</option>
            <option value="rva">RVA Only</option>
            <option value="alpenglow">Alpenglow Only</option>
          </select>
          <button onClick={openAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">Add FAQ</button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : (
          <AdminTable columns={columns} data={data} onEdit={openEdit} onDelete={setDeleteItem} onToggleActive={toggleActive} />
        )}
      </div>
      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit FAQ' : 'Add FAQ'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Question" name="question" value={form.question} onChange={updateForm} required />
        <FormField label="Answer" name="answer" type="textarea" value={form.answer} onChange={updateForm} required />
        <FormField label="Site" name="site_key" type="select" value={form.site_key} onChange={updateForm} options={[
          { value: 'rva', label: 'Rich Valley Adventures' }, { value: 'alpenglow', label: 'Aspen Alpenglow Limousine' },
        ]} />
        <FormField label="Display Order" name="display_order" type="number" value={form.display_order} onChange={updateForm} />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} />
      </AdminFormModal>
      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName="this FAQ" />
    </div>
  )
}
