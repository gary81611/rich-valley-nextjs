'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'
import EmptyState from '@/components/admin/EmptyState'

interface UsgsStation {
  id: string
  created_at: string
  updated_at: string
  station_id: string
  name: string
  low_threshold: number
  good_threshold: number
  high_threshold: number
  display_order: number
  is_active: boolean
}

const emptyStation: Omit<UsgsStation, 'id' | 'created_at' | 'updated_at'> = {
  station_id: '', name: '', low_threshold: 100, good_threshold: 400, high_threshold: 800, display_order: 0, is_active: true,
}

export default function ConditionsPage() {
  const [data, setData] = useState<UsgsStation[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<UsgsStation | null>(null)
  const [form, setForm] = useState(emptyStation)
  const [saving, setSaving] = useState(false)
  const [deleteItem, setDeleteItem] = useState<UsgsStation | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: rows } = await supabase.from('usgs_stations').select('*').order('display_order')
    setData(rows || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => { setEditing(null); setForm(emptyStation); setModalOpen(true) }
  const openEdit = (item: UsgsStation) => {
    setEditing(item)
    setForm({ station_id: item.station_id, name: item.name, low_threshold: item.low_threshold, good_threshold: item.good_threshold, high_threshold: item.high_threshold, display_order: item.display_order, is_active: item.is_active })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('usgs_stations').update(form).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Station updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('usgs_stations').insert(form)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Station created!', type: 'success' })
    }
    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    const { error } = await supabase.from('usgs_stations').delete().eq('id', deleteItem.id)
    if (error) setToast({ message: error.message, type: 'error' })
    else setToast({ message: 'Station deleted.', type: 'success' })
    setDeleteItem(null)
    fetchData()
  }

  const toggleActive = async (item: UsgsStation) => {
    await supabase.from('usgs_stations').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchData()
  }

  const updateForm = (name: string, value: string | number | boolean) => setForm((prev) => ({ ...prev, [name]: value }))

  const columns: Column<UsgsStation>[] = [
    { key: 'name', label: 'Name' },
    { key: 'station_id', label: 'Station ID' },
    { key: 'is_active', label: 'Active', render: (item) => item.is_active ? '✓' : '—' },
    { key: 'display_order', label: 'Order' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">River Conditions — USGS Stations</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
          Add Station
        </button>
      </div>

      {!loading && data.length === 0 && <EmptyState entity="USGS stations" onAdd={openAdd} addLabel="Add Station" />}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : (
          <AdminTable columns={columns} data={data} onEdit={openEdit} onDelete={setDeleteItem} onToggleActive={toggleActive} />
        )}
      </div>

      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit Station' : 'Add Station'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Station ID" name="station_id" value={form.station_id} onChange={updateForm} required placeholder="e.g. 09073300" help="The USGS station identifier. Find stations at waterdata.usgs.gov." preview="Used to fetch real-time flow data" />
        <FormField label="Name" name="name" value={form.name} onChange={updateForm} required help="A friendly name for this station (e.g., 'Roaring Fork at Glenwood Springs')." preview="Conditions page" />
        <FormField label="Low Threshold (cfs)" name="low_threshold" type="number" value={form.low_threshold} onChange={updateForm} help="Flow below this value is considered low. Default: 100 cfs." preview="Condition status indicator" />
        <FormField label="Good Threshold (cfs)" name="good_threshold" type="number" value={form.good_threshold} onChange={updateForm} help="Flow above this value is considered good. Default: 400 cfs." preview="Condition status indicator" />
        <FormField label="High Threshold (cfs)" name="high_threshold" type="number" value={form.high_threshold} onChange={updateForm} help="Flow above this value is considered high/dangerous. Default: 800 cfs." preview="Condition status indicator" />
        <FormField label="Display Order" name="display_order" type="number" value={form.display_order} onChange={updateForm} help="Controls sort order. Lower numbers appear first." preview="Order on conditions page" />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} help="Turn off to hide from the public site without deleting." />
      </AdminFormModal>

      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName={deleteItem?.name || 'this station'} />
    </div>
  )
}
