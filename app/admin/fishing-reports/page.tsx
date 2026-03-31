'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'
import EmptyState from '@/components/admin/EmptyState'

interface Guide {
  id: string
  name: string
}

interface FishingReport {
  id: string
  created_at: string
  updated_at: string
  title: string
  content: string
  author_guide_id: string
  river_name: string
  hatch_info: string
  fly_recommendations: string
  water_clarity: string
  is_published: boolean
  published_at: string | null
  guides?: { name: string }
}

const emptyReport: Omit<FishingReport, 'id' | 'created_at' | 'updated_at' | 'guides'> = {
  title: 'Weekly Fishing Report',
  content: '',
  author_guide_id: '',
  river_name: '',
  hatch_info: '',
  fly_recommendations: '',
  water_clarity: '',
  is_published: false,
  published_at: null,
}

export default function FishingReportsPage() {
  const [data, setData] = useState<FishingReport[]>([])
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<FishingReport | null>(null)
  const [form, setForm] = useState(emptyReport)
  const [saving, setSaving] = useState(false)
  const [deleteItem, setDeleteItem] = useState<FishingReport | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const [{ data: rows }, { data: guideRows }] = await Promise.all([
      supabase.from('fishing_reports').select('*, guides(name)').order('created_at', { ascending: false }),
      supabase.from('guides').select('id, name').order('name'),
    ])
    setData(rows || [])
    setGuides(guideRows || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => { setEditing(null); setForm(emptyReport); setModalOpen(true) }
  const openEdit = (item: FishingReport) => {
    setEditing(item)
    setForm({
      title: item.title,
      content: item.content,
      author_guide_id: item.author_guide_id,
      river_name: item.river_name,
      hatch_info: item.hatch_info,
      fly_recommendations: item.fly_recommendations,
      water_clarity: item.water_clarity,
      is_published: item.is_published,
      published_at: item.published_at,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = { ...form }

    // Auto-set published_at when toggling is_published to true
    if (payload.is_published && !editing?.is_published) {
      payload.published_at = new Date().toISOString()
    }
    // Clear published_at when unpublishing
    if (!payload.is_published) {
      payload.published_at = null
    }

    if (editing) {
      const { error } = await supabase.from('fishing_reports').update(payload).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Fishing report updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('fishing_reports').insert(payload)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Fishing report created!', type: 'success' })
    }
    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    const { error } = await supabase.from('fishing_reports').delete().eq('id', deleteItem.id)
    if (error) setToast({ message: error.message, type: 'error' })
    else setToast({ message: 'Fishing report deleted.', type: 'success' })
    setDeleteItem(null)
    fetchData()
  }

  const toggleActive = async (item: FishingReport) => {
    const newPublished = !item.is_published
    await supabase.from('fishing_reports').update({
      is_published: newPublished,
      published_at: newPublished ? new Date().toISOString() : null,
    }).eq('id', item.id)
    fetchData()
  }

  const updateForm = (name: string, value: string | number | boolean) => setForm((prev) => ({ ...prev, [name]: value }))

  const guideOptions = guides.map((g) => ({ value: g.id, label: g.name }))

  const columns: Column<FishingReport>[] = [
    { key: 'title', label: 'Title' },
    { key: 'river_name', label: 'River' },
    { key: 'author_guide_id', label: 'Author', render: (item) => item.guides?.name || '—' },
    { key: 'is_published', label: 'Published', render: (item) => item.is_published ? '✓' : '—' },
    { key: 'created_at', label: 'Date', render: (item) => new Date(item.created_at).toLocaleDateString() },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Fishing Reports</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
          Add Report
        </button>
      </div>

      {!loading && data.length === 0 && <EmptyState entity="fishing reports" onAdd={openAdd} addLabel="Add Report" />}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : (
          <AdminTable columns={columns} data={data} onEdit={openEdit} onDelete={setDeleteItem} onToggleActive={toggleActive} />
        )}
      </div>

      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit Fishing Report' : 'Add Fishing Report'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Title" name="title" value={form.title} onChange={updateForm} required help="Report title, e.g. 'Weekly Fishing Report'." preview="Report listing" />
        <FormField label="River Name" name="river_name" value={form.river_name} onChange={updateForm} required help="Which river does this report cover?" preview="Report listing + detail" />
        <FormField label="Author" name="author_guide_id" type="select" value={form.author_guide_id} onChange={updateForm} options={[{ value: '', label: 'Select a guide...' }, ...guideOptions]} required help="The guide who authored this report." preview="Report byline" />
        <FormField label="Content" name="content" type="textarea" value={form.content} onChange={updateForm} required help="Main report content — general conditions, catches, recommendations." preview="Report detail page" />
        <FormField label="Hatch Info" name="hatch_info" type="textarea" value={form.hatch_info} onChange={updateForm} help="Current hatch activity and insect observations." preview="Report detail page" />
        <FormField label="Fly Recommendations" name="fly_recommendations" type="textarea" value={form.fly_recommendations} onChange={updateForm} help="Recommended fly patterns for current conditions." preview="Report detail page" />
        <FormField label="Water Clarity" name="water_clarity" value={form.water_clarity} onChange={updateForm} help="Current water clarity (e.g. 'Clear', 'Slightly stained', 'Off-color')." preview="Report detail page" />
        <FormField label="Published" name="is_published" type="checkbox" value={form.is_published} onChange={updateForm} help="Publish to the public site. Published date is auto-set when toggled on." />
      </AdminFormModal>

      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName={deleteItem?.title || 'this report'} />
    </div>
  )
}
