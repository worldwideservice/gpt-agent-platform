'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'

interface Trigger {
  id: string
  name: string
  condition: {
    type: 'message_contains' | 'stage_change' | 'field_change' | 'time_elapsed'
    value: string
  }
  actions: Array<{
    type: 'create_deal' | 'update_stage' | 'assign_manager' | 'send_message' | 'create_task'
    value: string
  }>
  isActive: boolean
}

const mockTriggers: Trigger[] = [
  {
    id: '1',
    name: 'Создание сделки при готовности к покупке',
    condition: {
      type: 'message_contains',
      value: 'купить, заказать, приобрести',
    },
    actions: [
      { type: 'create_deal', value: 'Основная воронка' },
      { type: 'assign_manager', value: 'Автоматически' },
    ],
    isActive: true,
  },
  {
    id: '2',
    name: 'Эскалация при негативе',
    condition: {
      type: 'message_contains',
      value: 'плохо, ужасно, не работает',
    },
    actions: [
      { type: 'create_task', value: 'Срочно связаться с клиентом' },
      { type: 'assign_manager', value: 'Менеджер по работе с клиентами' },
    ],
    isActive: true,
  },
]

export const TriggerManager = () => {
  const [triggers, setTriggers] = useState<Trigger[]>(mockTriggers)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTrigger, setEditingTrigger] = useState<Trigger | null>(null)

  const handleCreate = () => {
    setEditingTrigger(null)
    setModalOpen(true)
  }

  const handleEdit = (trigger: Trigger) => {
    setEditingTrigger(trigger)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setTriggers(prev => prev.filter(t => t.id !== id))
  }

  const handleToggleActive = (id: string) => {
    setTriggers(prev =>
      prev.map(t => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    )
  }

  const getConditionLabel = (condition: Trigger['condition']) => {
    const labels = {
      message_contains: 'Сообщение содержит',
      stage_change: 'Изменение этапа',
      field_change: 'Изменение поля',
      time_elapsed: 'Прошло времени',
    }
    return labels[condition.type]
  }

  const getActionLabel = (action: Trigger['actions'][0]) => {
    const labels = {
      create_deal: 'Создать сделку',
      update_stage: 'Изменить этап',
      assign_manager: 'Назначить менеджера',
      send_message: 'Отправить сообщение',
      create_task: 'Создать задачу',
    }
    return labels[action.type]
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Триггеры и автоматизация
        </h3>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Создать триггер
        </Button>
      </div>

      {triggers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">
              Триггеры позволяют автоматизировать действия агента на основе условий
            </p>
            <Button onClick={handleCreate}>Создать первый триггер</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {triggers.map(trigger => (
            <Card key={trigger.id} className={!trigger.isActive ? 'opacity-60' : ''}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{trigger.name}</h4>
                      {trigger.isActive && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="text-sm">
                        <span className="font-medium text-gray-600">Условие: </span>
                        <span className="text-gray-900">
                          {getConditionLabel(trigger.condition)} "{trigger.condition.value}"
                        </span>
                      </div>

                      <div className="text-sm">
                        <span className="font-medium text-gray-600">Действия: </span>
                        <ul className="mt-1 space-y-1">
                          {trigger.actions.map((action, index) => (
                            <li key={index} className="text-gray-900 ml-4">
                              • {getActionLabel(action)} → {action.value}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={trigger.isActive}
                          onChange={() => handleToggleActive(trigger.id)}
                          className="w-4 h-4 text-primary-600 rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Активен</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(trigger)}
                      className="p-2"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(trigger.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
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
        <div className="space-y-4">
          <Input
            label="Название триггера"
            placeholder="Например: Создание сделки при готовности"
            defaultValue={editingTrigger?.name}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Условие срабатывания
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Тип условия"
                options={[
                  { value: 'message_contains', label: 'Сообщение содержит' },
                  { value: 'stage_change', label: 'Изменение этапа' },
                  { value: 'field_change', label: 'Изменение поля' },
                  { value: 'time_elapsed', label: 'Прошло времени' },
                ]}
                defaultValue={editingTrigger?.condition.type || 'message_contains'}
              />
              <Input
                label="Значение"
                placeholder="купить, заказать"
                defaultValue={editingTrigger?.condition.value}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Действия
            </label>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Действие 1"
                  options={[
                    { value: 'create_deal', label: 'Создать сделку' },
                    { value: 'update_stage', label: 'Изменить этап' },
                    { value: 'assign_manager', label: 'Назначить менеджера' },
                    { value: 'send_message', label: 'Отправить сообщение' },
                    { value: 'create_task', label: 'Создать задачу' },
                  ]}
                />
                <Input placeholder="Значение действия" />
              </div>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Добавить действие
              </Button>
            </div>
          </div>

          <Textarea
            label="Описание (опционально)"
            placeholder="Краткое описание триггера"
            rows={3}
          />

          <div className="flex items-center justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Отмена
            </Button>
            <Button onClick={() => setModalOpen(false)}>
              {editingTrigger ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

