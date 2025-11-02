'use client'

import { useState } from 'react'
import { Search, Settings, CheckCircle2, Circle } from 'lucide-react'
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
import { KwidSwitch } from '@/components/kwid'

interface Integration {
  id: string
  name: string
  isInstalled: boolean
  isActive: boolean
  icon?: React.ReactNode
}

interface IntegrationsTableProps {
  agentId?: string
}

const defaultIntegrations: Integration[] = [
  {
    id: 'kommo',
    name: 'Kommo',
    isInstalled: true,
    isActive: true,
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    isInstalled: false,
    isActive: false,
  },
]

export const IntegrationsTable = ({ agentId }: IntegrationsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [integrations, setIntegrations] = useState<Integration[]>(defaultIntegrations)
  const tenantId = useTenantId()

  const filteredIntegrations = integrations.filter((integration) =>
    integration.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggleActive = (integrationId: string, active: boolean) => {
    setIntegrations((prev) =>
      prev.map((int) => (int.id === integrationId ? { ...int, isActive: active } : int))
    )
  }

  const getSettingsPath = (integrationId: string) => {
    if (agentId) {
      return tenantId
        ? `/manage/${tenantId}/ai-agents/${agentId}/integrations/${integrationId}`
        : `/agents/${agentId}/integrations/${integrationId}`
    }
    return tenantId
      ? `/manage/${tenantId}/integrations/${integrationId}`
      : `/integrations/${integrationId}`
  }

  const getInstallPath = (integrationId: string) => {
    if (agentId) {
      return tenantId
        ? `/manage/${tenantId}/ai-agents/${agentId}/integrations/${integrationId}/install`
        : `/agents/${agentId}/integrations/${integrationId}/install`
    }
    return tenantId
      ? `/manage/${tenantId}/integrations/${integrationId}/install`
      : `/integrations/${integrationId}/install`
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
        <div className="fi-ta-header-toolbar flex items-center justify-between gap-x-4 px-4 py-3 sm:px-6">
          <div className="relative flex-1 max-w-md">
            <div className="fi-input-wrp-prefix items-center gap-x-3 ps-3 flex pe-2 absolute left-0 top-0 bottom-0 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="search"
              className="fi-input block w-full border-none py-1.5 text-base text-gray-950 transition duration-75 placeholder:text-gray-400 focus:ring-0 disabled:text-gray-500 pl-10 pr-4"
              placeholder="Поиск"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              maxLength={1000}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="fi-ta-header-cell px-3 py-3.5 sm:first-of-type:ps-6 fi-table-header-cell-name">
                Интеграция
              </TableHead>
              <TableHead className="fi-ta-header-cell px-3 py-3.5 sm:first-of-type:ps-6 sm:last-of-type:pe-6 fi-table-header-cell-connected">
                Установлено
              </TableHead>
              <TableHead className="fi-ta-header-cell px-3 py-3.5 sm:first-of-type:ps-6 sm:last-of-type:pe-6 fi-table-header-cell-active">
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
            {filteredIntegrations.map((integration) => (
              <TableRow
                key={integration.id}
                className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <TableCell className="px-3 py-4">
                  <div className="fi-ta-text grid w-full gap-y-1">{integration.name}</div>
                </TableCell>
                <TableCell className="px-3 py-4">
                  <div className="fi-ta-icon flex gap-1.5">
                    {integration.isInstalled ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {integration.isInstalled ? 'Установлено' : 'Не установлено'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-3 py-4">
                  <div className="fi-ta-toggle">
                    <KwidSwitch
                      checked={integration.isActive}
                      onCheckedChange={(checked) =>
                        handleToggleActive(integration.id, checked)
                      }
                      disabled={!integration.isInstalled}
                    />
                  </div>
                </TableCell>
                <TableCell className="fi-ta-cell p-0 first-of-type:ps-1 last-of-type:pe-1 sm:first-of-type:ps-3 sm:last-of-type:pe-3 fi-ta-actions-cell">
                  <div className="whitespace-nowrap px-3 py-4">
                    {integration.isInstalled ? (
                      <Link
                        href={getSettingsPath(integration.id)}
                        className="fi-link group/link relative inline-flex items-center justify-center outline-none fi-size-sm fi-link-size-sm gap-1 fi-color-custom fi-color-primary fi-ac-action fi-ac-link-action"
                        style={{
                          '--c-400': 'var(--primary-400)',
                          '--c-600': 'var(--primary-600)',
                        } as React.CSSProperties}
                      >
                        <span className="font-semibold text-sm text-custom-600 dark:text-custom-400 group-hover/link:underline group-focus-visible/link:underline">
                          Настройки
                        </span>
                      </Link>
                    ) : (
                      <Link
                        href={getInstallPath(integration.id)}
                        className="fi-link group/link relative inline-flex items-center justify-center outline-none fi-size-sm fi-link-size-sm gap-1 fi-color-custom fi-color-primary fi-ac-action fi-ac-link-action"
                        style={{
                          '--c-400': 'var(--primary-400)',
                          '--c-600': 'var(--primary-600)',
                        } as React.CSSProperties}
                      >
                        <span className="font-semibold text-sm text-custom-600 dark:text-custom-400 group-hover/link:underline group-focus-visible/link:underline">
                          Установить
                        </span>
                      </Link>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

