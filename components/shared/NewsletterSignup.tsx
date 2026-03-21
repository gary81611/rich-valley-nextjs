'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

interface NewsletterSignupProps {
  siteKey: 'rva' | 'alpenglow'
  variant: 'rva' | 'alpenglow'
}

export default function NewsletterSignup({ siteKey, variant }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const supabase = createClient()
      const { error } = await supabase.from('newsletter_subscribers').insert({ email, site_key: siteKey })
      if (error) {
        if (error.message.includes('duplicate') || error.code === '23505') {
          setStatus('success')
        } else {
          setErrorMsg(error.message)
          setStatus('error')
        }
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const isAlp = variant === 'alpenglow'
  const bgClass = isAlp ? 'bg-alp-navy' : 'bg-rva-forest'
  const accentClass = isAlp ? 'bg-alp-gold hover:bg-alp-gold-light text-alp-navy' : 'bg-rva-copper hover:bg-rva-copper-light text-white'
  const labelColor = isAlp ? 'text-alp-gold' : 'text-rva-copper-light'

  if (status === 'success') {
    return (
      <section className={`py-16 ${bgClass}`}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="font-playfair text-2xl text-white font-bold mb-2">You&apos;re In!</h3>
          <p className="text-white/70">Thanks for subscribing. We&apos;ll keep you posted on exclusive offers.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-16 ${bgClass}`}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className={`font-cormorant text-lg tracking-widest uppercase mb-4 ${labelColor}`}>Stay Connected</p>
        <h3 className="font-playfair text-3xl md:text-4xl text-white font-bold mb-4">Get Exclusive Offers</h3>
        <p className="text-white/70 mb-8">Sign up for our newsletter and be the first to know about special deals, new adventures, and seasonal offerings.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-5 py-3 rounded-full text-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${accentClass} disabled:opacity-50`}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {status === 'error' && <p className="text-red-400 text-sm mt-3">{errorMsg}</p>}
      </div>
    </section>
  )
}
