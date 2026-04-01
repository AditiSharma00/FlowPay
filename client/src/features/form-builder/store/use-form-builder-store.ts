import { arrayMove } from '@dnd-kit/sortable'
import { create } from 'zustand'
import { z } from 'zod'

import { demoForm } from '../data/demo-form'
import { formSchema } from '../../../lib/schema/form-schema'
import type { FieldOption, FieldType, FormField, FormSchema, FormStep } from '../../../types/form'

const STORAGE_KEY = 'flowpay.form-builder.draft.v1'
const hasBrowserStorage = typeof window !== 'undefined'

const storedSnapshotSchema = z.object({
  form: formSchema,
  selectedFieldId: z.string().nullable(),
  selectedStepId: z.string().nullable(),
  lastSavedAt: z.string().nullable(),
})

const createId = (prefix: string) => {
  const randomPart = globalThis.crypto?.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 10)
  return `${prefix}-${randomPart}`
}

const createChoiceOptions = (): FieldOption[] => [
  { id: createId('option'), label: 'Option 1', value: 'option1' },
  { id: createId('option'), label: 'Option 2', value: 'option2' },
]

const buildFieldDefaults = (type: FieldType, fieldCount: number): FormField => {
  const prettyType = type.charAt(0).toUpperCase() + type.slice(1)
  const baseField: FormField = {
    id: createId('field'),
    type,
    name: `field${fieldCount + 1}`,
    label: `New ${prettyType} Field`,
    helperText: `Help people answer your ${type} field with confidence.`,
    required: false,
  }

  if (type === 'text') {
    return {
      ...baseField,
      placeholder: 'Enter text',
    }
  }

  if (type === 'textarea') {
    return {
      ...baseField,
      placeholder: 'Write your answer',
    }
  }

  if (type === 'date') {
    return baseField
  }

  return {
    ...baseField,
    options: createChoiceOptions(),
  }
}

const cloneFieldDefinition = (field: FormField): FormField => ({
  ...field,
  id: createId('field'),
  name: `${field.name}_copy`,
  label: `${field.label} Copy`,
  options: field.options?.map((option) => ({
    ...option,
    id: createId('option'),
  })),
})

const buildStepDefaults = (stepCount: number): FormStep => ({
  id: createId('step'),
  title: `Category ${stepCount + 1}`,
  description: 'Add a short description for this step or section.',
  fields: [buildFieldDefaults('text', 0)],
})

const cloneStepDefinition = (step: FormStep): FormStep => ({
  ...step,
  id: createId('step'),
  title: `${step.title} Copy`,
  fields: step.fields.map((field) => cloneFieldDefinition(field)),
})

type EditableFieldKey = 'label' | 'name' | 'placeholder' | 'helperText' | 'required'
type EditableStepKey = 'title' | 'description'

type BuilderSnapshot = {
  form: FormSchema
  selectedFieldId: string | null
  selectedStepId: string | null
  lastSavedAt: string | null
}

type FormBuilderState = BuilderSnapshot & {
  selectField: (fieldId: string | null, stepId?: string | null) => void
  selectStep: (stepId: string) => void
  createNewForm: () => void
  resetToDemoForm: () => void
  saveDraft: () => void
  createStep: () => void
  duplicateStep: (stepId?: string) => void
  reorderSteps: (activeStepId: string, overStepId: string) => void
  updateSelectedStep: (key: EditableStepKey, value: string) => void
  createField: (type: FieldType) => void
  duplicateField: (fieldId?: string) => void
  reorderFields: (stepId: string, activeFieldId: string, overFieldId: string) => void
  deleteField: (fieldId?: string) => void
  deleteStep: (stepId?: string) => void
  updateSelectedField: (key: EditableFieldKey, value: string | boolean) => void
  addOptionToSelectedField: () => void
  updateOption: (optionId: string, key: 'label' | 'value', value: string) => void
  removeOption: (optionId: string) => void
  getSelectedField: () => FormField | null
  getSelectedStep: () => FormStep | null
}

const findFieldStep = (form: FormSchema, fieldId: string) => {
  for (const step of form.steps) {
    if (step.fields.some((field) => field.id === fieldId)) {
      return step
    }
  }

  return null
}

const normalizeSelection = (form: FormSchema, selectedStepId: string | null, selectedFieldId: string | null) => {
  const fallbackStep =
    (selectedStepId ? form.steps.find((step) => step.id === selectedStepId) : null) ?? form.steps[0] ?? null

  if (!fallbackStep) {
    return {
      selectedStepId: null,
      selectedFieldId: null,
    }
  }

  if (selectedFieldId === null) {
    return {
      selectedStepId: fallbackStep.id,
      selectedFieldId: null,
    }
  }

  const fieldStep = findFieldStep(form, selectedFieldId)
  if (fieldStep) {
    return {
      selectedStepId: fieldStep.id,
      selectedFieldId,
    }
  }

  return {
    selectedStepId: fallbackStep.id,
    selectedFieldId: fallbackStep.fields[0]?.id ?? null,
  }
}

const buildSnapshot = (
  form: FormSchema,
  selectedStepId: string | null,
  selectedFieldId: string | null,
  lastSavedAt: string | null = null,
): BuilderSnapshot => {
  const selection = normalizeSelection(form, selectedStepId, selectedFieldId)

  return {
    form,
    selectedStepId: selection.selectedStepId,
    selectedFieldId: selection.selectedFieldId,
    lastSavedAt,
  }
}

const loadSnapshot = (): BuilderSnapshot | null => {
  if (!hasBrowserStorage) {
    return null
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as unknown
    const result = storedSnapshotSchema.safeParse(parsed)

    if (!result.success) {
      return null
    }

    return buildSnapshot(
      result.data.form,
      result.data.selectedStepId,
      result.data.selectedFieldId,
      result.data.lastSavedAt,
    )
  } catch {
    return null
  }
}

const saveSnapshot = (snapshot: BuilderSnapshot) => {
  if (!hasBrowserStorage) {
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  } catch {
    // Ignore storage failures and keep the in-memory builder usable.
  }
}

const createFreshForm = (): FormSchema => ({
  id: createId('form'),
  title: 'Untitled FlowPay Form',
  description: 'Start from scratch or use the demo template to begin.',
  steps: [buildStepDefaults(0)],
})

const initialSnapshot = loadSnapshot() ?? buildSnapshot(demoForm, demoForm.steps[0]?.id ?? null, demoForm.steps[0]?.fields[0]?.id ?? null)

export const useFormBuilderStore = create<FormBuilderState>((set, get) => {
  const commit = (snapshot: BuilderSnapshot) => {
    const nextSnapshot = {
      ...snapshot,
      lastSavedAt: new Date().toISOString(),
    }

    set(nextSnapshot)
    saveSnapshot(nextSnapshot)
  }

  const commitForm = (form: FormSchema, selectedStepId: string | null, selectedFieldId: string | null) => {
    commit(buildSnapshot(form, selectedStepId, selectedFieldId))
  }

  return {
    ...initialSnapshot,
    selectField: (fieldId, stepId = null) => {
      commitForm(get().form, stepId, fieldId)
    },
    selectStep: (stepId) => {
      commitForm(get().form, stepId, null)
    },
    createNewForm: () => {
      const freshForm = createFreshForm()
      commitForm(freshForm, freshForm.steps[0]?.id ?? null, freshForm.steps[0]?.fields[0]?.id ?? null)
    },
    resetToDemoForm: () => {
      commitForm(demoForm, demoForm.steps[0]?.id ?? null, demoForm.steps[0]?.fields[0]?.id ?? null)
    },
    saveDraft: () => {
      const { form, selectedFieldId, selectedStepId } = get()
      commit({ form, selectedFieldId, selectedStepId, lastSavedAt: get().lastSavedAt })
    },
    createStep: () => {
      const { form } = get()
      const newStep = buildStepDefaults(form.steps.length)

      commitForm(
        {
          ...form,
          steps: [...form.steps, newStep],
        },
        newStep.id,
        null,
      )
    },
    duplicateStep: (stepId) => {
      const { form, selectedStepId } = get()
      const targetStepId = stepId ?? selectedStepId
      const targetIndex = form.steps.findIndex((step) => step.id === targetStepId)

      if (targetIndex === -1) return

      const sourceStep = form.steps[targetIndex]
      const duplicatedStep = cloneStepDefinition(sourceStep)
      const updatedSteps = [...form.steps]
      updatedSteps.splice(targetIndex + 1, 0, duplicatedStep)

      commitForm(
        {
          ...form,
          steps: updatedSteps,
        },
        duplicatedStep.id,
        null,
      )
    },
    reorderSteps: (activeStepId, overStepId) => {
      const { form, selectedFieldId, selectedStepId } = get()
      const activeIndex = form.steps.findIndex((step) => step.id === activeStepId)
      const overIndex = form.steps.findIndex((step) => step.id === overStepId)

      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return

      commitForm(
        {
          ...form,
          steps: arrayMove(form.steps, activeIndex, overIndex),
        },
        selectedStepId,
        selectedFieldId,
      )
    },
    updateSelectedStep: (key, value) => {
      const { form, selectedStepId, selectedFieldId } = get()
      if (!selectedStepId) return

      const updatedSteps = form.steps.map((step) => {
        if (step.id !== selectedStepId) return step

        return {
          ...step,
          [key]: value,
        }
      })

      commitForm(
        {
          ...form,
          steps: updatedSteps,
        },
        selectedStepId,
        selectedFieldId,
      )
    },
    createField: (type) => {
      const { form, selectedStepId } = get()
      const fallbackStepId = form.steps[0]?.id ?? null
      const targetStepId = selectedStepId ?? fallbackStepId

      if (!targetStepId) {
        return
      }

      const updatedSteps = form.steps.map((step) => {
        if (step.id !== targetStepId) {
          return step
        }

        const newField = buildFieldDefaults(type, step.fields.length)

        return {
          ...step,
          fields: [...step.fields, newField],
        }
      })

      const insertedStep = updatedSteps.find((step) => step.id === targetStepId)
      const insertedField = insertedStep?.fields.at(-1) ?? null

      commitForm(
        {
          ...form,
          steps: updatedSteps,
        },
        targetStepId,
        insertedField?.id ?? null,
      )
    },
    duplicateField: (fieldId) => {
      const { form, selectedFieldId, selectedStepId } = get()
      const targetFieldId = fieldId ?? selectedFieldId

      if (!targetFieldId) return

      let duplicatedFieldId: string | null = null
      let duplicatedStepId: string | null = null

      const updatedSteps = form.steps.map((step) => {
        const fieldIndex = step.fields.findIndex((field) => field.id === targetFieldId)

        if (fieldIndex === -1) {
          return step
        }

        const duplicatedField = cloneFieldDefinition(step.fields[fieldIndex])
        const updatedFields = [...step.fields]
        updatedFields.splice(fieldIndex + 1, 0, duplicatedField)
        duplicatedFieldId = duplicatedField.id
        duplicatedStepId = step.id

        return {
          ...step,
          fields: updatedFields,
        }
      })

      commitForm(
        {
          ...form,
          steps: updatedSteps,
        },
        duplicatedStepId ?? selectedStepId,
        duplicatedFieldId,
      )
    },
    reorderFields: (stepId, activeFieldId, overFieldId) => {
      const { form, selectedStepId, selectedFieldId } = get()

      const updatedSteps = form.steps.map((step) => {
        if (step.id !== stepId) {
          return step
        }

        const activeIndex = step.fields.findIndex((field) => field.id === activeFieldId)
        const overIndex = step.fields.findIndex((field) => field.id === overFieldId)

        if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
          return step
        }

        return {
          ...step,
          fields: arrayMove(step.fields, activeIndex, overIndex),
        }
      })

      commitForm(
        {
          ...form,
          steps: updatedSteps,
        },
        selectedStepId,
        selectedFieldId,
      )
    },
    deleteField: (fieldId) => {
      const { form, selectedFieldId, selectedStepId } = get()
      const targetFieldId = fieldId ?? selectedFieldId

      if (!targetFieldId) return

      const updatedSteps = form.steps.map((step) => ({
        ...step,
        fields: step.fields.filter((field) => field.id !== targetFieldId),
      }))

      const activeStep = updatedSteps.find((step) => step.id === selectedStepId) ?? updatedSteps[0] ?? null
      const nextField = activeStep?.fields[0] ?? null

      commitForm(
        {
          ...form,
          steps: updatedSteps,
        },
        activeStep?.id ?? null,
        nextField?.id ?? null,
      )
    },
    deleteStep: (stepId) => {
      const { form, selectedStepId } = get()
      const targetStepId = stepId ?? selectedStepId

      if (!targetStepId || form.steps.length <= 1) return

      const updatedSteps = form.steps.filter((step) => step.id !== targetStepId)
      const nextStep = updatedSteps[0] ?? null

      commitForm(
        {
          ...form,
          steps: updatedSteps,
        },
        nextStep?.id ?? null,
        nextStep?.fields[0]?.id ?? null,
      )
    },
    updateSelectedField: (key, value) => {
      const { form, selectedFieldId, selectedStepId } = get()
      if (!selectedFieldId) return

      const updatedSteps = form.steps.map((step) => ({
        ...step,
        fields: step.fields.map((field) => {
          if (field.id !== selectedFieldId) return field

          return {
            ...field,
            [key]: value,
          }
        }),
      }))

      commitForm(
        {
          ...form,
          steps: updatedSteps,
        },
        selectedStepId,
        selectedFieldId,
      )
    },
    addOptionToSelectedField: () => {
      const { form, selectedFieldId, selectedStepId } = get()
      if (!selectedFieldId) return

      const updatedSteps = form.steps.map((step) => ({
        ...step,
        fields: step.fields.map((field) => {
          if (field.id !== selectedFieldId) return field

          const nextIndex = (field.options?.length ?? 0) + 1
          const nextOption: FieldOption = {
            id: createId('option'),
            label: `Option ${nextIndex}`,
            value: `option${nextIndex}`,
          }

          return {
            ...field,
            options: [...(field.options ?? []), nextOption],
          }
        }),
      }))

      commitForm(
        {
          ...form,
          steps: updatedSteps,
        },
        selectedStepId,
        selectedFieldId,
      )
    },
    updateOption: (optionId, key, value) => {
      const { form, selectedFieldId, selectedStepId } = get()
      if (!selectedFieldId) return

      const updatedSteps = form.steps.map((step) => ({
        ...step,
        fields: step.fields.map((field) => {
          if (field.id !== selectedFieldId) return field

          return {
            ...field,
            options: (field.options ?? []).map((option) =>
              option.id === optionId
                ? {
                    ...option,
                    [key]: value,
                  }
                : option,
            ),
          }
        }),
      }))

      commitForm(
        {
          ...form,
          steps: updatedSteps,
        },
        selectedStepId,
        selectedFieldId,
      )
    },
    removeOption: (optionId) => {
      const { form, selectedFieldId, selectedStepId } = get()
      if (!selectedFieldId) return

      const updatedSteps = form.steps.map((step) => ({
        ...step,
        fields: step.fields.map((field) => {
          if (field.id !== selectedFieldId) return field

          return {
            ...field,
            options: (field.options ?? []).filter((option) => option.id !== optionId),
          }
        }),
      }))

      commitForm(
        {
          ...form,
          steps: updatedSteps,
        },
        selectedStepId,
        selectedFieldId,
      )
    },
    getSelectedField: () => {
      const { form, selectedFieldId } = get()
      if (!selectedFieldId) return null

      for (const step of form.steps) {
        const field = step.fields.find((item) => item.id === selectedFieldId)
        if (field) return field
      }

      return null
    },
    getSelectedStep: () => {
      const { form, selectedStepId } = get()
      if (!selectedStepId) return form.steps[0] ?? null

      return form.steps.find((step) => step.id === selectedStepId) ?? null
    },
  }
})
