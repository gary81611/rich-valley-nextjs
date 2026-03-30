'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'
import EmptyState from '@/components/admin/EmptyState'

interface Guide {
  id: string
  created_at: string
  updated_at: string
  name: string
  title: string
  photo_url: string
  bio: string
  years_experience: number
  display_order: number
  is_active: boolean
}

const emptyGuide: Omit<Guide, 'id' | 'created_at' | 'updated_at'> = {
  name: '', title: '', photo_url: '', bio: '', years_experience: 0, display_order: 0, is_active: true,
}

export default function GuidesPage() {
  const [data, setData] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Guide | null>(null)
  const [form, setForm] = useState(emptyGuide)
  const [saving, setSaving] = useState(false)
  const [deleteItem, setDeleteItem] = useState<Guide | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: rows } = await supabase.from('guides').select('*').order('display_order')
    setData(rows || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => { setEditing(null); setForm(emptyGuide); setModalOpen(true) }
  const openEdit = (item: Guide) => {
    setEditing(item)
    setForm({ name: item.name, title: item.title, photo_url: item.photo_url, bio: item.bio, years_experience: item.years_experience, display_order: item.display_order, is_active: item.is_active })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('guides').update(form).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Guide updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('guides').insert(form)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Guide created!', type: 'success' })
    }
    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    const { error } = await supabase.from('guides').delete().eq('id', deleteItem.id)
    if (error) setToast({ message: error.message, type: 'error' })
    else setToast({ message: 'Guide deleted.', type: 'success' })
    setDeleteItem(null)
    fetchData()
  }

  const toggleActive = async (item: Guide) => {
    await supabase.from('guides').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchData()
  }

  const updateForm = (name: string, value: string | number | boolean) => setForm((prev) => ({ ...prev, [name]: value }))

  const columns: Column<Guide>[] = [
    { key: 'name', label: 'Name' },
    { key: 'title', label: 'Title' },
    { key: 'is_active', label: 'Active', render: (item) => item.is_active ? '✓' : '—' },
    { key: 'display_order', label: 'Order' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Guides</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
          Add Guide
        </button>
      </div>

      {!loading && data.length === 0 && <EmptyState entity="guides" onAdd={openAdd} addLabel="Add Guide" />}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : (
          <AdminTable columns={columns} data={data} onEdit={openEdit} onDelete={setDeleteItem} onToggleActive={toggleActive} />
        )}
      </div>

      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit Guide' : 'Add Guide'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Name" name="name" value={form.name} onChange={updateForm} required help="The guide's full name." preview="Guide cards, about section" />
        <FormField label="Title" name="title" value={form.title} onChange={updateForm} required help="Their role or specialty (e.g., 'Lead Fishing Guide')." preview="Guide cards" />
        <FormField label="Photo URL" name="photo_url" value={form.photo_url} onChange={updateForm} help="URL to the guide's headshot or action photo." preview="Guide cards" />
        <FormField label="Bio" name="bio" type="textarea" value={form.bio} onChange={updateForm} help="A short biography about the guide's experience and background." preview="Guide detail section" />
        <FormField label="Years of Experience" name="years_experience" type="number" value={form.years_experience} onChange={updateForm} help="How many years of guiding experience." preview="Guide cards" />
        <FormField label="Display Order" name="display_order" type="number" value={form.display_order} onChange={updateForm} help="Controls sort order. Lower numbers appear first." preview="Order of cards" />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} help="Turn off to hide from the public site without deleting." />
      </AdminFormModal>

      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName={deleteItem?.name || 'this guide'} />
    </div>
  )
}
