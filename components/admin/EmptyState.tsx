'use client'
import Link from 'next/link'

interface EmptyStateProps {
  entity: string
}

export default function EmptyState({ entity }: EmptyStateProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-amber-800">No {entity} yet</p>
          <p className="text-xs text-amber-600 mt-1">
            Click{' '}
            <Link href="/admin" className="underline font-semibold hover:text-amber-800">
              &ldquo;Seed Default Data&rdquo; on the Dashboard
            </Link>{' '}
            to auto-populate with suggested content, or add entries manually above.
          </p>
        </div>
      </div>
    </div>
  )
}
