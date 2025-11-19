'use client'

import { useEffect, useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { ListSkeleton } from '@/components/ui/loading-skeletons'

type RuleExecution = {
  id: string
  rule_id: string
  trigger_type?: string | null
  success?: boolean | null
  error?: string | null
  executed_at?: string | null
  action_results?: Array<{ action: { type: string }; success: boolean; error?: string }>
}

interface AgentRuleExecutionsProps {
  agentId: string
}

export function AgentRuleExecutions({ agentId }: AgentRuleExecutionsProps) {
  const [items, setItems] = useState<RuleExecution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadExecutions = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/agents/${agentId}/rules/executions?limit=10`, { cache: 'no-store' })
        const payload = await response.json()
        if (!response.ok || !payload.success) {
          throw new Error(payload.error || 'Не удалось загрузить журнал правил')
        }
        setItems(payload.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки журнала правил')
      } finally {
        setLoading(false)
      }
    }

    void loadExecutions()
  }, [agentId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>История Rule Engine</CardTitle>
        <CardDescription>Последние выполненные правила.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {error && <p className="text-rose-500">{error}</p>}
        {loading ? (
          <ListSkeleton items={5} />
        ) : items.length === 0 ? (
          <p className="text-gray-500">История пустая.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((execution) => (
              <li key={execution.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-50">
                      Правило {execution.rule_id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Триггер: {execution.trigger_type ?? '—'} ·{' '}
                      {execution.executed_at ? new Date(execution.executed_at).toLocaleString('ru-RU') : '—'}
                    </p>
                  </div>
                  <span className={`text-xs ${execution.success ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {execution.success ? 'Успех' : execution.error ?? 'Ошибка'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
