'use client'
import { useState } from 'react'

interface BookingPlaceholderProps {
  accentColor: string; accentHover: string; phone: string; phoneHref: string; variant: 'rva' | 'alpenglow'
}

export default function BookingPlaceholder({ accentColor, accentHover, phone, phoneHref, variant }: BookingPlaceholderProps) {
  const [submitted, setSubmitted] = useState(false)
  const serviceOptions = variant === 'rva'
    ? ['Fly Fishing', 'Paddle Boarding', 'Mountain Biking', 'Trail Hiking', 'Scenic Escalade Tour', 'Horseback Riding', 'Elevated Camping']
    : ['Airport Transfer', 'Hourly Charter', 'Corporate Travel', 'Wedding Transportation', 'Custom Request']

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">✓</div>
        <h3 className="font-playfair text-2xl mb-2">Request Received</h3>
        <p className="text-gray-600">We&apos;ll get back to you within a few hours. For immediate assistance, call{' '}<a href={phoneHref} className={accentColor}>{phone}</a></p>
      </div>
    )
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-opacity-50 focus:outline-none" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input type="tel" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-opacity-50 focus:outline-none" placeholder="(555) 123-4567" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-opacity-50 focus:outline-none" placeholder="you@email.com" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
          <select required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-opacity-50 focus:outline-none">
            <option value="">Select a service</option>
            {serviceOptions.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
          <input type="date" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-opacity-50 focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
        <textarea rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-opacity-50 focus:outline-none" placeholder="Group size, special requests, questions..." />
      </div>
      <button type="submit" className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-colors ${accentColor} ${accentHover}`}>Request a Quote</button>
      <p className="text-center text-sm text-gray-500">Or call us directly at{' '}<a href={phoneHref} className="font-semibold underline">{phone}</a></p>
    </form>
  )
}
