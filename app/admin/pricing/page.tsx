'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'
import EmptyState from '@/components/admin/EmptyState'

interface PricingRoute {
  id: string
  created_at: string
  updated_at: string
  route_name: string
  category: string
  origin: string
  destination: string
  distance: string
  drive_time: string
  suv_price: number
  price_note: string
  display_order: number
  is_active: boolean
}

const emptyPricingRoute: Omit<PricingRoute, 'id' | 'created_at' | 'updated_at'> = {
  route_name: '', category: '', origin: '', destination: '', distance: '', drive_time: '', suv_price: 0, price_note: '', display_order: 0, is_active: true,
}

export default function PricingPage() {
  const [data, setData] = useState<PricingRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<PricingRoute | null>(null)
  const [form, setForm] = useState(emptyPricingRoute)
  const [saving, setSaving] = useState(false)
  const [deleteItem, setDeleteItem] = useState<PricingRoute | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: rows } = await supabase.from('pricing_routes').select('*').order('display_order')
    setData(rows || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => { setEditing(null); setForm(emptyPricingRoute); setModalOpen(true) }
  const openEdit = (item: PricingRoute) => {
    setEditing(item)
    setForm({ route_name: item.route_name, category: item.category, origin: item.origin, destination: item.destination, distance: item.distance, drive_time: item.drive_time, suv_price: item.suv_price, price_note: item.price_note, display_order: item.display_order, is_active: item.is_active })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('pricing_routes').update(form).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Pricing route updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('pricing_routes').insert(form)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Pricing route created!', type: 'success' })
    }
    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    const { error } = await supabase.from('pricing_routes').delete().eq('id', deleteItem.id)
    if (error) setToast({ message: error.message, type: 'error' })
    else setToast({ message: 'Pricing route deleted.', type: 'success' })
    setDeleteItem(null)
    fetchData()
  }

  const toggleActive = async (item: PricingRoute) => {
    await supabase.from('pricing_routes').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchData()
  }

  const updateForm = (name: string, value: string | number | boolean) => setForm((prev) => ({ ...prev, [name]: value }))

  const columns: Column<PricingRoute>[] = [
    { key: 'route_name', label: 'Route Name' },
    { key: 'category', label: 'Category' },
    { key: 'suv_price', label: 'SUV Price', render: (item) => item.suv_price > 0 ? `$${item.suv_price}` : '—' },
    { key: 'is_active', label: 'Active', render: (item) => item.is_active ? '✓' : '—' },
    { key: 'display_order', label: 'Order' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Pricing Routes</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
          Add Pricing Route
        </button>
      </div>

      {!loading && data.length === 0 && <EmptyState entity="pricing routes" onAdd={openAdd} addLabel="Add Pricing Route" />}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : (
          <AdminTable columns={columns} data={data} onEdit={openEdit} onDelete={setDeleteItem} onToggleActive={toggleActive} />
        )}
      </div>

      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit Pricing Route' : 'Add Pricing Route'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Route Name" name="route_name" value={form.route_name} onChange={updateForm} required help="The route name (e.g., 'Denver to Vail')." preview="Pricing table" />
        <FormField label="Category" name="category" value={form.category} onChange={updateForm} placeholder="e.g. Airport Transfer" help="Route category for grouping." preview="Pricing table sections" />
        <FormField label="Origin" name="origin" value={form.origin} onChange={updateForm} placeholder="e.g. Denver International Airport" help="Starting point of the route." preview="Route details" />
        <FormField label="Destination" name="destination" value={form.destination} onChange={updateForm} placeholder="e.g. Vail" help="End point of the route." preview="Route details" />
        <FormField label="Distance" name="distance" value={form.distance} onChange={updateForm} placeholder="e.g. 97 miles" help="Distance of the route." preview="Route details" />
        <FormField label="Drive Time" name="drive_time" value={form.drive_time} onChange={updateForm} placeholder="e.g. 1h 45m" help="Estimated drive time." preview="Route details" />
        <FormField label="SUV Price" name="suv_price" type="number" value={form.suv_price} onChange={updateForm} help="Price in dollars for SUV transport." preview="Pricing table" />
        <FormField label="Price Note" name="price_note" value={form.price_note} onChange={updateForm} placeholder="e.g. each way" help="Additional pricing context." preview="Below price in table" />
        <FormField label="Display Order" name="display_order" type="number" value={form.display_order} onChange={updateForm} help="Controls sort order. Lower numbers appear first." preview="Order in table" />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} help="Turn off to hide from the public site without deleting." />
      </AdminFormModal>

      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName={deleteItem?.route_name || 'this pricing route'} />
    </div>
  )
}
