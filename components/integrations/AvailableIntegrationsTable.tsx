'use client'

import { useState, useMemo } from 'react'
import { Search, Settings, CheckCircle2, XCircle, Link2 } from 'lucide-react'
import Link from 'next/link'
import { useTenantId } from '@/hooks/useTenantId'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { InstallIntegrationModal } from '@/components/integrations/InstallIntegrationModal'

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

interface Integration {
  id: string
  name: string
  type: string
  isInstalled: boolean
  isActive: boolean
}

interface AvailableIntegrationsTableProps {
  agentId: string
  agentName?: string
  integrations?: AgentIntegration[]
  isLoading?: boolean
}

// Список доступных интеграций
const availableIntegrationsList: Omit<Integration, 'isInstalled' | 'isActive'>[] = [
  {
    id: 'kommo',
    name: 'Kommo',
    type: 'kommo',
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    type: 'google_calendar',
  },
]

export const AvailableIntegrationsTable = ({
  agentId,
  agentName,
  integrations = [],
  isLoading = false,
}: AvailableIntegrationsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [installModal, setInstallModal] = useState<{
    isOpen: boolean
    integrationName: string
    integrationType: string
  }>({
    isOpen: false,
    integrationName: '',
    integrationType: '',
  })
  const tenantId = useTenantId()

  // Объединяем доступные интеграции с данными из БД
  const mergedIntegrations = useMemo(() => {
    return availableIntegrationsList.map((integration) => {
      const dbIntegration = integrations.find(
        (int) => int.integration_type === integration.type
      )

      return {
        ...integration,
        isInstalled: dbIntegration?.is_installed ?? false,
        isActive: dbIntegration?.is_active ?? false,
        dbId: dbIntegration?.id,
      }
    })
  }, [integrations])

  const filteredIntegrations = mergedIntegrations.filter((integration) =>
    integration.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getSettingsPath = (integrationId: string) => {
    return tenantId
      ? `/manage/${tenantId}/ai-agents/${agentId}/integrations/${integrationId}/edit`
      : `/agents/${agentId}/integrations/${integrationId}/edit`
  }

  const getInstallPath = (integrationId: string) => {
    return tenantId
      ? `/manage/${tenantId}/ai-agents/${agentId}/integrations/${integrationId}/install`
      : `/agents/${agentId}/integrations/${integrationId}/install`
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
        {/* Поиск */}
        <div className="fi-ta-header-toolbar flex items-center justify-between gap-x-4 px-4 py-3 sm:px-6">
          <div className="relative flex-1 max-w-md">
            <div className="fi-input-wrp-prefix items-center gap-x-3 ps-3 flex pe-2 absolute left-0 top-0 bottom-0 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="search"
              className="fi-input block w-full border-none py-1.5 text-base text-gray-950 transition duration-75 placeholder:text-gray-400 focus:ring-0 disabled:text-gray-500 pl-10 pr-4 bg-transparent"
              placeholder="Поиск"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              maxLength={1000}
            />
          </div>
        </div>

        {/* Таблица */}
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="fi-ta-header-cell px-3 py-3.5 sm:first-of-type:ps-6">
                <span className="fi-ta-header-cell-label text-sm font-semibold text-gray-950 dark:text-white">
                  Интеграция
                </span>
              </TableHead>
              <TableHead className="fi-ta-header-cell px-3 py-3.5 sm:last-of-type:pe-6">
                <span className="fi-ta-header-cell-label text-sm font-semibold text-gray-950 dark:text-white">
                  Установлено
                </span>
              </TableHead>
              <TableHead className="fi-ta-header-cell px-3 py-3.5 sm:last-of-type:pe-6">
                <span className="fi-ta-header-cell-label text-sm font-semibold text-gray-950 dark:text-white">
                  Активно
                </span>
              </TableHead>
              <TableHead
                aria-label="Actions"
                className="fi-ta-actions-header-cell w-1"
              ></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="px-3 py-4 text-center text-gray-500">
                  Загрузка...
                </TableCell>
              </TableRow>
            ) : filteredIntegrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="px-3 py-4 text-center text-gray-500">
                  Интеграции не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredIntegrations.map((integration) => (
                <TableRow
                  key={integration.id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {/* Колонка "Интеграция" */}
                  <TableCell className="px-3 py-4 sm:first-of-type:ps-6">
                    {integration.isInstalled ? (
                      <Link
                        href={getSettingsPath(integration.id)}
                        className="fi-link group/link relative inline-flex items-center justify-center outline-none gap-1 fi-color-custom fi-color-primary fi-ac-action fi-ac-link-action hover:underline"
                        style={
                          {
                            '--c-400': 'var(--primary-400)',
                            '--c-600': 'var(--primary-600)',
                          } as React.CSSProperties
                        }
                      >
                        <span className="font-semibold text-sm text-custom-600 dark:text-custom-400">
                          {integration.name}
                        </span>
                      </Link>
                    ) : (
                      <span className="text-sm font-medium text-gray-950 dark:text-white">
                        {integration.name}
                      </span>
                    )}
                  </TableCell>

                  {/* Колонка "Установлено" */}
                  <TableCell className="px-3 py-4">
                    {integration.isInstalled ? (
                      <Link
                        href={getSettingsPath(integration.id)}
                        className="fi-ta-icon flex items-center"
                      >
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </Link>
                    ) : (
                      <div className="fi-ta-icon flex items-center">
                        <XCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                  </TableCell>

                  {/* Колонка "Активно" */}
                  <TableCell className="px-3 py-4">
                    {integration.isActive ? (
                      <Link
                        href={getSettingsPath(integration.id)}
                        className="fi-ta-icon flex items-center"
                      >
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </Link>
                    ) : (
                      <div className="fi-ta-icon flex items-center">
                        <XCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                  </TableCell>

                  {/* Колонка "Actions" */}
                  <TableCell className="fi-ta-cell p-0 first-of-type:ps-1 last-of-type:pe-1 sm:first-of-type:ps-3 sm:last-of-type:pe-3 fi-ta-actions-cell">
                    <div className="whitespace-nowrap px-3 py-4">
                      {integration.isInstalled ? (
                        <Link
                          href={getSettingsPath(integration.id)}
                          className="fi-link group/link relative inline-flex items-center justify-center outline-none fi-size-sm fi-link-size-sm gap-1 fi-color-custom fi-color-primary fi-ac-action fi-ac-link-action"
                          style={
                            {
                              '--c-400': 'var(--primary-400)',
                              '--c-600': 'var(--primary-600)',
                            } as React.CSSProperties
                          }
                        >
                          <Settings className="h-4 w-4 text-custom-600 dark:text-custom-400" />
                          <span className="font-semibold text-sm text-custom-600 dark:text-custom-400 group-hover/link:underline group-focus-visible/link:underline">
                            Настройки
                          </span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setInstallModal({
                              isOpen: true,
                              integrationName: integration.name,
                              integrationType: integration.type,
                            })
                          }}
                          className="fi-link group/link relative inline-flex items-center justify-center outline-none fi-size-sm fi-link-size-sm gap-1 fi-color-custom fi-color-primary fi-ac-action fi-ac-link-action"
                          style={
                            {
                              '--c-400': 'var(--primary-400)',
                              '--c-600': 'var(--primary-600)',
                            } as React.CSSProperties
                          }
                        >
                          <Link2 className="h-4 w-4 text-custom-600 dark:text-custom-400" />
                          <span className="font-semibold text-sm text-custom-600 dark:text-custom-400 group-hover/link:underline group-focus-visible/link:underline">
                            Установить
                          </span>
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Модалка установки интеграции */}
      <InstallIntegrationModal
        isOpen={installModal.isOpen}
        onClose={() => {
          setInstallModal({ isOpen: false, integrationName: '', integrationType: '' })
        }}
        integrationName={installModal.integrationName}
        integrationType={installModal.integrationType}
        agentId={agentId}
        tenantId={tenantId || undefined}
      />
    </div>
  )
}

