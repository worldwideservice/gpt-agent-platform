'use client'

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { Loader2, Plus, Search } from 'lucide-react'

import { AgentTable } from '@/components/agents/AgentTable'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

import type { Agent } from '@/types'

interface AgentsClientProps {
  initialAgents: Agent[]
  total: number
}

interface AgentsApiResponse {
  success: boolean
  data: Agent[]
  pagination: {
    total: number
  }
  error?: string
}

const SEARCH_DEBOUNCE_MS = 350

export const AgentsClient = ({ initialAgents, total }: AgentsClientProps) => {
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [totalCount, setTotalCount] = useState(total)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const isInitialFetch = useRef(true)

  const hasAgents = agents.length > 0

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }, [])

  const fetchAgents = useCallback(
    async (query: string) => {
      const params = new URLSearchParams()

      if (query.trim().length > 0) {
        params.set('search', query.trim())
      }

      try {
        setError(null)
        const response = await fetch(`/api/agents?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = (await response.json()) as AgentsApiResponse

        if (!payload.success) {
          throw new Error(payload.error ?? 'Неизвестная ошибка загрузки агентов')
        }

        setAgents(payload.data)
        setTotalCount(payload.pagination.total)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Неизвестная ошибка'
        console.error('Failed to fetch agents', err)
        setError('Не удалось загрузить агентов. Попробуйте обновить страницу.')
        setAgents([])
        setTotalCount(0)
        return message
      }

      return null
    },
    [],
  )

  useEffect(() => {
    if (isInitialFetch.current) {
      isInitialFetch.current = false
      return
    }

    const timeoutId = window.setTimeout(() => {
      startTransition(async () => {
        await fetchAgents(searchTerm)
      })
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [fetchAgents, searchTerm])

  useEffect(() => {
    setAgents(initialAgents)
    setTotalCount(total)
  }, [initialAgents, total])

  const handleStatusChange = useCallback(
    async (id: string, checked: boolean) => {
      try {
        const response = await fetch(`/api/agents/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: checked ? 'active' : 'inactive',
          }),
        })

        if (!response.ok) {
          throw new Error('Не удалось обновить статус')
        }

        const payload = (await response.json()) as { success: boolean; data: Agent }

        if (!payload.success) {
          throw new Error('Не удалось обновить статус')
        }

        setAgents((prev) =>
          prev.map((agent) => (agent.id === id ? { ...agent, status: payload.data.status } : agent)),
        )
      } catch (err) {
        console.error('Failed to update agent status', err)
        setError('Не удалось обновить статус агента')
      }
    },
    [],
  )

  const handleDuplicate = useCallback(
    async (id: string) => {
      const agent = agents.find((a) => a.id === id)
      if (!agent) {
        return
      }

      try {
        const response = await fetch('/api/agents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `${agent.name} (копия)`,
            status: 'draft',
            model: agent.model,
          }),
        })

        if (!response.ok) {
          throw new Error('Не удалось создать копию агента')
        }

        const payload = (await response.json()) as { success: boolean; data: Agent }

        if (!payload.success) {
          throw new Error('Не удалось создать копию агента')
        }

        await fetchAgents(searchTerm)
      } catch (err) {
        console.error('Failed to duplicate agent', err)
        setError('Не удалось создать копию агента')
      }
    },
    [agents, fetchAgents, searchTerm],
  )

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Вы уверены, что хотите удалить этого агента? Это действие нельзя отменить.')) {
        return
      }

      try {
        const response = await fetch(`/api/agents/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Не удалось удалить агента')
        }

        const payload = (await response.json()) as { success: boolean }

        if (!payload.success) {
          throw new Error('Не удалось удалить агента')
        }

        await fetchAgents(searchTerm)
      } catch (err) {
        console.error('Failed to delete agent', err)
        setError('Не удалось удалить агента')
      }
    },
    [fetchAgents, searchTerm],
  )

  const resultLabel = useMemo(() => {
    if (!hasAgents) {
      return 'Нет агентов, удовлетворяющих условиям'
    }

    return `Показано ${agents.length} из ${totalCount} агентов`
  }, [agents.length, hasAgents, totalCount])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Агенты ИИ</h1>
          <p className="mt-1 text-sm text-slate-500">Управляйте поведением и статусом виртуальных сотрудников</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder="Поиск по имени или модели"
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Поиск агентов"
              className="pl-10"
            />
          </div>
          <Link href="/agents/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />Создать агента
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
        Всего агентов: <span className="font-semibold text-slate-900">{totalCount}</span>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">
          {error}
        </div>
      )}

      <AgentTable
        agents={agents}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onStatusChange={handleStatusChange}
        isLoading={isPending}
      />

      <div className="flex items-center justify-between text-sm text-slate-500">
        <p aria-live="polite">{resultLabel}</p>
        <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary-600">
          {isPending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Обновление…
            </>
          ) : null}
        </p>
      </div>
    </div>
  )
}

