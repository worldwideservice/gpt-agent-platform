'use client'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import type { WorkspaceSummary } from '@/lib/repositories/manage-summary'

type StatusFilter = 'all' | 'active' | 'inactive'

interface AgentsStatusFiltersProps {
  summary: WorkspaceSummary
  activeFilter: StatusFilter
  onFilterChange: (status: StatusFilter) => void
}

const FILTERS: Array<{ label: string; value: StatusFilter }> = [
  { label: 'Все', value: 'all' },
  { label: 'Активные', value: 'active' },
  { label: 'Неактивные', value: 'inactive' },
]

export function AgentsStatusFilters({ summary, activeFilter, onFilterChange }: AgentsStatusFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Состояние агентов</CardTitle>
        <CardDescription>Фильтры по состоянию на основе базы Supabase.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3 text-sm">
        {FILTERS.map((filter) => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
            {filter.value === 'active' && ` (${summary.agents.active})`}
            {filter.value === 'inactive' && ` (${summary.agents.inactive})`}
            {filter.value === 'all' && ` (${summary.agents.total})`}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
