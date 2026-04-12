'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import type { Adventure } from '@/lib/types'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'
import EmptyState from '@/components/admin/EmptyState'

const emptyAdventure: Omit<Adventure, 'id' | 'created_at' | 'updated_at'> = {
  name: '', description: '', long_description: '', whats_included: [] as unknown as string[], highlights: [] as unknown as string[], best_for: '', group_size: '', duration: '', price: 0, difficulty: 'moderate',
  image_url: '', display_order: 0, is_active: true, season: 'summer',
}

// Form state uses comma-separated strings for JSONB array fields
interface FormState {
  name: string
  description: string
  long_description: string
  whats_included: string
  highlights: string
  best_for: string
  group_size: string
  duration: string
  price: number
  difficulty: string
  image_url: string
  display_order: number
  is_active: boolean
  season: string
}

const emptyForm: FormState = {
  name: '', description: '', long_description: '', whats_included: '', highlights: '', best_for: '', group_size: '', duration: '', price: 0, difficulty: 'moderate',
  image_url: '', display_order: 0, is_active: true, season: 'summer',
}

function jsonArrayToCommaString(arr: unknown): string {
  if (Array.isArray(arr)) return arr.join(', ')
  if (typeof arr === 'string') {
    try {
      const parsed = JSON.parse(arr)
      if (Array.isArray(parsed)) return parsed.join(', ')
    } catch { /* ignore */ }
  }
  return ''
}

function commaStringToJsonArray(str: string): string[] {
  if (!str.trim()) return []
  return str.split(',').map((s) => s.trim()).filter(Boolean)
}

export default function AdventuresPage() {
  const [data, setData] = useState<Adventure[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Adventure | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteItem, setDeleteItem] = useState<Adventure | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: rows } = await supabase.from('adventures').select('*').order('display_order')
    setData(rows || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (item: Adventure) => {
    setEditing(item)
    setForm({
      name: item.name,
      description: item.description,
      long_description: item.long_description || '',
      whats_included: jsonArrayToCommaString(item.whats_included),
      highlights: jsonArrayToCommaString(item.highlights),
      best_for: item.best_for || '',
      group_size: item.group_size || '',
      duration: item.duration,
      price: item.price,
      difficulty: item.difficulty,
      image_url: item.image_url,
      display_order: item.display_order,
      is_active: item.is_active,
      season: item.season,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      name: form.name,
      description: form.description,
      long_description: form.long_description,
      whats_included: commaStringToJsonArray(form.whats_included),
      highlights: commaStringToJsonArray(form.highlights),
      best_for: form.best_for,
      group_size: form.group_size,
      duration: form.duration,
      price: form.price,
      difficulty: form.difficulty,
      image_url: form.image_url,
      display_order: form.display_order,
      is_active: form.is_active,
      season: form.season,
    }
    if (editing) {
      const { error } = await supabase.from('adventures').update(payload).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Adventure updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('adventures').insert(payload)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Adventure created!', type: 'success' })
    }
    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    const { error } = await supabase.from('adventures').delete().eq('id', deleteItem.id)
    if (error) setToast({ message: error.message, type: 'error' })
    else setToast({ message: 'Adventure deleted.', type: 'success' })
    setDeleteItem(null)
    fetchData()
  }

  const toggleActive = async (item: Adventure) => {
    await supabase.from('adventures').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchData()
  }

  const updateForm = (name: string, value: string | number | boolean) => setForm((prev) => ({ ...prev, [name]: value }))

  const columns: Column<Adventure>[] = [
    { key: 'name', label: 'Name' },
    { key: 'duration', label: 'Duration' },
    { key: 'price', label: 'Price', render: (item) => item.price > 0 ? `$${item.price}` : 'Contact for pricing' },
    { key: 'difficulty', label: 'Difficulty' },
    { key: 'display_order', label: 'Order' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Adventures</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
          Add Adventure
        </button>
      </div>

      {!loading && data.length === 0 && <EmptyState entity="adventures" onAdd={openAdd} addLabel="Add Adventure" />}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : (
          <AdminTable columns={columns} data={data} onEdit={openEdit} onDelete={setDeleteItem} onToggleActive={toggleActive} />
        )}
      </div>

      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit Adventure' : 'Add Adventure'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Name" name="name" value={form.name} onChange={updateForm} required help="The adventure title your customers will see (e.g., 'Fly Fishing')." preview="Adventure cards, detail page title" />
        <FormField label="Description" name="description" type="textarea" value={form.description} onChange={updateForm} help="Short description for adventure cards and SEO." preview="Adventure cards" />
        <FormField label="Detailed Description" name="long_description" type="textarea" value={form.long_description} onChange={updateForm} help="Detailed description for the adventure detail page. If empty, the short description is used." preview="Adventure detail page" />
        <FormField label="Duration" name="duration" value={form.duration} onChange={updateForm} placeholder="e.g. Half Day" help="How long does this adventure take? Examples: 'Half Day', 'Full Day', '2-3 Hours'." preview="Duration badge on cards" />
        <FormField label="Price" name="price" type="number" value={form.price} onChange={updateForm} help="Starting price in dollars. Use 0 if pricing varies." preview="Adventure cards" />
        <FormField label="Difficulty" name="difficulty" type="select" value={form.difficulty} onChange={updateForm} options={[
          { value: 'easy', label: 'Easy' }, { value: 'moderate', label: 'Moderate' },
          { value: 'challenging', label: 'Challenging' }, { value: 'expert', label: 'Expert' },
        ]} help="Skill level required. Helps customers decide if this adventure is right for them." preview="Adventure cards" />
        <FormField label="Image URL" name="image_url" value={form.image_url} onChange={updateForm} uploadFolder="adventures" help="Upload or paste a URL for the adventure hero and cards." preview="Card thumbnail + detail page hero" />
        <FormField label="What's Included" name="whats_included" type="textarea" value={form.whats_included} onChange={updateForm} help="Comma-separated list of included items (e.g., 'Expert guide, All equipment, Snacks and water')." preview="Adventure detail page" />
        <FormField label="Highlights" name="highlights" type="textarea" value={form.highlights} onChange={updateForm} help="Comma-separated list of highlights (e.g., 'Gold Medal trout waters, Private access, Photography')." preview="Adventure detail page" />
        <FormField label="Best For" name="best_for" value={form.best_for} onChange={updateForm} help="Who is this best for? (e.g., 'Serious anglers and beginners alike')." preview="Adventure detail page" />
        <FormField label="Group Size" name="group_size" value={form.group_size} onChange={updateForm} placeholder="e.g. 2-6 guests" help="Typical group size for this adventure." preview="Adventure detail page sidebar" />
        <FormField label="Display Order" name="display_order" type="number" value={form.display_order} onChange={updateForm} help="Controls sort order. Lower numbers appear first." preview="Order of cards" />
        <FormField label="Season" name="season" type="select" value={form.season} onChange={updateForm} options={[
          { value: 'summer', label: 'Summer' }, { value: 'winter', label: 'Winter' }, { value: 'year-round', label: 'Year-Round' },
        ]} help="When is this adventure available? Controls which filter tab it appears under." preview="Filter tabs on /adventures" />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} help="Turn off to hide from the public site without deleting it." />
      </AdminFormModal>

      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName={deleteItem?.name || 'this adventure'} />
    </div>
  )
}
