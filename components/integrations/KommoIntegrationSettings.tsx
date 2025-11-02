'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RefreshCw, Loader2 } from 'lucide-react'

import { KwidSwitch, KwidButton } from '@/components/kwid'
import { useTenantId } from '@/hooks/useTenantId'

interface AgentIntegration {
  id: string
  agent_id: string
  org_id: string
  integration_type: string
  is_installed: boolean
  is_active: boolean
  settings?: Record<string, unknown>
  created_at?: string
  updated_at?: string
}

interface KommoIntegrationSettingsProps {
  agentId: string
  integrationId: string
  integration: AgentIntegration | null
}

export const KommoIntegrationSettings = ({
  agentId,
  integrationId,
  integration,
}: KommoIntegrationSettingsProps) => {
  const router = useRouter()
  const tenantId = useTenantId()
  const [isActive, setIsActive] = useState(integration?.is_active ?? false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleToggleActive = useCallback(async (checked: boolean) => {
    setIsActive(checked)
    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/agents/${agentId}/integrations/${integrationId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            is_active: checked,
          }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Не удалось обновить настройки')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления')
      setIsActive(!checked) // Откатываем изменение
    } finally {
      setIsSaving(false)
    }
  }, [agentId, integrationId, router])

  const handleSync = useCallback(async () => {
    setIsSyncing(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/agents/${agentId}/integrations/${integrationId}/sync`,
        {
          method: 'POST',
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Не удалось синхронизировать настройки CRM')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка синхронизации')
    } finally {
      setIsSyncing(false)
    }
  }, [agentId, integrationId, router])

  const cancelPath = tenantId
    ? `/manage/${tenantId}/ai-agents/${agentId}/available-integrations`
    : `/agents/${agentId}/available-integrations`

  return (
    <div className="space-y-6">
      {/* Общие настройки */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
        <div className="fi-section-content-ctn p-6">
          <h3 className="fi-section-header-heading text-base font-semibold leading-6 text-gray-950 dark:text-white mb-4">
            Общие настройки
          </h3>

          <div className="space-y-6">
            {/* Switch "Активно" */}
            <div className="fi-fo-field-wrp">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <label className="fi-fo-field-wrp-label inline-flex items-center gap-x-3">
                    <span className="text-sm font-medium leading-6 text-gray-950 dark:text-white">
                      Активно
                    </span>
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Включить или отключить эту интеграцию
                  </p>
                </div>
                <KwidSwitch
                  checked={isActive}
                  onCheckedChange={handleToggleActive}
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Кнопка синхронизации */}
            <div className="flex items-center justify-start">
              <KwidButton
                variant="primary"
                size="md"
                onClick={handleSync}
                disabled={isSyncing}
                className="fi-color-custom"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Синхронизация...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Синхронизировать настройки CRM
                  </>
                )}
              </KwidButton>
            </div>
          </div>
        </div>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Кнопки действий */}
      <div className="flex items-center justify-start gap-3">
        <KwidButton
          variant="primary"
          size="md"
          onClick={() => router.refresh()}
          disabled={isSaving || isSyncing}
          className="fi-color-custom"
        >
          Сохранить изменения
        </KwidButton>
        <Link href={cancelPath}>
          <KwidButton
            variant="outline"
            size="md"
            type="button"
          >
            Отменить
          </KwidButton>
        </Link>
      </div>
    </div>
  )
}

