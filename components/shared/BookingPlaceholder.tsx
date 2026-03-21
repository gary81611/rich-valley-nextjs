'use client'
import { useState } from 'react'

interface BookingPlaceholderProps {
  accentColor: string; accentHover: string; phone: string; phoneHref: string; variant: 'rva' | 'alpenglow'
}

export default function BookingPlaceholder({ accentColor, accentHover, phone, phoneHref, variant }: BookingPlaceholderProps) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', preferred_date: '', details: '' })

  const serviceOptions = variant === 'rva'
    ? ['Fly Fishing', 'Paddle Boarding', 'Mountain Biking', 'Trail Hiking', 'Scenic Escalade Tour', 'Horseback Riding', 'Elevated Camping', 'Snowshoeing', 'Cross-Country Skiing', 'Ice Fishing', 'Winter Escalade Tour']
    : ['Airport Transfer', 'Hourly Charter', 'Corporate Travel', 'Wedding Transportation', 'Custom Request']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, brand: variant }),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="font-playfair text-2xl mb-2">Request Received!</h3>
        <p className="text-gray-600">We&apos;ll get back to you within a few hours. For immediate assistance, call{' '}<a href={phoneHref} className="font-semibold underline">{phone}</a></p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input type="text" required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-opacity-50 focus:outline-none" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input type="tel" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-opacity-50 focus:outline-none" placeholder="(555) 123-4567" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input type="email" required value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-opacity-50 focus:outline-none" placeholder="you@email.com" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
          <select value={form.service} onChange={(e) => setForm(f => ({ ...f, service: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-opacity-50 focus:outline-none">
            <option value="">Select a service</option>
            {serviceOptions.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
          <input type="date" value={form.preferred_date} onChange={(e) => setForm(f => ({ ...f, preferred_date: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-opacity-50 focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
        <textarea rows={3} value={form.details} onChange={(e) => setForm(f => ({ ...f, details: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-opacity-50 focus:outline-none" placeholder="Group size, special requests, questions..." />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={submitting} className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-colors disabled:opacity-50 ${accentColor} ${accentHover}`}>
        {submitting ? 'Sending...' : 'Request a Quote'}
      </button>
      <p className="text-center text-sm text-gray-500">Or call us directly at{' '}<a href={phoneHref} className="font-semibold underline">{phone}</a></p>
    </form>
  )
}
