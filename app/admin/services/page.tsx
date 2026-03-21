'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import type { Service } from '@/lib/types'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'

const emptyService: Omit<Service, 'id' | 'created_at' | 'updated_at'> = {
  name: '', description: '', price_from: 0, image_url: '', display_order: 0, is_active: true,
}

export default function ServicesPage() {
  const [data, setData] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState(emptyService)
  const [saving, setSaving] = useState(false)
  const [deleteItem, setDeleteItem] = useState<Service | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: rows } = await supabase.from('services').select('*').order('display_order')
    setData(rows || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => { setEditing(null); setForm(emptyService); setModalOpen(true) }
  const openEdit = (item: Service) => {
    setEditing(item)
    setForm({ name: item.name, description: item.description, price_from: item.price_from, image_url: item.image_url, display_order: item.display_order, is_active: item.is_active })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('services').update(form).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Service updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('services').insert(form)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Service created!', type: 'success' })
    }
    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    await supabase.from('services').delete().eq('id', deleteItem.id)
    setDeleteItem(null)
    setToast({ message: 'Service deleted.', type: 'success' })
    fetchData()
  }

  const toggleActive = async (item: Service) => {
    await supabase.from('services').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchData()
  }

  const updateForm = (name: string, value: string | number | boolean) => setForm((prev) => ({ ...prev, [name]: value }))

  const columns: Column<Service>[] = [
    { key: 'name', label: 'Name' },
    { key: 'price_from', label: 'Price From', render: (item) => `$${item.price_from}` },
    { key: 'display_order', label: 'Order' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Services</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">Add Service</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : (
          <AdminTable columns={columns} data={data} onEdit={openEdit} onDelete={setDeleteItem} onToggleActive={toggleActive} />
        )}
      </div>
      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit Service' : 'Add Service'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Name" name="name" value={form.name} onChange={updateForm} required />
        <FormField label="Description" name="description" type="textarea" value={form.description} onChange={updateForm} />
        <FormField label="Price From" name="price_from" type="number" value={form.price_from} onChange={updateForm} />
        <FormField label="Image URL" name="image_url" value={form.image_url} onChange={updateForm} />
        <FormField label="Display Order" name="display_order" type="number" value={form.display_order} onChange={updateForm} />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} />
      </AdminFormModal>
      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName={deleteItem?.name || 'this service'} />
    </div>
  )
}
