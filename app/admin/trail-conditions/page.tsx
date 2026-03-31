'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'
import EmptyState from '@/components/admin/EmptyState'

interface TrailCondition {
  id: string
  section: string
  title: string
  content: string
  icon: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

const SECTION_OPTIONS = [
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'birdwatching', label: 'Birdwatching' },
  { value: 'trail_status', label: 'Trail Status' },
  { value: 'general', label: 'General' },
]

const emptyForm: Omit<TrailCondition, 'id' | 'created_at' | 'updated_at'> = {
  section: 'general',
  title: '',
  content: '',
  icon: '',
  display_order: 0,
  is_active: true,
}

export default function TrailConditionsPage() {
  const [data, setData] = useState<TrailCondition[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<TrailCondition | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteItem, setDeleteItem] = useState<TrailCondition | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: rows } = await supabase.from('trail_conditions').select('*').order('display_order')
    setData(rows || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (item: TrailCondition) => {
    setEditing(item)
    setForm({ section: item.section, title: item.title, content: item.content, icon: item.icon || '', display_order: item.display_order, is_active: item.is_active })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('trail_conditions').update(form).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Trail condition updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('trail_conditions').insert(form)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Trail condition created!', type: 'success' })
    }
    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    await supabase.from('trail_conditions').delete().eq('id', deleteItem.id)
    setDeleteItem(null)
    setToast({ message: 'Trail condition deleted.', type: 'success' })
    fetchData()
  }

  const toggleActive = async (item: TrailCondition) => {
    await supabase.from('trail_conditions').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchData()
  }

  const updateForm = (name: string, value: string | number | boolean) => setForm((prev) => ({ ...prev, [name]: value }))

  const columns: Column<TrailCondition>[] = [
    { key: 'title', label: 'Title' },
    { key: 'section', label: 'Section', render: (item) => SECTION_OPTIONS.find((o) => o.value === item.section)?.label || item.section },
    { key: 'icon', label: 'Icon' },
    { key: 'display_order', label: 'Order' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Trail Conditions</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">Add Condition</button>
      </div>
      {!loading && data.length === 0 && <EmptyState entity="trail conditions" onAdd={openAdd} addLabel="Add Condition" />}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : (
          <AdminTable columns={columns} data={data} onEdit={openEdit} onDelete={setDeleteItem} onToggleActive={toggleActive} />
        )}
      </div>
      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit Trail Condition' : 'Add Trail Condition'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Section" name="section" type="select" value={form.section} onChange={updateForm} required options={SECTION_OPTIONS} help="Category for this trail condition entry." />
        <FormField label="Title" name="title" value={form.title} onChange={updateForm} required help="Heading for this condition entry (e.g., 'Elk Migration Active')." />
        <FormField label="Content" name="content" type="textarea" value={form.content} onChange={updateForm} required help="Detailed description of the current condition or advisory." />
        <FormField label="Icon" name="icon" value={form.icon} onChange={updateForm} help="Optional emoji or icon character (e.g., 🦌, 🐦, ⚠️)." />
        <FormField label="Display Order" name="display_order" type="number" value={form.display_order} onChange={updateForm} help="Sort position. Lower numbers appear first." />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} help="Toggle visibility on the public site." />
      </AdminFormModal>
      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName={deleteItem?.title || 'this trail condition'} />
    </div>
  )
}
