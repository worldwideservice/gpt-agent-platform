'use client'

import { useTranslations } from 'next-intl'

import type { WorkspaceSummary } from '@/lib/repositories/manage-summary'

interface KnowledgeHeatmapCardProps {
  data: WorkspaceSummary['knowledgeHeatmap']
}

export function KnowledgeHeatmapCard({ data }: KnowledgeHeatmapCardProps) {
  const t = useTranslations('manage.components.knowledgeHeatmap')

  if (!data?.length) {
    return null
  }

  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('title')}</p>
      <div className="mt-3 grid grid-cols-7 gap-1 text-[10px] text-gray-500">
        {data.map((entry) => (
          <div
            key={entry.date}
            className="rounded px-1 py-1 text-center"
            style={{
              backgroundColor: `rgba(59, 130, 246, ${Math.max(0.1, entry.intensity / 100)})`,
              color: entry.intensity > 50 ? '#fff' : '#1f2937',
            }}
          >
            {new Date(entry.date).getDate()}
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-500">{t('description')}</div>
    </div>
  )
}
