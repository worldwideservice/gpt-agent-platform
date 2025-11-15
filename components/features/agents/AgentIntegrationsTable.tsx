'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Settings, Loader2 } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from '@/components/ui'
import { EmptyState } from '@/components/ui/empty-state'
import { useAgentIntegrations } from '@/lib/hooks'
import { InstallIntegrationModal } from '@/components/features/integrations/InstallIntegrationModal'

interface Agent {
  id: string
  name: string
}

interface AgentIntegrationsTableProps {
  agent: Agent
  tenantId: string
}

export function AgentIntegrationsTable({ agent, tenantId }: AgentIntegrationsTableProps) {
  const [search, setSearch] = useState('')
  const [installModalOpen, setInstallModalOpen] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<{
    id: string
    name: string
  } | null>(null)

  // Используем hook для получения интеграций
  const { data: integrations = [], isLoading, error } = useAgentIntegrations(agent.id)

  const handleInstallClick = (integrationId: string, integrationName: string) => {
    setSelectedIntegration({ id: integrationId, name: integrationName })
    setInstallModalOpen(true)
  }

  const filteredIntegrations = integrations.filter((integration) =>
    integration.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Интеграции</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Поиск */}
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск"
          disabled={isLoading}
          data-testid="integrations-search"
        />

        {/* Состояние загрузки */}
        {isLoading && (
          <div className="flex items-center justify-center py-8" data-testid="loader">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        {/* Состояние ошибки */}
        {error && !isLoading && (
          <EmptyState
            type="error"
            title="Ошибка загрузки"
            description="Не удалось загрузить список интеграций"
            action={{
              label: 'Попробовать снова',
              onClick: () => window.location.reload(),
              variant: 'secondary',
            }}
            data-testid="error-state"
          />
        )}

        {/* Таблица интеграций */}
        {!isLoading && !error && filteredIntegrations.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm" data-testid="integrations-table">
              <thead className="text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="p-2 font-medium">Интеграция</th>
                  <th className="p-2 font-medium">Установлено</th>
                  <th className="p-2 font-medium">Активно</th>
                  <th className="p-2 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredIntegrations.map((integration) => {
                  const settingsUrl = integration.settingsUrl.replace('[tenantId]', tenantId)

                  return (
                    <tr key={integration.id} data-testid={`integration-row-${integration.id}`}>
                      <td className="p-2 font-medium text-gray-900 dark:text-gray-50">
                        {integration.installed ? (
                          <Link href={settingsUrl} className="hover:underline">
                            {integration.name}
                          </Link>
                        ) : (
                          <span>{integration.name}</span>
                        )}
                      </td>
                      <td className="p-2">
                        {integration.installed ? (
                          <Check className="h-5 w-5 text-green-500" data-testid="installed-check" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400" data-testid="not-installed-x" />
                        )}
                      </td>
                      <td className="p-2">
                        {integration.active ? (
                          <Check className="h-5 w-5 text-green-500" data-testid="active-check" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400" data-testid="not-active-x" />
                        )}
                      </td>
                      <td className="p-2">
                        {integration.installed ? (
                          <Button asChild variant="ghost" size="sm" data-testid="settings-button">
                            <Link href={settingsUrl}>
                              <Settings className="mr-2 h-4 w-4" />
                              Настройки
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleInstallClick(integration.id, integration.name)}
                            data-testid="install-button"
                          >
                            Установить
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Пустое состояние */}
        {!isLoading && !error && filteredIntegrations.length === 0 && (
          <EmptyState
            type="no-results"
            title="Интеграции не найдены"
            description="Попробуйте изменить параметры поиска"
            action={{
              label: 'Очистить поиск',
              onClick: () => setSearch(''),
              variant: 'secondary',
            }}
            data-testid="empty-state"
          />
        )}
      </CardContent>

      {/* Модалка установки интеграции */}
      {selectedIntegration && (
        <InstallIntegrationModal
          isOpen={installModalOpen}
          onClose={() => {
            setInstallModalOpen(false)
            setSelectedIntegration(null)
          }}
          integrationId={selectedIntegration.id}
          integrationName={selectedIntegration.name}
          agentId={agent.id}
        />
      )}
    </Card>
  )
}
