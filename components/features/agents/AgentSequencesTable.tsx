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
  MultiSelect,
} from '@/components/ui'
import type { MultiSelectOption } from '@/components/ui'

interface Agent {
  id: string
  name: string
}

interface AgentSequencesTableProps {
  agent: Agent
  tenantId: string
}

interface SequenceStep {
  id: string
  delay: number
  delayUnit: 'minutes' | 'hours' | 'days'
  actions: string[]
}

interface Sequence {
  id: string
  name: string
  isActive: boolean
  anyStageAllowed: boolean
  doNotRunCondition: string
  steps: SequenceStep[]
}

const ACTION_OPTIONS: MultiSelectOption[] = [
  { value: 'send-message', label: 'Отправить сообщение' },
  { value: 'change-stage', label: 'Изменить этап сделки' },
  { value: 'create-task', label: 'Создать задачу' },
  { value: 'run-salesbot', label: 'Запустить Salesbot' },
  { value: 'add-lead-tags', label: 'Добавить теги сделки' },
  { value: 'add-contact-tags', label: 'Добавить теги контакта' },
  { value: 'change-responsible', label: 'Изменить ответственного' },
  { value: 'send-files', label: 'Отправить файлы' },
  { value: 'send-webhook', label: 'Отправить вебхук' },
]

export function AgentSequencesTable({ agent, tenantId }: AgentSequencesTableProps) {
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock sequences data
  const [sequences, setSequences] = useState<Sequence[]>([])

  // New sequence form state
  const [newSequence, setNewSequence] = useState({
    name: '',
    isActive: true,
    anyStageAllowed: true,
    doNotRunCondition: '',
    steps: [
      { id: '1', delay: 1, delayUnit: 'hours' as const, actions: [] as string[] },
    ] as SequenceStep[],
  })

  const filteredSequences = sequences.filter((sequence) =>
    sequence.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggleActive = (sequenceId: string) => {
    setSequences(
      sequences.map((s) =>
        s.id === sequenceId ? { ...s, isActive: !s.isActive } : s
      )
    )
  }

  const handleAddStep = () => {
    setNewSequence({
      ...newSequence,
      steps: [
        ...newSequence.steps,
        { id: Date.now().toString(), delay: 1, delayUnit: 'hours', actions: [] },
      ],
    })
  }

  const handleRemoveStep = (stepId: string) => {
    if (newSequence.steps.length > 1) {
      setNewSequence({
        ...newSequence,
        steps: newSequence.steps.filter((s) => s.id !== stepId),
      })
    }
  }

  const handleMoveStepUp = (index: number) => {
    if (index > 0) {
      const newSteps = [...newSequence.steps]
      ;[newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]]
      setNewSequence({ ...newSequence, steps: newSteps })
    }
  }

  const handleMoveStepDown = (index: number) => {
    if (index < newSequence.steps.length - 1) {
      const newSteps = [...newSequence.steps]
      ;[newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]]
      setNewSequence({ ...newSequence, steps: newSteps })
    }
  }

  const handleUpdateStep = (stepId: string, updates: Partial<SequenceStep>) => {
    setNewSequence({
      ...newSequence,
      steps: newSequence.steps.map((s) =>
        s.id === stepId ? { ...s, ...updates } : s
      ),
    })
  }

  const handleCreateSequence = () => {
    const sequence: Sequence = {
      id: Date.now().toString(),
      name: newSequence.name,
      isActive: newSequence.isActive,
      anyStageAllowed: newSequence.anyStageAllowed,
      doNotRunCondition: newSequence.doNotRunCondition,
      steps: newSequence.steps,
    }

    setSequences([...sequences, sequence])
    setIsDialogOpen(false)
    setNewSequence({
      name: '',
      isActive: true,
      anyStageAllowed: true,
      doNotRunCondition: '',
      steps: [{ id: '1', delay: 1, delayUnit: 'hours', actions: [] }],
    })
  }

  const handleDeleteSequence = (sequenceId: string) => {
    setSequences(sequences.filter((s) => s.id !== sequenceId))
  }

  const getActionLabel = (value: string) => {
    return ACTION_OPTIONS.find((a) => a.value === value)?.label || value
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Цепочки</CardTitle>
            <p className="mt-1 text-sm text-gray-500">
              Автоматизируйте отправку последующих сообщений и выполнение действий по расписанию.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Создать</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Создать Цепочку</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Название */}
                <div className="space-y-2">
                  <Label htmlFor="sequence-name">
                    Название <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="sequence-name"
                    value={newSequence.name}
                    onChange={(e) => setNewSequence({ ...newSequence, name: e.target.value })}
                    placeholder="Например, Follow-up"
                  />
                </div>

                {/* Активно */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="sequence-active">Активно</Label>
                  <Switch
                    id="sequence-active"
                    checked={newSequence.isActive}
                    onCheckedChange={(checked) =>
                      setNewSequence({ ...newSequence, isActive: checked })
                    }
                  />
                </div>

                {/* Условия */}
                <div className="space-y-4 rounded-lg border p-4">
                  <h3 className="font-medium text-base">Условия</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="any-stage">
                      Любой этап сделки, разрешённый для этого агента ИИ
                    </Label>
                    <Switch
                      id="any-stage"
                      checked={newSequence.anyStageAllowed}
                      onCheckedChange={(checked) =>
                        setNewSequence({ ...newSequence, anyStageAllowed: checked })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sequence-condition">Не запускать цепочку, когда</Label>
                    <Textarea
                      id="sequence-condition"
                      value={newSequence.doNotRunCondition}
                      onChange={(e) =>
                        setNewSequence({ ...newSequence, doNotRunCondition: e.target.value })
                      }
                      rows={3}
                      placeholder="Опишите условия, когда цепочка не должна запускаться"
                    />
                  </div>
                </div>

                {/* Шаги */}
                <div className="space-y-4 rounded-lg border p-4">
                  <h3 className="font-medium text-base">Шаги</h3>
                  <div className="space-y-4">
                    {newSequence.steps.map((step, index) => (
                      <div key={step.id} className="space-y-3 rounded-lg border p-4 bg-gray-50 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">Шаг {index + 1}</h4>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveStepUp(index)}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveStepDown(index)}
                              disabled={index === newSequence.steps.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveStep(step.id)}
                              disabled={newSequence.steps.length === 1}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Задержка */}
                        <div className="space-y-2">
                          <Label>Подождать</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              value={step.delay}
                              onChange={(e) =>
                                handleUpdateStep(step.id, {
                                  delay: parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-24"
                            />
                            <Select
                              value={step.delayUnit}
                              onValueChange={(value) =>
                                handleUpdateStep(step.id, {
                                  delayUnit: value as 'minutes' | 'hours' | 'days',
                                })
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="minutes">Минут</SelectItem>
                                <SelectItem value="hours">Часов</SelectItem>
                                <SelectItem value="days">Дней</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Действия */}
                        <div className="space-y-2">
                          <Label>Действия</Label>
                          <MultiSelect
                            options={ACTION_OPTIONS}
                            selected={step.actions}
                            onChange={(selected) =>
                              handleUpdateStep(step.id, { actions: selected })
                            }
                            placeholder="Выберите действия для выполнения..."
                          />
                          <p className="text-xs text-gray-500">
                            Можно выбрать несколько действий
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddStep}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить шаг
                  </Button>
                  <p className="text-xs text-gray-500">
                    Шаги будут выполнены последовательно с указанными задержками
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Button onClick={handleCreateSequence}>Создать</Button>
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
        {filteredSequences.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="p-2 font-medium">Название</th>
                  <th className="p-2 font-medium">Активно</th>
                  <th className="p-2 font-medium">Шаги</th>
                  <th className="p-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredSequences.map((sequence) => (
                  <tr key={sequence.id}>
                    <td className="p-2 font-medium text-gray-900 dark:text-gray-50">
                      {sequence.name}
                    </td>
                    <td className="p-2">
                      <Switch
                        checked={sequence.isActive}
                        onCheckedChange={() => handleToggleActive(sequence.id)}
                      />
                    </td>
                    <td className="p-2 text-gray-500">
                      {sequence.steps.length} {sequence.steps.length === 1 ? 'шаг' : 'шагов'}
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
                          onClick={() => handleDeleteSequence(sequence.id)}
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
            <h4 className="text-lg font-medium">Не найдено Цепочки</h4>
            <p className="text-sm text-gray-500">Создать Цепочку для старта.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
