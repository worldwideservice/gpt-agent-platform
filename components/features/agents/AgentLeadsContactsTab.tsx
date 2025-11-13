import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { AgentLeadsContactsForm } from './AgentLeadsContactsForm'

interface AgentLeadsContactsTabProps {
  tenantId: string
  agentId: string
}

export async function AgentLeadsContactsTab({ tenantId, agentId }: AgentLeadsContactsTabProps) {
  const session = await auth()

  if (!session?.user?.orgId) {
    notFound()
  }

  const agent = await getAgentById(agentId, session.user.orgId)
  if (!agent) {
    notFound()
  }

  return <AgentLeadsContactsForm agent={agent} tenantId={tenantId} />
}
