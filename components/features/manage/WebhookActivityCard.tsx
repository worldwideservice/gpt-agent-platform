'use client'

import { useFormatter, useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import type { WorkspaceSummary } from '@/lib/repositories/manage-summary'

interface WebhookActivityCardProps {
  history: NonNullable<WorkspaceSummary['integrations']['webhookHistory']>
}

export function WebhookActivityCard({ history }: WebhookActivityCardProps) {
  const t = useTranslations('manage.components.webhookActivity')
  const format = useFormatter()

  if (!history?.length) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
        {history.map((event) => (
          <div key={event.id} className="flex justify-between">
            <div>
              <p className="font-medium">{event.eventType}</p>
              <p className="text-xs text-gray-500">
                {event.createdAt
                  ? format.dateTime(new Date(event.createdAt), {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })
                  : t('emptyTimestamp')}
              </p>
            </div>
            <span className="text-xs">{event.status}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
