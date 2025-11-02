'use client'

import Link from 'next/link'
import { Edit, Copy, Trash2 } from 'lucide-react'

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
            <TableHead className="fi-ta-header-cell px-3 py-3.5 sm:first-of-type:ps-6 w-12">
              {onSelectAll && (
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected
                  }}
                  onChange={onSelectAll}
                  className="fi-checkbox-input rounded border-none bg-white shadow-sm ring-1 transition duration-75 checked:ring-0 focus:ring-2 focus:ring-offset-0 disabled:pointer-events-none disabled:bg-gray-50 disabled:text-gray-500"
                  aria-label="Выбрать/снять все элементы для массовых действий"
                />
              )}
            </TableHead>
            <TableHead className="fi-ta-header-cell px-3 py-3.5 sm:first-of-type:ps-6 fi-table-header-cell-name">
              Название
            </TableHead>
            <TableHead className="fi-ta-header-cell px-3 py-3.5 sm:first-of-type:ps-6 w-32">
              <span className="fi-ta-header-cell-label text-sm font-semibold text-gray-950 dark:text-white">
                Активно
              </span>
            </TableHead>
            <TableHead className="fi-ta-header-cell px-3 py-3.5 sm:first-of-type:ps-6 sm:last-of-type:pe-6 fi-table-header-cell-llm-model.name">
              Модель ИИ
            </TableHead>
            <TableHead className="fi-ta-header-cell px-3 py-3.5 sm:last-of-type:pe-6 text-right">
              Actions
            </TableHead>
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
                <TableCell className="px-3 py-4">
                  {onSelectAgent && (
                    <input
                      type="checkbox"
                      checked={selectedAgents.includes(agent.id)}
                      onChange={() => onSelectAgent(agent.id)}
                      className="fi-checkbox-input rounded border-none bg-white shadow-sm ring-1 transition duration-75 checked:ring-0 focus:ring-2 focus:ring-offset-0 disabled:pointer-events-none disabled:bg-gray-50 disabled:text-gray-500"
                      aria-label={`Выбрать/отменить ${agent.id} для массовых действий`}
                      value={agent.id}
                    />
                  )}
                </TableCell>
                <TableCell className="px-3 py-4">
                  <Link
                    href={getAgentPath(agent.id)}
                    className="fi-ta-text grid w-full gap-y-1 text-gray-900 hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
                  >
                    {agent.name}
                  </Link>
                </TableCell>
                <TableCell className="px-3 py-4">
                  <div className="fi-ta-toggle">
                    <KwidSwitch
                      checked={agent.status === 'active'}
                      onCheckedChange={(checked) => onStatusChange?.(agent.id, checked)}
                    />
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap px-3 py-4 text-sm">
                  <Link
                    href={getAgentPath(agent.id)}
                    className="text-gray-900 hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
                  >
                    {agent.model ?? 'Не указана'}
                  </Link>
                </TableCell>
                <TableCell className="whitespace-nowrap px-3 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={getAgentPath(agent.id)}
                      className="fi-link group/link relative inline-flex items-center justify-center outline-none fi-size-sm fi-link-size-sm gap-1 fi-color-custom fi-color-primary fi-ac-action fi-ac-link-action"
                      style={{
                        '--c-400': 'var(--primary-400)',
                        '--c-600': 'var(--primary-600)',
                      } as React.CSSProperties}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="font-semibold text-sm text-custom-600 dark:text-custom-400 group-hover/link:underline group-focus-visible/link:underline">
                        Изменить
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDuplicate(agent.id)}
                      className="fi-link group/link relative inline-flex items-center justify-center outline-none fi-size-sm fi-link-size-sm gap-1 fi-color-custom fi-color-primary fi-ac-action fi-ac-link-action"
                      style={{
                        '--c-400': 'var(--primary-400)',
                        '--c-600': 'var(--primary-600)',
                      } as React.CSSProperties}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="font-semibold text-sm text-custom-600 dark:text-custom-400 group-hover/link:underline group-focus-visible/link:underline">
                        Копировать
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(agent.id)}
                      className="fi-link group/link relative inline-flex items-center justify-center outline-none fi-size-sm fi-link-size-sm gap-1 fi-color-custom fi-ac-action fi-ac-link-action"
                      style={{
                        '--c-400': 'var(--danger-400)',
                        '--c-600': 'var(--danger-600)',
                      } as React.CSSProperties}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="font-semibold text-sm text-custom-600 dark:text-custom-400 group-hover/link:underline group-focus-visible/link:underline">
                        Удалить
                      </span>
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
