import type { FormSchema } from '../../types/form'
import { FieldRenderer } from './field-renderer'

type FormRendererProps = {
  form: FormSchema
}

export function FormRenderer({ form }: FormRendererProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-amber-100 bg-gradient-to-br from-amber-50 via-orange-50 to-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Merchant onboarding</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{form.title}</h3>
        {form.description ? <p className="mt-2 max-w-2xl text-sm text-slate-500">{form.description}</p> : null}
      </div>

      {form.steps.map((step, index) => (
        <section key={step.id} className="rounded-[1.75rem] border border-amber-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(180,83,9,0.35)]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-500">Step {index + 1}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{step.title}</h3>
              {step.description ? <p className="mt-2 text-sm text-slate-500">{step.description}</p> : null}
            </div>
            <div className="hidden rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 sm:inline-flex">
              {step.fields.length} fields
            </div>
          </div>
          <div className="space-y-5">
            {step.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="block text-sm font-medium text-slate-800">
                  {field.label}
                  {field.required ? <span className="ml-1 text-rose-500">*</span> : null}
                </label>
                <FieldRenderer field={field} />
                {field.helperText ? <p className="text-xs text-slate-500">{field.helperText}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
