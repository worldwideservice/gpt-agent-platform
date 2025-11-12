import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { KnowledgeHeatmapCard } from '@/components/features/manage/KnowledgeHeatmapCard'
import { KnowledgeTimelineCard } from '@/components/features/manage/KnowledgeTimelineCard'
import type { WorkspaceSummary } from '@/lib/repositories/manage-summary'

interface WorkspaceSummaryKnowledgeInsightsProps {
  summary: WorkspaceSummary
}

export function WorkspaceSummaryKnowledgeInsights({ summary }: WorkspaceSummaryKnowledgeInsightsProps) {
  const { knowledgeTimeline, knowledgeHeatmap } = summary
  const hasTimeline = knowledgeTimeline.length > 0
  const hasHeatmap = knowledgeHeatmap.length > 0

  if (!hasTimeline && !hasHeatmap) {
    return null
  }

  const totalUploads = knowledgeTimeline.reduce((acc, entry) => acc + entry.count, 0)
  const totalPending = knowledgeTimeline.reduce((acc, entry) => acc + entry.pending, 0)

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Использование базы знаний</CardTitle>
            <CardDescription>Аналитика загрузок за последние 7 дней.</CardDescription>
          </div>
          <div className="text-right text-xs text-gray-500 dark:text-gray-400">
            <p>{totalUploads} загрузок</p>
            <p>{totalPending} ожидают</p>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {hasTimeline && <KnowledgeTimelineCard timeline={knowledgeTimeline} />}
        {hasHeatmap && <KnowledgeHeatmapCard data={knowledgeHeatmap} />}
      </div>
    </section>
  )
}
