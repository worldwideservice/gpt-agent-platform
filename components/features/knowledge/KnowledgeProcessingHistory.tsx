import type { ComponentType } from 'react'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import type { AgentAsset } from '@/lib/repositories/agent-assets'

interface KnowledgeProcessingHistoryProps {
  items: AgentAsset[]
}

const STATUS_BADGES: Record<AgentAsset['status'], string> = {
  pending: 'В очереди',
  processing: 'Обработка',
  completed: 'Готово',
  failed: 'Ошибка',
}

const STATUS_ICON: Record<AgentAsset['status'], ComponentType<{ className?: string }>> = {
  pending: Loader2,
  processing: Loader2,
  completed: CheckCircle2,
  failed: AlertCircle,
}

export function KnowledgeProcessingHistory({ items }: KnowledgeProcessingHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>История обработок</CardTitle>
        <CardDescription>Последние загруженные документы и их статусы</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">История пока пуста. Загрузите документы, чтобы запустить обработку.</p>
        ) : (
          <ul className="space-y-3 text-sm">
            {items.map((asset) => {
              const Icon = STATUS_ICON[asset.status]
              return (
                <li key={asset.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-50">{asset.sourceName || asset.type}</p>
                    <p className="text-xs text-gray-500">
                      Загружено {new Date(asset.createdAt).toLocaleString('ru-RU')}
                      {asset.processedAt ? ` · Завершено ${new Date(asset.processedAt).toLocaleString('ru-RU')}` : ''}
                    </p>
                    {asset.processingError && asset.status === 'failed' && (
                      <p className="mt-1 text-xs text-rose-500">{asset.processingError}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      <Icon className="h-3 w-3" />
                      {STATUS_BADGES[asset.status]}
                    </span>
                    {asset.chunksCount ? (
                      <p className="text-xs text-gray-400">Чанков: {asset.chunksCount}</p>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
