'use client'

import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, Plug } from 'lucide-react'

import { KommoSetup } from '@/components/crm/KommoSetup'
import { KwidButton, KwidSection } from '@/components/kwid'

import type { CrmConnectionRow } from '@/types/supabase'

type PipelineMetadata = {
 external_id?: string
 name?: string
 _embedded?: {
 statuses?: Array<{ id?: string | number; name?: string }>
 }
}

interface StatusResponse {
 success: boolean
 connection: CrmConnectionRow | null
 error?: string
}

export const IntegrationsContent = () => {
 const [connection, setConnection] = useState<CrmConnectionRow | null>(null)
 const [isLoading, setIsLoading] = useState(true)
 const [error, setError] = useState<string | null>(null)

 const fetchStatus = useCallback(async () => {
 setIsLoading(true)
 setError(null)

 try {
 const response = await fetch('/api/integrations/kommo/status', {
 cache: 'no-store',
 })
 const data = (await response.json()) as StatusResponse

 if (!response.ok || !data.success) {
 throw new Error(data.error ?? 'Не удалось получить статус интеграции')
 }

 setConnection(data.connection ?? null)
 } catch (err) {
 setError(
 err instanceof Error ? err.message : 'Неизвестная ошибка статуса Kommo'
 )
 setConnection(null)
 } finally {
 setIsLoading(false)
 }
 }, [])

 useEffect(() => {
 void fetchStatus()
 }, [fetchStatus])

 const handleConnectionEstablished = useCallback(
 (payload: CrmConnectionRow | null) => {
 setConnection(payload)
 setError(null)
 void fetchStatus()
 },
 [fetchStatus]
 )

 const handleError = useCallback((message: string) => {
 setError(message)
 }, [])

 const metadata = connection?.metadata as {
 pipelines?: unknown
 synced_at?: unknown
 } | null
 const pipelines = Array.isArray(metadata?.pipelines)
 ? (metadata?.pipelines as PipelineMetadata[])
 : []
 const pipelinesCount = pipelines.length
 const syncedAt =
 typeof metadata?.synced_at === 'string'
 ? metadata.synced_at
 : (connection?.updated_at ?? null)

 return (
 <div className="space-y-6">
 <header className="flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-bold text-gray-900
 Интеграции
 </h1>
 <p className="mt-1 text-sm text-gray-600
 Подключите CRM и внешние каналы для автоматической работы AI-агента
 </p>
 </div>
 </header>

 <section className="grid gap-6 lg:grid-cols-2">
 <KwidSection
 title="Kommo CRM"
 description="OAuth 2.0 подключение и автоматическая синхронизация"
 icon={Plug}
 >
 <div className="space-y-4">
 <div className="flex items-center justify-end">
 <KwidButton
 variant="outline"
 size="sm"
 onClick={() => void fetchStatus()}
 disabled={isLoading}
 >
 Обновить
 </KwidButton>
 </div>

 <KommoSetup
 connection={connection}
 onConnectionEstablished={handleConnectionEstablished}
 onError={handleError}
 />
 </div>
 </KwidSection>

 <KwidSection title="Статус подключения">
 {isLoading ? (
 <p className="text-sm text-gray-500
 Загрузка статуса...
 </p>
 ) : error ? (
 <div className="flex items-start space-x-3 rounded-lg border border-orange-200 bg-orange-50 p-4 text-orange-800
 <AlertTriangle className="mt-0.5 h-5 w-5" />
 <div>
 <p className="text-sm font-medium">
 Не удалось получить статус Kommo
 </p>
 <p className="text-sm">{error}</p>
 </div>
 </div>
 ) : connection ? (
 <div className="space-y-3 text-sm text-gray-700
 <div>
 <span className="font-medium text-gray-900
 Домен:
 </span>{' '}
 {connection.base_domain}
 </div>
 <div>
 <span className="font-medium text-gray-900
 Последняя синхронизация:
 </span>{' '}
 {syncedAt ?? '—'}
 </div>
 <div>
 <span className="font-medium text-gray-900
 Воронок синхронизировано:
 </span>{' '}
 {pipelinesCount}
 </div>
 <div>
 <span className="font-medium text-gray-900
 Статус:
 </span>{' '}
 <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700
 подключено
 </span>
 </div>
 </div>
 ) : (
 <p className="text-sm text-gray-500
 Интеграция с Kommo ещё не настроена.
 </p>
 )}
 </KwidSection>
 </section>
 </div>
 )
}

