'use client'

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'

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

  const handleDuplicate = useCallback((id: string) => {
    console.info('Duplicate agent feature is not implemented yet', id)
  }, [])

  const handleDelete = useCallback((id: string) => {
    console.info('Delete agent feature is not implemented yet', id)
  }, [])

  const resultLabel = useMemo(() => {
    if (!hasAgents) {
      return 'Нет агентов, удовлетворяющих условиям'
    }

    return `Показано ${agents.length} из ${totalCount} агентов`
  }, [agents.length, hasAgents, totalCount])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Агенты ИИ</h1>
          <p className="text-sm text-gray-600 mt-1">Управление агентами</p>
        </div>
        <Link href="/agents/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Создать агента
          </Button>
        </Link>
      </div>

      <div className="max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="search"
            placeholder="Поиск агентов..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Поиск агентов"
            className="pl-10"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      <AgentTable agents={agents} onDelete={handleDelete} onDuplicate={handleDuplicate} isLoading={isPending} />

      <div className="flex items-center justify-between text-sm text-gray-600">
        <p aria-live="polite">{resultLabel}</p>
        <p>{isPending ? 'Обновление...' : null}</p>
      </div>
    </div>
  )
}

