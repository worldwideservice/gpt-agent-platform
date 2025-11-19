import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AgentAssets } from '@/components/features/agents/AgentAssets'
import { AgentForm } from '@/components/features/agents/AgentForm'
import { AgentRules } from '@/components/features/agents/AgentRules'
import { AgentExecutionLog } from '@/components/features/agents/AgentExecutionLog'
import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { getAgentAssets } from '@/lib/repositories/agent-assets'

interface AgentDetailPageProps {
  params: Promise<{
    tenantId: string
    agentId: string
  }>
}

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { tenantId, agentId } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    notFound()
  }

  const agent = await getAgentById(agentId, session.user.orgId)
  if (!agent) {
    notFound()
  }

  const assets = await getAgentAssets(session.user.orgId, agentId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase text-primary">Агент</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{agent.name}</h1>
          <p className="text-sm text-gray-500">
            Workspace: <span className="font-mono">{tenantId}</span>
          </p>
        </div>
        <Link href={`/manage/${tenantId}/ai-agents`} className="text-sm text-primary hover:underline">
          ← Вернуться к списку
        </Link>
      </div>

      <AgentForm tenantId={tenantId} agent={agent} />
      <AgentAssets tenantId={tenantId} agentId={agent.id} initialAssets={assets} />
      <AgentRules agentId={agent.id} />
      <AgentExecutionLog agentId={agent.id} />
    </div>
  )
}
