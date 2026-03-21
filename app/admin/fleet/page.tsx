'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import type { FleetVehicle } from '@/lib/types'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'

const emptyVehicle: Omit<FleetVehicle, 'id' | 'created_at' | 'updated_at'> = {
  name: '', type: '', capacity: 0, description: '', image_url: '', is_active: true,
}

export default function FleetPage() {
  const [data, setData] = useState<FleetVehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<FleetVehicle | null>(null)
  const [form, setForm] = useState(emptyVehicle)
  const [saving, setSaving] = useState(false)
  const [deleteItem, setDeleteItem] = useState<FleetVehicle | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: rows } = await supabase.from('fleet_vehicles').select('*').order('name')
    setData(rows || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => { setEditing(null); setForm(emptyVehicle); setModalOpen(true) }
  const openEdit = (item: FleetVehicle) => {
    setEditing(item)
    setForm({ name: item.name, type: item.type, capacity: item.capacity, description: item.description, image_url: item.image_url, is_active: item.is_active })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('fleet_vehicles').update(form).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Vehicle updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('fleet_vehicles').insert(form)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Vehicle added!', type: 'success' })
    }
    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    await supabase.from('fleet_vehicles').delete().eq('id', deleteItem.id)
    setDeleteItem(null)
    setToast({ message: 'Vehicle deleted.', type: 'success' })
    fetchData()
  }

  const toggleActive = async (item: FleetVehicle) => {
    await supabase.from('fleet_vehicles').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchData()
  }

  const updateForm = (name: string, value: string | number | boolean) => setForm((prev) => ({ ...prev, [name]: value }))

  const columns: Column<FleetVehicle>[] = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Fleet Vehicles</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">Add Vehicle</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : (
          <AdminTable columns={columns} data={data} onEdit={openEdit} onDelete={setDeleteItem} onToggleActive={toggleActive} />
        )}
      </div>
      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit Vehicle' : 'Add Vehicle'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Name" name="name" value={form.name} onChange={updateForm} required />
        <FormField label="Type" name="type" value={form.type} onChange={updateForm} placeholder="e.g. SUV, Van" />
        <FormField label="Capacity" name="capacity" type="number" value={form.capacity} onChange={updateForm} />
        <FormField label="Description" name="description" type="textarea" value={form.description} onChange={updateForm} />
        <FormField label="Image URL" name="image_url" value={form.image_url} onChange={updateForm} />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} />
      </AdminFormModal>
      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName={deleteItem?.name || 'this vehicle'} />
    </div>
  )
}
