'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'
import EmptyState from '@/components/admin/EmptyState'

interface ValueProposition {
  id: string
  site_key: string
  title: string
  description: string
  icon: string
  display_order: number
  is_active: boolean
  created_at: string
}

const emptyForm: Omit<ValueProposition, 'id' | 'created_at'> = {
  site_key: 'rva', title: '', description: '', icon: '', display_order: 0, is_active: true,
}

export default function ValuePropositionsPage() {
  const [data, setData] = useState<ValueProposition[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'rva' | 'alpenglow'>('rva')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ValueProposition | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteItem, setDeleteItem] = useState<ValueProposition | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: rows } = await supabase.from('value_propositions').select('*').order('display_order')
    setData(rows || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const filteredData = data.filter((item) => item.site_key === activeTab)

  const openAdd = () => { setEditing(null); setForm({ ...emptyForm, site_key: activeTab }); setModalOpen(true) }
  const openEdit = (item: ValueProposition) => {
    setEditing(item)
    setForm({ site_key: item.site_key, title: item.title, description: item.description, icon: item.icon, display_order: item.display_order, is_active: item.is_active })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('value_propositions').update(form).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Value proposition updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('value_propositions').insert(form)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Value proposition created!', type: 'success' })
    }
    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    await supabase.from('value_propositions').delete().eq('id', deleteItem.id)
    setDeleteItem(null)
    setToast({ message: 'Value proposition deleted.', type: 'success' })
    fetchData()
  }

  const toggleActive = async (item: ValueProposition) => {
    await supabase.from('value_propositions').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchData()
  }

  const updateForm = (name: string, value: string | number | boolean) => setForm((prev) => ({ ...prev, [name]: value }))

  const columns: Column<ValueProposition>[] = [
    { key: 'title', label: 'Title' },
    { key: 'site_key', label: 'Site', render: (item) => item.site_key === 'rva' ? 'RVA' : 'Alpenglow' },
    { key: 'display_order', label: 'Order' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Value Propositions</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
          Add Value Proposition
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('rva')} className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'rva' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
          Rich Valley Adventures
        </button>
        <button onClick={() => setActiveTab('alpenglow')} className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'alpenglow' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
          Aspen Alpenglow Limousine
        </button>
      </div>

      {!loading && filteredData.length === 0 && <EmptyState entity="value propositions" onAdd={openAdd} addLabel="Add Value Proposition" />}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : (
          <AdminTable columns={columns} data={filteredData} onEdit={openEdit} onDelete={setDeleteItem} onToggleActive={toggleActive} />
        )}
      </div>

      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit Value Proposition' : 'Add Value Proposition'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Site" name="site_key" type="select" value={form.site_key} onChange={updateForm} options={[
          { value: 'rva', label: 'Rich Valley Adventures' }, { value: 'alpenglow', label: 'Aspen Alpenglow Limousine' },
        ]} help="Which site this value proposition appears on." preview="'Why Choose Us' section" />
        <FormField label="Title" name="title" value={form.title} onChange={updateForm} required help="Short headline (e.g., 'Expert Local Guides', '24/7 Availability')." preview="Why Choose Us cards" />
        <FormField label="Description" name="description" type="textarea" value={form.description} onChange={updateForm} help="Explain this benefit in 1-2 sentences. Be specific and compelling." preview="Why Choose Us card body" />
        <FormField label="Icon" name="icon" value={form.icon} onChange={updateForm} placeholder="e.g. shield-check, clock, star" help="Optional icon identifier. Use a Lucide/Heroicon name or emoji." preview="Why Choose Us card icon" />
        <FormField label="Display Order" name="display_order" type="number" value={form.display_order} onChange={updateForm} help="Controls sort order. Lower numbers appear first." preview="Order of cards" />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} help="Toggle visibility on the public site without deleting." />
      </AdminFormModal>

      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName={deleteItem?.title || 'this value proposition'} />
    </div>
  )
}
