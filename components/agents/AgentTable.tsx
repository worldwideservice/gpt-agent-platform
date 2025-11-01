'use client'

import Link from 'next/link'

import { KwidSwitch } from '@/components/kwid'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { useTenantId } from '@/hooks/useTenantId'

import type { Agent } from '@/types'

interface AgentTableProps {
  agents: Agent[]
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onStatusChange?: (id: string, status: boolean) => void
  isLoading?: boolean
  selectedAgents?: string[]
  onSelectAgent?: (id: string) => void
  onSelectAll?: () => void
}

export const AgentTable = ({
  agents,
  onDelete,
  onDuplicate,
  onStatusChange,
  isLoading = false,
  selectedAgents = [],
  onSelectAgent,
  onSelectAll,
}: AgentTableProps) => {
  const tenantId = useTenantId()
  const allSelected = agents.length > 0 && agents.every(agent => selectedAgents.includes(agent.id))
  const someSelected = selectedAgents.length > 0 && !allSelected
  
  const getAgentPath = (agentId: string) => {
    return tenantId ? `/manage/${tenantId}/ai-agents/${agentId}/edit` : `/agents/${agentId}/edit`
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800">
            <TableHead className="w-12">
              {onSelectAll && (
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected
                  }}
                  onChange={onSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-custom-600 focus:ring-custom-500 dark:border-gray-600 dark:text-custom-400 dark:focus:ring-custom-400"
                  aria-label="Выбрать все агенты"
                />
              )}
            </TableHead>
            <TableHead>Название</TableHead>
            <TableHead className="w-32">Активно</TableHead>
            <TableHead>Модель ИИ</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                Загрузка агентов...
              </TableCell>
            </TableRow>
          ) : agents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                Агенты не найдены. Создайте первого агента, чтобы начать работу.
              </TableCell>
            </TableRow>
          ) : (
            agents.map((agent) => (
              <TableRow key={agent.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                <TableCell>
                  {onSelectAgent && (
                    <input
                      type="checkbox"
                      checked={selectedAgents.includes(agent.id)}
                      onChange={() => onSelectAgent(agent.id)}
                      className="h-4 w-4 rounded border-gray-300 text-custom-600 focus:ring-custom-500 dark:border-gray-600 dark:text-custom-400 dark:focus:ring-custom-400"
                      aria-label={`Выбрать агента ${agent.name}`}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <Link
                      href={getAgentPath(agent.id)}
                      className="text-sm font-semibold text-gray-900 hover:text-custom-600 hover:underline dark:text-white dark:hover:text-custom-400"
                    >
                      {agent.name}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  <KwidSwitch
                    checked={agent.status === 'active'}
                    onCheckedChange={(checked) => onStatusChange?.(agent.id, checked)}
                  />
                </TableCell>
                <TableCell className="text-sm text-gray-600 dark:text-gray-400">{agent.model ?? 'Не указана'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-3 text-sm font-medium">
                    <Link href={getAgentPath(agent.id)} className="text-custom-600 hover:text-custom-700 dark:text-custom-400 dark:hover:text-custom-300">
                      Изменить
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDuplicate(agent.id)}
                      className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      Копировать
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(agent.id)}
                      className="text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
