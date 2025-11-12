'use client'

import { useFormatter, useTranslations } from 'next-intl'

import { Progress } from '@/components/ui'
import type { WorkspaceSummary } from '@/lib/repositories/manage-summary'

interface KnowledgeTimelineCardProps {
  timeline: WorkspaceSummary['knowledgeTimeline']
}

export function KnowledgeTimelineCard({ timeline }: KnowledgeTimelineCardProps) {
  const t = useTranslations('manage.components.knowledgeTimeline')
  const format = useFormatter()

  if (!timeline?.length) {
    return null
  }

  const maxCount = Math.max(...timeline.map((entry) => entry.count), 1)

  return (
    <div className="space-y-2 rounded-lg border p-4">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('title')}</p>
      <div className="space-y-3">
        {timeline.map((entry) => (
          <div key={entry.date} className="space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{format.dateTime(new Date(entry.date), { day: '2-digit', month: 'short' })}</span>
              <span>{t('metrics', { count: entry.count, pending: entry.pending })}</span>
            </div>
            <Progress value={(entry.count / maxCount) * 100} />
          </div>
        ))}
      </div>
    </div>
  )
}
