import { useFormBuilderStore } from '../../features/form-builder/store/use-form-builder-store'
import { FieldPalette } from '../../components/builder/field-palette'
import { BuilderCanvas } from '../../components/builder/builder-canvas'
import { SettingsPanel } from '../../components/builder/settings-panel'
import { PreviewPanel } from '../../components/preview/preview-panel'
import { AppShell } from '../../components/layout/app-shell'

function formatSavedAt(lastSavedAt: string | null) {
  if (!lastSavedAt) {
    return 'Auto-save ready'
  }

  return `Saved ${new Date(lastSavedAt).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })}`
}

export function BuilderPage() {
  const saveDraft = useFormBuilderStore((state) => state.saveDraft)
  const createNewForm = useFormBuilderStore((state) => state.createNewForm)
  const resetToDemoForm = useFormBuilderStore((state) => state.resetToDemoForm)
  const lastSavedAt = useFormBuilderStore((state) => state.lastSavedAt)

  return (
    <AppShell
      toolbar={
        <>
          <span className="rounded-full border border-amber-100 bg-white/75 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm">
            {formatSavedAt(lastSavedAt)}
          </span>
          <button
            type="button"
            onClick={createNewForm}
            className="rounded-full border border-amber-100 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-amber-200 hover:bg-amber-50"
          >
            New form
          </button>
          <button
            type="button"
            onClick={resetToDemoForm}
            className="rounded-full border border-amber-100 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-amber-200 hover:bg-amber-50"
          >
            Reset demo
          </button>
          <button
            type="button"
            onClick={saveDraft}
            className="rounded-full bg-gradient-to-r from-amber-500 to-orange-400 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:from-amber-400 hover:to-orange-300"
          >
            Save draft
          </button>
        </>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <FieldPalette />
        <BuilderCanvas />
        <SettingsPanel />
      </div>
      <div className="mt-6">
        <PreviewPanel />
      </div>
    </AppShell>
  )
}
