'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'

const BUCKET = 'site-media'
const MAX_BYTES = 10 * 1024 * 1024

interface Props {
  /** Storage path prefix, e.g. `guides` → `guides/1234-abc.jpg` */
  folder: string
  /** Current image URL (optional preview context) */
  value: string
  onUrlChange: (publicUrl: string) => void
  disabled?: boolean
}

export default function AdminImageUpload({ folder, value, onUrlChange, disabled }: Props) {
  const supabase = createClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pickFile = () => {
    setError(null)
    inputRef.current?.click()
  }

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPEG, PNG, WebP, or GIF).')
      return
    }
    if (file.size > MAX_BYTES) {
      setError('File is too large. Maximum size is 10 MB.')
      return
    }

    setError(null)
    setUploading(true)

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`
    const path = `${folder.replace(/^\/+|\/+$/g, '')}/${safeName}`

    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false,
    })

    if (upErr) {
      setError(
        upErr.message.includes('Bucket not found')
          ? 'Storage bucket “site-media” is missing. Run the migration SQL in Supabase (see supabase/migrations/20260412000000_site_media_storage.sql).'
          : upErr.message
      )
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    onUrlChange(data.publicUrl)
    setUploading(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="sr-only"
        aria-hidden
        tabIndex={-1}
        onChange={onFile}
      />
      <button
        type="button"
        onClick={pickFile}
        disabled={disabled || uploading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            Uploading…
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload image
          </>
        )}
      </button>
      {value && !uploading && (
        <span className="text-xs text-slate-500 truncate max-w-[200px]" title={value}>
          Using hosted URL
        </span>
      )}
      {error && <p className="text-xs text-red-600 w-full">{error}</p>}
    </div>
  )
}
