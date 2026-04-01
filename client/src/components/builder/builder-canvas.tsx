import type { DragEndEvent } from '@dnd-kit/core'
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Copy, GripVertical, PlusSquare, Trash2 } from 'lucide-react'

import { useFormBuilderStore } from '../../features/form-builder/store/use-form-builder-store'
import type { FormField, FormStep } from '../../types/form'
import { SectionCard } from '../ui/section-card'

type SortableStepCardProps = {
  step: FormStep
  index: number
  totalSteps: number
  selectedFieldId: string | null
  selectedStepId: string | null
  onSelectField: (fieldId: string | null, stepId?: string | null) => void
  onSelectStep: (stepId: string) => void
  onDuplicateStep: (stepId: string) => void
  onDuplicateField: (fieldId: string) => void
  onDeleteField: (fieldId: string) => void
  onDeleteStep: (stepId: string) => void
}

type SortableFieldCardProps = {
  field: FormField
  stepId: string
  isSelected: boolean
  onSelectField: (fieldId: string, stepId: string) => void
  onDuplicateField: (fieldId: string) => void
  onDeleteField: (fieldId: string) => void
}

function SortableFieldCard({
  field,
  stepId,
  isSelected,
  onSelectField,
  onDuplicateField,
  onDeleteField,
}: SortableFieldCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
    data: {
      type: 'field',
      stepId,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        'rounded-2xl border bg-white/90 p-4 text-left transition',
        isSelected ? 'border-amber-300 ring-2 ring-amber-100' : 'border-amber-100 hover:border-amber-200',
        isDragging ? 'opacity-70 shadow-lg' : '',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <button
            type="button"
            className="mt-0.5 rounded-full p-2 text-slate-400 transition hover:bg-amber-50 hover:text-amber-700"
            aria-label={`Reorder ${field.label}`}
            title="Drag to reorder"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onSelectField(field.id, stepId)} className="min-w-0 flex-1 text-left">
            <div>
              <p className="text-sm font-semibold text-slate-900">{field.label}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">{field.type}</p>
            </div>
            {field.placeholder ? <p className="mt-3 text-sm text-slate-500">Placeholder: {field.placeholder}</p> : null}
          </button>
        </div>
        <div className="flex items-center gap-2">
          {field.required ? (
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600">Required</span>
          ) : null}
          <button
            type="button"
            onClick={() => onDuplicateField(field.id)}
            className="rounded-full p-2 text-slate-400 transition hover:bg-amber-50 hover:text-amber-700"
            aria-label={`Duplicate ${field.label}`}
            title="Duplicate question"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDeleteField(field.id)}
            className="rounded-full p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
            aria-label={`Delete ${field.label}`}
            title="Delete question"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function SortableStepCard({
  step,
  index,
  totalSteps,
  selectedFieldId,
  selectedStepId,
  onSelectField,
  onSelectStep,
  onDuplicateStep,
  onDuplicateField,
  onDeleteField,
  onDeleteStep,
}: SortableStepCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: step.id,
    data: {
      type: 'step',
      stepId: step.id,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isStepSelected = selectedStepId === step.id

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        'rounded-[2rem] border p-4 transition',
        isStepSelected ? 'border-amber-300 bg-amber-50/60' : 'border-amber-100 bg-white/70',
        isDragging ? 'opacity-75 shadow-lg' : '',
      ].join(' ')}
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <button
            type="button"
            className="mt-0.5 rounded-full p-2 text-slate-400 transition hover:bg-white hover:text-amber-700"
            aria-label={`Reorder ${step.title}`}
            title="Drag to reorder"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onSelectStep(step.id)} className="min-w-0 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Category {index + 1}</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{step.title}</h3>
            {step.description ? <p className="mt-1 text-sm text-slate-500">{step.description}</p> : null}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-amber-100 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
            {step.fields.length} questions
          </span>
          <button
            type="button"
            onClick={() => onDuplicateStep(step.id)}
            className="rounded-full p-2 text-slate-400 transition hover:bg-amber-50 hover:text-amber-700"
            aria-label={`Duplicate ${step.title}`}
            title="Duplicate category"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDeleteStep(step.id)}
            disabled={totalSteps <= 1}
            className="rounded-full p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Delete ${step.title}`}
            title={totalSteps <= 1 ? 'At least one category is required' : 'Delete category'}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <SortableContext items={step.fields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {step.fields.map((field) => (
            <SortableFieldCard
              key={field.id}
              field={field}
              stepId={step.id}
              isSelected={selectedFieldId === field.id}
              onSelectField={onSelectField}
              onDuplicateField={onDuplicateField}
              onDeleteField={onDeleteField}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export function BuilderCanvas() {
  const form = useFormBuilderStore((state) => state.form)
  const selectedFieldId = useFormBuilderStore((state) => state.selectedFieldId)
  const selectedStepId = useFormBuilderStore((state) => state.selectedStepId)
  const selectField = useFormBuilderStore((state) => state.selectField)
  const selectStep = useFormBuilderStore((state) => state.selectStep)
  const createStep = useFormBuilderStore((state) => state.createStep)
  const duplicateStep = useFormBuilderStore((state) => state.duplicateStep)
  const reorderSteps = useFormBuilderStore((state) => state.reorderSteps)
  const duplicateField = useFormBuilderStore((state) => state.duplicateField)
  const reorderFields = useFormBuilderStore((state) => state.reorderFields)
  const deleteField = useFormBuilderStore((state) => state.deleteField)
  const deleteStep = useFormBuilderStore((state) => state.deleteStep)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  )

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return
    }

    const activeType = active.data.current?.type
    const overType = over.data.current?.type

    if (activeType === 'step' && overType === 'step') {
      reorderSteps(String(active.id), String(over.id))
      return
    }

    if (activeType === 'field' && overType === 'field') {
      const activeStepId = active.data.current?.stepId
      const overStepId = over.data.current?.stepId

      if (!activeStepId || activeStepId !== overStepId) {
        return
      }

      reorderFields(String(activeStepId), String(active.id), String(over.id))
    }
  }

  return (
    <SectionCard
      title="Builder Canvas"
      description="Click to edit, drag to reorder, duplicate common structure, and remove questions or categories without losing flow."
      className="h-full"
      bodyClassName="xl:max-h-[72vh] xl:overflow-y-auto xl:pr-1"
      action={
        <button
          type="button"
          onClick={createStep}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:from-amber-400 hover:to-orange-300"
        >
          <PlusSquare className="h-4 w-4" />
          Add category
        </button>
      }
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={form.steps.map((step) => step.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-6">
            {form.steps.map((step, index) => (
              <SortableStepCard
                key={step.id}
                step={step}
                index={index}
                totalSteps={form.steps.length}
                selectedFieldId={selectedFieldId}
                selectedStepId={selectedStepId}
                onSelectField={selectField}
                onSelectStep={selectStep}
                onDuplicateStep={duplicateStep}
                onDuplicateField={duplicateField}
                onDeleteField={deleteField}
                onDeleteStep={deleteStep}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </SectionCard>
  )
}
