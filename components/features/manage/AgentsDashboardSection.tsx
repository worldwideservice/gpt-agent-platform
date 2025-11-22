'use client'

import { useState } from 'react'

import { AgentsStatusFilters } from '@/components/features/manage/AgentsStatusFilters'
import { AgentsTableFilters } from '@/components/features/agents/AgentsTableFilters'
import { AgentsTable } from '@/components/features/agents/AgentsTable'
import type { AgentListItem } from '@/components/features/agents/AgentsTable'
import type { WorkspaceSummary } from '@/lib/repositories/manage-summary'

type StatusFilter = 'all' | 'active' | 'inactive'

interface AgentsDashboardSectionProps {
  tenantId: string
  initialAgents: AgentListItem[]
  initialError: string | null
  summary: WorkspaceSummary
}

/**
 * Задача 4.1: Advanced Filters для агентов
 * Добавлен компонент AgentsTableFilters для расширенной фильтрации
 */
export function AgentsDashboardSection({
  tenantId,
  initialAgents,
  initialError,
  summary,
}: AgentsDashboardSectionProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active')

  return (
    <div className="space-y-4">
      <AgentsStatusFilters summary={summary} activeFilter={statusFilter} onFilterChange={setStatusFilter} />
      {/* Задача 4.1: Расширенные фильтры */}
      <AgentsTableFilters />
      <AgentsTable
        tenantId={tenantId}
        initialAgents={initialAgents}
        initialError={initialError}
        initialStatusFilter={statusFilter}
      />
    </div>
  )
}
