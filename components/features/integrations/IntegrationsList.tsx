'use client'

import { useState, type ComponentType } from 'react'
import { CheckCircle2, PlugZap, Shield, RefreshCcw, Globe } from 'lucide-react'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@/components/ui'

export type IntegrationStatus = 'connected' | 'not_connected' | 'coming_soon'

export interface IntegrationListItem {
  id: string
  name: string
  description: string
  status: IntegrationStatus
  details?: {
    baseDomain?: string | null
    expiresAt?: string | null
    note?: string
  }
}

interface IntegrationsListProps {
  tenantId: string
  items: IntegrationListItem[]
  notice?: string | null
}

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  kommo: PlugZap,
  slack: Shield,
}

export function IntegrationsList({ tenantId, items, notice }: IntegrationsListProps) {
  return (
    <div className="space-y-4">
      {notice && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {notice}
        </div>
      )}

      {items.length === 0 && (
        <Card>
          <CardContent className="py-6 text-sm text-gray-500">Интеграции пока не доступны.</CardContent>
        </Card>
      )}

      {items.map((integration) => {
        const Icon = ICONS[integration.id] ?? Globe
        return (
          <Card key={integration.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary">
                  <Icon className="h-5 w-5" />
                  <CardTitle>{integration.name}</CardTitle>
                </div>
                <CardDescription>{integration.description}</CardDescription>
                <p className="text-xs text-gray-500">
                  Workspace: <span className="font-mono">{tenantId}</span>
                </p>
              </div>
              <IntegrationStatusBadge status={integration.status} />
            </CardHeader>
            <CardContent>{renderIntegrationContent(integration)}</CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function renderIntegrationContent(integration: IntegrationListItem) {
  if (integration.status === 'connected') {
    return (
      <div className="space-y-2 text-sm">
        <p className="text-emerald-600">Интеграция активна и готова к использованию.</p>
        {integration.details?.baseDomain && (
          <p className="text-gray-500">
            Домен: <span className="font-mono">{integration.details.baseDomain}</span>
          </p>
        )}
        {integration.details?.expiresAt && (
          <p className="text-xs text-gray-500">
            Токен истекает {new Date(integration.details.expiresAt).toLocaleString('ru-RU')}
          </p>
        )}
        {integration.details?.note && <p className="text-xs text-gray-500">{integration.details.note}</p>}
      </div>
    )
  }

  if (integration.status === 'coming_soon') {
    return <p className="text-sm text-gray-500">Интеграция будет доступна в следующих релизах.</p>
  }

  if (integration.id === 'kommo') {
    return <KommoConnectCard defaultDomain={integration.details?.baseDomain} />
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-gray-600 dark:text-gray-300">{integration.details?.note ?? 'Подключите интеграцию.'}</p>
      <div className="flex gap-2">
        <Button size="sm" variant="outline">
          Инструкции
        </Button>
        <Button size="sm">Подключить</Button>
      </div>
    </div>
  )
}

function IntegrationStatusBadge({ status }: { status: IntegrationStatus }) {
  if (status === 'connected') {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Подключено
      </span>
    )
  }

  if (status === 'coming_soon') {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
        <RefreshCcw className="mr-1 h-3 w-3" />
        Скоро
      </span>
    )
  }

  return (
    <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
      Не подключено
    </span>
  )
}

function KommoConnectCard({ defaultDomain }: { defaultDomain?: string | null }) {
  const [baseDomain, setBaseDomain] = useState(defaultDomain ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    if (!baseDomain.trim()) {
      setError('Укажите домен Kommo (например, company.kommo.com)')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/integrations/kommo/oauth/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseDomain }),
      })
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось начать авторизацию Kommo')
      }
      window.location.href = payload.authUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка подключения Kommo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3 text-sm">
      <p className="text-gray-600 dark:text-gray-300">Впишите домен вашего Kommo аккаунта и следуйте шагам OAuth авторизации.</p>
      <Input
        value={baseDomain}
        onChange={(event) => setBaseDomain(event.target.value)}
        placeholder="example.kommo.com"
      />
      {error && <p className="text-xs text-rose-500">{error}</p>}
      <div className="flex gap-2">
        <Button size="sm" variant="outline">
          Инструкции
        </Button>
        <Button size="sm" onClick={handleConnect} disabled={loading}>
          {loading ? 'Переходим…' : 'Подключить'}
        </Button>
      </div>
    </div>
  )
}
