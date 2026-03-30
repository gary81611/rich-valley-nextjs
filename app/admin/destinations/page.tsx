'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'
import EmptyState from '@/components/admin/EmptyState'

interface Destination {
  id: string
  created_at: string
  updated_at: string
  name: string
  slug: string
  description: string
  image_url: string
  display_order: number
  is_active: boolean
}

const emptyDestination: Omit<Destination, 'id' | 'created_at' | 'updated_at'> = {
  name: '', slug: '', description: '', image_url: '', display_order: 0, is_active: true,
}

export default function DestinationsPage() {
  const [data, setData] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Destination | null>(null)
  const [form, setForm] = useState(emptyDestination)
  const [saving, setSaving] = useState(false)
  const [deleteItem, setDeleteItem] = useState<Destination | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: rows } = await supabase.from('destinations').select('*').order('display_order')
    setData(rows || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => { setEditing(null); setForm(emptyDestination); setModalOpen(true) }
  const openEdit = (item: Destination) => {
    setEditing(item)
    setForm({ name: item.name, slug: item.slug, description: item.description, image_url: item.image_url, display_order: item.display_order, is_active: item.is_active })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('destinations').update(form).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Destination updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('destinations').insert(form)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Destination created!', type: 'success' })
    }
    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    const { error } = await supabase.from('destinations').delete().eq('id', deleteItem.id)
    if (error) setToast({ message: error.message, type: 'error' })
    else setToast({ message: 'Destination deleted.', type: 'success' })
    setDeleteItem(null)
    fetchData()
  }

  const toggleActive = async (item: Destination) => {
    await supabase.from('destinations').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchData()
  }

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const updateForm = (name: string, value: string | number | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [name]: value }
      if (name === 'name' && typeof value === 'string' && !editing) {
        updated.slug = autoSlug(value)
      }
      return updated
    })
  }

  const columns: Column<Destination>[] = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'is_active', label: 'Active', render: (item) => item.is_active ? '✓' : '—' },
    { key: 'display_order', label: 'Order' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Destinations</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
          Add Destination
        </button>
      </div>

      {!loading && data.length === 0 && <EmptyState entity="destinations" onAdd={openAdd} addLabel="Add Destination" />}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : (
          <AdminTable columns={columns} data={data} onEdit={openEdit} onDelete={setDeleteItem} onToggleActive={toggleActive} />
        )}
      </div>

      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit Destination' : 'Add Destination'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Name" name="name" value={form.name} onChange={updateForm} required help="The destination name (e.g., 'Aspen')." preview="Destination cards, page title" />
        <FormField label="Slug" name="slug" value={form.slug} onChange={updateForm} required help="URL-friendly identifier. Auto-generated from name." preview="URL path: /destinations/[slug]" />
        <FormField label="Description" name="description" type="textarea" value={form.description} onChange={updateForm} help="Detailed description of this destination." preview="Destination detail page" />
        <FormField label="Image URL" name="image_url" value={form.image_url} onChange={updateForm} help="The main image for this destination." preview="Card thumbnail + detail page hero" />
        <FormField label="Display Order" name="display_order" type="number" value={form.display_order} onChange={updateForm} help="Controls sort order. Lower numbers appear first." preview="Order of cards" />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} help="Turn off to hide from the public site without deleting." />
      </AdminFormModal>

      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName={deleteItem?.name || 'this destination'} />
    </div>
  )
}
