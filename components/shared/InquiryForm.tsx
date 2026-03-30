'use client'

import { useState } from 'react'

const RVA_SERVICES = [
  { id: 'fly-fishing', label: 'Fly Fishing', icon: '🎣' },
  { id: 'mountain-biking', label: 'Mountain Biking', icon: '🚵' },
  { id: 'hiking', label: 'Hiking & Backpacking', icon: '🥾' },
  { id: 'horseback', label: 'Horseback Riding', icon: '🐎' },
  { id: 'winter', label: 'Winter Adventures', icon: '❄️' },
  { id: 'guided-tours', label: 'Chauffeur Guided Tours', icon: '🚙' },
  { id: 'custom', label: 'Custom Adventure', icon: '✨' },
]

const AAL_SERVICES = [
  { id: 'airport', label: 'Airport Transfer', icon: '✈️' },
  { id: 'hourly', label: 'Hourly Charter', icon: '🕐' },
  { id: 'corporate', label: 'Corporate Transportation', icon: '💼' },
  { id: 'wedding', label: 'Wedding & Special Events', icon: '💒' },
  { id: 'guided-tours', label: 'Chauffeur Guided Tours', icon: '🚙' },
  { id: 'custom', label: 'Custom Request', icon: '✨' },
]

const GROUP_SIZES = ['1-2', '3-4', '5-6', '7+']

interface Props {
  brand: 'rva' | 'alpenglow'
}

export default function InquiryForm({ brand }: Props) {
  const [step, setStep] = useState(1)
  const [service, setService] = useState('')
  const [date, setDate] = useState('')
  const [groupSize, setGroupSize] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [details, setDetails] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const services = brand === 'rva' ? RVA_SERVICES : AAL_SERVICES
  const accent = brand === 'rva' ? 'bg-rva-copper hover:bg-rva-copper-light' : 'bg-alp-gold hover:bg-alp-gold-light'
  const accentText = brand === 'rva' ? 'text-rva-copper' : 'text-alp-gold'
  const accentBorder = brand === 'rva' ? 'border-rva-copper' : 'border-alp-gold'
  const accentBg = brand === 'rva' ? 'bg-rva-copper/5' : 'bg-alp-gold/5'

  const handleSubmit = async () => {
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand,
          name,
          email,
          phone: phone || undefined,
          service,
          preferred_date: date,
          message: `Service: ${service}\nGroup size: ${groupSize}\nPreferred date: ${date}\n\n${details || 'No additional details'}`,
        }),
      })
      if (res.ok) setStatus('sent')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank you!</h3>
        <p className="text-gray-600 mb-4">Kit will be in touch within a few hours.</p>
        <p className="text-sm text-gray-500">Want to talk sooner? Call <a href="tel:+19704563666" className={`${accentText} font-semibold`}>970-456-3666</a></p>
      </div>
    )
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              s <= step ? `${accent.split(' ')[0]} text-white` : 'bg-gray-100 text-gray-400'
            }`}>{s}</div>
            {s < 3 && <div className={`w-8 h-0.5 ${s < step ? accent.split(' ')[0] : 'bg-gray-200'}`} />}
          </div>
        ))}
        <span className="text-sm text-gray-400 ml-2">Step {step} of 3</span>
      </div>

      {/* Step 1: Service Selection */}
      {step === 1 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What are you looking for?</h3>
          <div className="grid grid-cols-2 gap-3">
            {services.map(s => (
              <button
                key={s.id}
                onClick={() => { setService(s.label); setStep(2) }}
                className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                  service === s.label ? `${accentBorder} ${accentBg}` : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl mb-2 block">{s.icon}</span>
                <span className="text-sm font-medium text-gray-800">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: When & Who */}
      {step === 2 && (
        <div>
          <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-700 mb-4">← Back</button>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">When and how many?</h3>
          <p className="text-sm text-gray-500 mb-6">For: {service}</p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Group Size</label>
              <div className="grid grid-cols-4 gap-2">
                {GROUP_SIZES.map(g => (
                  <button key={g} onClick={() => setGroupSize(g)}
                    className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                      groupSize === g ? `${accent.split(' ')[0]} text-white` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>{g}</button>
                ))}
              </div>
            </div>
            <button onClick={() => { if (date && groupSize) setStep(3) }} disabled={!date || !groupSize}
              className={`w-full py-3 rounded-xl text-white font-semibold transition-colors disabled:opacity-40 ${accent}`}>
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Contact Details */}
      {step === 3 && (
        <div>
          <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-gray-700 mb-4">← Back</button>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Your details</h3>
          <p className="text-sm text-gray-500 mb-6">{service} · {date} · {groupSize} people</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Best way for us to reach you quickly"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
              <textarea value={details} onChange={e => setDetails(e.target.value)} rows={3} placeholder="Anything else we should know?"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none" />
            </div>
            <button onClick={handleSubmit} disabled={!name || !email || status === 'sending'}
              className={`w-full py-3 rounded-xl text-white font-semibold transition-colors disabled:opacity-40 ${accent}`}>
              {status === 'sending' ? 'Sending...' : 'Send Request'}
            </button>
            {status === 'error' && <p className="text-sm text-red-600 text-center">Something went wrong. Please try again or call 970-456-3666.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
