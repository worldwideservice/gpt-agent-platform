'use client'

import { Progress } from '@/components/ui'
import type { WorkspaceSummary } from '@/lib/repositories/manage-summary'

interface KnowledgeTimelineCardProps {
  timeline: WorkspaceSummary['knowledgeTimeline']
}

export function KnowledgeTimelineCard({ timeline }: KnowledgeTimelineCardProps) {
  if (!timeline.length) {
    return null
  }

  const maxCount = Math.max(...timeline.map((entry) => entry.count), 1)

  return (
    <div className="space-y-2 rounded-lg border p-4">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Загрузка знаний (7 дней)</p>
      <div className="space-y-3">
        {timeline.map((entry) => (
          <div key={entry.date} className="space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{new Date(entry.date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })}</span>
              <span>
                {entry.count} загрузок · {entry.pending} в очереди
              </span>
            </div>
            <Progress value={(entry.count / maxCount) * 100} />
          </div>
        ))}
      </div>
    </div>
  )
}
