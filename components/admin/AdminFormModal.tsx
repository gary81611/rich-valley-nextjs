'use client'
import { FormEvent, ReactNode } from 'react'

interface AdminFormModalProps {
  isOpen: boolean
  title: string
  onSubmit: (e: FormEvent) => void
  onClose: () => void
  loading: boolean
  children: ReactNode
}

export default function AdminFormModal({ isOpen, title, onSubmit, onClose, loading, children }: AdminFormModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/50 overflow-y-auto py-8">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {children}
          </div>
          <div className="flex gap-3 justify-end px-6 py-4 border-t border-slate-200">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
