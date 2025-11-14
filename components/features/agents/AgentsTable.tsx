'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Edit, Columns3, ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react'

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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination'
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
  const router = useRouter()
  const searchParams = useSearchParams()

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

  // Sorting state (persisted in localStorage)
  type SortColumn = 'name' | 'isActive' | 'createdAt' | 'updatedAt'
  type SortDirection = 'asc' | 'desc'

  const [sortColumn, setSortColumn] = useState<SortColumn>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agentsTable.sortColumn')
      return (saved as SortColumn) || 'name'
    }
    return 'name'
  })

  const [sortDirection, setSortDirection] = useState<SortDirection>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agentsTable.sortDirection')
      return (saved as SortDirection) || 'asc'
    }
    return 'asc'
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page')
    return page ? parseInt(page, 10) : 1
  })

  const [pageSize] = useState(10) // Fixed page size for now

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

  // Handle sorting column click
  const handleSort = (column: SortColumn) => {
    const newDirection: SortDirection =
      sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'

    setSortColumn(column)
    setSortDirection(newDirection)

    // Persist to localStorage
    localStorage.setItem('agentsTable.sortColumn', column)
    localStorage.setItem('agentsTable.sortDirection', newDirection)

    // Reset to first page when sorting changes
    setCurrentPage(1)
    updateURL(1)
  }

  // Update URL with current page
  const updateURL = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page > 1) {
      params.set('page', page.toString())
    } else {
      params.delete('page')
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateURL(page)
  }

  // Filter agents
  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(search.toLowerCase()),
  )

  // Sort agents
  const sortedAgents = [...filteredAgents].sort((a, b) => {
    let comparison = 0

    switch (sortColumn) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'isActive':
        comparison = a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1
        break
      case 'createdAt':
        comparison = (a.createdAt || '').localeCompare(b.createdAt || '')
        break
      case 'updatedAt':
        comparison = (a.updatedAt || '').localeCompare(b.updatedAt || '')
        break
    }

    return sortDirection === 'asc' ? comparison : -comparison
  })

  // Paginate agents
  const totalPages = Math.ceil(sortedAgents.length / pageSize)
  const paginatedAgents = sortedAgents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
    updateURL(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter])

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

  // Render sort indicator icon
  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) {
      return <ChevronsUpDown className="ml-1 inline h-4 w-4 text-gray-400" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 inline h-4 w-4 text-primary" />
    ) : (
      <ArrowDown className="ml-1 inline h-4 w-4 text-primary" />
    )
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

        {sortedAgents.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-xs uppercase text-gray-500">
                <tr>
                  <th
                    className="cursor-pointer p-2 font-medium transition-colors hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort('name')}
                  >
                    Название
                    <SortIcon column="name" />
                  </th>
                  <th
                    className="cursor-pointer p-2 font-medium transition-colors hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort('isActive')}
                  >
                    Активно
                    <SortIcon column="isActive" />
                  </th>
                  {showCreatedAt && (
                    <th
                      className="cursor-pointer p-2 font-medium transition-colors hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={() => handleSort('createdAt')}
                    >
                      Created at
                      <SortIcon column="createdAt" />
                    </th>
                  )}
                  {showUpdatedAt && (
                    <th
                      className="cursor-pointer p-2 font-medium transition-colors hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={() => handleSort('updatedAt')}
                    >
                      Updated at
                      <SortIcon column="updatedAt" />
                    </th>
                  )}
                  <th className="p-2 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedAgents.map((agent) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="text-sm text-gray-500">
                  Показано {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sortedAgents.length)} из {sortedAgents.length}
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) handlePageChange(currentPage - 1)
                        }}
                        aria-disabled={currentPage === 1}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>

                    {/* First page */}
                    {currentPage > 2 && (
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(1)
                          }}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Ellipsis before current page */}
                    {currentPage > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Previous page */}
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(currentPage - 1)
                          }}
                        >
                          {currentPage - 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Current page */}
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        {currentPage}
                      </PaginationLink>
                    </PaginationItem>

                    {/* Next page */}
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(currentPage + 1)
                          }}
                        >
                          {currentPage + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Ellipsis after current page */}
                    {currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Last page */}
                    {currentPage < totalPages - 1 && (
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(totalPages)
                          }}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < totalPages) handlePageChange(currentPage + 1)
                        }}
                        aria-disabled={currentPage === totalPages}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
