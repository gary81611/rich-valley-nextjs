'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'
import EmptyState from '@/components/admin/EmptyState'

interface WinterAdventure {
  id: string
  created_at: string
  updated_at: string
  title: string
  description: string
  duration: string
  difficulty: string
  season_start: string
  season_end: string
  image_url: string
  price_from: number
  display_order: number
  is_active: boolean
}

const emptyWinterAdventure: Omit<WinterAdventure, 'id' | 'created_at' | 'updated_at'> = {
  title: '', description: '', duration: '', difficulty: '', season_start: '', season_end: '', image_url: '', price_from: 0, display_order: 0, is_active: true,
}

export default function WinterAdventuresPage() {
  const [data, setData] = useState<WinterAdventure[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<WinterAdventure | null>(null)
  const [form, setForm] = useState(emptyWinterAdventure)
  const [saving, setSaving] = useState(false)
  const [deleteItem, setDeleteItem] = useState<WinterAdventure | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: rows } = await supabase.from('winter_adventures').select('*').order('display_order')
    setData(rows || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => { setEditing(null); setForm(emptyWinterAdventure); setModalOpen(true) }
  const openEdit = (item: WinterAdventure) => {
    setEditing(item)
    setForm({ title: item.title, description: item.description, duration: item.duration, difficulty: item.difficulty, season_start: item.season_start, season_end: item.season_end, image_url: item.image_url, price_from: item.price_from, display_order: item.display_order, is_active: item.is_active })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('winter_adventures').update(form).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Winter adventure updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('winter_adventures').insert(form)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Winter adventure created!', type: 'success' })
    }
    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    const { error } = await supabase.from('winter_adventures').delete().eq('id', deleteItem.id)
    if (error) setToast({ message: error.message, type: 'error' })
    else setToast({ message: 'Winter adventure deleted.', type: 'success' })
    setDeleteItem(null)
    fetchData()
  }

  const toggleActive = async (item: WinterAdventure) => {
    await supabase.from('winter_adventures').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchData()
  }

  const updateForm = (name: string, value: string | number | boolean) => setForm((prev) => ({ ...prev, [name]: value }))

  const columns: Column<WinterAdventure>[] = [
    { key: 'title', label: 'Title' },
    { key: 'duration', label: 'Duration' },
    { key: 'difficulty', label: 'Difficulty' },
    { key: 'is_active', label: 'Active', render: (item) => item.is_active ? '✓' : '—' },
    { key: 'display_order', label: 'Order' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Winter Adventures</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
          Add Winter Adventure
        </button>
      </div>

      {!loading && data.length === 0 && <EmptyState entity="winter adventures" onAdd={openAdd} addLabel="Add Winter Adventure" />}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : (
          <AdminTable columns={columns} data={data} onEdit={openEdit} onDelete={setDeleteItem} onToggleActive={toggleActive} />
        )}
      </div>

      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit Winter Adventure' : 'Add Winter Adventure'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Title" name="title" value={form.title} onChange={updateForm} required help="The winter adventure name (e.g., 'Snowmobile Tours')." preview="Adventure cards, detail page" />
        <FormField label="Description" name="description" type="textarea" value={form.description} onChange={updateForm} help="Describe what this winter experience includes." preview="Adventure detail page" />
        <FormField label="Duration" name="duration" value={form.duration} onChange={updateForm} placeholder="e.g. Half Day" help="How long does this adventure take?" preview="Duration badge on cards" />
        <FormField label="Difficulty" name="difficulty" value={form.difficulty} onChange={updateForm} placeholder="e.g. Moderate" help="Skill level required for this adventure." preview="Adventure cards" />
        <FormField label="Season Start" name="season_start" value={form.season_start} onChange={updateForm} placeholder="e.g. November" help="When does this adventure become available?" preview="Availability info" />
        <FormField label="Season End" name="season_end" value={form.season_end} onChange={updateForm} placeholder="e.g. April" help="When does this adventure season end?" preview="Availability info" />
        <FormField label="Image URL" name="image_url" value={form.image_url} onChange={updateForm} uploadFolder="winter" help="Upload or paste a URL for this winter offering." preview="Card thumbnail + detail page hero" />
        <FormField label="Price From" name="price_from" type="number" value={form.price_from} onChange={updateForm} help="Starting price in dollars. Use 0 if pricing varies." preview="Adventure cards" />
        <FormField label="Display Order" name="display_order" type="number" value={form.display_order} onChange={updateForm} help="Controls sort order. Lower numbers appear first." preview="Order of cards" />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} help="Turn off to hide from the public site without deleting." />
      </AdminFormModal>

      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName={deleteItem?.title || 'this winter adventure'} />
    </div>
  )
}
