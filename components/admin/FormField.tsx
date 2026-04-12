'use client'
import Image from 'next/image'
import AdminImageUpload from '@/components/admin/AdminImageUpload'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'textarea' | 'number' | 'select' | 'checkbox'
  value: string | number | boolean
  onChange: (name: string, value: string | number | boolean) => void
  required?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
  help?: string
  preview?: string
  maxLength?: number
  /** When set, shows “Upload image” (Supabase Storage `site-media` bucket). User can still paste a URL. */
  uploadFolder?: string
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required,
  options,
  placeholder,
  help,
  preview,
  maxLength,
  uploadFolder,
}: FormFieldProps) {
  const baseClass = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent'
  const strValue = typeof value === 'string' ? value : ''
  const showCharCount = maxLength && typeof value === 'string'
  const overLimit = showCharCount && strValue.length > maxLength

  if (type === 'checkbox') {
    return (
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={value as boolean}
            onChange={(e) => onChange(name, e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
          />
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </label>
        {help && <p className="text-xs text-slate-400 mt-1 ml-7">{help}</p>}
      </div>
    )
  }

  // Show image preview for URL fields that look like image paths
  const isImageField =
    name.includes('image') ||
    name === 'url' ||
    name === 'logo_url' ||
    name === 'photo_url' ||
    name === 'og_image_url' ||
    name === 'hero_image_url'
  const showImagePreview = isImageField && strValue.length > 0
  const showUpload = Boolean(uploadFolder) && type !== 'select' && type !== 'number'

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {help && <p className="text-xs text-slate-400">{help}</p>}
      {showUpload && uploadFolder && (
        <div className="mt-1.5 mb-1">
          <AdminImageUpload
            folder={uploadFolder}
            value={strValue}
            onUrlChange={(url) => onChange(name, url)}
          />
          <p className="text-[11px] text-slate-400 mt-1">Or paste an external URL below.</p>
        </div>
      )}
      {type === 'textarea' ? (
        <textarea
          value={strValue}
          onChange={(e) => onChange(name, e.target.value)}
          required={required}
          placeholder={placeholder}
          rows={3}
          className={baseClass}
        />
      ) : type === 'select' ? (
        <select
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(name, e.target.value)}
          required={required}
          className={baseClass}
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={type === 'number' ? (value as number) : strValue}
          onChange={(e) => onChange(name, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
          required={required}
          placeholder={placeholder}
          step={type === 'number' ? 'any' : undefined}
          className={baseClass}
        />
      )}
      <div className="flex items-center justify-between gap-2">
        {preview && (
          <p className="text-xs text-blue-500 mt-0.5">Shows on: {preview}</p>
        )}
        {showCharCount && (
          <p className={`text-xs mt-0.5 ml-auto ${overLimit ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
            {strValue.length}/{maxLength}
          </p>
        )}
      </div>
      {showImagePreview && (
        <div className="mt-1.5 relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
          <Image src={strValue} alt="Preview" fill className="object-contain" unoptimized />
        </div>
      )}
    </div>
  )
}
