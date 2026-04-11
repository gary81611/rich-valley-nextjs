'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import type { ServiceArea } from '@/lib/types'
import AdminTable, { Column } from '@/components/admin/AdminTable'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'
import EmptyState from '@/components/admin/EmptyState'

type ServiceAreaForm = Omit<
  ServiceArea,
  'id' | 'created_at' | 'updated_at' | 'key_destinations' | 'faq_schema' | 'meta_title' | 'meta_description'
> & {
  key_destinations: string
  faq_schema: string
  meta_title: string
  meta_description: string
}

const emptyArea: ServiceAreaForm = {
  name: '',
  description: '',
  slug: '',
  long_description: '',
  key_destinations: '',
  meta_title: '',
  meta_description: '',
  faq_schema: '[]',
  display_order: 0,
  site_key: 'alpenglow',
  is_active: true,
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function ServiceAreasPage() {
  const [data, setData] = useState<ServiceArea[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ServiceArea | null>(null)
  const [form, setForm] = useState<ServiceAreaForm>(emptyArea)
  const [saving, setSaving] = useState(false)
  const [deleteItem, setDeleteItem] = useState<ServiceArea | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const { data: rows } = await supabase.from('service_areas').select('*').in('site_key', ['rva', 'alpenglow']).order('display_order').order('name')
    setData(rows || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => { setEditing(null); setForm(emptyArea); setModalOpen(true) }
  const openEdit = (item: ServiceArea) => {
    setEditing(item)
    const destinations = Array.isArray(item.key_destinations)
      ? (item.key_destinations as string[]).join(', ')
      : ''
    setForm({
      name: item.name,
      description: item.description,
      slug: item.slug || '',
      long_description: item.long_description || '',
      key_destinations: destinations,
      meta_title: item.meta_title || '',
      meta_description: item.meta_description || '',
      faq_schema: JSON.stringify(Array.isArray(item.faq_schema) ? item.faq_schema : [], null, 2),
      display_order: item.display_order ?? 0,
      site_key: item.site_key,
      is_active: item.is_active,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const keyDestinations = form.key_destinations
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    let faq_schema: unknown = []
    try {
      const raw = form.faq_schema.trim()
      if (raw) {
        const parsed = JSON.parse(raw) as unknown
        if (!Array.isArray(parsed)) throw new Error('FAQs must be a JSON array')
        faq_schema = parsed
      }
    } catch {
      setToast({ message: 'FAQ schema must be valid JSON array: [{"question":"...","answer":"..."}]', type: 'error' })
      setSaving(false)
      return
    }

    const payload = {
      name: form.name,
      description: form.description,
      slug: form.slug,
      long_description: form.long_description,
      key_destinations: keyDestinations,
      meta_title: (form.meta_title ?? '').trim() || null,
      meta_description: (form.meta_description ?? '').trim() || null,
      faq_schema,
      display_order: form.display_order,
      site_key: form.site_key,
      is_active: form.is_active,
    }
    if (editing) {
      const { error } = await supabase.from('service_areas').update(payload).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Service area updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('service_areas').insert(payload)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Service area created!', type: 'success' })
    }
    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    await supabase.from('service_areas').delete().eq('id', deleteItem.id)
    setDeleteItem(null)
    setToast({ message: 'Service area deleted.', type: 'success' })
    fetchData()
  }

  const toggleActive = async (item: ServiceArea) => {
    await supabase.from('service_areas').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchData()
  }

  const updateForm = (name: string, value: string | number | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [name]: value }
      if (name === 'name' && typeof value === 'string') {
        updated.slug = slugify(value)
      }
      return updated
    })
  }

  const columns: Column<ServiceArea>[] = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'description', label: 'Description' },
    { key: 'display_order', label: 'Order', render: (item) => String(item.display_order ?? 0) },
    { key: 'site_key', label: 'Site', render: (item) => item.site_key === 'rva' ? 'RVA' : 'Alpenglow' },
    { key: 'actions', label: 'Actions' },
  ]

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Service Areas</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">Add Service Area</button>
      </div>
      {!loading && data.length === 0 && <EmptyState entity="service areas" onAdd={openAdd} addLabel="Add Service Area" />}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
        ) : (
          <AdminTable columns={columns} data={data} onEdit={openEdit} onDelete={setDeleteItem} onToggleActive={toggleActive} />
        )}
      </div>
      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit Service Area' : 'Add Service Area'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Name" name="name" value={form.name} onChange={updateForm} required help="Town or area name (e.g., 'Snowmass Village')." preview="Service areas page" />
        <FormField label="Slug" name="slug" value={form.slug} onChange={updateForm} required help="URL slug, auto-generated from name. Used in /service-areas/[slug]." preview="URL path" />
        <FormField label="Description" name="description" type="textarea" value={form.description} onChange={updateForm} help="Brief note — distance from Aspen, service availability." preview="Service areas list" />
        <FormField label="Long Description" name="long_description" type="textarea" value={form.long_description} onChange={updateForm} help="Detailed description for the area detail page." preview="Service area detail page" />
        <FormField label="Key Destinations" name="key_destinations" type="textarea" value={form.key_destinations} onChange={updateForm} help="Comma-separated list of key destinations (e.g., 'Downtown Aspen, The Little Nell, Wheeler Opera House')." preview="Service area detail page" />
        <FormField label="Meta title (SEO)" name="meta_title" value={form.meta_title ?? ''} onChange={updateForm} help="Optional. Overrides browser title; ~50–60 chars ideal." preview="SERP title" />
        <FormField label="Meta description (SEO)" name="meta_description" type="textarea" value={form.meta_description ?? ''} onChange={updateForm} help="Optional. ~150–160 chars for Google snippet + social cards." preview="SERP description" />
        <FormField label="FAQ schema (JSON)" name="faq_schema" type="textarea" value={form.faq_schema} onChange={updateForm} help='JSON array for FAQPage rich results, e.g. [{"question":"...","answer":"..."}]' preview="Structured data" />
        <FormField label="Display Order" name="display_order" type="number" value={form.display_order} onChange={updateForm} help="Sort order (lower numbers appear first)." />
        <FormField label="Site" name="site_key" type="select" value={form.site_key} onChange={updateForm} options={[{ value: 'rva', label: 'RVA' }, { value: 'alpenglow', label: 'Alpenglow' }]} help="Which brand serves this area." preview="Controls which site shows it" />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} help="Toggle visibility." />
      </AdminFormModal>
      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName={deleteItem?.name || 'this service area'} />
    </div>
  )
}
