import { useFormBuilderStore } from '../../features/form-builder/store/use-form-builder-store'
import { FormRenderer } from '../renderer/form-renderer'
import { SectionCard } from '../ui/section-card'

export function PreviewPanel() {
  const form = useFormBuilderStore((state) => state.form)

  return (
    <SectionCard
      title="Live Preview"
      description="The preview uses the same schema shape the runtime renderer will use in production."
      className="overflow-hidden"
      bodyClassName="xl:max-h-[78vh] xl:overflow-y-auto xl:pr-1"
    >
      <div className="rounded-[2rem] border border-amber-100 bg-gradient-to-b from-white via-amber-50/70 to-orange-50/70 p-4 shadow-[0_24px_70px_-48px_rgba(180,83,9,0.45)]">
        <div className="mb-4 flex items-center justify-between rounded-[1.25rem] border border-amber-100 bg-white/80 px-4 py-3 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Public preview</p>
            <p className="mt-1 text-sm text-slate-500">This is how the form can feel to the end user.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-orange-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-rose-200" />
          </div>
        </div>
        <div className="rounded-[1.75rem] bg-white p-4 shadow-[0_24px_60px_-40px_rgba(180,83,9,0.4)]">
          <FormRenderer form={form} />
        </div>
      </div>
    </SectionCard>
  )
}
