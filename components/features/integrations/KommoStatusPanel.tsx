'use client'

import { useEffect, useMemo, useState } from 'react'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from '@/components/ui'

type KommoSyncJobStatus = {
  status?: string | null
  requestedAt?: string | null
  startedAt?: string | null
  completedAt?: string | null
  failedAt?: string | null
  error?: string | null
  pipelinesCount?: number | null
  stagesCount?: number | null
  contactsCount?: number | null
  latestContactAt?: string | number | null
  sampleContact?: Record<string, unknown> | null
}

type KommoSyncState = {
  status?: string | null
  requestedAt?: string | null
  completedAt?: string | null
  error?: string | null
  pipelines?: KommoSyncJobStatus | null
  contacts?: KommoSyncJobStatus | null
  [key: string]: unknown
}

type KommoStatus = {
  provider: string
  credentialsConfigured: boolean
  connectionConfigured: boolean
  sync?: KommoSyncState | null
}

interface KommoStatusPanelProps {
  notice?: string | null
}

const formatDateTime = (value?: string | number | null) => {
  if (!value) return null
  const date = typeof value === 'number' ? new Date(value * 1000) : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }
  return date.toLocaleString('ru-RU')
}

export function KommoStatusPanel({ notice }: KommoStatusPanelProps) {
  const [status, setStatus] = useState<KommoStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncingPipelines, setSyncingPipelines] = useState(false)
  const [syncingContacts, setSyncingContacts] = useState(false)
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

  const pipelinesJob = useMemo(() => status?.sync?.pipelines ?? null, [status])
  const contactsJob = useMemo(() => status?.sync?.contacts ?? null, [status])

  const handlePipelineSync = async () => {
    setSyncingPipelines(true)
    setError(null)
    try {
      const response = await fetch('/api/integrations/kommo/sync/pipelines', { method: 'POST' })
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось запустить синхронизацию воронок')
      }
      await loadStatus()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка запуска синхронизации воронок')
    } finally {
      setSyncingPipelines(false)
    }
  }

  const handleContactsSync = async () => {
    setSyncingContacts(true)
    setError(null)
    try {
      const response = await fetch('/api/integrations/kommo/sync/contacts', { method: 'POST' })
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось запустить синхронизацию контактов')
      }
      await loadStatus()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка запуска синхронизации контактов')
    } finally {
      setSyncingContacts(false)
    }
  }

  const renderJobStatus = (label: string, job: KommoSyncJobStatus | null) => {
    if (!job) {
      return (
        <div className="rounded-md border border-border/40 bg-muted/30 p-3 text-xs text-foreground/70">
          <span className="font-semibold text-foreground/80">{label}:</span> нет данных.
        </div>
      )
    }

    const statusLabel = job.status ?? '—'
    const completed = job.completedAt || job.failedAt
    const completedText = formatDateTime(completed) ?? formatDateTime(job.startedAt)

    return (
      <div className="space-y-1 rounded-md border border-border/40 bg-muted/30 p-3 text-xs text-foreground/70">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground/80">{label}</span>
          <span className="font-semibold capitalize text-foreground">{statusLabel}</span>
        </div>
        {completedText && <p>Завершено: {completedText}</p>}
        {typeof job.pipelinesCount === 'number' && (
          <p>
            Воронок: <span className="font-medium">{job.pipelinesCount}</span>, стадий:{' '}
            <span className="font-medium">{job.stagesCount ?? 0}</span>
          </p>
        )}
        {typeof job.contactsCount === 'number' && (
          <p>
            Контактов синхронизировано: <span className="font-medium">{job.contactsCount}</span>
          </p>
        )}
        {job.latestContactAt && (
          <p>Последнее обновление контактов: {formatDateTime(job.latestContactAt) ?? '—'}</p>
        )}
        {job.error && <p className="text-rose-500">Ошибка: {job.error}</p>}
      </div>
    )
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
              <div className="space-y-2">
                <Separator />
                {status.sync.status && (
                  <p className="text-xs text-foreground/70">
                    Текущий статус: <span className="font-medium">{status.sync.status}</span>
                  </p>
                )}
                {status.sync.error && <p className="text-xs text-rose-500">{status.sync.error}</p>}
                <div className="grid gap-2 md:grid-cols-2">
                  {renderJobStatus('Синхронизация воронок', pipelinesJob)}
                  {renderJobStatus('Синхронизация контактов', contactsJob)}
                </div>
              </div>
            )}
            <div className="grid gap-2 md:grid-cols-2">
              <Button size="sm" onClick={handlePipelineSync} disabled={syncingPipelines} className="w-full">
                {syncingPipelines ? 'Синхронизация воронок…' : 'Синхронизировать воронки'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleContactsSync}
                disabled={syncingContacts}
                className="w-full"
              >
                {syncingContacts ? 'Синхронизация контактов…' : 'Синхронизировать контакты'}
              </Button>
            </div>
          </>
        ) : (
          <p className="text-xs text-gray-500">Нет данных по статусу.</p>
        )}
      </CardContent>
    </Card>
  )
}
