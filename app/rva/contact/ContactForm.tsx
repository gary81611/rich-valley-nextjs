'use client'

import { useState } from 'react'

const serviceOptions = [
  'Fly Fishing',
  'Paddle Boarding',
  'Mountain Biking',
  'Trail Hiking',
  'Scenic Escalade Tours',
  'Horseback Riding',
  'Elevated Camping',
  'Winter Adventure',
  'Other / Not Sure',
]

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    preferredDate: '',
    details: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, brand: 'rva' }),
      })

      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', service: '', preferredDate: '', details: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-rva-sage/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-rva-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-playfair text-2xl text-rva-forest font-bold mb-2">Message Sent!</h3>
        <p className="text-gray-600">
          Thank you for reaching out. We&apos;ll get back to you within a few hours with
          availability and pricing.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rva-copper focus:ring-2 focus:ring-rva-copper/20 outline-none transition-all text-gray-800"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rva-copper focus:ring-2 focus:ring-rva-copper/20 outline-none transition-all text-gray-800"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rva-copper focus:ring-2 focus:ring-rva-copper/20 outline-none transition-all text-gray-800"
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
            Adventure / Service *
          </label>
          <select
            id="service"
            name="service"
            required
            value={formData.service}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rva-copper focus:ring-2 focus:ring-rva-copper/20 outline-none transition-all text-gray-800 bg-white"
          >
            <option value="">Select an adventure...</option>
            {serviceOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Date
        </label>
        <input
          type="date"
          id="preferredDate"
          name="preferredDate"
          value={formData.preferredDate}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rva-copper focus:ring-2 focus:ring-rva-copper/20 outline-none transition-all text-gray-800"
        />
      </div>

      <div>
        <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
          Details
        </label>
        <textarea
          id="details"
          name="details"
          rows={4}
          value={formData.details}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rva-copper focus:ring-2 focus:ring-rva-copper/20 outline-none transition-all text-gray-800 resize-none"
          placeholder="Tell us about your group, experience level, any special requests..."
        />
      </div>

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          Something went wrong. Please try again or call us at 970-456-3666.
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-rva-copper hover:bg-rva-copper-light disabled:opacity-50 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-lg"
      >
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
