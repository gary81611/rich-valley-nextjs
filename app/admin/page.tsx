'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

interface Counts {
  adventures: number
  services: number
  fleet: number
  testimonials: number
  gallery: number
  faqs: number
  serviceAreas: number
  contacts: number
  newsletter: number
  newContacts: number
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchCounts() {
      const [adv, svc, fleet, test, gal, faq, sa, cont, nl, newCont] = await Promise.all([
        supabase.from('adventures').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('fleet_vehicles').select('id', { count: 'exact', head: true }),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }),
        supabase.from('gallery_images').select('id', { count: 'exact', head: true }),
        supabase.from('faqs').select('id', { count: 'exact', head: true }),
        supabase.from('service_areas').select('id', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
        supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      ])
      setCounts({
        adventures: adv.count ?? 0, services: svc.count ?? 0, fleet: fleet.count ?? 0,
        testimonials: test.count ?? 0, gallery: gal.count ?? 0, faqs: faq.count ?? 0,
        serviceAreas: sa.count ?? 0, contacts: cont.count ?? 0, newsletter: nl.count ?? 0,
        newContacts: newCont.count ?? 0,
      })
      setLoading(false)
    }
    fetchCounts()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
      </div>
    )
  }

  const c = counts!

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
      <p className="text-slate-500 text-sm mb-8">Here&apos;s what&apos;s happening across both sites.</p>

      {/* Brand summary cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* RVA Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Rich Valley Adventures</h2>
              <p className="text-xs text-slate-400">richvalleyadventures.com</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{c.adventures}</div>
              <div className="text-xs text-slate-500">Adventures</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{c.testimonials}</div>
              <div className="text-xs text-slate-500">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{c.gallery}</div>
              <div className="text-xs text-slate-500">Photos</div>
            </div>
          </div>
          <a href="https://richvalleyadventures.com" target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 font-medium hover:text-green-800 inline-flex items-center gap-1">
            Visit Site
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>

        {/* Alpenglow Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Aspen Alpenglow Limousine</h2>
              <p className="text-xs text-slate-400">aspenalpenglowlimousine.com</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{c.services}</div>
              <div className="text-xs text-slate-500">Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{c.fleet}</div>
              <div className="text-xs text-slate-500">Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{c.serviceAreas}</div>
              <div className="text-xs text-slate-500">Areas</div>
            </div>
          </div>
          <a href="https://aspenalpenglowlimousine.com" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 font-medium hover:text-blue-800 inline-flex items-center gap-1">
            Visit Site
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>
      </div>

      {/* Activity + Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-sm text-slate-900">
                  <span className="font-medium">{c.newContacts} new</span> contact {c.newContacts === 1 ? 'inquiry' : 'inquiries'}
                </p>
                <p className="text-xs text-slate-400">{c.contacts} total submissions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
              </div>
              <div>
                <p className="text-sm text-slate-900">
                  <span className="font-medium">{c.newsletter}</span> newsletter {c.newsletter === 1 ? 'subscriber' : 'subscribers'}
                </p>
                <p className="text-xs text-slate-400">Across both sites</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="text-sm text-slate-900"><span className="font-medium">{c.faqs}</span> FAQs published</p>
                <p className="text-xs text-slate-400">Shown on sites + Google search</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/adventures" className="flex items-center gap-2.5 px-4 py-3 bg-slate-50 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200">
              <span className="text-green-600">+</span> Add Adventure
            </Link>
            <Link href="/admin/services" className="flex items-center gap-2.5 px-4 py-3 bg-slate-50 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200">
              <span className="text-blue-600">+</span> Add Service
            </Link>
            <Link href="/admin/testimonials" className="flex items-center gap-2.5 px-4 py-3 bg-slate-50 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200">
              <span className="text-amber-600">+</span> Add Review
            </Link>
            <Link href="/admin/gallery" className="flex items-center gap-2.5 px-4 py-3 bg-slate-50 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200">
              <span className="text-purple-600">+</span> Add Photo
            </Link>
          </div>
          {c.newContacts > 0 && (
            <Link href="/admin/contacts" className="mt-4 flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm font-medium text-amber-800 hover:bg-amber-100 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
              {c.newContacts} new {c.newContacts === 1 ? 'inquiry' : 'inquiries'} to review
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
