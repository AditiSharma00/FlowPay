import type { FormSchema } from '../../types/form'
import { FieldRenderer } from './field-renderer'

type FormRendererProps = {
  form: FormSchema
}

export function FormRenderer({ form }: FormRendererProps) {
  return (
    <div className="space-y-6">
      {form.steps.map((step, index) => (
        <section key={step.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
              Step {index + 1}
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{step.title}</h3>
            {step.description ? <p className="mt-2 text-sm text-slate-500">{step.description}</p> : null}
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
