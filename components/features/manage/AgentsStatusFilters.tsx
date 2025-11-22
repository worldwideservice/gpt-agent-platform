'use client'

import { useTranslations } from 'next-intl'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import type { WorkspaceSummary } from '@/lib/repositories/manage-summary'

type StatusFilter = 'all' | 'active' | 'inactive'

interface AgentsStatusFiltersProps {
  summary: WorkspaceSummary
  activeFilter: StatusFilter
  onFilterChange: (status: StatusFilter) => void
}

const FILTERS: Array<{ labelKey: string; value: StatusFilter }> = [
  { labelKey: 'filters.all', value: 'all' },
  { labelKey: 'filters.active', value: 'active' },
  { labelKey: 'filters.inactive', value: 'inactive' },
]

export function AgentsStatusFilters({ summary, activeFilter, onFilterChange }: AgentsStatusFiltersProps) {
  const t = useTranslations('manage.components.agentsFilters')
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3 text-sm">
        {FILTERS.map((filter) => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(filter.value)}
          >
            {t(filter.labelKey)}
            {filter.value === 'active' && ` (${summary.agents.active})`}
            {filter.value === 'inactive' && ` (${summary.agents.inactive})`}
            {filter.value === 'all' && ` (${summary.agents.total})`}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
