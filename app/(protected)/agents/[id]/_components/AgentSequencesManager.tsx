'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, Plus, Trash2, Edit2, Pause, Play, MessageSquare, Save } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Toggle } from '@/components/ui/Toggle'

import type { AgentSequence } from '@/lib/repositories/agent-sequences'

type SequenceStepInput = {
  id?: string
  stepType: 'send_message' | 'wait' | 'webhook'
  payload: Record<string, unknown>
  delaySeconds: number
  sortOrder: number
}

interface AgentSequencesManagerProps {
  agentId: string
}

const STEP_TYPE_OPTIONS = [
  { value: 'send_message', label: 'Отправить сообщение' },
  { value: 'wait', label: 'Ожидание' },
  { value: 'webhook', label: 'Вызвать Webhook' },
]

const createEmptyStep = (sortOrder: number): SequenceStepInput => ({
  stepType: 'send_message',
  payload: { text: '' },
  delaySeconds: 0,
  sortOrder,
})

export const AgentSequencesManager = ({ agentId }: AgentSequencesManagerProps) => {
  const isDraft = agentId === 'new'

  const [sequences, setSequences] = useState<AgentSequence[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingSequenceId, setEditingSequenceId] = useState<string | null>(null)

  const [formState, setFormState] = useState({
    name: '',
    description: '',
    isActive: true,
    steps: [createEmptyStep(0)],
  })

  const fetchSequences = useCallback(async () => {
    if (!agentId || agentId === 'new') {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/agents/${agentId}/sequences`, { cache: 'no-store' })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      const payload = (await response.json()) as {
        success: boolean
        data: AgentSequence[]
        error?: string
      }

      if (!payload.success) {
        throw new Error(payload.error ?? 'Unknown error')
      }

      setSequences(payload.data)
    } catch (err) {
      console.error('Failed to load sequences', err)
      setError('Не удалось загрузить цепочки. Попробуйте позже.')
    } finally {
      setIsLoading(false)
    }
  }, [agentId])

  useEffect(() => {
    if (isDraft) {
      setIsLoading(false)
      return
    }

    void fetchSequences()
  }, [fetchSequences, isDraft])

  const resetForm = useCallback(() => {
    setFormState({
      name: '',
      description: '',
      isActive: true,
      steps: [createEmptyStep(0)],
    })
    setEditingSequenceId(null)
  }, [])

  const openCreateEditor = () => {
    resetForm()
    setIsEditorOpen(true)
  }

  const openEditEditor = (sequence: AgentSequence) => {
    setEditingSequenceId(sequence.id)
    setFormState({
      name: sequence.name,
      description: sequence.description ?? '',
      isActive: sequence.isActive,
      steps: sequence.steps.map((step, index) => ({
        id: step.id,
        stepType: (step.stepType as SequenceStepInput['stepType']) ?? 'send_message',
        payload: step.payload,
        delaySeconds: step.delaySeconds,
        sortOrder: step.sortOrder ?? index,
      })),
    })
    setIsEditorOpen(true)
  }

  const closeEditor = () => {
    setIsEditorOpen(false)
    resetForm()
  }

  const handleStepChange = <K extends keyof SequenceStepInput>(index: number, key: K, value: SequenceStepInput[K]) => {
    setFormState((prev) => {
      const steps = prev.steps.map((step, stepIndex) => {
        if (stepIndex !== index) {
          return step
        }

        const nextStep: SequenceStepInput = {
          ...step,
          [key]: value,
        }

        if (key === 'stepType') {
          if (value === 'send_message') {
            nextStep.payload = { text: '' }
            nextStep.delaySeconds = 0
          }

          if (value === 'wait') {
            nextStep.payload = { message: 'Ожидание' }
            nextStep.delaySeconds = step.delaySeconds ?? 60
          }

          if (value === 'webhook') {
            nextStep.payload = { url: '' }
            nextStep.delaySeconds = 0
          }
        }

        return nextStep
      })

      return { ...prev, steps }
    })
  }

  const handleStepPayloadChange = (index: number, payload: Record<string, unknown>) => {
    setFormState((prev) => {
      const steps = prev.steps.map((step, stepIndex) => (stepIndex === index ? { ...step, payload } : step))
      return { ...prev, steps }
    })
  }

  const addStep = () => {
    setFormState((prev) => {
      const nextOrder = prev.steps.length
      return {
        ...prev,
        steps: [...prev.steps, createEmptyStep(nextOrder)],
      }
    })
  }

  const removeStep = (index: number) => {
    setFormState((prev) => {
      const steps = prev.steps.filter((_, stepIndex) => stepIndex !== index).map((step, idx) => ({
        ...step,
        sortOrder: idx,
      }))
      return { ...prev, steps: steps.length > 0 ? steps : [createEmptyStep(0)] }
    })
  }

  const convertStepPayload = (step: SequenceStepInput): Record<string, unknown> => {
    if (step.stepType === 'send_message') {
      return { text: String((step.payload as { text?: unknown })?.text ?? '') }
    }

    if (step.stepType === 'wait') {
      return {
        message: String((step.payload as { message?: unknown })?.message ?? 'Ожидание'),
        seconds: Number.isFinite(step.delaySeconds) ? step.delaySeconds : 0,
      }
    }

    if (step.stepType === 'webhook') {
      return {
        url: String((step.payload as { url?: unknown })?.url ?? ''),
        method: 'POST',
      }
    }

    return step.payload
  }

  const handleSubmit = async () => {
    setIsSaving(true)

    try {
      const endpoint = editingSequenceId
        ? `/api/agents/${agentId}/sequences/${editingSequenceId}`
        : `/api/agents/${agentId}/sequences`

      const method = editingSequenceId ? 'PATCH' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formState.name.trim(),
          description: formState.description.trim() || null,
          isActive: formState.isActive,
          steps: formState.steps.map((step, index) => ({
            id: step.id,
            stepType: step.stepType,
            payload: convertStepPayload(step),
            delaySeconds: step.delaySeconds,
            sortOrder: index,
          })),
        }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(payload?.error ?? 'Request failed')
      }

      await fetchSequences()
      closeEditor()
    } catch (err) {
      console.error('Failed to save sequence', err)
      alert('Не удалось сохранить цепочку. Попробуйте еще раз.')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleSequenceActive = async (sequence: AgentSequence, nextValue: boolean) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/sequences/${sequence.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: nextValue }),
      })

      if (!response.ok) {
        throw new Error('Failed to toggle')
      }

      await fetchSequences()
    } catch (err) {
      console.error('Failed to toggle sequence', err)
      alert('Не удалось обновить статус цепочки.')
    }
  }

  const deleteSequence = async (sequenceId: string) => {
    if (!confirm('Удалить цепочку? Действие нельзя отменить.')) {
      return
    }

    try {
      const response = await fetch(`/api/agents/${agentId}/sequences/${sequenceId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete')
      }

      await fetchSequences()
    } catch (err) {
      console.error('Failed to delete sequence', err)
      alert('Не удалось удалить цепочку.')
    }
  }

  const editorTitle = editingSequenceId ? 'Редактирование цепочки' : 'Новая цепочка'

  const canSubmit = useMemo(() => {
    if (!formState.name.trim()) {
      return false
    }

    const hasValidSteps = formState.steps.every((step) => {
      if (step.stepType === 'send_message') {
        return Boolean((step.payload as { text?: unknown })?.text)
      }

      if (step.stepType === 'wait') {
        return Number.isFinite(step.delaySeconds) && step.delaySeconds >= 0
      }

      if (step.stepType === 'webhook') {
        const url = (step.payload as { url?: unknown })?.url
        return typeof url === 'string' && url.trim().length > 0
      }

      return true
    })

    return hasValidSteps
  }, [formState.name, formState.steps])

  return (
    <div className="space-y-6">
      {isDraft ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
          Сначала сохраните агента, чтобы управлять автоматическими цепочками.
        </div>
      ) : null}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Автоматические цепочки</h2>
          <p className="text-sm text-slate-500">
            Настройте последовательности действий: сообщения, паузы и внешние запросы.
          </p>
        </div>
        <Button onClick={openCreateEditor} className="w-full gap-2 sm:w-auto" disabled={isDraft}>
          <Plus className="h-4 w-4" /> Новая цепочка
        </Button>
      </div>

      {isDraft ? null : isLoading ? (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Загрузка цепочек…
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
      ) : sequences.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
          Цепочки еще не настроены. Создайте первую, чтобы автоматизировать шаги агента.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sequences.map((sequence) => (
            <Card key={sequence.id} className="shadow-sm">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-900">{sequence.name}</h3>
                      {sequence.isActive ? (
                        <span className="text-xs font-medium text-green-600">Активна</span>
                      ) : (
                        <span className="text-xs font-medium text-slate-400">Выключена</span>
                      )}
                    </div>
                    {sequence.description ? (
                      <p className="mt-1 text-xs text-slate-500">{sequence.description}</p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-slate-900"
                      onClick={() => openEditEditor(sequence)}
                      aria-label="Изменить цепочку"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-rose-500 hover:text-rose-700"
                      onClick={() => deleteSequence(sequence.id)}
                      aria-label="Удалить цепочку"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {sequence.steps.map((step) => (
                    <div key={step.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">
                          {step.stepType === 'send_message'
                            ? 'Сообщение'
                            : step.stepType === 'wait'
                            ? 'Ожидание'
                            : 'Webhook'}
                        </span>
                      </div>
                      <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-500">
                        {JSON.stringify(step.payload, null, 2)}
                      </pre>
                      {step.delaySeconds > 0 ? (
                        <p className="mt-2 text-xs text-slate-400">Задержка: {step.delaySeconds} сек.</p>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSequenceActive(sequence, !sequence.isActive)}
                    className="gap-2"
                  >
                    {sequence.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {sequence.isActive ? 'Приостановить' : 'Активировать'}
                  </Button>
                  <p className="text-xs text-slate-400">Шагов: {sequence.steps.length}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isEditorOpen ? (
        <Card className="border-primary-200 shadow-lg">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{editorTitle}</h3>
                <p className="text-sm text-slate-500">
                  Опишите шаги, которые агент выполнит автоматически.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={closeEditor}>
                Отменить
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Название"
                placeholder="Например, Приветствие нового лида"
                value={formState.name}
                onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
              <Toggle
                checked={formState.isActive}
                onChange={(value) => setFormState((prev) => ({ ...prev, isActive: value }))}
                label="Цепочка активна"
                description={
                  formState.isActive
                    ? 'Будет выполняться автоматически'
                    : 'Цепочка отключена до повторного включения'
                }
              />
            </div>

            <Textarea
              label="Описание"
              placeholder="Кратко опишите назначение цепочки"
              rows={3}
              value={formState.description}
              onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-slate-700">Шаги</h4>
                <Button variant="outline" size="sm" onClick={addStep}>
                  <Plus className="mr-2 h-4 w-4" /> Добавить шаг
                </Button>
              </div>

              <div className="space-y-4">
                {formState.steps.map((step, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-3">
                        <label className="text-xs font-medium text-slate-500">Тип шага</label>
                        <div className="grid gap-3 md:grid-cols-2">
                          <select
                            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                            value={step.stepType}
                            onChange={(event) =>
                              handleStepChange(index, 'stepType', event.target.value as SequenceStepInput['stepType'])
                            }
                          >
                            {STEP_TYPE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>

                          {step.stepType === 'wait' ? (
                            <Input
                              type="number"
                              min={0}
                              label="Задержка, сек"
                              value={step.delaySeconds}
                              onChange={(event) =>
                                handleStepChange(index, 'delaySeconds', Number.parseInt(event.target.value, 10) || 0)
                              }
                            />
                          ) : step.stepType === 'send_message' ? (
                            <Textarea
                              label="Сообщение"
                              rows={3}
                              value={String((step.payload as { text?: unknown })?.text ?? '')}
                              onChange={(event) =>
                                handleStepPayloadChange(index, { text: event.target.value })
                              }
                            />
                          ) : (
                            <Input
                              label="URL Webhook"
                              value={String((step.payload as { url?: unknown })?.url ?? '')}
                              onChange={(event) =>
                                handleStepPayloadChange(index, { url: event.target.value })
                              }
                            />
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-rose-500 hover:text-rose-700"
                        onClick={() => removeStep(index)}
                        aria-label="Удалить шаг"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={closeEditor}>
                Отмена
              </Button>
              <Button onClick={handleSubmit} disabled={!canSubmit || isSaving} className="gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingSequenceId ? 'Сохранить изменения' : 'Создать цепочку'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

