'use client'

import { useEffect, useState } from 'react'

import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Label, Textarea } from '@/components/ui'

type Sequence = {
  id: string
  name: string
  description?: string | null
  is_active: boolean
  steps: SequenceStep[]
}

type SequenceStep = {
  id: string
  step_index: number
  wait_interval: string
  channel: string
  template: string
}

type StepForm = {
  wait_interval: string
  channel: string
  template: string
}

const DEFAULT_STEP_FORM: StepForm = { wait_interval: '1 day', channel: 'email', template: '' }

interface AgentSequencesProps {
  agentId: string
}

export function AgentSequences({ agentId }: AgentSequencesProps) {
  const [sequences, setSequences] = useState<Sequence[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState({ name: '', description: '' })
  const [creating, setCreating] = useState(false)
  const [expandedSequenceId, setExpandedSequenceId] = useState<string | null>(null)
  const [stepForms, setStepForms] = useState<Record<string, StepForm>>({})

  useEffect(() => {
    const loadSequences = async () => {
      try {
        const response = await fetch(`/api/agents/${agentId}/sequences`)
        const payload = await response.json()
        if (!response.ok || !payload.success) {
          throw new Error(payload.error || 'Не удалось загрузить последовательности')
        }
        setSequences(payload.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки последовательностей')
      } finally {
        setLoading(false)
      }
    }

    void loadSequences()
  }, [agentId])

  const handleCreateSequence = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draft.name.trim()) {
      setError('Введите название последовательности')
      return
    }

    try {
      setCreating(true)
      setError(null)
      const response = await fetch(`/api/agents/${agentId}/sequences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: draft.name,
          description: draft.description,
          steps: [
            {
              channel: 'email',
              wait_interval: '0 minutes',
              template: 'Спасибо за обращение! Чем помочь?',
            },
          ],
        }),
      })
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось создать последовательность')
      }
      setDraft({ name: '', description: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания последовательности')
    } finally {
      setCreating(false)
    }
  }

  const toggleSequence = async (sequence: Sequence) => {
    setError(null)
    try {
      const response = await fetch(`/api/agents/${agentId}/sequences/${sequence.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !sequence.is_active }),
      })
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось обновить последовательность')
      }
      setSequences((prev) => prev.map((item) => (item.id === sequence.id ? { ...item, is_active: !item.is_active } : item)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления последовательности')
    }
  }

  const deleteSequence = async (sequenceId: string) => {
    if (!confirm('Удалить последовательность?')) {
      return
    }
    setError(null)
    try {
      const response = await fetch(`/api/agents/${agentId}/sequences/${sequenceId}`, { method: 'DELETE' })
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось удалить последовательность')
      }
      setSequences((prev) => prev.filter((sequence) => sequence.id !== sequenceId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления последовательности')
    }
  }

  const getStepForm = (sequenceId: string): StepForm => {
    return stepForms[sequenceId] ?? DEFAULT_STEP_FORM
  }

  const addStep = async (sequenceId: string) => {
    const formValue = getStepForm(sequenceId)
    if (!formValue.template.trim()) {
      setError('Введите текст шага')
      return
    }
    setError(null)
    try {
      const response = await fetch(`/api/agents/${agentId}/sequences/${sequenceId}/steps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValue),
      })
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось добавить шаг')
      }
      setSequences((prev) =>
        prev.map((sequence) =>
          sequence.id === sequenceId
            ? { ...sequence, steps: [...(sequence.steps ?? []), payload.data] }
            : sequence,
        ),
      )
      setStepForms((prev) => ({ ...prev, [sequenceId]: { wait_interval: '1 day', channel: 'email', template: '' } }))
      setExpandedSequenceId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка добавления шага')
    }
  }

  const deleteStep = async (sequenceId: string, stepId: string) => {
    if (!confirm('Удалить шаг последовательности?')) {
      return
    }
    setError(null)
    try {
      const response = await fetch(`/api/agents/${agentId}/sequences/${sequenceId}/steps/${stepId}`, {
        method: 'DELETE',
      })
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось удалить шаг')
      }
      setSequences((prev) =>
        prev.map((sequence) =>
          sequence.id === sequenceId
            ? { ...sequence, steps: (sequence.steps ?? []).filter((step) => step.id !== stepId) }
            : sequence,
        ),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления шага')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sequences</CardTitle>
        <CardDescription>Многошаговые фоллоу-ап цепочки для этого агента.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {error && <p className="text-rose-500">{error}</p>}
        {loading ? (
          <p className="text-gray-500">Загрузка последовательностей…</p>
        ) : sequences.length === 0 ? (
          <p className="text-gray-500">Последовательности ещё не созданы.</p>
        ) : (
          <ul className="space-y-2">
            {sequences.map((sequence) => (
              <li key={sequence.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-50">{sequence.name}</p>
                    {sequence.description && <p className="text-xs text-gray-500">{sequence.description}</p>}
                    <p className="mt-2 text-xs text-gray-500">Шаги:</p>
                    <ol className="mt-1 space-y-1 text-xs text-gray-600">
                      {sequence.steps?.map((step) => (
                        <li key={step.id} className="flex items-center justify-between gap-2">
                          <span>
                            {step.step_index}. Через {step.wait_interval} → {step.channel.toUpperCase()} «
                            {step.template.slice(0, 40)}…»
                          </span>
                          <button type="button" onClick={() => deleteStep(sequence.id, step.id)} className="text-rose-500">
                            ×
                          </button>
                        </li>
                      )) ?? <li>Пока нет шагов.</li>}
                    </ol>
                    {expandedSequenceId === sequence.id && (
                      <div className="mt-3 space-y-2 text-xs">
                        <div className="grid gap-2 md:grid-cols-3">
                          <Input
                            value={getStepForm(sequence.id).wait_interval}
                            onChange={(event) =>
                              setStepForms((prev) => ({
                                ...prev,
                                [sequence.id]: { ...getStepForm(sequence.id), wait_interval: event.target.value },
                              }))
                            }
                            placeholder="1 day"
                          />
                          <select
                            className="rounded-md border border-input bg-transparent px-2 py-1"
                            value={getStepForm(sequence.id).channel}
                            onChange={(event) =>
                              setStepForms((prev) => ({
                                ...prev,
                                [sequence.id]: { ...getStepForm(sequence.id), channel: event.target.value },
                              }))
                            }
                          >
                            <option value="email">Email</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="sms">SMS</option>
                          </select>
                          <Button type="button" size="sm" onClick={() => addStep(sequence.id)}>
                            Добавить шаг
                          </Button>
                        </div>
                        <Textarea
                          rows={3}
                          value={getStepForm(sequence.id).template}
                          onChange={(event) =>
                            setStepForms((prev) => ({
                              ...prev,
                              [sequence.id]: { ...getStepForm(sequence.id), template: event.target.value },
                            }))
                          }
                          placeholder="Текст сообщения"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      className="rounded border px-2 py-1"
                      onClick={() => toggleSequence(sequence)}
                    >
                      {sequence.is_active ? 'Выключить' : 'Включить'}
                    </button>
                    <button
                      type="button"
                      className="rounded border px-2 py-1"
                      onClick={() => setExpandedSequenceId((prev) => (prev === sequence.id ? null : sequence.id))}
                    >
                      Добавить шаг
                    </button>
                    <button type="button" className="rounded border px-2 py-1" onClick={() => deleteSequence(sequence.id)}>
                      Удалить
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">Создать простую последовательность</p>
          <form className="mt-4 space-y-3" onSubmit={handleCreateSequence}>
            <div className="space-y-2">
              <Label htmlFor="sequence-name">Название</Label>
              <Input
                id="sequence-name"
                value={draft.name}
                onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Follow-up 24 часа"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sequence-desc">Описание</Label>
              <Textarea
                id="sequence-desc"
                rows={3}
                value={draft.description}
                onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>
            <Button type="submit" disabled={creating}>
              {creating ? 'Сохраняем…' : 'Создать последовательность'}
            </Button>
          </form>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-gray-500">Поддержка многошагового редактора появится в следующих релизах.</p>
      </CardFooter>
    </Card>
  )
}
