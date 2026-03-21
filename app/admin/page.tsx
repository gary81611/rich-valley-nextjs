'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

interface StatCard {
  label: string
  count: number
  href: string
  addHref: string
  addLabel: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchCounts() {
      const tables = [
        { table: 'adventures', label: 'Adventures', href: '/admin/adventures' },
        { table: 'services', label: 'Services', href: '/admin/services' },
        { table: 'fleet_vehicles', label: 'Fleet Vehicles', href: '/admin/fleet' },
        { table: 'testimonials', label: 'Testimonials', href: '/admin/testimonials' },
        { table: 'gallery_images', label: 'Gallery Images', href: '/admin/gallery' },
        { table: 'faqs', label: 'FAQs', href: '/admin/faqs' },
      ]

      const results = await Promise.all(
        tables.map(async (t) => {
          const { count } = await supabase.from(t.table).select('id', { count: 'exact', head: true })
          return {
            label: t.label,
            count: count ?? 0,
            href: t.href,
            addHref: t.href,
            addLabel: `Add ${t.label.replace(/s$/, '')}`,
          }
        })
      )

      setStats(results)
      setLoading(false)
    }

    fetchCounts()
  }, [supabase])

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
      <p className="text-slate-500 text-sm mb-8">Welcome to the admin panel for Rich Valley Adventures & Aspen Alpenglow Limousine.</p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-600">{stat.label}</h3>
                <span className="text-2xl font-bold text-slate-900">{stat.count}</span>
              </div>
              <div className="flex gap-2">
                <Link href={stat.href} className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200">
                  View All
                </Link>
                <Link href={stat.addHref} className="text-xs font-medium text-white bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-900">
                  {stat.addLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
