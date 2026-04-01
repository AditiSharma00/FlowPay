import type { FormField } from '../../types/form'

type FieldRendererProps = {
  field: FormField
}

export function FieldRenderer({ field }: FieldRendererProps) {
  const sharedClasses =
    'w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100'

  switch (field.type) {
    case 'textarea':
      return <textarea className={`${sharedClasses} min-h-28 resize-none`} placeholder={field.placeholder} />
    case 'select':
      return (
        <select className={sharedClasses} defaultValue="">
          <option value="" disabled>
            {field.placeholder ?? 'Select an option'}
          </option>
          {field.options?.map((option) => (
            <option key={option.id} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    case 'radio':
      return (
        <div className="space-y-3 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/80 to-white p-4">
          {field.options?.map((option) => (
            <label key={option.id} className="flex items-center gap-3 text-sm text-slate-700">
              <input type="radio" name={field.name} value={option.value} className="h-4 w-4 accent-amber-500" />
              {option.label}
            </label>
          ))}
        </div>
      )
    case 'checkbox':
      return (
        <div className="space-y-3 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/80 to-white p-4">
          {field.options?.map((option) => (
            <label key={option.id} className="flex items-center gap-3 text-sm text-slate-700">
              <input type="checkbox" value={option.value} className="h-4 w-4 rounded accent-amber-500" />
              {option.label}
            </label>
          ))}
        </div>
      )
    default:
      return <input className={sharedClasses} type={field.type} placeholder={field.placeholder} />
  }
}
