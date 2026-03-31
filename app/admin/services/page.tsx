'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import type { Service } from '@/lib/types'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'
import EmptyState from '@/components/admin/EmptyState'

const emptyService: Omit<Service, 'id' | 'created_at' | 'updated_at'> & { features_text: string } = {
  name: '', slug: '', description: '', features: [], features_text: '', icon: '', price_from: 0, image_url: '', display_order: 0, is_active: true,
}

type ServiceForm = typeof emptyService

export default function ServicesPage() {
  const [data, setData] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState<ServiceForm>(emptyService)
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
    const featuresArray = Array.isArray(item.features) ? item.features : []
    setForm({
      name: item.name,
      slug: item.slug || '',
      description: item.description,
      features: featuresArray,
      features_text: featuresArray.join(', '),
      icon: item.icon || '',
      price_from: item.price_from,
      image_url: item.image_url,
      display_order: item.display_order,
      is_active: item.is_active,
    })
    setModalOpen(true)
  }

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const featuresArray = form.features_text
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean)
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      features: featuresArray,
      icon: form.icon,
      price_from: form.price_from,
      image_url: form.image_url,
      display_order: form.display_order,
      is_active: form.is_active,
    }
    if (editing) {
      const { error } = await supabase.from('services').update(payload).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Service updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('services').insert(payload)
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

  const updateForm = (name: string, value: string | number | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [name]: value }
      if (name === 'name' && typeof value === 'string' && !editing) {
        updated.slug = autoSlug(value)
      }
      return updated
    })
  }

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
      {!loading && data.length === 0 && <EmptyState entity="services" onAdd={openAdd} addLabel="Add Service" />}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : (
          <AdminTable columns={columns} data={data} onEdit={openEdit} onDelete={setDeleteItem} onToggleActive={toggleActive} />
        )}
      </div>
      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit Service' : 'Add Service'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Name" name="name" value={form.name} onChange={updateForm} required help="Service package name (e.g., 'Airport Transfers')." preview="Service cards on Alpenglow site" />
        <FormField label="Slug" name="slug" value={form.slug} onChange={updateForm} required help="URL-friendly name, auto-generated from name." preview="URL path: /services/[slug]" />
        <FormField label="Description" name="description" type="textarea" value={form.description} onChange={updateForm} help="What's included — vehicle type, route, amenities, capacity." preview="Service detail section" />
        <FormField label="Features" name="features_text" type="textarea" value={form.features_text} onChange={updateForm} help="Comma-separated list of features (e.g., 'Flight tracking, Complimentary wait time')." preview="Feature bullets on service cards" />
        <FormField label="Icon" name="icon" value={form.icon} onChange={updateForm} help="Icon name (e.g., 'Plane', 'Clock', 'Briefcase', 'Heart')." preview="Service card icon" />
        <FormField label="Price From" name="price_from" type="number" value={form.price_from} onChange={updateForm} help="Starting price. Displayed as 'From $X' on the public site." preview="Service cards" />
        <FormField label="Image URL" name="image_url" value={form.image_url} onChange={updateForm} help="Main photo for this service package." preview="Service card image" />
        <FormField label="Display Order" name="display_order" type="number" value={form.display_order} onChange={updateForm} help="Sort position. Lower numbers appear first." preview="Order of service cards" />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} help="Toggle visibility on the Alpenglow site." />
      </AdminFormModal>
      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName={deleteItem?.name || 'this service'} />
    </div>
  )
}
