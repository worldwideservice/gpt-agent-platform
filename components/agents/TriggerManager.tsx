'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, Edit, Trash2, CheckCircle, Loader2, Zap, Search, Filter, ArrowDown, X, ChevronUp, ChevronDown, Link2, Settings } from 'lucide-react'

import { KwidButton, KwidInput, KwidSelect, KwidTextarea, KwidSwitch } from '@/components/kwid'
import { Card, CardContent } from '@/components/ui/Card'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])

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

  const filteredTriggers = triggers.filter(trigger => 
    trigger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatConditionValue(trigger.conditions[0] || { payload: {}, conditionType: '' } as TriggerCondition).toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectTrigger = (id: string) => {
    setSelectedTriggers(prev => 
      prev.includes(id) 
        ? prev.filter(triggerId => triggerId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedTriggers.length === filteredTriggers.length) {
      setSelectedTriggers([])
    } else {
      setSelectedTriggers(filteredTriggers.map(t => t.id))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400 dark:text-gray-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Триггеры</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Выполняйте мгновенные действия при соблюдении определённых условий в ходе разговора.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <KwidInput
              type="search"
              placeholder="Поиск"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>
          <KwidButton
            variant="outline"
            size="sm"
            className="h-10 w-10 p-0"
            aria-label="Фильтры"
          >
            <Filter className="h-5 w-5" />
          </KwidButton>
        </div>
        <KwidButton onClick={handleCreate} variant="primary" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Создать
        </KwidButton>
      </div>

      {triggers.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <Zap className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Не найдено Триггеры</h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Создать Триггер для старта.</p>
          <KwidButton onClick={handleCreate} variant="primary" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Создать
          </KwidButton>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedTriggers.length === filteredTriggers.length && filteredTriggers.length > 0}
                      ref={(input) => {
                        if (input) input.indeterminate = selectedTriggers.length > 0 && selectedTriggers.length < filteredTriggers.length
                      }}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-custom-600 focus:ring-custom-500 dark:border-gray-600 dark:text-custom-500"
                      aria-label="Выбрать все триггеры"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Название</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                    <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
                      Активно
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Условие</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-gray-300">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredTriggers.map((trigger) => {
                  const conditionText = trigger.conditions.length > 0 
                    ? `Когда ты понял, что это клиент по продукту ${formatConditionValue(trigger.conditions[0]).substring(0, 50)}...`
                    : 'Нет условия'
                  return (
                    <tr key={trigger.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedTriggers.includes(trigger.id)}
                          onChange={() => handleSelectTrigger(trigger.id)}
                          className="h-4 w-4 rounded border-gray-300 text-custom-600 focus:ring-custom-500 dark:border-gray-600 dark:text-custom-500"
                          aria-label={`Выбрать триггер ${trigger.name}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{trigger.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <KwidSwitch
                          checked={trigger.isActive}
                          onCheckedChange={() => handleToggleActive(trigger.id, trigger.isActive)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{conditionText}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleEdit(trigger)}
                            className="text-custom-600 hover:text-custom-700 text-sm font-medium flex items-center gap-1 dark:text-custom-400 dark:hover:text-custom-300"
                          >
                            <Edit className="h-4 w-4" />
                            Изменить
                          </button>
                          <button
                            onClick={() => handleDelete(trigger.id)}
                            className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <p>Показано с {filteredTriggers.length > 0 ? 1 : 0} по {filteredTriggers.length} из {triggers.length}</p>
            <div className="flex items-center gap-4">
              <p>на страницу</p>
              <KwidSelect
                options={[
                  { value: '10', label: '10' },
                  { value: '25', label: '25' },
                  { value: '50', label: '50' },
                  { value: '100', label: '100' },
                ]}
                value="10"
                onChange={() => {}}
                className="w-24"
              />
            </div>
          </div>
        </>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-gray-900/40 p-4 backdrop-blur-sm dark:bg-gray-900/60" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="w-full max-w-lg h-full bg-white shadow-xl overflow-y-auto dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 dark:bg-gray-900 dark:border-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{editingTrigger ? 'Редактировать триггер' : 'Создать триггер'}</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-6 space-y-6">

          <KwidInput
            label="Название"
            placeholder="Например, запрос оплаты"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Активно</label>
            <KwidSwitch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
          </div>

          <KwidInput
            label="Условие"
            placeholder="Например, если клиент просит оплатить"
            value={formData.conditions[0]?.value || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                conditions: [{ conditionType: 'message_contains', value: e.target.value, ordering: 0 }],
              }))
            }
            hint="Укажите, когда этот триггер должен срабатывать"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Действия<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="space-y-3">
              {formData.actions.map((action, index) => (
                <div key={index} className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                    aria-label="Переместить вверх"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                    aria-label="Переместить вниз"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <KwidSelect
                    options={[
                      { value: '', label: 'Выбрать действие' },
                      ...ACTION_TYPES.map((type) => ({ value: type.value, label: type.label })),
                    ]}
                    value={action.actionType}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        actions: prev.actions.map((a, i) =>
                          i === index ? { ...a, actionType: value } : a,
                        ),
                      }))
                    }
                    className="flex-1"
                  />
                </div>
              ))}
              <KwidButton variant="outline" size="sm" onClick={addAction} className="gap-2">
                <Plus className="h-4 w-4" />
                Добавить действие
              </KwidButton>
            </div>
          </div>

          <KwidInput
            label="Ответное сообщение"
            placeholder="Например, я обработал ваш запрос и создал задачу для нашей финансовой команды."
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            hint="Сообщение, возвращаемое при выполнении триггера"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Лимит запусков в чате
            </label>
            <div className="flex items-center gap-2">
              <KwidInput
                type="number"
                min={0}
                className="w-20"
                value="0"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">раз</span>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Максимальное количество запусков этого триггера в одном чате. Установите 0 для неограниченного количества.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <KwidButton variant="outline" onClick={() => setModalOpen(false)} disabled={isSaving}>
              Отменить
            </KwidButton>
            {!editingTrigger && (
              <KwidButton 
                variant="outline" 
                onClick={async () => {
                  await handleSave()
                  if (!isSaving) {
                    handleCreate()
                  }
                }} 
                disabled={isSaving}
              >
                Создать и создать еще один
              </KwidButton>
            )}
            <KwidButton onClick={handleSave} disabled={isSaving || !formData.name.trim() || !formData.conditions[0]?.value} variant="primary">
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
            </KwidButton>
          </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
