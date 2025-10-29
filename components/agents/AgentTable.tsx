'use client'

import Link from 'next/link'

import { Toggle } from '@/components/ui/Toggle'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

import type { Agent } from '@/types'

interface AgentTableProps {
  agents: Agent[]
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onStatusChange?: (id: string, status: boolean) => void
  isLoading?: boolean
}

export const AgentTable = ({
  agents,
  onDelete,
  onDuplicate,
  onStatusChange,
  isLoading = false,
}: AgentTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Название</TableHead>
            <TableHead className="w-32">Активно</TableHead>
            <TableHead>Модель ИИ</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="py-12 text-center text-sm text-slate-500">
                Загрузка агентов...
              </TableCell>
            </TableRow>
          ) : agents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-12 text-center text-sm text-slate-500">
                Агенты не найдены. Создайте первого агента, чтобы начать работу.
              </TableCell>
            </TableRow>
          ) : (
            agents.map((agent) => (
              <TableRow key={agent.id} className="border-b border-slate-100">
                <TableCell>
                  <div className="flex flex-col">
                    <Link
                      href={`/agents/${agent.id}`}
                      className="text-sm font-semibold text-slate-900 hover:text-primary-600 hover:underline"
                    >
                      {agent.name}
                    </Link>
                    <span className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                      Обновлён {formatDate(agent.updatedAt)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Toggle
                    checked={agent.status === 'active'}
                    onChange={(checked) => onStatusChange?.(agent.id, checked)}
                    aria-label={`Переключить статус агента ${agent.name}`}
                  />
                </TableCell>
                <TableCell className="text-sm text-slate-600">{agent.model ?? 'Не указана'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-3 text-sm font-medium">
                    <Link href={`/agents/${agent.id}`} className="text-primary-600 hover:text-primary-700">
                      Изменить
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDuplicate(agent.id)}
                      className="text-slate-500 transition-colors hover:text-slate-700"
                    >
                      Копировать
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(agent.id)}
                      className="text-rose-500 transition-colors hover:text-rose-600"
                    >
                      Удалить
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const formatDate = (value: string): string => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

