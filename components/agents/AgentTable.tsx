'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Copy, Trash2, Plus } from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/Table'
import type { Agent } from '@/types'

interface AgentTableProps {
  agents: Agent[]
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
}

export const AgentTable = ({ agents, onDelete, onDuplicate }: AgentTableProps) => {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedAgents(agents.map(agent => agent.id))
    } else {
      setSelectedAgents([])
    }
  }

  const handleSelectAgent = (id: string) => {
    setSelectedAgents(prev =>
      prev.includes(id) ? prev.filter(agentId => agentId !== id) : [...prev, id]
    )
  }

  const getStatusBadge = (status: Agent['status']) => {
    const statusConfig = {
      active: { variant: 'success' as const, label: 'Активен' },
      inactive: { variant: 'warning' as const, label: 'Неактивен' },
      draft: { variant: 'default' as const, label: 'Черновик' },
    }

    const config = statusConfig[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="space-y-4">
      {selectedAgents.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-primary-900">
            Выбрано: {selectedAgents.length}
          </span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Массовое изменение статуса
            </Button>
            <Button variant="danger" size="sm">
              Удалить выбранные
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selectedAgents.length === agents.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  aria-label="Выбрать все"
                />
              </TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Модель</TableHead>
              <TableHead>Создан</TableHead>
              <TableHead>Обновлён</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedAgents.includes(agent.id)}
                    onChange={() => handleSelectAgent(agent.id)}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    aria-label={`Выбрать ${agent.name}`}
                  />
                </TableCell>
                <TableCell>
                  <Link
                    href={`/agents/${agent.id}`}
                    className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    {agent.name}
                  </Link>
                </TableCell>
                <TableCell>{getStatusBadge(agent.status)}</TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{agent.model}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {new Date(agent.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {new Date(agent.updatedAt).toLocaleDateString('ru-RU')}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end space-x-2">
                    <Link href={`/agents/${agent.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2"
                        aria-label="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2"
                      onClick={() => onDuplicate(agent.id)}
                      aria-label="Дублировать"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDelete(agent.id)}
                      aria-label="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

