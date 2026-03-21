'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { seedAllTables } from '@/lib/seed'
import { BrandProvider, useBrand } from './contexts/BrandContext'
import type { BrandFilter } from './contexts/BrandContext'

interface NavItem {
  name: string
  href: string
  icon: string
  badge?: 'rva' | 'alpenglow'
}

interface NavGroup {
  label: string | null
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: null,
    items: [
      { name: 'Overview', href: '/admin', icon: 'home' },
    ],
  },
  {
    label: 'YOUR SITES',
    items: [
      { name: 'Branding & Info', href: '/admin/settings', icon: 'settings' },
      { name: 'Adventures', href: '/admin/adventures', icon: 'compass', badge: 'rva' },
      { name: 'Transportation', href: '/admin/services', icon: 'briefcase', badge: 'alpenglow' },
      { name: 'Fleet & Vehicles', href: '/admin/fleet', icon: 'truck', badge: 'alpenglow' },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { name: 'Blog Generator', href: '/admin/blog', icon: 'pencil' },
      { name: 'Photo Gallery', href: '/admin/gallery', icon: 'image' },
      { name: 'Testimonials & Reviews', href: '/admin/testimonials', icon: 'star' },
      { name: 'FAQs', href: '/admin/faqs', icon: 'help' },
      { name: 'Service Areas', href: '/admin/service-areas', icon: 'map' },
    ],
  },
  {
    label: 'CUSTOMERS',
    items: [
      { name: 'Contact Inquiries', href: '/admin/contacts', icon: 'phone' },
      { name: 'Newsletter', href: '/admin/newsletter', icon: 'mail' },
    ],
  },
  {
    label: 'SEARCH & VISIBILITY',
    items: [
      { name: 'SEO Settings', href: '/admin/seo', icon: 'search' },
    ],
  },
]

const iconPaths: Record<string, string> = {
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
  compass: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  briefcase: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  truck: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
  star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  image: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  help: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  map: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
  mail: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  phone: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  pencil: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
}

function BrandToggle() {
  const { brand, setBrand } = useBrand()
  const labels: Record<BrandFilter, string> = { all: 'Both Sites', rva: 'RVA Only', alpenglow: 'Alpenglow Only' }
  return (
    <select
      value={brand}
      onChange={(e) => setBrand(e.target.value as BrandFilter)}
      className="w-full mt-2 px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500"
    >
      <option value="all">{labels.all}</option>
      <option value="rva">{labels.rva}</option>
      <option value="alpenglow">{labels.alpenglow}</option>
    </select>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false)
      return
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace('/admin/login')
      } else {
        setLoading(false)
        // Auto-seed on first login
        const hasSeeded = localStorage.getItem('admin_seeded')
        if (!hasSeeded) {
          supabase.from('adventures').select('id', { count: 'exact', head: true }).then(({ count }) => {
            if (!count || count === 0) {
              seedAllTables(supabase).then(() => {
                localStorage.setItem('admin_seeded', 'true')
              })
            } else {
              localStorage.setItem('admin_seeded', 'true')
            }
          })
        }
      }
    })
  }, [pathname, router, supabase])

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }, [supabase.auth, router])

  if (pathname === '/admin/login') return <>{children}</>

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <BrandProvider>
      <div className="min-h-screen bg-slate-50">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between bg-slate-900 text-white px-4 py-3">
          <span className="font-semibold text-sm">Admin Panel</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:min-h-screen overflow-y-auto flex flex-col`}>
            <div className="p-5 border-b border-slate-700">
              <h1 className="font-bold text-base">Admin Panel</h1>
              <BrandToggle />
            </div>
            <nav className="flex-1 p-3">
              {navGroups.map((group, gi) => (
                <div key={gi} className={gi > 0 ? 'mt-5' : ''}>
                  {group.label && (
                    <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest uppercase text-slate-500">
                      {group.label}
                    </p>
                  )}
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                            isActive
                              ? 'bg-slate-700 text-white'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPaths[item.icon] || iconPaths.home} />
                          </svg>
                          <span className="flex-1">{item.name}</span>
                          {item.badge && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                              item.badge === 'rva' ? 'bg-green-900/50 text-green-400' : 'bg-amber-900/50 text-amber-400'
                            }`}>
                              {item.badge === 'rva' ? 'RVA' : 'ALP'}
                            </span>
                          )}
                        </a>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>
            <div className="p-3 border-t border-slate-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </aside>

          {/* Overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}

          {/* Main content */}
          <main className="flex-1 p-6 lg:p-8 min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </BrandProvider>
  )
}
