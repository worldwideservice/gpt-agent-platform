import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { AgentTriggersTable } from './AgentTriggersTable'

interface AgentTriggersTabProps {
  tenantId: string
  agentId: string
}

export async function AgentTriggersTab({ tenantId, agentId }: AgentTriggersTabProps) {
  const session = await auth()

  if (!session?.user?.orgId) {
    notFound()
  }

  const agent = await getAgentById(agentId, session.user.orgId)
  if (!agent) {
    notFound()
  }

  return <AgentTriggersTable agent={agent} tenantId={tenantId} />
}
