import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { AgentIntegrationsTableWrapper } from './AgentIntegrationsTableWrapper'

interface AgentIntegrationsPageProps {
  tenantId: string
  agentId: string
}

export async function AgentIntegrationsPage({ tenantId, agentId }: AgentIntegrationsPageProps) {
  const session = await auth()

  if (!session?.user?.orgId) {
    notFound()
  }

  const agent = await getAgentById(agentId, session.user.orgId)
  if (!agent) {
    notFound()
  }

  return <AgentIntegrationsTableWrapper agent={agent} tenantId={tenantId} />
}
