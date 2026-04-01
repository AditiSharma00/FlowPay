import { GripVertical, PlusSquare } from 'lucide-react'

import { SectionCard } from '../ui/section-card'
import { FIELD_TYPES } from '../../lib/constants/field-types'
import { useFormBuilderStore } from '../../features/form-builder/store/use-form-builder-store'

export function FieldPalette() {
  const createField = useFormBuilderStore((state) => state.createField)
  const selectedStep = useFormBuilderStore((state) => state.getSelectedStep())

  return (
    <SectionCard
      title="Field Palette"
      description="Core field types for the first MVP of the builder."
      className="h-full"
      bodyClassName="xl:max-h-[72vh] xl:overflow-y-auto xl:pr-1"
    >
      <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        <p className="font-medium">Fields will be added to the selected step.</p>
        <p className="mt-1 text-emerald-700/80">
          Current target: <span className="font-semibold">{selectedStep?.title ?? 'No step selected'}</span>
        </p>
      </div>
      <div className="space-y-3">
        {FIELD_TYPES.map((fieldType) => (
          <button
            key={fieldType}
            type="button"
            onClick={() => createField(fieldType)}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            <span className="flex items-center gap-3">
              <PlusSquare className="h-4 w-4 text-emerald-600" />
              <span className="capitalize">{fieldType}</span>
            </span>
            <GripVertical className="h-4 w-4 text-slate-400" />
          </button>
        ))}
      </div>
    </SectionCard>
  )
}
