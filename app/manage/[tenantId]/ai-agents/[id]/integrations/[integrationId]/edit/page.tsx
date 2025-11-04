'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { LoadingOverlay } from '@/components/refine-ui/layout/loading-overlay'
import { KommoIntegrationSettings } from '@/components/integrations/KommoIntegrationSettings'
import { useToast } from '@/components/ui/toast-context'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface Integration {
  id: string
  agent_id: string
  org_id: string
  integration_type: string
  is_active: boolean
  is_installed: boolean
  settings?: Record<string, unknown>
  created_at?: string
  updated_at?: string
}

export default function IntegrationEditPage() {
  const params = useParams()
  const router = useRouter()
  const { push } = useToast()

  const agentId = (params?.id as string) || ''
  const integrationId = (params?.integrationId as string) || ''
  const tenantId = (params?.tenantId as string) || ''

  const [integration, setIntegration] = useState<Integration | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadIntegration = async () => {
      try {
        const response = await fetch(`/api/agents/${agentId}/integrations/${integrationId}`)
        const data = await response.json()

        if (data.success) {
          setIntegration(data.integration)
        } else {
          throw new Error(data.error || 'Не удалось загрузить интеграцию')
        }
      } catch (error) {
        console.error('Failed to load integration', error)
        push({
          title: 'Ошибка',
          description: error instanceof Error ? error.message : 'Не удалось загрузить интеграцию',
          variant: 'error',
        })
      } finally {
        setLoading(false)
      }
    }

    loadIntegration()
  }, [agentId, integrationId, push])

  if (loading) {
    return (
      <div className="p-6">
        <LoadingOverlay loading={true}>
          <div className="text-center py-8">Загрузка...</div>
        </LoadingOverlay>
      </div>
    )
  }

  if (!integration) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Интеграция не найдена</p>
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/manage/${tenantId}/ai-agents/${agentId}/available-integrations`)
            }
          >
            Вернуться к списку
          </Button>
        </div>
      </div>
    )
  }

  const getIntegrationName = (type: string) => {
    const names: Record<string, string> = {
      kommo: 'Kommo CRM',
      amocrm: 'AmoCRM',
      bitrix24: 'Bitrix24',
      hubspot: 'HubSpot',
      salesforce: 'Salesforce',
    }
    return names[type] || type
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/manage/${tenantId}/ai-agents`}>Агенты ИИ</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/manage/${tenantId}/ai-agents/${agentId}/edit`}>Редактирование</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/manage/${tenantId}/ai-agents/${agentId}/available-integrations`}>
                  Интеграции
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Настройки</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Заголовок */}
        <div className="flex items-center space-x-4 mb-6 mt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              router.push(`/manage/${tenantId}/ai-agents/${agentId}/available-integrations`)
            }
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">
            Настройки интеграции {getIntegrationName(integration.integration_type)}
          </h1>
        </div>

        {/* Компонент настроек */}
        {integration.integration_type === 'kommo' ? (
          <KommoIntegrationSettings
            agentId={agentId}
            integrationId={integrationId}
            integration={integration}
          />
        ) : (
          <div className="border rounded-lg p-6">
            <p className="text-gray-500">
              Настройки для интеграции типа "{integration.integration_type}" пока не реализованы.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

