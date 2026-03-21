'use client'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'textarea' | 'number' | 'select' | 'checkbox'
  value: string | number | boolean
  onChange: (name: string, value: string | number | boolean) => void
  required?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
}

export default function FormField({ label, name, type = 'text', value, onChange, required, options, placeholder }: FormFieldProps) {
  const baseClass = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent'

  if (type === 'checkbox') {
    return (
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={value as boolean}
          onChange={(e) => onChange(name, e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
        />
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </label>
    )
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={value as string}
          onChange={(e) => onChange(name, e.target.value)}
          required={required}
          placeholder={placeholder}
          rows={3}
          className={baseClass}
        />
      ) : type === 'select' ? (
        <select
          value={value as string}
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
          value={type === 'number' ? (value as number) : (value as string)}
          onChange={(e) => onChange(name, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
          required={required}
          placeholder={placeholder}
          step={type === 'number' ? 'any' : undefined}
          className={baseClass}
        />
      )}
    </div>
  )
}
