import { FIELD_TYPES } from '../lib/constants/field-types'

export type FieldType = (typeof FIELD_TYPES)[number]

export type FieldOption = {
  id: string
  label: string
  value: string
}

export type ShowIfRule = {
  field: string
  operator: 'equals' | 'notEquals' | 'includes'
  value: string
}

export type FormField = {
  id: string
  type: FieldType
  name: string
  label: string
  helperText?: string
  placeholder?: string
  required?: boolean
  options?: FieldOption[]
  showIf?: ShowIfRule
}

export type FormStep = {
  id: string
  title: string
  description?: string
  fields: FormField[]
}

export type FormSchema = {
  id: string
  title: string
  description?: string
  steps: FormStep[]
}
