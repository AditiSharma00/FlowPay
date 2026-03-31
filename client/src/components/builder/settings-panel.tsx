import { useFormBuilderStore } from '../../features/form-builder/store/use-form-builder-store'
import { SectionCard } from '../ui/section-card'

export function SettingsPanel() {
  const selectedField = useFormBuilderStore((state) => state.getSelectedField())

  return (
    <SectionCard
      title="Field Settings"
      description="The selected field metadata lives here. Later this becomes the editable settings panel."
      className="h-full"
    >
      {selectedField ? (
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-medium text-slate-500">Label</dt>
            <dd className="mt-1 text-slate-900">{selectedField.label}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Name</dt>
            <dd className="mt-1 text-slate-900">{selectedField.name}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Type</dt>
            <dd className="mt-1 text-slate-900 capitalize">{selectedField.type}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Required</dt>
            <dd className="mt-1 text-slate-900">{selectedField.required ? 'Yes' : 'No'}</dd>
          </div>
          {selectedField.placeholder ? (
            <div>
              <dt className="font-medium text-slate-500">Placeholder</dt>
              <dd className="mt-1 text-slate-900">{selectedField.placeholder}</dd>
            </div>
          ) : null}
          {selectedField.showIf ? (
            <div>
              <dt className="font-medium text-slate-500">Show If</dt>
              <dd className="mt-1 text-slate-900">
                {selectedField.showIf.field} {selectedField.showIf.operator} {selectedField.showIf.value}
              </dd>
            </div>
          ) : null}
        </dl>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
          Select a field from the builder canvas to inspect its settings.
        </div>
      )}
    </SectionCard>
  )
}
