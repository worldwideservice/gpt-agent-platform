'use client'

import { useState } from 'react'

import { AgentsStatusFilters } from '@/components/features/manage/AgentsStatusFilters'
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
      <AgentsTable
        tenantId={tenantId}
        initialAgents={initialAgents}
        initialError={initialError}
        initialStatusFilter={statusFilter}
      />
    </div>
  )
}
