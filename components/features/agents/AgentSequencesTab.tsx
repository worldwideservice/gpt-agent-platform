import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { AgentSequencesTable } from './AgentSequencesTable'

interface AgentSequencesTabProps {
  tenantId: string
  agentId: string
}

export async function AgentSequencesTab({ tenantId, agentId }: AgentSequencesTabProps) {
  const session = await auth()

  if (!session?.user?.orgId) {
    notFound()
  }

  const agent = await getAgentById(agentId, session.user.orgId)
  if (!agent) {
    notFound()
  }

  return <AgentSequencesTable agent={agent} tenantId={tenantId} />
}
