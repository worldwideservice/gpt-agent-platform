'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@/components/ui'

export type AgentListItem = {
  id: string
  name: string
  status: string
  model?: string | null
  ownerName?: string | null
  updatedAt?: string
}

type StatusFilter = 'all' | 'active' | 'inactive' | 'draft'

interface AgentsTableProps {
  tenantId: string
  initialAgents?: AgentListItem[]
  initialError?: string | null
  initialStatusFilter?: StatusFilter
  onStatusChange?: (status: StatusFilter) => void
}

export function AgentsTable({
  tenantId,
  initialAgents,
  initialError,
  initialStatusFilter,
  onStatusChange,
}: AgentsTableProps) {
  const [agents, setAgents] = useState<AgentListItem[]>(initialAgents ?? [])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatusFilter ?? 'all')
  const [loading, setLoading] = useState(!initialAgents?.length && !initialError)
  const [error, setError] = useState<string | null>(initialError ?? null)
  const filtersReadyRef = useRef(false)

  useEffect(() => {
    if (initialAgents) {
      setAgents(initialAgents)
    }
  }, [initialAgents])

  useEffect(() => {
    if (initialError) {
      setError(initialError)
    }
  }, [initialError])

  useEffect(() => {
    if (initialStatusFilter) {
      setStatusFilter(initialStatusFilter)
    }
  }, [initialStatusFilter])

  useEffect(() => {
    onStatusChange?.(statusFilter)
  }, [statusFilter, onStatusChange])

  const fetchAgents = useCallback(
    async (params?: { searchQuery?: string; status?: StatusFilter }) => {
      setLoading(true)
      setError(null)

      try {
        const query = new URLSearchParams()
        if (params?.searchQuery) {
          query.set('search', params.searchQuery)
        }
        if (params?.status && params.status !== 'all') {
          query.set('status', params.status)
        }

        const response = await fetch(`/api/agents${query.toString() ? `?${query.toString()}` : ''}`, {
          cache: 'no-store',
        })
        const payload = await response.json()
        if (!response.ok || !payload.success) {
          throw new Error(payload.error || 'Не удалось загрузить агентов')
        }
        setAgents(payload.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки')
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    if ((!initialAgents || initialAgents.length === 0) && !initialError) {
      void fetchAgents()
    } else {
      filtersReadyRef.current = true
    }
  }, [initialAgents, initialError, fetchAgents])

  useEffect(() => {
    if (!filtersReadyRef.current) {
      filtersReadyRef.current = true
      return
    }

    const handle = setTimeout(() => {
      void fetchAgents({ searchQuery: search, status: statusFilter })
    }, 400)

    return () => clearTimeout(handle)
  }, [search, statusFilter, fetchAgents])

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Агенты ИИ</CardTitle>
            <CardDescription>Управляйте агентами внутри workspace `{tenantId}`</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchAgents({ searchQuery: search, status: statusFilter })}
              disabled={loading}
            >
              Обновить
            </Button>
            <Button size="sm">Создать агента</Button>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск по имени агента" />
          <div>
          <select
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="inactive">Выключенные</option>
              <option value="draft">Черновики</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-sm text-gray-500">Загрузка агентов…</p>}
        {error && (
          <p className="text-sm text-rose-500">
            {error}. Убедитесь, что вы авторизованы и Supabase настроен.
          </p>
        )}
        {!loading && !error && filteredAgents.length === 0 && (
          <p className="text-sm text-gray-500">Агенты не найдены. Создайте первого, чтобы начать.</p>
        )}

        {filteredAgents.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="p-2 font-medium">Название</th>
                  <th className="p-2 font-medium">Статус</th>
                  <th className="p-2 font-medium">Модель</th>
                  <th className="p-2 font-medium">Владелец</th>
                  <th className="p-2 font-medium">Обновлён</th>
                  <th className="p-2 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredAgents.map((agent) => (
                  <tr key={agent.id}>
                    <td className="p-2 font-medium text-gray-900 dark:text-gray-50">{agent.name}</td>
                    <td className="p-2">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs capitalize">
                        {agent.status}
                      </span>
                    </td>
                    <td className="p-2 text-gray-500">{agent.model ?? '—'}</td>
                    <td className="p-2 text-gray-500">{agent.ownerName ?? '—'}</td>
                    <td className="p-2 text-gray-500">
                      {agent.updatedAt ? new Date(agent.updatedAt).toLocaleDateString('ru-RU') : '—'}
                    </td>
                    <td className="p-2 text-right text-xs">
                      <Link
                        href={`/manage/${tenantId}/ai-agents/${agent.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        Настроить
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
