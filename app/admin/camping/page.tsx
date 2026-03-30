'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'
import EmptyState from '@/components/admin/EmptyState'

interface CampingPackage {
  id: string
  created_at: string
  updated_at: string
  name: string
  description: string
  price_from: number
  price_note: string
  duration: string
  capacity: string
  image_url: string
  display_order: number
  is_active: boolean
}

const emptyCampingPackage: Omit<CampingPackage, 'id' | 'created_at' | 'updated_at'> = {
  name: '', description: '', price_from: 0, price_note: '', duration: '', capacity: '', image_url: '', display_order: 0, is_active: true,
}

export default function CampingPage() {
  const [data, setData] = useState<CampingPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CampingPackage | null>(null)
  const [form, setForm] = useState(emptyCampingPackage)
  const [saving, setSaving] = useState(false)
  const [deleteItem, setDeleteItem] = useState<CampingPackage | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: rows } = await supabase.from('camping_packages').select('*').order('display_order')
    setData(rows || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => { setEditing(null); setForm(emptyCampingPackage); setModalOpen(true) }
  const openEdit = (item: CampingPackage) => {
    setEditing(item)
    setForm({ name: item.name, description: item.description, price_from: item.price_from, price_note: item.price_note, duration: item.duration, capacity: item.capacity, image_url: item.image_url, display_order: item.display_order, is_active: item.is_active })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('camping_packages').update(form).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Camping package updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('camping_packages').insert(form)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Camping package created!', type: 'success' })
    }
    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    const { error } = await supabase.from('camping_packages').delete().eq('id', deleteItem.id)
    if (error) setToast({ message: error.message, type: 'error' })
    else setToast({ message: 'Camping package deleted.', type: 'success' })
    setDeleteItem(null)
    fetchData()
  }

  const toggleActive = async (item: CampingPackage) => {
    await supabase.from('camping_packages').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchData()
  }

  const updateForm = (name: string, value: string | number | boolean) => setForm((prev) => ({ ...prev, [name]: value }))

  const columns: Column<CampingPackage>[] = [
    { key: 'name', label: 'Name' },
    { key: 'price_from', label: 'Price From', render: (item) => item.price_from > 0 ? `$${item.price_from}` : '—' },
    { key: 'duration', label: 'Duration' },
    { key: 'is_active', label: 'Active', render: (item) => item.is_active ? '✓' : '—' },
    { key: 'display_order', label: 'Order' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Camping Packages</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
          Add Camping Package
        </button>
      </div>

      {!loading && data.length === 0 && <EmptyState entity="camping packages" onAdd={openAdd} addLabel="Add Camping Package" />}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : (
          <AdminTable columns={columns} data={data} onEdit={openEdit} onDelete={setDeleteItem} onToggleActive={toggleActive} />
        )}
      </div>

      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit Camping Package' : 'Add Camping Package'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Name" name="name" value={form.name} onChange={updateForm} required help="The package name (e.g., 'Riverside Camp & Fish')." preview="Package cards, detail page" />
        <FormField label="Description" name="description" type="textarea" value={form.description} onChange={updateForm} help="Describe what's included in this camping package." preview="Package detail page" />
        <FormField label="Price From" name="price_from" type="number" value={form.price_from} onChange={updateForm} help="Starting price in dollars." preview="Package cards" />
        <FormField label="Price Note" name="price_note" value={form.price_note} onChange={updateForm} placeholder="e.g. per person" help="Additional pricing context (e.g., 'per person', 'per night')." preview="Below price on cards" />
        <FormField label="Duration" name="duration" value={form.duration} onChange={updateForm} placeholder="e.g. 2 nights" help="How long is this camping package?" preview="Package cards" />
        <FormField label="Capacity" name="capacity" value={form.capacity} onChange={updateForm} placeholder="e.g. Up to 6 guests" help="Maximum number of guests." preview="Package detail page" />
        <FormField label="Image URL" name="image_url" value={form.image_url} onChange={updateForm} help="The main photo for this camping package." preview="Card thumbnail + detail page hero" />
        <FormField label="Display Order" name="display_order" type="number" value={form.display_order} onChange={updateForm} help="Controls sort order. Lower numbers appear first." preview="Order of cards" />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} help="Turn off to hide from the public site without deleting." />
      </AdminFormModal>

      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName={deleteItem?.name || 'this camping package'} />
    </div>
  )
}
