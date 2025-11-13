import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { AgentBasicsForm } from './AgentBasicsForm'

interface AgentBasicsTabProps {
  tenantId: string
  agentId: string
}

export async function AgentBasicsTab({ tenantId, agentId }: AgentBasicsTabProps) {
  const session = await auth()

  if (!session?.user?.orgId) {
    notFound()
  }

  const agent = await getAgentById(agentId, session.user.orgId)
  if (!agent) {
    notFound()
  }

  return <AgentBasicsForm agent={agent} tenantId={tenantId} />
}
