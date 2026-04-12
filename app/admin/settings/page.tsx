'use client'
import { useEffect, useState, useCallback, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import type { SiteSettings } from '@/lib/types'
import Toast from '@/components/admin/Toast'
import AdminImageUpload from '@/components/admin/AdminImageUpload'
import { rvaData, alpenglowData } from '@/lib/site-data'

const defaultSettings: Record<'rva' | 'alpenglow', Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>> = {
  rva: {
    site_key: 'rva',
    brand_name: rvaData.name,
    tagline: rvaData.tagline,
    phone: rvaData.phone,
    email: rvaData.email,
    address: 'Aspen, Colorado 81611',
    social_links: { Facebook: rvaData.social.facebook, Instagram: rvaData.social.instagram },
    colors: { primary: '#C17A3A', secondary: '#2D3B2D', accent: '#D4A96A', background: '#F5F0EB' },
    logo_url: rvaData.logo,
    stats: [],
    about_content: null,
  },
  alpenglow: {
    site_key: 'alpenglow',
    brand_name: alpenglowData.name,
    tagline: alpenglowData.tagline,
    phone: alpenglowData.phone,
    email: alpenglowData.email,
    address: 'Aspen, Colorado 81611',
    social_links: { Facebook: alpenglowData.social.facebook, Instagram: alpenglowData.social.instagram },
    colors: { primary: '#1B2541', secondary: '#C8A96E', accent: '#2A3F6F', background: '#0F1729' },
    logo_url: alpenglowData.logo,
    stats: [],
    about_content: null,
  },
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
  const [statLabel, setStatLabel] = useState('')
  const [statValue, setStatValue] = useState('')
  const supabase = createClient()

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase.from('site_settings').select('*')
    const rvaRow = data?.find((s: SiteSettings) => s.site_key === 'rva') || null
    const alpRow = data?.find((s: SiteSettings) => s.site_key === 'alpenglow') || null
    // Pre-fill with suggested defaults if no data exists
    setRvaSettings(rvaRow || { ...defaultSettings.rva, id: '', created_at: '', updated_at: '' } as SiteSettings)
    setAlpSettings(alpRow || { ...defaultSettings.alpenglow, id: '', created_at: '', updated_at: '' } as SiteSettings)
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
      stats: currentSettings?.stats || [],
      about_content: currentSettings?.about_content || null,
    }

    if (currentSettings?.id && currentSettings.id !== '') {
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
    const base = currentSettings || { ...defaultSettings[activeTab], id: '', created_at: '', updated_at: '', site_key: activeTab }
    setCurrentSettings({ ...base, [field]: value } as SiteSettings)
  }

  const addSocialLink = () => {
    if (!socialKey.trim()) return
    const base = currentSettings || { ...defaultSettings[activeTab], id: '', created_at: '', updated_at: '', site_key: activeTab }
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
    const base = currentSettings || { ...defaultSettings[activeTab], id: '', created_at: '', updated_at: '', site_key: activeTab }
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

  const addStat = () => {
    if (!statLabel.trim() || !statValue.trim()) return
    const base = currentSettings || { ...defaultSettings[activeTab], id: '', created_at: '', updated_at: '', site_key: activeTab }
    const existing = base.stats || []
    setCurrentSettings({ ...base, stats: [...existing, { label: statLabel, value: statValue }] } as SiteSettings)
    setStatLabel('')
    setStatValue('')
  }

  const removeStat = (index: number) => {
    if (!currentSettings) return
    const stats = [...(currentSettings.stats || [])]
    stats.splice(index, 1)
    setCurrentSettings({ ...currentSettings, stats })
  }

  const updateStatField = (index: number, field: 'label' | 'value', val: string) => {
    if (!currentSettings) return
    const stats = [...(currentSettings.stats || [])]
    stats[index] = { ...stats[index], [field]: val }
    setCurrentSettings({ ...currentSettings, stats })
  }

  const updateAboutContent = (field: string, value: string | string[]) => {
    const base = currentSettings || { ...defaultSettings[activeTab], id: '', created_at: '', updated_at: '', site_key: activeTab }
    const existing = base.about_content || { founder_story: '', company_narrative: '', team_characteristics: [], cta_text: '' }
    setCurrentSettings({ ...base, about_content: { ...existing, [field]: value } } as SiteSettings)
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

      {currentSettings && !currentSettings.id && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-800">Pre-filled with suggested defaults</p>
              <p className="text-xs text-blue-600 mt-0.5">These fields are populated with recommended values. Review and click &ldquo;Save Settings&rdquo; to persist them to the database.</p>
            </div>
          </div>
        </div>
      )}

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
            <div className="mb-1.5">
              <AdminImageUpload
                folder="branding"
                value={currentSettings?.logo_url || ''}
                onUrlChange={(u) => updateField('logo_url', u)}
              />
            </div>
            <p className="text-[11px] text-slate-400 mb-1">Or paste a URL.</p>
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

        {/* Site Statistics */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Site Statistics</h3>
          <div className="space-y-2 mb-2">
            {(currentSettings?.stats || []).map((stat, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStatField(index, 'label', e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm w-40"
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStatField(index, 'value', e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm flex-1"
                  placeholder="Value"
                />
                <button type="button" onClick={() => removeStat(index)} className="text-red-500 text-xs">Remove</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Label" value={statLabel} onChange={(e) => setStatLabel(e.target.value)} className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm w-40" />
            <input type="text" placeholder="Value" value={statValue} onChange={(e) => setStatValue(e.target.value)} className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm flex-1" />
            <button type="button" onClick={addStat} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200">Add</button>
          </div>
        </div>

        {/* About Page Content — RVA only */}
        {activeTab === 'rva' && (
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">About Page Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Founder Story</label>
                <textarea
                  rows={5}
                  value={currentSettings?.about_content?.founder_story || ''}
                  onChange={(e) => updateAboutContent('founder_story', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="The founder's story paragraph(s)..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Narrative</label>
                <textarea
                  rows={5}
                  value={currentSettings?.about_content?.company_narrative || ''}
                  onChange={(e) => updateAboutContent('company_narrative', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="The 'Since 2012' / decade of adventure narrative..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Team Characteristics</label>
                <input
                  type="text"
                  value={(currentSettings?.about_content?.team_characteristics || []).join(', ')}
                  onChange={(e) => updateAboutContent('team_characteristics', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="Wilderness First-Aid certified, Average 8+ years experience, ..."
                />
                <p className="text-xs text-slate-500 mt-1">Comma-separated list of team qualities</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CTA Text</label>
                <input
                  type="text"
                  value={currentSettings?.about_content?.cta_text || ''}
                  onChange={(e) => updateAboutContent('cta_text', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="Whether it's your first visit or your fourteenth..."
                />
              </div>
            </div>
          </div>
        )}

        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
