'use client'

import { useState } from 'react'
import RvaButton from '@/components/rva/Button'

const RVA_SERVICES = [
  { id: 'fly-fishing', label: 'Fly Fishing', icon: '🎣' },
  { id: 'private-ranch-fishing', label: 'Private Ranch Fishing', icon: '🎣' },
  { id: 'mountain-biking', label: 'Mountain Biking', icon: '🚵' },
  { id: 'hiking', label: 'Hiking & Backpacking', icon: '🥾' },
  { id: 'horseback', label: 'Horseback Riding', icon: '🐎' },
  { id: 'winter', label: 'Winter Adventures', icon: '❄️' },
  { id: 'guided-tours', label: 'Scenic & Wildlife Tours', icon: '🚙' },
  { id: 'custom', label: 'Custom Adventure', icon: '✨' },
]

const AAL_SERVICES = [
  { id: 'airport', label: 'Airport Transfer', icon: '✈️' },
  { id: 'hourly', label: 'Hourly Charter', icon: '🕐' },
  { id: 'corporate', label: 'Corporate Transportation', icon: '💼' },
  { id: 'wedding', label: 'Wedding & Special Events', icon: '💒' },
  { id: 'guided-tours', label: 'Scenic & Wildlife Tours', icon: '🚙' },
  { id: 'custom', label: 'Custom Request', icon: '✨' },
]

const GROUP_SIZES = ['1-2', '3-4', '5-6', '7+']

function AalServiceIcon({ id }: { id: string }) {
  const common = 'w-6 h-6 mb-2 text-alp-navy'
  if (id === 'airport' || id === 'hourly') {
    return (
      <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19V6m0 0l-4 4m4-4l4 4M4 19h16" />
      </svg>
    )
  }
  if (id === 'corporate') {
    return (
      <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 20h16M6 20V8h12v12M10 20v-4h4v4" />
      </svg>
    )
  }
  if (id === 'wedding') {
    return (
      <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21s-6-4.4-6-9a4 4 0 016-3 4 4 0 016 3c0 4.6-6 9-6 9z" />
      </svg>
    )
  }
  return (
    <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16h16M6 16l1-5h10l1 5M7 11l2-4h6l2 4" />
    </svg>
  )
}

interface Props {
  brand: 'rva' | 'alpenglow'
  /** Matches a service id, for example private-ranch-fishing from /contact?service= */
  initialServiceId?: string
}

export default function InquiryForm({ brand, initialServiceId }: Props) {
  const displayPhone = brand === 'alpenglow' ? '970-315-6111' : '970-456-3666'
  const displayPhoneHref = brand === 'alpenglow' ? 'tel:+19703156111' : 'tel:+19704563666'
  const services = brand === 'rva' ? RVA_SERVICES : AAL_SERVICES
  const preset = services.find((s) => s.id === initialServiceId)
  const [step, setStep] = useState(preset ? 2 : 1)
  const [service, setService] = useState(preset?.label ?? '')
  const [date, setDate] = useState('')
  const [groupSize, setGroupSize] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [details, setDetails] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const accent = brand === 'rva' ? 'bg-rva-copper-700 hover:bg-rva-copper-800' : 'bg-alp-gold hover:bg-alp-gold-light'
  const accentInk = brand === 'rva' ? 'text-white' : 'text-alp-navy'
  const accentText = brand === 'rva' ? 'text-rva-copper-700' : 'text-alp-gold-700'
  const accentBorder = brand === 'rva' ? 'border-rva-copper-700' : 'border-alp-gold'
  const accentBg = brand === 'rva' ? 'bg-rva-copper-700/5' : 'bg-alp-gold/5'

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
        {brand === 'alpenglow' ? (
          <svg className="w-10 h-10 mx-auto mb-4 text-alp-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
        ) : (
          <div className="text-4xl mb-4">✅</div>
        )}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank you!</h3>
        <p className="text-gray-600 mb-4">Kit will be in touch within a few hours.</p>
        <p className="text-sm text-gray-500">Want to talk sooner? Call <a href={displayPhoneHref} className={`${accentText} font-semibold`}>{displayPhone}</a></p>
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
              s <= step ? `${accent.split(' ')[0]} ${accentInk}` : 'bg-gray-100 text-gray-700'
            }`}>{s}</div>
            {s < 3 && <div className={`w-8 h-0.5 ${s < step ? accent.split(' ')[0] : 'bg-gray-200'}`} />}
          </div>
        ))}
        <span className="text-sm text-gray-700 ml-2">Step {step} of 3</span>
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
                {brand === 'alpenglow' ? <AalServiceIcon id={s.id} /> : <span className="text-2xl mb-2 block">{s.icon}</span>}
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
            {brand === 'rva' ? (
              <RvaButton type="button" disabled={!date || !groupSize} className="w-full" onClick={() => { if (date && groupSize) setStep(3) }}>
                Next
              </RvaButton>
            ) : (
            <button onClick={() => { if (date && groupSize) setStep(3) }} disabled={!date || !groupSize}
              className={`w-full py-3 rounded-xl text-white font-semibold transition-colors disabled:opacity-40 ${accent}`}>
              Next
            </button>
            )}
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
            {brand === 'rva' ? (
              <RvaButton type="button" disabled={!name || !email || status === 'sending'} className="w-full" onClick={handleSubmit}>
                {status === 'sending' ? 'Sending...' : 'Send Request'}
              </RvaButton>
            ) : (
            <button onClick={handleSubmit} disabled={!name || !email || status === 'sending'}
              className={`w-full py-3 rounded-xl ${accentInk} font-semibold transition-colors disabled:opacity-40 ${accent}`}>
              {status === 'sending' ? 'Sending...' : brand === 'alpenglow' ? 'Request a quote' : 'Send Request'}
            </button>
            )}
            {status === 'error' && <p className="text-sm text-red-600 text-center">Something went wrong. Please try again or call {displayPhone}.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
