import { create } from 'zustand'

import { demoForm } from '../data/demo-form'
import type { FieldOption, FieldType, FormField, FormSchema, FormStep } from '../../../types/form'

const createId = (prefix: string) => {
  const randomPart = globalThis.crypto?.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 10)
  return `${prefix}-${randomPart}`
}

const createChoiceOptions = (): FieldOption[] => [
  { id: createId('option'), label: 'Option 1', value: 'option1' },
  { id: createId('option'), label: 'Option 2', value: 'option2' },
]

const buildFieldDefaults = (type: FieldType, fieldCount: number): FormField => {
  const baseField: FormField = {
    id: createId('field'),
    type,
    name: `field${fieldCount + 1}`,
    label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
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

type FormBuilderState = {
  form: FormSchema
  selectedFieldId: string | null
  selectedStepId: string | null
  selectField: (fieldId: string | null, stepId?: string | null) => void
  createField: (type: FieldType) => void
  getSelectedField: () => FormField | null
  getSelectedStep: () => FormStep | null
}

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
  form: demoForm,
  selectedFieldId: demoForm.steps[0]?.fields[0]?.id ?? null,
  selectedStepId: demoForm.steps[0]?.id ?? null,
  selectField: (fieldId, stepId = null) => {
    set({ selectedFieldId: fieldId, selectedStepId: stepId })
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

    set({
      form: {
        ...form,
        steps: updatedSteps,
      },
      selectedStepId: targetStepId,
      selectedFieldId: insertedField?.id ?? null,
    })
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
}))
