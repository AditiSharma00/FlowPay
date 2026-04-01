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
      <div className="mb-4 rounded-[1.5rem] border border-amber-100 bg-gradient-to-br from-amber-50 via-orange-50 to-white px-4 py-3 text-sm text-amber-900 shadow-sm">
        <p className="font-medium">Fields will be added to the selected step.</p>
        <p className="mt-1 text-amber-800/80">
          Current target: <span className="font-semibold">{selectedStep?.title ?? 'No step selected'}</span>
        </p>
      </div>
      <div className="space-y-3">
        {FIELD_TYPES.map((fieldType) => (
          <button
            key={fieldType}
            type="button"
            onClick={() => createField(fieldType)}
            className="flex w-full items-center justify-between rounded-[1.25rem] border border-amber-100 bg-white/85 px-4 py-3 text-left text-sm font-medium text-slate-700 shadow-[0_16px_30px_-24px_rgba(180,83,9,0.38)] transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-50"
          >
            <span className="flex items-center gap-3">
              <PlusSquare className="h-4 w-4 text-amber-600" />
              <span className="capitalize">{fieldType}</span>
            </span>
            <GripVertical className="h-4 w-4 text-slate-400" />
          </button>
        ))}
      </div>
    </SectionCard>
  )
}
