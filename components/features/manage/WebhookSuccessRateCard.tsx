'use client'

import { useTranslations } from 'next-intl'

import { Progress } from '@/components/ui'

interface WebhookSuccessRateCardProps {
  rate: number
  totalEvents: number
}

export function WebhookSuccessRateCard({ rate, totalEvents }: WebhookSuccessRateCardProps) {
  const t = useTranslations('manage.components.webhookSuccess')

  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('title')}</p>
      <p className="text-2xl font-bold">{rate}%</p>
      <Progress value={rate} className="mt-2" />
      <p className="text-xs text-gray-500">{t('eventsWindow', { count: totalEvents, days: 5 })}</p>
    </div>
  )
}
