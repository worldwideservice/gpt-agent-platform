'use client'

import { useEffect, useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from '@/components/ui'
import { EmptyState } from '@/components/ui/empty-state'

type WebhookEvent = {
  id: string
  event_type: string
  status: string
  payload: Record<string, unknown>
  error?: string | null
  created_at?: string | null
}

export function KommoWebhookEventsPanel() {
  const [events, setEvents] = useState<WebhookEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retrying, setRetrying] = useState<string | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/integrations/kommo/webhook/events?limit=10')
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось загрузить события Kommo')
      }
      setEvents(payload.data as WebhookEvent[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки событий')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook события Kommo</CardTitle>
        <CardDescription>Последние входящие webhook от Kommo и их статус</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        {error && <p className="text-rose-500">{error}</p>}
        {loading ? (
          <p className="text-gray-500">Загрузка событий…</p>
        ) : events.length === 0 ? (
          <EmptyState
            type="no-data"
            title="События не найдены"
            description="Webhook события от Kommo отсутствуют"
            action={{
              label: 'Обновить',
              onClick: load,
            }}
          />
        ) : (
          events.map((event) => (
            <div key={event.id} className="space-y-1 rounded-lg border px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">{event.event_type}</span>
                <span className={`text-xs ${event.status === 'processed' ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {event.status}
                </span>
              </div>
              {event.error && <p className="text-rose-500">Ошибка: {event.error}</p>}
              <p className="text-gray-500">
                {event.created_at ? new Date(event.created_at).toLocaleString('ru-RU') : '—'}
              </p>
              <Separator />
              <pre className="max-h-32 overflow-auto text-[10px]">
                {JSON.stringify(event.payload, null, 2)}
              </pre>
              <div className="pt-2 text-right">
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                  disabled={retrying === event.id}
                  onClick={async () => {
                    setRetrying(event.id)
                    await fetch(`/api/integrations/kommo/webhook/events/${event.id}`, { method: 'POST' })
                    setRetrying(null)
                    void load()
                  }}
                >
                  {retrying === event.id ? 'Повтор...' : 'Повторить'}
                </button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
