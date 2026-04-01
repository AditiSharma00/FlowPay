import { z } from 'zod'

const fieldOptionSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  value: z.string().min(1),
})

const showIfRuleSchema = z.object({
  field: z.string().min(1),
  operator: z.enum(['equals', 'notEquals', 'includes']),
  value: z.string(),
})

const fieldSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'textarea', 'select', 'radio', 'checkbox', 'date']),
  name: z.string().min(1),
  label: z.string().min(1),
  helperText: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  options: z.array(fieldOptionSchema).optional(),
  showIf: showIfRuleSchema.optional(),
})

const stepSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  fields: z.array(fieldSchema),
})

export const formSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  steps: z.array(stepSchema).min(1),
})

export type FormSchemaInput = z.infer<typeof formSchema>
