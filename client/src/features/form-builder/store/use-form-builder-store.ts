import { arrayMove } from '@dnd-kit/sortable'
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

type FormBuilderState = {
  form: FormSchema
  selectedFieldId: string | null
  selectedStepId: string | null
  selectField: (fieldId: string | null, stepId?: string | null) => void
  selectStep: (stepId: string) => void
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

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
  form: demoForm,
  selectedFieldId: demoForm.steps[0]?.fields[0]?.id ?? null,
  selectedStepId: demoForm.steps[0]?.id ?? null,
  selectField: (fieldId, stepId = null) => {
    set({ selectedFieldId: fieldId, selectedStepId: stepId })
  },
  selectStep: (stepId) => {
    set({
      selectedStepId: stepId,
      selectedFieldId: null,
    })
  },
  createStep: () => {
    const { form } = get()
    const newStep = buildStepDefaults(form.steps.length)

    set({
      form: {
        ...form,
        steps: [...form.steps, newStep],
      },
      selectedStepId: newStep.id,
      selectedFieldId: null,
    })
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

    set({
      form: {
        ...form,
        steps: updatedSteps,
      },
      selectedStepId: duplicatedStep.id,
      selectedFieldId: null,
    })
  },
  reorderSteps: (activeStepId, overStepId) => {
    const { form } = get()
    const activeIndex = form.steps.findIndex((step) => step.id === activeStepId)
    const overIndex = form.steps.findIndex((step) => step.id === overStepId)

    if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) return

    set({
      form: {
        ...form,
        steps: arrayMove(form.steps, activeIndex, overIndex),
      },
    })
  },
  updateSelectedStep: (key, value) => {
    const { form, selectedStepId } = get()
    if (!selectedStepId) return

    const updatedSteps = form.steps.map((step) => {
      if (step.id !== selectedStepId) return step

      return {
        ...step,
        [key]: value,
      }
    })

    set({
      form: {
        ...form,
        steps: updatedSteps,
      },
    })
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
  duplicateField: (fieldId) => {
    const { form, selectedFieldId } = get()
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

    set({
      form: {
        ...form,
        steps: updatedSteps,
      },
      selectedStepId: duplicatedStepId,
      selectedFieldId: duplicatedFieldId,
    })
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

    set({
      form: {
        ...form,
        steps: updatedSteps,
      },
      selectedStepId,
      selectedFieldId,
    })
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

    set({
      form: {
        ...form,
        steps: updatedSteps,
      },
      selectedStepId: activeStep?.id ?? null,
      selectedFieldId: nextField?.id ?? null,
    })
  },
  deleteStep: (stepId) => {
    const { form, selectedStepId } = get()
    const targetStepId = stepId ?? selectedStepId

    if (!targetStepId || form.steps.length <= 1) return

    const updatedSteps = form.steps.filter((step) => step.id !== targetStepId)
    const nextStep = updatedSteps[0] ?? null

    set({
      form: {
        ...form,
        steps: updatedSteps,
      },
      selectedStepId: nextStep?.id ?? null,
      selectedFieldId: null,
    })
  },
  updateSelectedField: (key, value) => {
    const { form, selectedFieldId } = get()
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

    set({
      form: {
        ...form,
        steps: updatedSteps,
      },
    })
  },
  addOptionToSelectedField: () => {
    const { form, selectedFieldId } = get()
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

    set({
      form: {
        ...form,
        steps: updatedSteps,
      },
    })
  },
  updateOption: (optionId, key, value) => {
    const { form, selectedFieldId } = get()
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

    set({
      form: {
        ...form,
        steps: updatedSteps,
      },
    })
  },
  removeOption: (optionId) => {
    const { form, selectedFieldId } = get()
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

    set({
      form: {
        ...form,
        steps: updatedSteps,
      },
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
