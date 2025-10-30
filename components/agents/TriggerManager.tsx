'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, Edit, Trash2, CheckCircle, Loader2, Zap, Search, Filter, ArrowDown, X, ChevronUp, ChevronDown, Link2, Settings } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
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
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Триггеры</h2>
        <p className="mt-1 text-sm text-slate-500">
          Выполняйте мгновенные действия при соблюдении определённых условий в ходе разговора.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Поиск"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-primary-200 hover:text-primary-600"
            aria-label="Фильтры"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Создать
        </Button>
      </div>

      {triggers.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Zap className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900">Не найдено Триггеры</h3>
          <p className="mb-6 text-sm text-slate-500">Создать Триггер для старта.</p>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Создать
          </Button>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedTriggers.length === filteredTriggers.length && filteredTriggers.length > 0}
                      ref={(input) => {
                        if (input) input.indeterminate = selectedTriggers.length > 0 && selectedTriggers.length < filteredTriggers.length
                      }}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      aria-label="Выбрать все триггеры"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Название</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                    <button className="flex items-center gap-1 hover:text-slate-900">
                      Активно
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Условие</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredTriggers.map((trigger) => {
                  const conditionText = trigger.conditions.length > 0 
                    ? `Когда ты понял, что это клиент по продукту ${formatConditionValue(trigger.conditions[0]).substring(0, 50)}...`
                    : 'Нет условия'
                  return (
                    <tr key={trigger.id} className="border-b border-slate-100">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedTriggers.includes(trigger.id)}
                          onChange={() => handleSelectTrigger(trigger.id)}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          aria-label={`Выбрать триггер ${trigger.name}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-slate-900">{trigger.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleActive(trigger.id, trigger.isActive)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                            trigger.isActive ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                          aria-label={trigger.isActive ? 'Деактивировать' : 'Активировать'}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              trigger.isActive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-600">{conditionText}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleEdit(trigger)}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Изменить
                          </button>
                          <button
                            onClick={() => handleDelete(trigger.id)}
                            className="text-rose-500 hover:text-rose-600 text-sm font-medium flex items-center gap-1"
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
          <div className="flex items-center justify-between text-sm text-slate-500">
            <p>Показано с {filteredTriggers.length > 0 ? 1 : 0} по {filteredTriggers.length} из {triggers.length}</p>
            <div className="flex items-center gap-4">
              <p>на страницу</p>
              <select className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 p-4 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="w-full max-w-lg h-full bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-semibold text-slate-900">{editingTrigger ? 'Редактировать триггер' : 'Создать триггер'}</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-6 space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              placeholder="Например, запрос оплаты"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Активно</label>
            <button
              onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                formData.isActive ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.isActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Условие<span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              placeholder="Например, если клиент просит оплатить"
              value={formData.conditions[0]?.value || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  conditions: [{ conditionType: 'message_contains', value: e.target.value, ordering: 0 }],
                }))
              }
            />
            <p className="mt-1 text-xs text-gray-500">
              Укажите, когда этот триггер должен срабатывать
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Действия<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="space-y-3">
              {formData.actions.map((action, index) => (
                <div key={index} className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Переместить вверх"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Переместить вниз"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <select
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    value={action.actionType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        actions: prev.actions.map((a, i) =>
                          i === index ? { ...a, actionType: e.target.value } : a,
                        ),
                      }))
                    }
                  >
                    <option value="">Выбрать действие</option>
                    {ACTION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addAction} className="gap-2">
                <Plus className="h-4 w-4" />
                Добавить действие
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ответное сообщение
            </label>
            <Input
              placeholder="Например, я обработал ваш запрос и создал задачу для нашей финансовой команды."
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
            <p className="mt-1 text-xs text-gray-500">
              Сообщение, возвращаемое при выполнении триггера
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Лимит запусков в чате
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                value="0"
              />
              <span className="text-sm text-gray-600">раз</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Максимальное количество запусков этого триггера в одном чате. Установите 0 для неограниченного количества.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isSaving}>
              Отменить
            </Button>
            {!editingTrigger && (
              <Button 
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
              </Button>
            )}
            <Button onClick={handleSave} disabled={isSaving || !formData.name.trim() || !formData.conditions[0]?.value}>
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
          </div>
        </div>
      )}
    </div>
  )
}
