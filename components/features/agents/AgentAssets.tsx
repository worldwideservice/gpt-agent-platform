'use client'

import { useState } from 'react'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import type { AgentAsset } from '@/lib/repositories/agent-assets'

interface AgentAssetsProps {
  tenantId: string
  agentId: string
  initialAssets: AgentAsset[]
}

export function AgentAssets({ tenantId, agentId, initialAssets }: AgentAssetsProps) {
  const [assets, setAssets] = useState(initialAssets)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (assetId: string) => {
    setDeletingId(assetId)
    setError(null)
    try {
      const response = await fetch(`/api/agents/${agentId}/assets/${assetId}`, { method: 'DELETE' })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось удалить файл')
      }
      setAssets((prev) => prev.filter((asset) => asset.id !== assetId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления файла')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Файлы агента</CardTitle>
        <CardDescription>Документы, загруженные в знания агента.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {error && <p className="text-rose-500">{error}</p>}
        {assets.length === 0 ? (
          <p className="text-gray-500">Файлы ещё не загружены для этого агента.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="p-2 font-medium">Название</th>
                  <th className="p-2 font-medium">Статус</th>
                  <th className="p-2 font-medium">Размер</th>
                  <th className="p-2 font-medium">Обновлено</th>
                  <th className="p-2 font-medium text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {assets.map((asset) => (
                  <tr key={asset.id}>
                    <td className="p-2 font-medium text-gray-900 dark:text-gray-50">{asset.sourceName || asset.type}</td>
                    <td className="p-2 text-gray-500">{asset.status}</td>
                    <td className="p-2 text-gray-500">{formatSize(asset.fileSize)}</td>
                    <td className="p-2 text-gray-500">
                      {asset.processedAt ? new Date(asset.processedAt).toLocaleString('ru-RU') : '—'}
                    </td>
                    <td className="p-2 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(asset.id)}
                        disabled={deletingId === asset.id}
                      >
                        {deletingId === asset.id ? 'Удаляем…' : 'Удалить'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const formatSize = (size?: number | null) => {
  if (!size) return '—'
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}
