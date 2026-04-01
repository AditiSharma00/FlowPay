import { useFormBuilderStore } from '../../features/form-builder/store/use-form-builder-store'
import { FormRenderer } from '../renderer/form-renderer'
import { SectionCard } from '../ui/section-card'

export function PreviewPanel() {
  const form = useFormBuilderStore((state) => state.form)

  return (
    <SectionCard
      title="Live Preview"
      description="The preview uses the same schema shape the runtime renderer will use in production."
    >
      <FormRenderer form={form} />
    </SectionCard>
  )
}
