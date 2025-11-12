'use client'

import { AlertCircle, RefreshCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import type { WorkspaceSummary } from '@/lib/repositories/manage-summary'

interface IntegrationAlertCardProps {
  summary: WorkspaceSummary
}

export function IntegrationAlertCard({ summary }: IntegrationAlertCardProps) {
  const { kommoConnected, lastWebhookEvent } = summary.integrations
  const t = useTranslations('manage.components.integrationAlert')
  const title = kommoConnected ? t('title.connected') : t('title.disconnected')

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-primary">
          {kommoConnected ? <RefreshCcw className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
        {summary.integrations.kommoDomain && (
          <p>
            {t('domain')} <span className="font-mono">{summary.integrations.kommoDomain}</span>
          </p>
        )}

        {lastWebhookEvent ? (
          <>
            <p>{t('lastEvent', { event: lastWebhookEvent.eventType })}</p>
            <p>{t('status', { status: lastWebhookEvent.status })}</p>
            {lastWebhookEvent.error && (
              <p className="text-rose-500">{t('error', { message: lastWebhookEvent.error })}</p>
            )}
          </>
        ) : (
          <p>{t('noEvents')}</p>
        )}
      </CardContent>
    </Card>
  )
}
