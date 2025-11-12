'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import type { WorkspaceSummary } from '@/lib/repositories/manage-summary'

interface WebhookActivityCardProps {
  history: NonNullable<WorkspaceSummary['integrations']['webhookHistory']>
}

export function WebhookActivityCard({ history }: WebhookActivityCardProps) {
  if (!history.length) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>История webhook Kommo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
        {history.map((event) => (
          <div key={event.id} className="flex justify-between">
            <div>
              <p className="font-medium">{event.eventType}</p>
              <p className="text-xs text-gray-500">
                {event.createdAt ? new Date(event.createdAt).toLocaleString('ru-RU') : '—'}
              </p>
            </div>
            <span className="text-xs">{event.status}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
