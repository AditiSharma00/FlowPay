import { useFormBuilderStore } from '../../features/form-builder/store/use-form-builder-store'
import { SectionCard } from '../ui/section-card'

export function BuilderCanvas() {
  const form = useFormBuilderStore((state) => state.form)
  const selectedFieldId = useFormBuilderStore((state) => state.selectedFieldId)
  const selectField = useFormBuilderStore((state) => state.selectField)

  return (
    <SectionCard
      title="Builder Canvas"
      description="This is where the step structure and field ordering will evolve into the visual builder."
      className="h-full"
    >
      <div className="space-y-6">
        {form.steps.map((step) => (
          <div key={step.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Step</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">{step.title}</h3>
              {step.description ? <p className="mt-1 text-sm text-slate-500">{step.description}</p> : null}
            </div>
            <div className="space-y-3">
              {step.fields.map((field) => {
                const isSelected = selectedFieldId === field.id

                return (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => selectField(field.id, step.id)}
                    className={[
                      'w-full rounded-2xl border bg-white p-4 text-left transition',
                      isSelected
                        ? 'border-emerald-400 ring-2 ring-emerald-200'
                        : 'border-slate-200 hover:border-slate-300',
                    ].join(' ')}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{field.label}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                          {field.type}
                        </p>
                      </div>
                      {field.required ? (
                        <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600">
                          Required
                        </span>
                      ) : null}
                    </div>
                    {field.placeholder ? (
                      <p className="mt-3 text-sm text-slate-500">Placeholder: {field.placeholder}</p>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
