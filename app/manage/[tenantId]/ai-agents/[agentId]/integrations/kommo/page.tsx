import { notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { KommoIntegrationSettings } from '@/components/features/agents/KommoIntegrationSettings'
import { AgentEditTabs } from '@/components/features/agents/AgentEditTabs'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui'

interface KommoIntegrationPageProps {
  params: Promise<{
    tenantId: string
    agentId: string
  }>
}

export default async function KommoIntegrationPage({ params }: KommoIntegrationPageProps) {
  const { tenantId, agentId } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    notFound()
  }

  const agent = await getAgentById(agentId, session.user.orgId)
  if (!agent) {
    notFound()
  }

  const tabs = [
    { id: 'edit', label: 'Основные', href: `/manage/${tenantId}/ai-agents/${agentId}/edit` },
    { id: 'leads-contacts', label: 'Сделки и контакты', href: `/manage/${tenantId}/ai-agents/${agentId}/leads-contacts` },
    { id: 'triggers', label: 'Триггеры', href: `/manage/${tenantId}/ai-agents/${agentId}/triggers` },
    { id: 'sequences', label: 'Цепочки', href: `/manage/${tenantId}/ai-agents/${agentId}/sequences` },
    { id: 'available-integrations', label: 'Интеграции', href: `/manage/${tenantId}/ai-agents/${agentId}/available-integrations` },
    { id: 'advanced-settings', label: 'Дополнительно', href: `/manage/${tenantId}/ai-agents/${agentId}/advanced-settings` },
  ]

  return (
    <div className="space-y-6">
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
              <Link href={`/manage/${tenantId}/ai-agents/${agentId}/edit`}>{agent.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/manage/${tenantId}/ai-agents/${agentId}/available-integrations`}>Интеграции</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Kommo</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Kommo</h1>
      </header>

      {/* Tabs Navigation */}
      <AgentEditTabs tabs={tabs} />

      {/* Content */}
      <KommoIntegrationSettings agent={agent} tenantId={tenantId} />
    </div>
  )
}
