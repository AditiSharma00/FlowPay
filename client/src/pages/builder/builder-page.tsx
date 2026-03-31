import { FieldPalette } from '../../components/builder/field-palette'
import { BuilderCanvas } from '../../components/builder/builder-canvas'
import { SettingsPanel } from '../../components/builder/settings-panel'
import { PreviewPanel } from '../../components/preview/preview-panel'
import { AppShell } from '../../components/layout/app-shell'

export function BuilderPage() {
  return (
    <AppShell>
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
