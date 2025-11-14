'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Settings } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from '@/components/ui'
import { EmptyState } from '@/components/ui/empty-state'

interface Agent {
  id: string
  name: string
}

interface AgentIntegrationsTableProps {
  agent: Agent
  tenantId: string
}

interface Integration {
  id: string
  name: string
  installed: boolean
  active: boolean
  settingsUrl: string
}

export function AgentIntegrationsTable({ agent, tenantId }: AgentIntegrationsTableProps) {
  const [search, setSearch] = useState('')

  // Mock integrations data - in real app, fetch from API
  const integrations: Integration[] = [
    {
      id: 'kommo',
      name: 'Kommo',
      installed: true,
      active: true,
      settingsUrl: `/manage/${tenantId}/ai-agents/${agent.id}/integrations/kommo`,
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      installed: true,
      active: false,
      settingsUrl: `/manage/${tenantId}/ai-agents/${agent.id}/integrations/google-calendar`,
    },
  ]

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
        />

        {/* Таблица интеграций */}
        {filteredIntegrations.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="p-2 font-medium">Интеграция</th>
                  <th className="p-2 font-medium">Установлено</th>
                  <th className="p-2 font-medium">Активно</th>
                  <th className="p-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredIntegrations.map((integration) => (
                  <tr key={integration.id}>
                    <td className="p-2 font-medium text-gray-900 dark:text-gray-50">
                      <Link href={integration.settingsUrl} className="hover:underline">
                        {integration.name}
                      </Link>
                    </td>
                    <td className="p-2">
                      {integration.installed ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400" />
                      )}
                    </td>
                    <td className="p-2">
                      {integration.active ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400" />
                      )}
                    </td>
                    <td className="p-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={integration.settingsUrl}>
                          <Settings className="mr-2 h-4 w-4" />
                          Настройки
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredIntegrations.length === 0 && (
          <EmptyState
            type="no-results"
            title="Интеграции не найдены"
            description="Попробуйте изменить параметры поиска"
            action={{
              label: 'Очистить поиск',
              onClick: () => setSearch(''),
              variant: 'secondary',
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}
