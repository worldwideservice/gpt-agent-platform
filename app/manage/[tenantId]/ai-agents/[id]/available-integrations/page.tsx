'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Settings, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/Badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { useToast } from '@/components/ui/toast-context'
import { LoadingOverlay } from '@/components/refine-ui/layout/loading-overlay'

interface Integration {
  id: string
  integration_type: string
  is_active: boolean
  config?: Record<string, any>
  created_at: string
  updated_at: string
}

export default function AvailableIntegrationsPage() {
  const params = useParams()
  const router = useRouter()
  const agentId = (params?.id as string) || ''
  const tenantId = (params?.tenantId as string) || ''
  const { push } = useToast()

  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadIntegrations = async () => {
      try {
        const response = await fetch(`/api/agents/${agentId}/integrations`)
        const data = await response.json()

        if (data.success) {
          setIntegrations(data.integrations || data.data || [])
        } else {
          throw new Error(data.error || 'Не удалось загрузить интеграции')
        }
      } catch (error) {
        console.error('Failed to load integrations', error)
        push({
          title: 'Ошибка',
          description: error instanceof Error ? error.message : 'Не удалось загрузить интеграции',
          variant: 'error',
        })
      } finally {
        setLoading(false)
      }
    }

    loadIntegrations()
  }, [agentId, push])

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

  const handleSettings = (integrationId: string) => {
    router.push(`/manage/${tenantId}/ai-agents/${agentId}/integrations/${integrationId}/edit`)
  }

  if (loading) {
    return (
      <div className="p-6">
        <LoadingOverlay loading={true}>
          <div className="text-center py-8">Загрузка...</div>
        </LoadingOverlay>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl">
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
              <BreadcrumbPage>Интеграции</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-6 mt-4">
          <h1 className="text-2xl font-semibold">Интеграции</h1>
        </div>

        {integrations.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-gray-500">Нет настроенных интеграций</p>
            <p className="text-sm text-gray-400 mt-2">
              Интеграции можно настроить на странице редактирования агента
            </p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата подключения</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {integrations.map((integration) => (
                  <TableRow key={integration.id}>
                    <TableCell className="font-medium">
                      {getIntegrationName(integration.integration_type)}
                    </TableCell>
                    <TableCell>
                      {integration.is_active ? (
                        <Badge variant="default" className="bg-green-500">
                          Настроена
                        </Badge>
                      ) : (
                        <Badge variant="outline">Неактивна</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {new Date(integration.created_at).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSettings(integration.id)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Настройки
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}

