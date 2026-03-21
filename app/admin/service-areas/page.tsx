'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import type { ServiceArea } from '@/lib/types'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'
import EmptyState from '@/components/admin/EmptyState'

const emptyArea: Omit<ServiceArea, 'id' | 'created_at' | 'updated_at'> = {
  name: '', description: '', site_key: 'alpenglow', is_active: true,
}

export default function ServiceAreasPage() {
  const [data, setData] = useState<ServiceArea[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ServiceArea | null>(null)
  const [form, setForm] = useState(emptyArea)
  const [saving, setSaving] = useState(false)
  const [deleteItem, setDeleteItem] = useState<ServiceArea | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: rows } = await supabase.from('service_areas').select('*').order('name')
    setData(rows || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => { setEditing(null); setForm(emptyArea); setModalOpen(true) }
  const openEdit = (item: ServiceArea) => {
    setEditing(item)
    setForm({ name: item.name, description: item.description, site_key: item.site_key, is_active: item.is_active })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('service_areas').update(form).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Service area updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('service_areas').insert(form)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Service area created!', type: 'success' })
    }
    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    await supabase.from('service_areas').delete().eq('id', deleteItem.id)
    setDeleteItem(null)
    setToast({ message: 'Service area deleted.', type: 'success' })
    fetchData()
  }

  const toggleActive = async (item: ServiceArea) => {
    await supabase.from('service_areas').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchData()
  }

  const updateForm = (name: string, value: string | number | boolean) => setForm((prev) => ({ ...prev, [name]: value }))

  const columns: Column<ServiceArea>[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'site_key', label: 'Site', render: (item) => item.site_key === 'rva' ? 'RVA' : 'Alpenglow' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Service Areas</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">Add Service Area</button>
      </div>
      {!loading && data.length === 0 && <EmptyState entity="service areas" />}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : (
          <AdminTable columns={columns} data={data} onEdit={openEdit} onDelete={setDeleteItem} onToggleActive={toggleActive} />
        )}
      </div>
      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit Service Area' : 'Add Service Area'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Name" name="name" value={form.name} onChange={updateForm} required />
        <FormField label="Description" name="description" type="textarea" value={form.description} onChange={updateForm} />
        <FormField label="Site" name="site_key" type="select" value={form.site_key} onChange={updateForm} options={[{ value: 'rva', label: 'RVA' }, { value: 'alpenglow', label: 'Alpenglow' }]} />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} />
      </AdminFormModal>
      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName={deleteItem?.name || 'this service area'} />
    </div>
  )
}
