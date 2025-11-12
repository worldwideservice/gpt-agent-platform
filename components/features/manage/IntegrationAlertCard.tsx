'use client'

import { AlertCircle, RefreshCcw } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import type { WorkspaceSummary } from '@/lib/repositories/manage-summary'

interface IntegrationAlertCardProps {
  summary: WorkspaceSummary
}

export function IntegrationAlertCard({ summary }: IntegrationAlertCardProps) {
  const { kommoConnected, lastWebhookEvent } = summary.integrations

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-primary">
          {kommoConnected ? <RefreshCcw className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <CardTitle className="text-lg">{kommoConnected ? 'Kommo подключён' : 'Kommo не подключён'}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
        {summary.integrations.kommoDomain && (
          <p>Домен: <span className="font-mono">{summary.integrations.kommoDomain}</span></p>
        )}

        {lastWebhookEvent ? (
          <>
            <p>Последнее webhook: {lastWebhookEvent.eventType}</p>
            <p>Статус: {lastWebhookEvent.status}</p>
            {lastWebhookEvent.error && <p className="text-rose-500">Ошибка: {lastWebhookEvent.error}</p>}
          </>
        ) : (
          <p>Последние webhook события отсутствуют.</p>
        )}
      </CardContent>
    </Card>
  )
}
