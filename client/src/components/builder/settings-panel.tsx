import { useEffect, useMemo, useState } from 'react'
import { Copy, Layers3, Plus, Sparkles, Trash2 } from 'lucide-react'

import { useFormBuilderStore } from '../../features/form-builder/store/use-form-builder-store'
import { SectionCard } from '../ui/section-card'

type PanelScope = 'category' | 'question'
type PanelTab = 'basic' | 'validation' | 'logic' | 'appearance'

type TabButtonProps = {
  id: PanelTab
  label: string
  activeTab: PanelTab
  onSelect: (tab: PanelTab) => void
  disabled?: boolean
}

function TabButton({ id, label, activeTab, onSelect, disabled = false }: TabButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(id)}
      className={[
        'rounded-full px-3 py-2 text-xs font-semibold transition',
        activeTab === id
          ? 'bg-slate-900 text-white shadow-sm'
          : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700',
        disabled ? 'cursor-not-allowed opacity-40 hover:bg-white hover:text-slate-500' : '',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

export function SettingsPanel() {
  const selectedField = useFormBuilderStore((state) => state.getSelectedField())
  const selectedStep = useFormBuilderStore((state) => state.getSelectedStep())
  const updateSelectedStep = useFormBuilderStore((state) => state.updateSelectedStep)
  const updateSelectedField = useFormBuilderStore((state) => state.updateSelectedField)
  const addOptionToSelectedField = useFormBuilderStore((state) => state.addOptionToSelectedField)
  const updateOption = useFormBuilderStore((state) => state.updateOption)
  const removeOption = useFormBuilderStore((state) => state.removeOption)
  const duplicateStep = useFormBuilderStore((state) => state.duplicateStep)
  const deleteStep = useFormBuilderStore((state) => state.deleteStep)
  const duplicateField = useFormBuilderStore((state) => state.duplicateField)
  const deleteField = useFormBuilderStore((state) => state.deleteField)

  const [scope, setScope] = useState<PanelScope>(selectedField ? 'question' : 'category')
  const [activeTab, setActiveTab] = useState<PanelTab>('basic')

  useEffect(() => {
    setScope(selectedField ? 'question' : 'category')
  }, [selectedField?.id, selectedStep?.id])

  useEffect(() => {
    setActiveTab('basic')
  }, [scope, selectedField?.id, selectedStep?.id])

  const supportsOptions =
    selectedField?.type === 'select' ||
    selectedField?.type === 'radio' ||
    selectedField?.type === 'checkbox'
  const supportsPlaceholder = selectedField?.type === 'text' || selectedField?.type === 'textarea'

  const tabs = useMemo(
    () => [
      { id: 'basic' as const, label: 'Basic', disabled: false },
      { id: 'validation' as const, label: 'Validation', disabled: scope === 'category' },
      { id: 'logic' as const, label: 'Logic', disabled: scope === 'category' },
      { id: 'appearance' as const, label: 'Appearance', disabled: false },
    ],
    [scope],
  )

  if (!selectedStep) {
    return (
      <SectionCard
        title="Settings"
        description="Select a category or question from the builder canvas to start editing."
        className="h-full"
      >
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
          Nothing is selected yet. Start by clicking a category or question on the canvas.
        </div>
      </SectionCard>
    )
  }

  return (
    <SectionCard
      title={scope === 'question' ? 'Question Settings' : 'Category Settings'}
      description={
        scope === 'question'
          ? 'Keep the common edits up front, then move into validation and logic only when you need them.'
          : 'Shape the step title and description first so the form stays easy to scan as it grows.'
      }
      className="h-full"
      bodyClassName="xl:max-h-[72vh] xl:overflow-y-auto xl:pr-1"
    >
      <div className="space-y-5 text-sm">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2">
          <button
            type="button"
            onClick={() => setScope('category')}
            className={[
              'flex-1 rounded-2xl px-4 py-3 text-left transition',
              scope === 'category' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700',
            ].join(' ')}
          >
            <span className="block font-medium">Category</span>
            <span className="mt-1 block text-xs text-slate-500">Edit the section title, description, and structure.</span>
          </button>
          <button
            type="button"
            onClick={() => selectedField && setScope('question')}
            disabled={!selectedField}
            className={[
              'flex-1 rounded-2xl px-4 py-3 text-left transition',
              scope === 'question' && selectedField
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700',
              !selectedField ? 'cursor-not-allowed opacity-50 hover:text-slate-500' : '',
            ].join(' ')}
          >
            <span className="block font-medium">Question</span>
            <span className="mt-1 block text-xs text-slate-500">
              {selectedField ? 'Adjust labels, validation, options, and logic.' : 'Select a question to edit its details.'}
            </span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-1">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              activeTab={activeTab}
              onSelect={setActiveTab}
              disabled={tab.disabled}
            />
          ))}
        </div>

        {scope === 'category' ? (
          <>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white p-2 text-slate-500 shadow-sm">
                  <Layers3 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Selected category</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedStep.fields.length} question{selectedStep.fields.length === 1 ? '' : 's'} in this section.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => duplicateStep(selectedStep.id)}
                  className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-600 transition hover:bg-sky-100"
                >
                  <Copy className="h-4 w-4" />
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => deleteStep(selectedStep.id)}
                  className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>

            {activeTab === 'basic' ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block font-medium text-slate-700" htmlFor="step-title">
                    Category title
                  </label>
                  <input
                    id="step-title"
                    type="text"
                    value={selectedStep.title}
                    onChange={(event) => updateSelectedStep('title', event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700" htmlFor="step-description">
                    Description
                  </label>
                  <textarea
                    id="step-description"
                    rows={4}
                    value={selectedStep.description ?? ''}
                    onChange={(event) => updateSelectedStep('description', event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-700">Writing tip</p>
                  <p className="mt-1">
                    Keep category titles short and make descriptions outcome-focused so people know why they are being asked these questions.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                <p className="font-medium text-slate-700">Appearance controls are next</p>
                <p className="mt-1">
                  Step-level layout, dividers, and progress styling will live here once the base editing flow is fully stable.
                </p>
              </div>
            )}
          </>
        ) : selectedField ? (
          <>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="font-medium text-slate-800">Selected question</p>
                <p className="mt-1 text-xs text-slate-500">
                  Duplicate it to reuse the setup, or delete it when the flow no longer needs it.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => duplicateField(selectedField.id)}
                  className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-600 transition hover:bg-sky-100"
                >
                  <Copy className="h-4 w-4" />
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => deleteField(selectedField.id)}
                  className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>

            {activeTab === 'basic' ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block font-medium text-slate-700" htmlFor="field-label">
                    Label
                  </label>
                  <input
                    id="field-label"
                    type="text"
                    value={selectedField.label}
                    onChange={(event) => updateSelectedField('label', event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700" htmlFor="field-name">
                    Internal name
                  </label>
                  <input
                    id="field-name"
                    type="text"
                    value={selectedField.name}
                    onChange={(event) => updateSelectedField('name', event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700" htmlFor="field-helper-text">
                    Helper text
                  </label>
                  <textarea
                    id="field-helper-text"
                    rows={3}
                    value={selectedField.helperText ?? ''}
                    onChange={(event) => updateSelectedField('helperText', event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <p className="mb-2 block font-medium text-slate-700">Type</p>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 capitalize text-slate-800">
                    {selectedField.type}
                  </div>
                </div>

                {supportsPlaceholder ? (
                  <div>
                    <label className="mb-2 block font-medium text-slate-700" htmlFor="field-placeholder">
                      Placeholder
                    </label>
                    <input
                      id="field-placeholder"
                      type="text"
                      value={selectedField.placeholder ?? ''}
                      onChange={(event) => updateSelectedField('placeholder', event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                ) : null}

                {supportsOptions ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-800">Options</p>
                        <p className="text-xs text-slate-500">Edit the choices for this field type.</p>
                      </div>
                      <button
                        type="button"
                        onClick={addOptionToSelectedField}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-400"
                      >
                        <Plus className="h-4 w-4" />
                        Add option
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(selectedField.options ?? []).map((option, index) => (
                        <div key={option.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                              Option {index + 1}
                            </p>
                            <button
                              type="button"
                              onClick={() => removeOption(option.id)}
                              className="rounded-full p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                              aria-label={`Remove option ${index + 1}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">Label</label>
                              <input
                                type="text"
                                value={option.label}
                                onChange={(event) => updateOption(option.id, 'label', event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">Value</label>
                              <input
                                type="text"
                                value={option.value}
                                onChange={(event) => updateOption(option.id, 'value', event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {activeTab === 'validation' ? (
              <div className="space-y-4">
                <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span>
                    <span className="block font-medium text-slate-800">Required</span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Make this answer mandatory before the form can move forward.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedField.required ?? false}
                    onChange={(event) => updateSelectedField('required', event.target.checked)}
                    className="h-4 w-4 rounded accent-emerald-600"
                  />
                </label>

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-700">Validation roadmap</p>
                  <p className="mt-1">Min/max rules, patterns, and file constraints will slot into this tab next.</p>
                </div>
              </div>
            ) : null}

            {activeTab === 'logic' ? (
              <div className="space-y-4">
                {selectedField.showIf ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-medium text-slate-700">Current visibility rule</p>
                    <p className="mt-2">
                      Show this question when <span className="font-medium text-slate-800">{selectedField.showIf.field}</span>{' '}
                      <span className="font-medium text-slate-800">{selectedField.showIf.operator}</span>{' '}
                      <span className="font-medium text-slate-800">{selectedField.showIf.value}</span>
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                    No `showIf` rule is connected to this question yet.
                  </div>
                )}

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-white p-2 text-amber-500 shadow-sm">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">Visual rule editor is next</p>
                      <p className="mt-1">
                        We have the rule shape in the schema already. The next step is a simple point-and-click builder for `showIf` conditions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === 'appearance' ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-700">Appearance direction</p>
                  <p className="mt-1">
                    Layout width, spacing density, and field presentation controls will live here as we expand the form theming system.
                  </p>
                </div>
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  Right now, the strongest customization lives in content, validation, and logic so we keep the MVP focused.
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
            Select a question from the builder canvas to inspect and edit its settings.
          </div>
        )}
      </div>
    </SectionCard>
  )
}
