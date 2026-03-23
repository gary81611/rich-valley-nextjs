'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { NavItem, SiteId } from '@/lib/pages'

const blank: Omit<NavItem, 'id'> = { site_id: 'rva', label: '', href: '', position: 0, parent_id: null, is_visible: true }

export default function AdminNavigationPage() {
  const supabase = createClient()
  const [items, setItems] = useState<NavItem[]>([])
  const [loading, setLoading] = useState(true)
  const [siteFilter, setSiteFilter] = useState<SiteId>('rva')
  const [editing, setEditing] = useState<Partial<NavItem> | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('navigation').select('*').eq('site_id', siteFilter).order('position')
    setItems((data as NavItem[]) || [])
    setLoading(false)
  }, [supabase, siteFilter])

  useEffect(() => { load() }, [load])

  const save = async () => {
    if (!editing) return
    setSaving(true)
    const isNew = !editing.id
    let q
    if (isNew) {
      const maxPos = items.length > 0 ? Math.max(...items.map(i => i.position)) + 1 : 0
      q = supabase.from('navigation').insert({ ...blank, ...editing, site_id: siteFilter, position: maxPos })
    } else {
      q = supabase.from('navigation').update({
        label: editing.label, href: editing.href, is_visible: editing.is_visible, position: editing.position,
      }).eq('id', editing.id)
    }
    const { error } = await q
    if (error) showToast(`Error: ${error.message}`, false)
    else { showToast(isNew ? 'Item added' : 'Saved'); setEditing(null); load() }
    setSaving(false)
  }

  const toggleVisible = async (item: NavItem) => {
    const { error } = await supabase.from('navigation').update({ is_visible: !item.is_visible }).eq('id', item.id)
    if (!error) load()
  }

  const deleteItem = async (item: NavItem) => {
    if (!confirm(`Remove "${item.label}" from navigation?`)) return
    const { error } = await supabase.from('navigation').delete().eq('id', item.id)
    if (error) showToast(`Error: ${error.message}`, false)
    else { showToast('Removed'); load() }
  }

  const moveUp = async (item: NavItem, idx: number) => {
    if (idx === 0) return
    const prev = items[idx - 1]
    await Promise.all([
      supabase.from('navigation').update({ position: prev.position }).eq('id', item.id),
      supabase.from('navigation').update({ position: item.position }).eq('id', prev.id),
    ])
    load()
  }

  const moveDown = async (item: NavItem, idx: number) => {
    if (idx === items.length - 1) return
    const next = items[idx + 1]
    await Promise.all([
      supabase.from('navigation').update({ position: next.position }).eq('id', item.id),
      supabase.from('navigation').update({ position: item.position }).eq('id', next.id),
    ])
    load()
  }

  return (
    <div className="max-w-3xl">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${toast.ok ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Navigation</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage site navigation links and order</p>
        </div>
        <button
          onClick={() => setEditing({ ...blank, site_id: siteFilter })}
          className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          + Add Link
        </button>
      </div>

      {/* Site tabs */}
      <div className="flex gap-2 mb-5">
        {(['rva', 'alpenglow'] as SiteId[]).map((s) => (
          <button
            key={s}
            onClick={() => setSiteFilter(s)}
            className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${siteFilter === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-300 hover:border-slate-500'}`}
          >
            {s === 'rva' ? 'Rich Valley Adventures' : 'Aspen Alpenglow'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">No navigation items yet. Click "Seed Pages" on the Pages tab first, or add items manually.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {items.length} items — drag to reorder (use ↑↓ arrows)
            </p>
          </div>
          <ul className="divide-y divide-slate-100">
            {items.map((item, idx) => (
              <li key={item.id} className={`flex items-center gap-3 px-4 py-3 ${!item.is_visible ? 'opacity-50' : ''}`}>
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveUp(item, idx)} disabled={idx === 0} className="text-slate-400 hover:text-slate-700 disabled:opacity-30 leading-none">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button onClick={() => moveDown(item, idx)} disabled={idx === items.length - 1} className="text-slate-400 hover:text-slate-700 disabled:opacity-30 leading-none">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <span className="text-xs text-slate-400 w-5 text-center">{idx + 1}</span>
                <div className="flex-1">
                  <span className="font-medium text-sm text-slate-900">{item.label}</span>
                  <span className="ml-2 text-xs text-slate-400 font-mono">{item.href}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleVisible(item)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${item.is_visible ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {item.is_visible ? 'Visible' : 'Hidden'}
                  </button>
                  <button onClick={() => setEditing(item)} className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200">Edit</button>
                  <button onClick={() => deleteItem(item)} className="text-xs px-2.5 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">{editing.id ? 'Edit Nav Item' : 'Add Nav Item'}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Label</label>
                <input
                  type="text"
                  value={editing.label || ''}
                  onChange={e => setEditing(p => ({ ...p, label: e.target.value }))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="e.g. Fly Fishing"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">URL</label>
                <input
                  type="text"
                  value={editing.href || ''}
                  onChange={e => setEditing(p => ({ ...p, href: e.target.value }))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="/fly-fishing"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="visible"
                  checked={editing.is_visible ?? true}
                  onChange={e => setEditing(p => ({ ...p, is_visible: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <label htmlFor="visible" className="text-sm text-slate-700">Visible in navigation</label>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">Cancel</button>
              <button
                onClick={save}
                disabled={saving || !editing.label || !editing.href}
                className="px-5 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
