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
} from '@/components/ui'

interface Agent {
  id: string
  name: string
}

interface AgentSequencesTableProps {
  agent: Agent
  tenantId: string
}

interface Sequence {
  id: string
  name: string
  isActive: boolean
  condition: string
}

export function AgentSequencesTable({ agent, tenantId }: AgentSequencesTableProps) {
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock sequences data
  const [sequences, setSequences] = useState<Sequence[]>([])

  // New sequence form state
  const [newSequence, setNewSequence] = useState({
    name: '',
    isActive: true,
    condition: '',
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

  const handleCreateSequence = () => {
    const sequence: Sequence = {
      id: Date.now().toString(),
      name: newSequence.name,
      isActive: newSequence.isActive,
      condition: newSequence.condition,
    }

    setSequences([...sequences, sequence])
    setIsDialogOpen(false)
    setNewSequence({
      name: '',
      isActive: true,
      condition: '',
    })
  }

  const handleDeleteSequence = (sequenceId: string) => {
    setSequences(sequences.filter((s) => s.id !== sequenceId))
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Создать Цепочка</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
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
                <div className="space-y-3">
                  <h3 className="font-medium">Условия</h3>
                  <div className="flex items-center justify-between">
                    <Label>Любой этап сделки, разрешённый для этого агента ИИ</Label>
                    <Switch checked={true} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sequence-condition">Не запускать цепочку, когда</Label>
                    <Textarea
                      id="sequence-condition"
                      value={newSequence.condition}
                      onChange={(e) => setNewSequence({ ...newSequence, condition: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Шаги */}
                <div className="space-y-3">
                  <h3 className="font-medium">Шаги</h3>
                  <div className="space-y-2 rounded-lg border p-4">
                    <p className="text-sm text-gray-500">
                      Шаги можно настроить после создания цепочки
                    </p>
                  </div>
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
                  <th className="p-2 font-medium">Условие</th>
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
                    <td className="p-2 text-gray-500">{sequence.condition || '—'}</td>
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
            <p className="text-sm text-gray-500">Создать Цепочка для старта.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
