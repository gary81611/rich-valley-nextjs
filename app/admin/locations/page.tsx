'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'
import EmptyState from '@/components/admin/EmptyState'

interface FAQ {
  q: string
  a: string
}

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
  faqs: FAQ[]
  rivers: string[]
  activities: string[]
  highlights: string[]
}

type LocationForm = Omit<Location, 'id' | 'created_at' | 'updated_at'>

const emptyLocation: LocationForm = {
  name: '', slug: '', tagline: '', description: '', drive_time: '', hero_image_url: '', display_order: 0, is_active: true,
  faqs: [],
  rivers: [],
  activities: [],
  highlights: [],
}

export default function LocationsPage() {
  const [data, setData] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Location | null>(null)
  const [form, setForm] = useState<LocationForm>(emptyLocation)
  const [saving, setSaving] = useState(false)
  const [deleteItem, setDeleteItem] = useState<Location | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Comma-separated string helpers for rivers/activities/highlights
  const [riversText, setRiversText] = useState('')
  const [activitiesText, setActivitiesText] = useState('')
  const [highlightsText, setHighlightsText] = useState('')

  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: rows } = await supabase.from('locations').select('*').order('display_order')
    setData(rows || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const arrayToComma = (arr: string[] | null) => (arr || []).join(', ')
  const commaToArray = (text: string) => text.split(',').map(s => s.trim()).filter(Boolean)

  const openAdd = () => {
    setEditing(null)
    setForm(emptyLocation)
    setRiversText('')
    setActivitiesText('')
    setHighlightsText('')
    setModalOpen(true)
  }

  const openEdit = (item: Location) => {
    setEditing(item)
    setForm({
      name: item.name,
      slug: item.slug,
      tagline: item.tagline,
      description: item.description,
      drive_time: item.drive_time,
      hero_image_url: item.hero_image_url,
      display_order: item.display_order,
      is_active: item.is_active,
      faqs: item.faqs || [],
      rivers: item.rivers || [],
      activities: item.activities || [],
      highlights: item.highlights || [],
    })
    setRiversText(arrayToComma(item.rivers))
    setActivitiesText(arrayToComma(item.activities))
    setHighlightsText(arrayToComma(item.highlights))
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      rivers: commaToArray(riversText),
      activities: commaToArray(activitiesText),
      highlights: commaToArray(highlightsText),
    }
    if (editing) {
      const { error } = await supabase.from('locations').update(payload).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Location updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('locations').insert(payload)
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

  // FAQ helpers
  const addFaq = () => {
    setForm(prev => ({ ...prev, faqs: [...prev.faqs, { q: '', a: '' }] }))
  }
  const removeFaq = (index: number) => {
    setForm(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }))
  }
  const updateFaq = (index: number, field: 'q' | 'a', value: string) => {
    setForm(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => i === index ? { ...faq, [field]: value } : faq),
    }))
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
        <FormField label="Hero Image URL" name="hero_image_url" value={form.hero_image_url} onChange={updateForm} uploadFolder="locations" help="Upload or paste a URL for the location hero image." preview="Location detail page hero" />
        <FormField label="Display Order" name="display_order" type="number" value={form.display_order} onChange={updateForm} help="Controls sort order. Lower numbers appear first." preview="Order of cards" />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} help="Turn off to hide from the public site without deleting." />

        {/* Comma-separated array fields */}
        <div className="mt-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Rivers</label>
          <p className="text-xs text-slate-500 mb-1">Comma-separated list of rivers/waterways.</p>
          <input
            type="text"
            value={riversText}
            onChange={(e) => setRiversText(e.target.value)}
            placeholder="e.g. Roaring Fork River, Crystal River, Frying Pan River"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        <div className="mt-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Activities</label>
          <p className="text-xs text-slate-500 mb-1">Comma-separated list of available activities.</p>
          <input
            type="text"
            value={activitiesText}
            onChange={(e) => setActivitiesText(e.target.value)}
            placeholder="e.g. Fly Fishing, Guided Hiking, Snowshoeing"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        <div className="mt-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Highlights</label>
          <p className="text-xs text-slate-500 mb-1">Comma-separated list of location highlights.</p>
          <input
            type="text"
            value={highlightsText}
            onChange={(e) => setHighlightsText(e.target.value)}
            placeholder="e.g. Gold medal trout water, Scenic views, Historic landmarks"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        {/* FAQs */}
        <div className="mt-4 border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">FAQs</label>
              <p className="text-xs text-slate-500">Question and answer pairs shown on the location page.</p>
            </div>
            <button type="button" onClick={addFaq} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors">
              + Add FAQ
            </button>
          </div>
          {form.faqs.length === 0 && (
            <p className="text-xs text-slate-400 italic">No FAQs yet. Click &quot;Add FAQ&quot; to add one.</p>
          )}
          <div className="space-y-3">
            {form.faqs.map((faq, index) => (
              <div key={index} className="bg-slate-50 p-3 rounded-lg border border-slate-200 relative">
                <button
                  type="button"
                  onClick={() => removeFaq(index)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-500 text-xs font-bold"
                  title="Remove FAQ"
                >
                  ✕
                </button>
                <label className="block text-xs font-medium text-slate-600 mb-1">Question</label>
                <input
                  type="text"
                  value={faq.q}
                  onChange={(e) => updateFaq(index, 'q', e.target.value)}
                  placeholder="Enter question..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
                <label className="block text-xs font-medium text-slate-600 mb-1">Answer</label>
                <textarea
                  value={faq.a}
                  onChange={(e) => updateFaq(index, 'a', e.target.value)}
                  placeholder="Enter answer..."
                  rows={2}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
            ))}
          </div>
        </div>
      </AdminFormModal>

      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName={deleteItem?.name || 'this location'} />
    </div>
  )
}
