'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'
import EmptyState from '@/components/admin/EmptyState'

interface Location {
  id: string
  created_at: string
  updated_at: string
  name: string
  slug: string
  tagline: string
  description: string
  drive_time: string
  hero_image_url: string
  display_order: number
  is_active: boolean
}

const emptyLocation: Omit<Location, 'id' | 'created_at' | 'updated_at'> = {
  name: '', slug: '', tagline: '', description: '', drive_time: '', hero_image_url: '', display_order: 0, is_active: true,
}

export default function LocationsPage() {
  const [data, setData] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Location | null>(null)
  const [form, setForm] = useState(emptyLocation)
  const [saving, setSaving] = useState(false)
  const [deleteItem, setDeleteItem] = useState<Location | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: rows } = await supabase.from('locations').select('*').order('display_order')
    setData(rows || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => { setEditing(null); setForm(emptyLocation); setModalOpen(true) }
  const openEdit = (item: Location) => {
    setEditing(item)
    setForm({ name: item.name, slug: item.slug, tagline: item.tagline, description: item.description, drive_time: item.drive_time, hero_image_url: item.hero_image_url, display_order: item.display_order, is_active: item.is_active })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('locations').update(form).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Location updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('locations').insert(form)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Location created!', type: 'success' })
    }
    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    const { error } = await supabase.from('locations').delete().eq('id', deleteItem.id)
    if (error) setToast({ message: error.message, type: 'error' })
    else setToast({ message: 'Location deleted.', type: 'success' })
    setDeleteItem(null)
    fetchData()
  }

  const toggleActive = async (item: Location) => {
    await supabase.from('locations').update({ is_active: !item.is_active }).eq('id', item.id)
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

  const columns: Column<Location>[] = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'drive_time', label: 'Drive Time' },
    { key: 'is_active', label: 'Active', render: (item) => item.is_active ? '✓' : '—' },
    { key: 'display_order', label: 'Order' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Locations</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
          Add Location
        </button>
      </div>

      {!loading && data.length === 0 && <EmptyState entity="locations" onAdd={openAdd} addLabel="Add Location" />}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : (
          <AdminTable columns={columns} data={data} onEdit={openEdit} onDelete={setDeleteItem} onToggleActive={toggleActive} />
        )}
      </div>

      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit Location' : 'Add Location'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Name" name="name" value={form.name} onChange={updateForm} required help="The location name (e.g., 'Glenwood Springs')." preview="Location cards, page title" />
        <FormField label="Slug" name="slug" value={form.slug} onChange={updateForm} required help="URL-friendly identifier. Auto-generated from name." preview="URL path: /locations/[slug]" />
        <FormField label="Tagline" name="tagline" value={form.tagline} onChange={updateForm} help="A short tagline for this location." preview="Location cards" />
        <FormField label="Description" name="description" type="textarea" value={form.description} onChange={updateForm} help="Detailed description of what this location offers." preview="Location detail page" />
        <FormField label="Drive Time" name="drive_time" value={form.drive_time} onChange={updateForm} placeholder="e.g. 2.5 hours from Denver" help="How long to drive from a major city." preview="Location cards" />
        <FormField label="Hero Image URL" name="hero_image_url" value={form.hero_image_url} onChange={updateForm} help="The main hero image for this location." preview="Location detail page hero" />
        <FormField label="Display Order" name="display_order" type="number" value={form.display_order} onChange={updateForm} help="Controls sort order. Lower numbers appear first." preview="Order of cards" />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} help="Turn off to hide from the public site without deleting." />
      </AdminFormModal>

      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName={deleteItem?.name || 'this location'} />
    </div>
  )
}
