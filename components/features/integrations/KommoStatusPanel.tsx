'use client'

import { useEffect, useState } from 'react'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from '@/components/ui'

type KommoStatus = {
  provider: string
  credentialsConfigured: boolean
  connectionConfigured: boolean
  sync?: {
    last_synced_at?: string | null
    status?: string | null
    error?: string | null
  }
}

interface KommoStatusPanelProps {
  notice?: string | null
}

export function KommoStatusPanel({ notice }: KommoStatusPanelProps) {
  const [status, setStatus] = useState<KommoStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/integrations/kommo/status')
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось загрузить статус Kommo')
      }
      setStatus(payload.status)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка чтения статуса Kommo')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadStatus()
  }, [])

  const handleSync = async () => {
    setSyncing(true)
    setError(null)
    try {
      const response = await fetch('/api/integrations/kommo/sync/pipelines', { method: 'POST' })
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось запустить синхронизацию')
      }
      await loadStatus()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка запуска синхронизации')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Статус Kommo</CardTitle>
        <CardDescription>OAuth, webhook и синхронизация.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {notice && <p className="text-xs text-emerald-600">{notice}</p>}
        {error && <p className="text-xs text-rose-500">{error}</p>}
        {loading ? (
          <p className="text-xs text-gray-500">Загрузка статуса…</p>
        ) : status ? (
          <>
            <div className="flex items-center justify-between text-xs">
              <span>OAuth credentials</span>
              <strong className={status.credentialsConfigured ? 'text-emerald-600' : 'text-rose-500'}>
                {status.credentialsConfigured ? 'Готово' : 'Не настроено'}
              </strong>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>CRM connection</span>
              <strong className={status.connectionConfigured ? 'text-emerald-600' : 'text-rose-500'}>
                {status.connectionConfigured ? 'Подключено' : 'Нет соединения'}
              </strong>
            </div>
            {status.sync && (
              <>
                <Separator />
                <p className="text-xs text-gray-500">
                  Последняя синхронизация:{' '}
                  {status.sync.last_synced_at ? new Date(status.sync.last_synced_at).toLocaleString('ru-RU') : '—'}
                </p>
                <p className="text-xs">
                  Статус: <span className="font-medium">{status.sync.status ?? '—'}</span>
                  {status.sync.error && <span className="text-rose-500"> — {status.sync.error}</span>}
                </p>
              </>
            )}
            <Button size="sm" onClick={handleSync} disabled={syncing} className="w-full">
              {syncing ? 'Синхронизируем…' : 'Запустить синхронизацию Kommo'}
            </Button>
          </>
        ) : (
          <p className="text-xs text-gray-500">Нет данных по статусу.</p>
        )}
      </CardContent>
    </Card>
  )
}
