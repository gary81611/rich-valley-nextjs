'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import type { SiteSettings } from '@/lib/types'
import Toast from '@/components/admin/Toast'

const emptySiteSettings: Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'> = {
  site_key: 'rva',
  brand_name: '',
  tagline: '',
  phone: '',
  email: '',
  address: '',
  social_links: {},
  colors: {},
  logo_url: '',
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'rva' | 'alpenglow'>('rva')
  const [rvaSettings, setRvaSettings] = useState<SiteSettings | null>(null)
  const [alpSettings, setAlpSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [socialKey, setSocialKey] = useState('')
  const [socialVal, setSocialVal] = useState('')
  const [colorKey, setColorKey] = useState('')
  const [colorVal, setColorVal] = useState('')
  const supabase = createClient()

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase.from('site_settings').select('*')
    if (data) {
      setRvaSettings(data.find((s: SiteSettings) => s.site_key === 'rva') || null)
      setAlpSettings(data.find((s: SiteSettings) => s.site_key === 'alpenglow') || null)
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  const currentSettings = activeTab === 'rva' ? rvaSettings : alpSettings
  const setCurrentSettings = activeTab === 'rva' ? setRvaSettings : setAlpSettings

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      site_key: activeTab,
      brand_name: currentSettings?.brand_name || '',
      tagline: currentSettings?.tagline || '',
      phone: currentSettings?.phone || '',
      email: currentSettings?.email || '',
      address: currentSettings?.address || '',
      social_links: currentSettings?.social_links || {},
      colors: currentSettings?.colors || {},
      logo_url: currentSettings?.logo_url || '',
    }

    if (currentSettings?.id) {
      const { error } = await supabase.from('site_settings').update(payload).eq('id', currentSettings.id)
      if (error) setToast({ message: error.message, type: 'error' })
      else setToast({ message: 'Settings saved!', type: 'success' })
    } else {
      const { data, error } = await supabase.from('site_settings').insert(payload).select().single()
      if (error) setToast({ message: error.message, type: 'error' })
      else {
        setCurrentSettings(data)
        setToast({ message: 'Settings created!', type: 'success' })
      }
    }

    setSaving(false)
  }

  const updateField = (field: string, value: string) => {
    const base = currentSettings || { ...emptySiteSettings, id: '', created_at: '', updated_at: '', site_key: activeTab }
    setCurrentSettings({ ...base, [field]: value } as SiteSettings)
  }

  const addSocialLink = () => {
    if (!socialKey.trim()) return
    const base = currentSettings || { ...emptySiteSettings, id: '', created_at: '', updated_at: '', site_key: activeTab }
    setCurrentSettings({ ...base, social_links: { ...base.social_links, [socialKey]: socialVal } } as SiteSettings)
    setSocialKey('')
    setSocialVal('')
  }

  const removeSocialLink = (key: string) => {
    if (!currentSettings) return
    const links = { ...currentSettings.social_links }
    delete links[key]
    setCurrentSettings({ ...currentSettings, social_links: links })
  }

  const addColor = () => {
    if (!colorKey.trim()) return
    const base = currentSettings || { ...emptySiteSettings, id: '', created_at: '', updated_at: '', site_key: activeTab }
    setCurrentSettings({ ...base, colors: { ...base.colors, [colorKey]: colorVal } } as SiteSettings)
    setColorKey('')
    setColorVal('')
  }

  const removeColor = (key: string) => {
    if (!currentSettings) return
    const colors = { ...currentSettings.colors }
    delete colors[key]
    setCurrentSettings({ ...currentSettings, colors })
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" /></div>
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Site Settings</h1>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('rva')} className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'rva' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
          Rich Valley Adventures
        </button>
        <button onClick={() => setActiveTab('alpenglow')} className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'alpenglow' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
          Aspen Alpenglow Limousine
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Brand Name</label>
            <input type="text" value={currentSettings?.brand_name || ''} onChange={(e) => updateField('brand_name', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
            <input type="text" value={currentSettings?.tagline || ''} onChange={(e) => updateField('tagline', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input type="text" value={currentSettings?.phone || ''} onChange={(e) => updateField('phone', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" value={currentSettings?.email || ''} onChange={(e) => updateField('email', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input type="text" value={currentSettings?.address || ''} onChange={(e) => updateField('address', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
            <input type="text" value={currentSettings?.logo_url || ''} onChange={(e) => updateField('logo_url', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" />
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Social Links</h3>
          <div className="space-y-2 mb-2">
            {Object.entries(currentSettings?.social_links || {}).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <span className="font-medium text-slate-700 min-w-[80px]">{key}:</span>
                <span className="text-slate-500 flex-1 truncate">{val}</span>
                <button type="button" onClick={() => removeSocialLink(key)} className="text-red-500 text-xs">Remove</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Platform" value={socialKey} onChange={(e) => setSocialKey(e.target.value)} className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm w-28" />
            <input type="text" placeholder="URL" value={socialVal} onChange={(e) => setSocialVal(e.target.value)} className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm flex-1" />
            <button type="button" onClick={addSocialLink} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200">Add</button>
          </div>
        </div>

        {/* Colors */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Colors</h3>
          <div className="space-y-2 mb-2">
            {Object.entries(currentSettings?.colors || {}).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <span className="font-medium text-slate-700 min-w-[80px]">{key}:</span>
                <div className="w-6 h-6 rounded border border-slate-300" style={{ backgroundColor: val }} />
                <span className="text-slate-500">{val}</span>
                <button type="button" onClick={() => removeColor(key)} className="text-red-500 text-xs">Remove</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Name" value={colorKey} onChange={(e) => setColorKey(e.target.value)} className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm w-28" />
            <input type="text" placeholder="#hex" value={colorVal} onChange={(e) => setColorVal(e.target.value)} className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm flex-1" />
            <button type="button" onClick={addColor} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200">Add</button>
          </div>
        </div>

        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
