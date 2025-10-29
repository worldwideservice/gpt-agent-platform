'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Copy, Edit, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

import type { Agent } from '@/types'
import { formatNumber } from '@/lib/utils'

interface AgentTableProps {
  agents: Agent[]
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  isLoading?: boolean
}

export const AgentTable = ({ agents, onDelete, onDuplicate, isLoading = false }: AgentTableProps) => {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])

  useEffect(() => {
    setSelectedAgents((prev) => prev.filter((id) => agents.some((agent) => agent.id === id)))
  }, [agents])

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedAgents(agents.map((agent) => agent.id))
      return
    }

    setSelectedAgents([])
  }

  const handleSelectAgent = (id: string) => {
    setSelectedAgents((prev) =>
      prev.includes(id) ? prev.filter((agentId) => agentId !== id) : [...prev, id],
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

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="py-10 text-center text-sm text-gray-500">
            Загрузка агентов...
          </TableCell>
        </TableRow>
      )
    }

    if (agents.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="py-10 text-center text-sm text-gray-500">
            Агенты не найдены
          </TableCell>
        </TableRow>
      )
    }

    return agents.map((agent) => (
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
          <span className="text-sm text-gray-600">{agent.model ?? '—'}</span>
        </TableCell>
        <TableCell>
          <span className="text-sm text-gray-600">{formatNumber(agent.messagesTotal)}</span>
        </TableCell>
        <TableCell>
          <span className="text-sm text-gray-600">{formatRelativeActivity(agent.lastActivityAt)}</span>
        </TableCell>
        <TableCell>
          <span className="text-sm text-gray-600">{formatDate(agent.createdAt)}</span>
        </TableCell>
        <TableCell>
          <span className="text-sm text-gray-600">{formatDate(agent.updatedAt)}</span>
        </TableCell>
        <TableCell>
          <div className="flex items-center justify-end space-x-2">
            <Link href={`/agents/${agent.id}`}>
              <Button variant="ghost" size="sm" className="p-2" aria-label="Редактировать">
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
    ))
  }

  return (
    <div className="space-y-4">
      {selectedAgents.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-primary-200 bg-primary-50 p-4">
          <span className="text-sm font-medium text-primary-900">
            Выбрано: {selectedAgents.length}
          </span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Массовое изменение статуса
            </Button>
            <Button variant="destructive" size="sm">
              Удалить выбранные
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={agents.length > 0 && selectedAgents.length === agents.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  aria-label="Выбрать все"
                  disabled={agents.length === 0 || isLoading}
                />
              </TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Модель</TableHead>
              <TableHead>Сообщений</TableHead>
              <TableHead>Последняя активность</TableHead>
              <TableHead>Создан</TableHead>
              <TableHead>Обновлён</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderTableBody()}</TableBody>
        </Table>
      </div>
    </div>
  )
}

const formatDate = (value: string): string => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleDateString('ru-RU')
}

const formatRelativeActivity = (value: string | null): string => {
  if (!value) {
    return 'нет данных'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'нет данных'
  }

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffMinutes < 1) {
    return 'только что'
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} мин назад`
  }

  const diffHours = Math.floor(diffMinutes / 60)

  if (diffHours < 24) {
    return `${diffHours} ч назад`
  }

  const diffDays = Math.floor(diffHours / 24)

  if (diffDays < 7) {
    return `${diffDays} дн назад`
  }

  return date.toLocaleDateString('ru-RU')
}

