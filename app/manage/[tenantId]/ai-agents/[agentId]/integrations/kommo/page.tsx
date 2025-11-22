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
  params: {
    tenantId: string
    agentId: string
  }
}

export default async function KommoIntegrationPage({ params }: KommoIntegrationPageProps) {
  const session = await auth()

  if (!session?.user?.orgId) {
    notFound()
  }

  const agent = await getAgentById(params.agentId, session.user.orgId)
  if (!agent) {
    notFound()
  }

  const tabs = [
    { id: 'edit', label: 'Основные', href: `/manage/${params.tenantId}/ai-agents/${params.agentId}/edit` },
    { id: 'leads-contacts', label: 'Сделки и контакты', href: `/manage/${params.tenantId}/ai-agents/${params.agentId}/leads-contacts` },
    { id: 'triggers', label: 'Триггеры', href: `/manage/${params.tenantId}/ai-agents/${params.agentId}/triggers` },
    { id: 'sequences', label: 'Цепочки', href: `/manage/${params.tenantId}/ai-agents/${params.agentId}/sequences` },
    { id: 'available-integrations', label: 'Интеграции', href: `/manage/${params.tenantId}/ai-agents/${params.agentId}/available-integrations` },
    { id: 'advanced-settings', label: 'Дополнительно', href: `/manage/${params.tenantId}/ai-agents/${params.agentId}/advanced-settings` },
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/manage/${params.tenantId}/ai-agents`}>Агенты ИИ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/manage/${params.tenantId}/ai-agents/${params.agentId}/edit`}>{agent.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/manage/${params.tenantId}/ai-agents/${params.agentId}/available-integrations`}>Интеграции</Link>
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
      <KommoIntegrationSettings agent={agent} tenantId={params.tenantId} />
    </div>
  )
}
