'use client'

import { useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'
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

interface Trigger {
  id: string
  name: string
  isActive: boolean
  condition: string
  action: string
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
      action: 'change-stage',
    },
  ])

  // New trigger form state
  const [newTrigger, setNewTrigger] = useState({
    name: '',
    isActive: true,
    condition: '',
    action: '',
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

  const handleCreateTrigger = () => {
    const trigger: Trigger = {
      id: Date.now().toString(),
      name: newTrigger.name,
      isActive: newTrigger.isActive,
      condition: newTrigger.condition,
      action: newTrigger.action,
    }

    setTriggers([...triggers, trigger])
    setIsDialogOpen(false)
    setNewTrigger({
      name: '',
      isActive: true,
      condition: '',
      action: '',
      responseMessage: '',
      runLimit: 0,
    })
  }

  const handleDeleteTrigger = (triggerId: string) => {
    setTriggers(triggers.filter((t) => t.id !== triggerId))
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

                {/* Действия */}
                <div className="space-y-2">
                  <Label htmlFor="trigger-action">
                    Действие <span className="text-rose-500">*</span>
                  </Label>
                  <Select
                    value={newTrigger.action}
                    onValueChange={(value) => setNewTrigger({ ...newTrigger, action: value })}
                  >
                    <SelectTrigger id="trigger-action">
                      <SelectValue placeholder="Выбрать вариант" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRIGGER_ACTIONS.map((action) => (
                        <SelectItem key={action.value} value={action.value}>
                          {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <td className="p-2 text-gray-500">{trigger.condition}</td>
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
