'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, Edit, Trash2, CheckCircle, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Toggle } from '@/components/ui/Toggle'

import type { Trigger, TriggerCondition, TriggerAction } from '@/lib/repositories/triggers'

interface TriggerManagerProps {
  agentId: string
}

interface TriggerFormData {
  name: string
  description: string
  isActive: boolean
  conditions: Array<{ conditionType: string; value: string; ordering: number }>
  actions: Array<{ actionType: string; value: string; ordering: number }>
}

const CONDITION_TYPES = [
  { value: 'message_contains', label: 'Сообщение содержит' },
  { value: 'stage_change', label: 'Изменение этапа' },
  { value: 'field_change', label: 'Изменение поля' },
  { value: 'time_elapsed', label: 'Прошло времени' },
]

const ACTION_TYPES = [
  { value: 'create_deal', label: 'Создать сделку' },
  { value: 'update_stage', label: 'Изменить этап' },
  { value: 'assign_manager', label: 'Назначить менеджера' },
  { value: 'send_message', label: 'Отправить сообщение' },
  { value: 'create_task', label: 'Создать задачу' },
]

const getConditionLabel = (conditionType: string): string => {
  const condition = CONDITION_TYPES.find((c) => c.value === conditionType)
  return condition?.label ?? conditionType
}

const getActionLabel = (actionType: string): string => {
  const action = ACTION_TYPES.find((a) => a.value === actionType)
  return action?.label ?? actionType
}

const formatConditionValue = (condition: TriggerCondition): string => {
  const payload = condition.payload
  if (typeof payload === 'object' && payload !== null) {
    if ('value' in payload) {
      return String(payload.value)
    }
    if ('keywords' in payload) {
      return Array.isArray(payload.keywords) ? payload.keywords.join(', ') : String(payload.keywords)
    }
    return JSON.stringify(payload)
  }
  return String(payload)
}

const formatActionValue = (action: TriggerAction): string => {
  const payload = action.payload
  if (typeof payload === 'object' && payload !== null) {
    if ('value' in payload) {
      return String(payload.value)
    }
    if ('message' in payload) {
      return String(payload.message)
    }
    if ('pipeline' in payload) {
      return String(payload.pipeline)
    }
    return JSON.stringify(payload)
  }
  return String(payload)
}

export const TriggerManager = ({ agentId }: TriggerManagerProps) => {
  const [triggers, setTriggers] = useState<Trigger[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTrigger, setEditingTrigger] = useState<Trigger | null>(null)
  const [formData, setFormData] = useState<TriggerFormData>({
    name: '',
    description: '',
    isActive: true,
    conditions: [{ conditionType: 'message_contains', value: '', ordering: 0 }],
    actions: [{ actionType: 'create_deal', value: '', ordering: 0 }],
  })
  const [isSaving, setIsSaving] = useState(false)

  const fetchTriggers = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/agents/${agentId}/triggers`)

      if (!response.ok) {
        throw new Error('Не удалось загрузить триггеры')
      }

      const payload = (await response.json()) as { success: boolean; data: Trigger[] }

      if (!payload.success) {
        throw new Error('Не удалось загрузить триггеры')
      }

      setTriggers(payload.data)
    } catch (error) {
      console.error('Failed to fetch triggers', error)
    } finally {
      setIsLoading(false)
    }
  }, [agentId])

  useEffect(() => {
    fetchTriggers()
  }, [fetchTriggers])

  const handleCreate = () => {
    setEditingTrigger(null)
    setFormData({
      name: '',
      description: '',
      isActive: true,
      conditions: [{ conditionType: 'message_contains', value: '', ordering: 0 }],
      actions: [{ actionType: 'create_deal', value: '', ordering: 0 }],
    })
    setModalOpen(true)
  }

  const handleEdit = (trigger: Trigger) => {
    setEditingTrigger(trigger)
    setFormData({
      name: trigger.name,
      description: trigger.description ?? '',
      isActive: trigger.isActive,
      conditions:
        trigger.conditions.length > 0
          ? trigger.conditions.map((c) => ({
              conditionType: c.conditionType,
              value: formatConditionValue(c),
              ordering: c.ordering,
            }))
          : [{ conditionType: 'message_contains', value: '', ordering: 0 }],
      actions:
        trigger.actions.length > 0
          ? trigger.actions.map((a) => ({
              actionType: a.actionType,
              value: formatActionValue(a),
              ordering: a.ordering,
            }))
          : [{ actionType: 'create_deal', value: '', ordering: 0 }],
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Название триггера обязательно')
      return
    }

    setIsSaving(true)

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        isActive: formData.isActive,
        conditions: formData.conditions
          .filter((c) => c.value.trim())
          .map((c, index) => ({
            conditionType: c.conditionType,
            payload: { value: c.value.trim() },
            ordering: index,
          })),
        actions: formData.actions
          .filter((a) => a.value.trim())
          .map((a, index) => ({
            actionType: a.actionType,
            payload: { value: a.value.trim() },
            ordering: index,
          })),
      }

      const url = editingTrigger
        ? `/api/agents/${agentId}/triggers/${editingTrigger.id}`
        : `/api/agents/${agentId}/triggers`
      const method = editingTrigger ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Не удалось сохранить триггер')
      }

      const result = (await response.json()) as { success: boolean }

      if (!result.success) {
        throw new Error('Не удалось сохранить триггер')
      }

      setModalOpen(false)
      await fetchTriggers()
    } catch (error) {
      console.error('Failed to save trigger', error)
      alert('Не удалось сохранить триггер. Попробуйте еще раз.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот триггер? Это действие нельзя отменить.')) {
      return
    }

    try {
      const response = await fetch(`/api/agents/${agentId}/triggers/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Не удалось удалить триггер')
      }

      const payload = (await response.json()) as { success: boolean }

      if (!payload.success) {
        throw new Error('Не удалось удалить триггер')
      }

      await fetchTriggers()
    } catch (error) {
      console.error('Failed to delete trigger', error)
      alert('Не удалось удалить триггер. Попробуйте еще раз.')
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/triggers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (!response.ok) {
        throw new Error('Не удалось обновить статус триггера')
      }

      await fetchTriggers()
    } catch (error) {
      console.error('Failed to toggle trigger status', error)
      alert('Не удалось обновить статус триггера. Попробуйте еще раз.')
    }
  }

  const addCondition = () => {
    setFormData((prev) => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        { conditionType: 'message_contains', value: '', ordering: prev.conditions.length },
      ],
    }))
  }

  const removeCondition = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index).map((c, i) => ({ ...c, ordering: i })),
    }))
  }

  const addAction = () => {
    setFormData((prev) => ({
      ...prev,
      actions: [...prev.actions, { actionType: 'create_deal', value: '', ordering: prev.actions.length }],
    }))
  }

  const removeAction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index).map((a, i) => ({ ...a, ordering: i })),
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Триггеры и автоматизация</h3>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Создать триггер
        </Button>
      </div>

      {triggers.length === 0 ? (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="py-12 text-center">
            <p className="mb-4 text-slate-500">
              Триггеры позволяют автоматизировать действия агента на основе условий
            </p>
            <Button onClick={handleCreate}>Создать первый триггер</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {triggers.map((trigger) => (
            <Card key={trigger.id} className={`border-slate-200 shadow-sm ${!trigger.isActive ? 'opacity-60' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <h4 className="text-base font-semibold text-slate-900">{trigger.name}</h4>
                      {trigger.isActive && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>

                    {trigger.description && (
                      <p className="mb-3 text-sm text-slate-500">{trigger.description}</p>
                    )}

                    <div className="mb-4 space-y-2">
                      {trigger.conditions.length > 0 && (
                        <div className="text-sm">
                          <span className="font-medium text-slate-600">Условие: </span>
                          {trigger.conditions.map((condition, index) => (
                            <span key={condition.id} className="text-slate-900">
                              {index > 0 && ', '}
                              {getConditionLabel(condition.conditionType)} &quot;{formatConditionValue(condition)}&quot;
                            </span>
                          ))}
                        </div>
                      )}

                      {trigger.actions.length > 0 && (
                        <div className="text-sm">
                          <span className="font-medium text-slate-600">Действия: </span>
                          <ul className="ml-4 mt-1 space-y-1">
                            {trigger.actions.map((action) => (
                              <li key={action.id} className="text-slate-900">
                                • {getActionLabel(action.actionType)} → {formatActionValue(action)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <Toggle
                        checked={trigger.isActive}
                        onChange={() => handleToggleActive(trigger.id, trigger.isActive)}
                        label="Активен"
                      />
                    </div>
                  </div>

                  <div className="ml-4 flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(trigger)} className="p-2">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(trigger.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTrigger ? 'Редактировать триггер' : 'Создать триггер'}
        size="lg"
      >
        <div className="space-y-6">
          <Input
            label="Название триггера*"
            placeholder="Например: Создание сделки при готовности"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          />

          <Textarea
            label="Описание (опционально)"
            placeholder="Краткое описание триггера"
            rows={3}
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Условия срабатывания</label>
            <div className="space-y-3">
              {formData.conditions.map((condition, index) => (
                <div key={index} className="grid grid-cols-[1fr,2fr,auto] gap-3">
                  <Select
                    options={CONDITION_TYPES}
                    value={condition.conditionType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        conditions: prev.conditions.map((c, i) =>
                          i === index ? { ...c, conditionType: e.target.value } : c,
                        ),
                      }))
                    }
                  />
                  <Input
                    placeholder="Значение условия"
                    value={condition.value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        conditions: prev.conditions.map((c, i) => (i === index ? { ...c, value: e.target.value } : c)),
                      }))
                    }
                  />
                  {formData.conditions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCondition(index)}
                      className="p-2 text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addCondition} className="gap-2">
                <Plus className="h-4 w-4" />
                Добавить условие
              </Button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Действия</label>
            <div className="space-y-3">
              {formData.actions.map((action, index) => (
                <div key={index} className="grid grid-cols-[1fr,2fr,auto] gap-3">
                  <Select
                    options={ACTION_TYPES}
                    value={action.actionType}
                    onChange={(value: string) =>
                      setFormData((prev) => ({
                        ...prev,
                        actions: prev.actions.map((a, i) =>
                          i === index ? { ...a, actionType: value } : a,
                        ),
                      }))
                    }
                  />
                  <Input
                    placeholder="Значение действия"
                    value={action.value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        actions: prev.actions.map((a, i) => (i === index ? { ...a, value: e.target.value } : a)),
                      }))
                    }
                  />
                  {formData.actions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAction(index)}
                      className="p-2 text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addAction} className="gap-2">
                <Plus className="h-4 w-4" />
                Добавить действие
              </Button>
            </div>
          </div>

          <Toggle
            checked={formData.isActive}
            onChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
            label="Активен"
          />

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isSaving}>
              Отмена
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение…
                </>
              ) : editingTrigger ? (
                'Сохранить'
              ) : (
                'Создать'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
