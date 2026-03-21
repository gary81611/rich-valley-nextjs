'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import type { Adventure } from '@/lib/types'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'

const emptyAdventure: Omit<Adventure, 'id' | 'created_at' | 'updated_at'> = {
  name: '', description: '', duration: '', price: 0, difficulty: 'moderate',
  image_url: '', display_order: 0, is_active: true, season: 'summer',
}

export default function AdventuresPage() {
  const [data, setData] = useState<Adventure[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Adventure | null>(null)
  const [form, setForm] = useState(emptyAdventure)
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

  const openAdd = () => { setEditing(null); setForm(emptyAdventure); setModalOpen(true) }
  const openEdit = (item: Adventure) => {
    setEditing(item)
    setForm({ name: item.name, description: item.description, duration: item.duration, price: item.price, difficulty: item.difficulty, image_url: item.image_url, display_order: item.display_order, is_active: item.is_active, season: item.season })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('adventures').update(form).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Adventure updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('adventures').insert(form)
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
    { key: 'price', label: 'Price', render: (item) => `$${item.price}` },
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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : (
          <AdminTable columns={columns} data={data} onEdit={openEdit} onDelete={setDeleteItem} onToggleActive={toggleActive} />
        )}
      </div>

      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit Adventure' : 'Add Adventure'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Name" name="name" value={form.name} onChange={updateForm} required />
        <FormField label="Description" name="description" type="textarea" value={form.description} onChange={updateForm} />
        <FormField label="Duration" name="duration" value={form.duration} onChange={updateForm} placeholder="e.g. Half Day" />
        <FormField label="Price" name="price" type="number" value={form.price} onChange={updateForm} />
        <FormField label="Difficulty" name="difficulty" type="select" value={form.difficulty} onChange={updateForm} options={[
          { value: 'easy', label: 'Easy' }, { value: 'moderate', label: 'Moderate' },
          { value: 'challenging', label: 'Challenging' }, { value: 'expert', label: 'Expert' },
        ]} />
        <FormField label="Image URL" name="image_url" value={form.image_url} onChange={updateForm} />
        <FormField label="Display Order" name="display_order" type="number" value={form.display_order} onChange={updateForm} />
        <FormField label="Season" name="season" type="select" value={form.season} onChange={updateForm} options={[
          { value: 'summer', label: 'Summer' }, { value: 'winter', label: 'Winter' }, { value: 'year-round', label: 'Year-Round' },
        ]} />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} />
      </AdminFormModal>

      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName={deleteItem?.name || 'this adventure'} />
    </div>
  )
}
