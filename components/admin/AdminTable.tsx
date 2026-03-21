'use client'

export interface Column<T> {
  key: keyof T | 'actions'
  label: string
  render?: (item: T) => React.ReactNode
}

interface AdminTableProps<T extends { id: string }> {
  columns: Column<T>[]
  data: T[]
  onEdit: (item: T) => void
  onDelete: (item: T) => void
  onToggleActive?: (item: T) => void
}

export default function AdminTable<T extends { id: string; is_active?: boolean }>({
  columns,
  data,
  onEdit,
  onDelete,
  onToggleActive,
}: AdminTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            {columns.map((col) => (
              <th key={String(col.key)} className="text-left px-4 py-3 text-slate-600 font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-slate-400">
                No records found.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3">
                    {col.key === 'actions' ? (
                      <div className="flex gap-2">
                        <button onClick={() => onEdit(item)} className="text-slate-600 hover:text-slate-900 text-xs font-medium px-2 py-1 bg-slate-100 rounded">
                          Edit
                        </button>
                        {onToggleActive && (
                          <button
                            onClick={() => onToggleActive(item)}
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              item.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {item.is_active ? 'Active' : 'Inactive'}
                          </button>
                        )}
                        <button onClick={() => onDelete(item)} className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 bg-red-50 rounded">
                          Delete
                        </button>
                      </div>
                    ) : col.render ? (
                      col.render(item)
                    ) : (
                      String(item[col.key as keyof T] ?? '')
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
