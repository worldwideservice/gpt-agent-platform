'use client'

import { useEffect, useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'

type RuleLogItem = {
  id: string
  rule_id: string
  trigger_type?: string | null
  success?: boolean | null
  error?: string | null
  executed_at?: string | null
}

type SequenceLogItem = {
  id: string
  sequence_id: string
  status: 'running' | 'completed' | 'paused' | 'failed'
  current_step?: number | null
  updated_at?: string | null
  error?: string | null
}


interface AgentExecutionLogProps {
  agentId: string
}

export function AgentExecutionLog({ agentId }: AgentExecutionLogProps) {
  const [ruleLog, setRuleLog] = useState<RuleLogItem[]>([])
  const [sequenceLog, setSequenceLog] = useState<SequenceLogItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [rulesResponse, sequencesResponse] = await Promise.all([
          fetch(`/api/agents/${agentId}/rules/executions?limit=5`, { cache: 'no-store' }),
          fetch(`/api/agents/${agentId}/sequences/executions?limit=5`, { cache: 'no-store' }),
        ])

        const rulesPayload = await rulesResponse.json()
        const sequencesPayload = await sequencesResponse.json()

        if (rulesResponse.ok && rulesPayload.success) {
          setRuleLog(rulesPayload.data)
        }

        if (sequencesResponse.ok && sequencesPayload.success) {
          setSequenceLog(sequencesPayload.data)
        }
      } finally {
        setLoading(false)
      }
    }

    void loadData()
  }, [agentId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Исполнение автоматизаций</CardTitle>
        <CardDescription>Последние действия Rule Engine и Sequences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {loading ? (
          <p className="text-gray-500">Загрузка…</p>
        ) : (
          <>
            <section>
              <p className="text-xs font-medium uppercase text-gray-500">Rule Engine</p>
              {ruleLog.length === 0 ? (
                <p className="text-gray-500">История пустая.</p>
              ) : (
                <ul className="space-y-1 text-xs text-gray-600">
                  {ruleLog.map((item) => (
                    <li key={item.id}>
                      {item.trigger_type ?? '—'} · {item.executed_at ? new Date(item.executed_at).toLocaleString('ru-RU') : '—'} ·{' '}
                      {item.success ? 'Успех' : item.error ?? 'Ошибка'}
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section>
              <p className="text-xs font-medium uppercase text-gray-500">Sequences</p>
              {sequenceLog.length === 0 ? (
                <p className="text-gray-500">История пустая.</p>
              ) : (
                <ul className="space-y-1 text-xs text-gray-600">
                  {sequenceLog.map((item) => (
                    <li key={item.id}>
                      {item.sequence_id.slice(0, 8)} · {item.status} ·{' '}
                      {item.updated_at ? new Date(item.updated_at).toLocaleString('ru-RU') : '—'}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </CardContent>
    </Card>
  )
}
