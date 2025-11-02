import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Settings, Users, Zap, Clock, Plug, Settings2, ChevronRight } from 'lucide-react'

import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { AvailableIntegrationsTable } from '@/components/integrations/AvailableIntegrationsTable'
import { KwidTabs, KwidTabsContent } from '@/components/kwid'

interface AgentIntegration {
  id: string
  agent_id: string
  org_id: string
  integration_type: string
  is_installed: boolean
  is_active: boolean
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata: Metadata = {
  title: 'Интеграции',
  description: 'Управление интеграциями AI-агента',
}

interface AvailableIntegrationsPageProps {
  params: Promise<{ tenantId: string; id: string }>
}

async function getAgentIntegrations(
  agentId: string,
  orgId: string
): Promise<AgentIntegration[]> {
  try {
    const supabase = getSupabaseServiceRoleClient()
    const { data, error } = await supabase
      .from('agent_integrations')
      .select('*')
      .eq('agent_id', agentId)
      .eq('org_id', orgId)

    if (error) {
      console.error('Error fetching agent integrations:', error)
      return []
    }

    return (data as AgentIntegration[]) || []
  } catch (error) {
    console.error('Error in getAgentIntegrations:', error)
    return []
  }
}

const AvailableIntegrationsPage = async ({ params }: AvailableIntegrationsPageProps) => {
  const resolvedParams = await params
  const { id: agentId, tenantId } = resolvedParams

  const session = await auth()

  if (!session?.user?.orgId) {
    redirect('/login')
  }

  const agent = await getAgentById(agentId, session.user.orgId)

  if (!agent) {
    notFound()
  }

  const integrations = await getAgentIntegrations(agentId, session.user.orgId)

  const agentsPath = `/manage/${tenantId}/ai-agents`
  const editPath = `/manage/${tenantId}/ai-agents/${agentId}/edit`
  const currentPath = `/manage/${tenantId}/ai-agents/${agentId}/available-integrations`

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
            <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 mx-1" />
            <Link
              href={editPath}
              className="fi-breadcrumbs-item-label text-sm font-medium text-gray-500 transition duration-75 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {agent.name}
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 mx-1" />
            <span className="fi-breadcrumbs-item-label text-sm font-medium text-gray-500 dark:text-gray-400">
              Интеграции
            </span>
          </li>
        </ul>
      </nav>

      {/* Заголовок */}
      <header className="fi-header">
        <h1 className="fi-header-heading text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
          Интеграции
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
              integrations: currentPath,
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

        <AvailableIntegrationsTable
          agentId={agentId}
          agentName={agent.name}
          integrations={integrations}
          isLoading={false}
        />
      </div>
    </div>
  )
}

export default AvailableIntegrationsPage

