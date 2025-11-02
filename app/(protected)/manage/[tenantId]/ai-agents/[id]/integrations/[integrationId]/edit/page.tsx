import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Settings, Users, Zap, Clock, Plug, Settings2, RefreshCw } from 'lucide-react'

import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { KommoIntegrationSettings } from '@/components/integrations/KommoIntegrationSettings'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata: Metadata = {
  title: 'Настройки Kommo',
  description: 'Настройка интеграции Kommo для AI-агента',
}

interface KommoIntegrationEditPageProps {
  params: Promise<{ tenantId: string; id: string; integrationId: string }>
}

async function getAgentIntegration(
  agentId: string,
  integrationId: string,
  orgId: string
) {
  try {
    const supabase = getSupabaseServiceRoleClient()
    const { data, error } = await supabase
      .from('agent_integrations')
      .select('*')
      .eq('id', integrationId)
      .eq('agent_id', agentId)
      .eq('org_id', orgId)
      .single()

    if (error || !data) {
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching agent integration:', error)
    return null
  }
}

const KommoIntegrationEditPage = async ({ params }: KommoIntegrationEditPageProps) => {
  const resolvedParams = await params
  const { id: agentId, tenantId, integrationId } = resolvedParams

  const session = await auth()

  if (!session?.user?.orgId) {
    redirect('/login')
  }

  const agent = await getAgentById(agentId, session.user.orgId)

  if (!agent) {
    notFound()
  }

  const integration = await getAgentIntegration(agentId, integrationId, session.user.orgId)

  // Если интеграция не найдена, пытаемся найти по типу
  let agentIntegration = integration
  if (!agentIntegration) {
    const supabase = getSupabaseServiceRoleClient()
    const { data } = await supabase
      .from('agent_integrations')
      .select('*')
      .eq('agent_id', agentId)
      .eq('integration_type', 'kommo')
      .eq('org_id', session.user.orgId)
      .single()

    if (data) {
      agentIntegration = data
    }
  }

  const agentsPath = `/manage/${tenantId}/ai-agents`
  const editPath = `/manage/${tenantId}/ai-agents/${agentId}/edit`
  const integrationsPath = `/manage/${tenantId}/ai-agents/${agentId}/available-integrations`

  const tabs = [
    { value: 'basic', label: 'Основные', icon: Settings },
    { value: 'crm', label: 'Сделки и контакты', icon: Users },
    { value: 'triggers', label: 'Триггеры', icon: Zap },
    { value: 'chains', label: 'Цепочки', icon: Clock },
    { value: 'integrations', label: 'Интеграции', icon: Plug },
    { value: 'advanced', label: 'Дополнительно', icon: Settings2 },
  ]

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Хлебные крошки">
        <ul className="flex items-center gap-0">
          <li>
            <Link
              href={agentsPath}
              className="fi-breadcrumbs-item-label text-sm font-medium text-gray-500 transition duration-75 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Агенты ИИ
            </Link>
          </li>
          <li className="flex items-center">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m9 18 6-6-6-6'/%3E%3C/svg%3E"
              alt=""
              className="h-4 w-4 mx-1 opacity-50"
              aria-hidden="true"
            />
            <Link
              href={editPath}
              className="fi-breadcrumbs-item-label text-sm font-medium text-gray-500 transition duration-75 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {agent.name}
            </Link>
          </li>
          <li className="flex items-center">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m9 18 6-6-6-6'/%3E%3C/svg%3E"
              alt=""
              className="h-4 w-4 mx-1 opacity-50"
              aria-hidden="true"
            />
            <Link
              href={integrationsPath}
              className="fi-breadcrumbs-item-label text-sm font-medium text-gray-500 transition duration-75 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Интеграции
            </Link>
          </li>
          <li className="flex items-center">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m9 18 6-6-6-6'/%3E%3C/svg%3E"
              alt=""
              className="h-4 w-4 mx-1 opacity-50"
              aria-hidden="true"
            />
            <span className="fi-breadcrumbs-item-label text-sm font-medium text-gray-500 dark:text-gray-400">
              Kommo
            </span>
          </li>
        </ul>
      </nav>

      {/* Заголовок */}
      <header className="fi-header">
        <h1 className="fi-header-heading text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
          Kommo
        </h1>
      </header>

      {/* Табы навигации */}
      <div className="space-y-6">
        <nav
          className="fi-tabs flex max-w-full gap-x-1 overflow-x-auto mx-auto rounded-xl bg-white p-2 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10 fi-page-sub-navigation-tabs"
          role="tablist"
        >
          {tabs.map((tab) => {
            const isActive = tab.value === 'integrations'
            const tabHrefs: Record<string, string> = {
              basic: editPath,
              crm: `${editPath}?tab=crm`,
              triggers: `${editPath}?tab=triggers`,
              chains: `${editPath}?tab=chains`,
              integrations: integrationsPath,
              advanced: `${editPath}?tab=advanced`,
            }
            const tabHref = tabHrefs[tab.value] || editPath

            return (
              <Link
                key={tab.value}
                href={tabHref}
                className={`fi-tabs-item group flex items-center justify-center gap-x-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium outline-none transition duration-75 hover:bg-gray-50 focus-visible:bg-gray-50 dark:hover:bg-white/5 dark:focus-visible:bg-white/5 ${
                  isActive
                    ? 'fi-active fi-tabs-item-active bg-gray-50 dark:bg-white/5 text-gray-950 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                role="tab"
                aria-selected={isActive}
              >
                {tab.icon && (
                  <tab.icon
                    className={`h-4 w-4 ${
                      isActive
                        ? 'text-gray-700 dark:text-gray-300'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  />
                )}
                <span>{tab.label}</span>
              </Link>
            )
          })}
        </nav>

        <KommoIntegrationSettings
          agentId={agentId}
          integrationId={integrationId}
          integration={agentIntegration}
        />
      </div>
    </div>
  )
}

export default KommoIntegrationEditPage

