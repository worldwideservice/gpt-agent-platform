'use client'

import { Progress } from '@/components/ui'
import type { WorkspaceSummary } from '@/lib/repositories/manage-summary'

interface WebhookSuccessRateCardProps {
  rate: number
  totalEvents: number
}

export function WebhookSuccessRateCard({ rate, totalEvents }: WebhookSuccessRateCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Успешность webhook Kommo</p>
      <p className="text-2xl font-bold">{rate}%</p>
      <Progress value={rate} className="mt-2" />
      <p className="text-xs text-gray-500">{totalEvents} событий за последние 5</p>
    </div>
  )
}
