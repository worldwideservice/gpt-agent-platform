'use client'

import { useState } from 'react'
import { Edit, Trash2, Plus, ArrowUp, ArrowDown, X } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Switch,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'

interface Agent {
  id: string
  name: string
}

interface AgentTriggersTableProps {
  agent: Agent
  tenantId: string
}

interface TriggerAction {
  id: string
  type: string
}

interface Trigger {
  id: string
  name: string
  isActive: boolean
  condition: string
  actions: TriggerAction[]
  responseMessage?: string
  runLimit?: number
}

const TRIGGER_ACTIONS = [
  { value: 'change-stage', label: 'Изменить этап сделки' },
  { value: 'stop-agents', label: 'Остановить агентов в этом чате' },
  { value: 'create-task', label: 'Создать задачу' },
  { value: 'run-salesbot', label: 'Запустить Salesbot' },
  { value: 'add-lead-tags', label: 'Добавить теги сделки' },
  { value: 'add-contact-tags', label: 'Добавить теги контакта' },
  { value: 'add-lead-note', label: 'Добавить примечание к сделке' },
  { value: 'add-contact-note', label: 'Добавить примечание к контакту' },
  { value: 'change-responsible', label: 'Изменить ответственного' },
  { value: 'send-files', label: 'Отправить файлы' },
  { value: 'send-webhook', label: 'Отправить вебхук' },
]

export function AgentTriggersTable({ agent, tenantId }: AgentTriggersTableProps) {
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock triggers data
  const [triggers, setTriggers] = useState<Trigger[]>([
    {
      id: '1',
      name: 'Тип услуги "AGENT PARTNERSHIP"',
      isActive: true,
      condition: 'Когда ты понял, что это клиент по продукту AGENT P...',
      actions: [
        { id: '1', type: 'change-stage' },
        { id: '2', type: 'create-task' },
      ],
      responseMessage: 'Я создал задачу для нашей команды.',
      runLimit: 1,
    },
  ])

  // New trigger form state
  const [newTrigger, setNewTrigger] = useState({
    name: '',
    isActive: true,
    condition: '',
    actions: [{ id: '1', type: '' }] as TriggerAction[],
    responseMessage: '',
    runLimit: 0,
  })

  const filteredTriggers = triggers.filter((trigger) =>
    trigger.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggleActive = (triggerId: string) => {
    setTriggers(
      triggers.map((t) =>
        t.id === triggerId ? { ...t, isActive: !t.isActive } : t
      )
    )
  }

  const handleAddAction = () => {
    setNewTrigger({
      ...newTrigger,
      actions: [...newTrigger.actions, { id: Date.now().toString(), type: '' }],
    })
  }

  const handleRemoveAction = (actionId: string) => {
    if (newTrigger.actions.length > 1) {
      setNewTrigger({
        ...newTrigger,
        actions: newTrigger.actions.filter((a) => a.id !== actionId),
      })
    }
  }

  const handleMoveActionUp = (index: number) => {
    if (index > 0) {
      const newActions = [...newTrigger.actions]
      ;[newActions[index - 1], newActions[index]] = [newActions[index], newActions[index - 1]]
      setNewTrigger({ ...newTrigger, actions: newActions })
    }
  }

  const handleMoveActionDown = (index: number) => {
    if (index < newTrigger.actions.length - 1) {
      const newActions = [...newTrigger.actions]
      ;[newActions[index], newActions[index + 1]] = [newActions[index + 1], newActions[index]]
      setNewTrigger({ ...newTrigger, actions: newActions })
    }
  }

  const handleUpdateAction = (actionId: string, type: string) => {
    setNewTrigger({
      ...newTrigger,
      actions: newTrigger.actions.map((a) =>
        a.id === actionId ? { ...a, type } : a
      ),
    })
  }

  const handleCreateTrigger = () => {
    const trigger: Trigger = {
      id: Date.now().toString(),
      name: newTrigger.name,
      isActive: newTrigger.isActive,
      condition: newTrigger.condition,
      actions: newTrigger.actions.filter((a) => a.type), // Only include actions with type
      responseMessage: newTrigger.responseMessage,
      runLimit: newTrigger.runLimit,
    }

    setTriggers([...triggers, trigger])
    setIsDialogOpen(false)
    setNewTrigger({
      name: '',
      isActive: true,
      condition: '',
      actions: [{ id: '1', type: '' }],
      responseMessage: '',
      runLimit: 0,
    })
  }

  const handleDeleteTrigger = (triggerId: string) => {
    setTriggers(triggers.filter((t) => t.id !== triggerId))
  }

  const getActionLabel = (type: string) => {
    return TRIGGER_ACTIONS.find((a) => a.value === type)?.label || type
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Триггеры</CardTitle>
            <p className="mt-1 text-sm text-gray-500">
              Выполняйте мгновенные действия при соблюдении определённых условий в ходе разговора.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Создать</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Создать Триггер</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Название */}
                <div className="space-y-2">
                  <Label htmlFor="trigger-name">
                    Название <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="trigger-name"
                    value={newTrigger.name}
                    onChange={(e) => setNewTrigger({ ...newTrigger, name: e.target.value })}
                    placeholder="Например, запрос оплаты"
                  />
                </div>

                {/* Активно */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="trigger-active">Активно</Label>
                  <Switch
                    id="trigger-active"
                    checked={newTrigger.isActive}
                    onCheckedChange={(checked) =>
                      setNewTrigger({ ...newTrigger, isActive: checked })
                    }
                  />
                </div>

                {/* Условие */}
                <div className="space-y-2">
                  <Label htmlFor="trigger-condition">
                    Условие <span className="text-rose-500">*</span>
                  </Label>
                  <Textarea
                    id="trigger-condition"
                    value={newTrigger.condition}
                    onChange={(e) => setNewTrigger({ ...newTrigger, condition: e.target.value })}
                    placeholder="Например, если клиент просит оплатить"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    Укажите, когда этот триггер должен срабатывать
                  </p>
                </div>

                {/* Действия (множественные) */}
                <div className="space-y-3">
                  <Label>
                    Действия <span className="text-rose-500">*</span>
                  </Label>
                  <div className="space-y-2">
                    {newTrigger.actions.map((action, index) => (
                      <div key={action.id} className="flex items-center gap-2">
                        <div className="flex-1">
                          <Select
                            value={action.type}
                            onValueChange={(value) => handleUpdateAction(action.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Выбрать действие" />
                            </SelectTrigger>
                            <SelectContent>
                              {TRIGGER_ACTIONS.map((actionType) => (
                                <SelectItem key={actionType.value} value={actionType.value}>
                                  {actionType.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveActionUp(index)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveActionDown(index)}
                            disabled={index === newTrigger.actions.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAction(action.id)}
                            disabled={newTrigger.actions.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddAction}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить действие
                  </Button>
                  <p className="text-xs text-gray-500">
                    Действия будут выполнены в указанном порядке
                  </p>
                </div>

                {/* Ответное сообщение */}
                <div className="space-y-2">
                  <Label htmlFor="trigger-response">Ответное сообщение</Label>
                  <Textarea
                    id="trigger-response"
                    value={newTrigger.responseMessage}
                    onChange={(e) =>
                      setNewTrigger({ ...newTrigger, responseMessage: e.target.value })
                    }
                    placeholder="Например, я обработал ваш запрос и создал задачу для нашей финансовой команды."
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    Сообщение, возвращаемое при выполнении триггера
                  </p>
                </div>

                {/* Лимит запусков */}
                <div className="space-y-2">
                  <Label htmlFor="trigger-limit">Лимит запусков в чате</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="trigger-limit"
                      type="number"
                      min="0"
                      value={newTrigger.runLimit}
                      onChange={(e) =>
                        setNewTrigger({ ...newTrigger, runLimit: parseInt(e.target.value) || 0 })
                      }
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">раз</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Максимальное количество запусков этого триггера в одном чате. Установите 0 для
                    неограниченного количества.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Button onClick={handleCreateTrigger}>Создать</Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отменить
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Поиск */}
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск"
        />

        {/* Таблица */}
        {filteredTriggers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="p-2 font-medium">Название</th>
                  <th className="p-2 font-medium">Активно</th>
                  <th className="p-2 font-medium">Условие</th>
                  <th className="p-2 font-medium">Действия</th>
                  <th className="p-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredTriggers.map((trigger) => (
                  <tr key={trigger.id}>
                    <td className="p-2 font-medium text-gray-900 dark:text-gray-50">
                      {trigger.name}
                    </td>
                    <td className="p-2">
                      <Switch
                        checked={trigger.isActive}
                        onCheckedChange={() => handleToggleActive(trigger.id)}
                      />
                    </td>
                    <td className="p-2 text-gray-500 max-w-xs truncate">
                      {trigger.condition}
                    </td>
                    <td className="p-2 text-gray-500">
                      {trigger.actions.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {trigger.actions.map((action, idx) => (
                            <span key={action.id} className="text-xs">
                              {idx + 1}. {getActionLabel(action.type)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Изменить
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTrigger(trigger.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Удалить
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <h4 className="text-lg font-medium">Не найдено Триггеры</h4>
            <p className="text-sm text-gray-500">Создать Триггер для старта.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
