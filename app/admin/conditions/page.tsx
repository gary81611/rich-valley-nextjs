'use client'

import { useCallback, useEffect, useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import FormField from '@/components/admin/FormField'
import Toast from '@/components/admin/Toast'

type ConditionsReport = {
  id: string
  report_date: string
  author_name: string | null
  hatch_report: string | null
  fly_recommendations: string | null
  water_clarity: string | null
  trail_conditions: string | null
  wildlife_notes: string | null
  birdwatching_highlights: string | null
  environmental_alerts: string | null
  general_notes: string | null
  published: boolean
  created_at: string
  updated_at: string
}

const emptyForm = {
  report_date: new Date().toISOString().slice(0, 10),
  author_name: '',
  hatch_report: '',
  fly_recommendations: '',
  water_clarity: '',
  trail_conditions: '',
  wildlife_notes: '',
  birdwatching_highlights: '',
  environmental_alerts: '',
  general_notes: '',
}

export default function ConditionsReportsAdminPage() {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [recent, setRecent] = useState<ConditionsReport[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchRecent = useCallback(async () => {
    const { data, error } = await supabase
      .from('conditions_reports')
      .select('*')
      .order('report_date', { ascending: false })
      .limit(5)
    if (!error && data) setRecent(data as ConditionsReport[])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchRecent()
  }, [fetchRecent])

  const updateForm = (name: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const submit = async (e: FormEvent, published: boolean) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/conditions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        author_name: form.author_name || null,
        hatch_report: form.hatch_report || null,
        fly_recommendations: form.fly_recommendations || null,
        water_clarity: form.water_clarity || null,
        trail_conditions: form.trail_conditions || null,
        wildlife_notes: form.wildlife_notes || null,
        birdwatching_highlights: form.birdwatching_highlights || null,
        environmental_alerts: form.environmental_alerts || null,
        general_notes: form.general_notes || null,
        published,
      }),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      setToast({ message: body.error || 'Save failed', type: 'error' })
    } else {
      setToast({ message: published ? 'Published.' : 'Draft saved.', type: 'success' })
      setForm(emptyForm)
      fetchRecent()
    }
    setSaving(false)
  }

  const togglePublished = async (row: ConditionsReport) => {
    const res = await fetch(`/api/conditions/${row.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !row.published }),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) setToast({ message: body.error || 'Update failed', type: 'error' })
    else {
      setToast({ message: !row.published ? 'Published.' : 'Unpublished.', type: 'success' })
      fetchRecent()
    }
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Conditions reports</h1>
      <p className="text-slate-600 text-sm mb-8">Published reports appear on /conditions and the homepage strip.</p>

      <form className="max-w-3xl space-y-4 bg-white rounded-xl border border-slate-200 p-6 mb-10" onSubmit={(e) => e.preventDefault()}>
        <FormField label="Report date" name="report_date" value={form.report_date} onChange={updateForm} required />
        <FormField label="Author name" name="author_name" value={form.author_name} onChange={updateForm} />
        <FormField label="Hatch report" name="hatch_report" type="textarea" value={form.hatch_report} onChange={updateForm} />
        <FormField label="Fly recommendations" name="fly_recommendations" type="textarea" value={form.fly_recommendations} onChange={updateForm} />
        <FormField label="Water clarity" name="water_clarity" type="textarea" value={form.water_clarity} onChange={updateForm} />
        <FormField label="Trail conditions" name="trail_conditions" type="textarea" value={form.trail_conditions} onChange={updateForm} />
        <FormField label="Wildlife notes" name="wildlife_notes" type="textarea" value={form.wildlife_notes} onChange={updateForm} />
        <FormField label="Birdwatching highlights" name="birdwatching_highlights" type="textarea" value={form.birdwatching_highlights} onChange={updateForm} />
        <FormField label="Environmental alerts" name="environmental_alerts" type="textarea" value={form.environmental_alerts} onChange={updateForm} />
        <FormField label="General notes" name="general_notes" type="textarea" value={form.general_notes} onChange={updateForm} />

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            disabled={saving}
            onClick={(e) => submit(e, false)}
            className="px-4 py-2 bg-slate-200 text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-300 disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={(e) => submit(e, true)}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </form>

      <h2 className="text-lg font-semibold text-slate-900 mb-3">Recent reports (last 5)</h2>
      {loading ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : recent.length === 0 ? (
        <p className="text-slate-500 text-sm">No reports yet.</p>
      ) : (
        <ul className="space-y-2">
          {recent.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm">
              <span>
                {r.report_date} — {r.published ? <span className="text-green-700 font-medium">Published</span> : <span className="text-slate-500">Draft</span>}
              </span>
              <button
                type="button"
                onClick={() => togglePublished(r)}
                className="text-slate-700 underline hover:text-slate-900"
              >
                {r.published ? 'Unpublish' : 'Publish'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
