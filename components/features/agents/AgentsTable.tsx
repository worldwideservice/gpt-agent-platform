'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Edit, Columns3 } from 'lucide-react'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Switch,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Label,
} from '@/components/ui'
import { AgentCopyButton } from './AgentCopyButton'
import { AgentDeleteButton } from './AgentDeleteButton'

export type AgentListItem = {
  id: string
  name: string
  isActive: boolean
  status: string
  model?: string | null
  ownerName?: string | null
  createdAt?: string
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

  // Column visibility state (persisted in localStorage)
  const [showCreatedAt, setShowCreatedAt] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agentsTable.showCreatedAt')
      return saved !== null ? saved === 'true' : false
    }
    return false
  })

  const [showUpdatedAt, setShowUpdatedAt] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agentsTable.showUpdatedAt')
      return saved !== null ? saved === 'true' : true
    }
    return true
  })

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

  const toggleCreatedAt = () => {
    setShowCreatedAt((prev) => {
      const newValue = !prev
      localStorage.setItem('agentsTable.showCreatedAt', String(newValue))
      return newValue
    })
  }

  const toggleUpdatedAt = () => {
    setShowUpdatedAt((prev) => {
      const newValue = !prev
      localStorage.setItem('agentsTable.showUpdatedAt', String(newValue))
      return newValue
    })
  }

  const handleToggleActive = async (agentId: string, isActive: boolean) => {
    // Optimistic update
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId ? { ...agent, isActive } : agent
      )
    )

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/tenants/${tenantId}/agents/${agentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      })

      if (!response.ok) {
        throw new Error('Failed to update agent status')
      }
    } catch (error) {
      console.error('Error updating agent status:', error)
      // Revert on error
      setAgents((prev) =>
        prev.map((agent) =>
          agent.id === agentId ? { ...agent, isActive: !isActive } : agent
        )
      )
      // TODO: Show error toast
    }
  }

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
        <div className="flex gap-3">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск..."
            className="flex-1"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="default">
                <Columns3 className="mr-2 h-4 w-4" />
                Переключить столбцы
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="end">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Столбцы</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="col-created" className="text-sm font-normal">
                      Created at
                    </Label>
                    <Switch
                      id="col-created"
                      checked={showCreatedAt}
                      onCheckedChange={toggleCreatedAt}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="col-updated" className="text-sm font-normal">
                      Updated at
                    </Label>
                    <Switch
                      id="col-updated"
                      checked={showUpdatedAt}
                      onCheckedChange={toggleUpdatedAt}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
                  <th className="p-2 font-medium">Активно</th>
                  {showCreatedAt && <th className="p-2 font-medium">Created at</th>}
                  {showUpdatedAt && <th className="p-2 font-medium">Updated at</th>}
                  <th className="p-2 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredAgents.map((agent) => (
                  <tr key={agent.id}>
                    <td className="p-2 font-medium text-gray-900 dark:text-gray-50">{agent.name}</td>
                    <td className="p-2">
                      <Switch
                        checked={agent.isActive}
                        onCheckedChange={(checked) => handleToggleActive(agent.id, checked)}
                        aria-label={`Переключить активность агента ${agent.name}`}
                      />
                    </td>
                    {showCreatedAt && (
                      <td className="p-2 text-gray-500">
                        {agent.createdAt ? new Date(agent.createdAt).toLocaleDateString('ru-RU') : '—'}
                      </td>
                    )}
                    {showUpdatedAt && (
                      <td className="p-2 text-gray-500">
                        {agent.updatedAt ? new Date(agent.updatedAt).toLocaleDateString('ru-RU') : '—'}
                      </td>
                    )}
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          aria-label="Изменить агента"
                        >
                          <Link href={`/manage/${tenantId}/ai-agents/${agent.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Изменить
                          </Link>
                        </Button>
                        <AgentCopyButton
                          agentId={agent.id}
                          agentName={agent.name}
                          tenantId={tenantId}
                        />
                        <AgentDeleteButton
                          agentId={agent.id}
                          agentName={agent.name}
                          tenantId={tenantId}
                          variant="ghost"
                          size="sm"
                        />
                      </div>
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
