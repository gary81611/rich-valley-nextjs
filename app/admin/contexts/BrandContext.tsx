'use client'
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type BrandFilter = 'all' | 'rva' | 'alpenglow'

interface BrandContextType {
  brand: BrandFilter
  setBrand: (b: BrandFilter) => void
}

const BrandContext = createContext<BrandContextType>({ brand: 'all', setBrand: () => {} })

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState<BrandFilter>('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('admin_brand') as BrandFilter | null
    if (saved && ['all', 'rva', 'alpenglow'].includes(saved)) {
      setBrand(saved)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('admin_brand', brand)
    }
  }, [brand, mounted])

  return (
    <BrandContext.Provider value={{ brand, setBrand }}>
      {children}
    </BrandContext.Provider>
  )
}

export const useBrand = () => useContext(BrandContext)
export type { BrandFilter }
