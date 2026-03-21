'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import type { GalleryImage } from '@/lib/types'
import AdminFormModal from '@/components/admin/AdminFormModal'
import FormField from '@/components/admin/FormField'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog'
import Toast from '@/components/admin/Toast'
import Image from 'next/image'
import EmptyState from '@/components/admin/EmptyState'

const emptyImage: Omit<GalleryImage, 'id' | 'created_at' | 'updated_at'> = {
  url: '', alt_text: '', caption: '', site_key: 'rva', display_order: 0, is_active: true,
}

export default function GalleryPage() {
  const [data, setData] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'rva' | 'alpenglow'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<GalleryImage | null>(null)
  const [form, setForm] = useState(emptyImage)
  const [saving, setSaving] = useState(false)
  const [deleteItem, setDeleteItem] = useState<GalleryImage | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    let query = supabase.from('gallery_images').select('*').order('display_order')
    if (filter !== 'all') query = query.eq('site_key', filter)
    const { data: rows } = await query
    setData(rows || [])
    setLoading(false)
  }, [supabase, filter])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => { setEditing(null); setForm(emptyImage); setModalOpen(true) }
  const openEdit = (item: GalleryImage) => {
    setEditing(item)
    setForm({ url: item.url, alt_text: item.alt_text, caption: item.caption, site_key: item.site_key, display_order: item.display_order, is_active: item.is_active })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('gallery_images').update(form).eq('id', editing.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Image updated!', type: 'success' })
    } else {
      const { error } = await supabase.from('gallery_images').insert(form)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Image added!', type: 'success' })
    }
    setSaving(false)
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    await supabase.from('gallery_images').delete().eq('id', deleteItem.id)
    setDeleteItem(null)
    setToast({ message: 'Image deleted.', type: 'success' })
    fetchData()
  }

  const toggleActive = async (item: GalleryImage) => {
    await supabase.from('gallery_images').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchData()
  }

  const updateForm = (name: string, value: string | number | boolean) => setForm((prev) => ({ ...prev, [name]: value }))

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Gallery</h1>
        <div className="flex gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value as 'all' | 'rva' | 'alpenglow')} className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
            <option value="all">All</option>
            <option value="rva">RVA Only</option>
            <option value="alpenglow">Alpenglow Only</option>
          </select>
          <button onClick={openAdd} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">Add Image</button>
        </div>
      </div>

      {!loading && data.length === 0 && <EmptyState entity="gallery images" onAdd={openAdd} addLabel="Add Photo" />}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-400">No images found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.map((img) => (
            <div key={img.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
              <div className="relative aspect-square bg-slate-100">
                <Image src={img.url} alt={img.alt_text || 'Gallery image'} fill className="object-cover" unoptimized />
                {!img.is_active && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xs font-medium bg-slate-800 px-2 py-1 rounded">Inactive</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-slate-500 mb-1">{img.site_key === 'rva' ? 'RVA' : 'Alpenglow'} &middot; Order: {img.display_order}</p>
                {img.caption && <p className="text-sm text-slate-700 truncate">{img.caption}</p>}
                <div className="flex gap-2 mt-2">
                  <button onClick={() => openEdit(img)} className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">Edit</button>
                  <button onClick={() => toggleActive(img)} className={`text-xs px-2 py-1 rounded ${img.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {img.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <button onClick={() => setDeleteItem(img)} className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded hover:bg-red-100">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminFormModal isOpen={modalOpen} title={editing ? 'Edit Image' : 'Add Image'} onSubmit={handleSubmit} onClose={() => setModalOpen(false)} loading={saving}>
        <FormField label="Image URL" name="url" value={form.url} onChange={updateForm} required help="Path to the image file (e.g., /images/gallery/fishing-01.jpg)." preview="/gallery page masonry grid" />
        <FormField label="Alt Text" name="alt_text" value={form.alt_text} onChange={updateForm} help="Describe the image for accessibility and SEO. Google reads this." preview="Screen readers + Google Image search" />
        <FormField label="Caption" name="caption" value={form.caption} onChange={updateForm} help="Optional text shown when a visitor clicks to enlarge the photo." preview="Lightbox overlay" />
        <FormField label="Site" name="site_key" type="select" value={form.site_key} onChange={updateForm} options={[
          { value: 'rva', label: 'Rich Valley Adventures' }, { value: 'alpenglow', label: 'Aspen Alpenglow Limousine' },
        ]} help="Which site's gallery should display this photo?" preview="Controls which site shows it" />
        <FormField label="Display Order" name="display_order" type="number" value={form.display_order} onChange={updateForm} help="Sort position in the gallery grid." preview="Photo order" />
        <FormField label="Active" name="is_active" type="checkbox" value={form.is_active} onChange={updateForm} help="Toggle visibility." />
      </AdminFormModal>
      <DeleteConfirmDialog isOpen={!!deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} itemName="this image" />
    </div>
  )
}
