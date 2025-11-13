import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { AgentIntegrationsTable } from './AgentIntegrationsTable'

interface AgentIntegrationsTabProps {
  tenantId: string
  agentId: string
}

export async function AgentIntegrationsTab({ tenantId, agentId }: AgentIntegrationsTabProps) {
  const session = await auth()

  if (!session?.user?.orgId) {
    notFound()
  }

  const agent = await getAgentById(agentId, session.user.orgId)
  if (!agent) {
    notFound()
  }

  return <AgentIntegrationsTable agent={agent} tenantId={tenantId} />
}
