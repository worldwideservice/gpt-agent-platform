import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { AgentAdvancedSettingsForm } from './AgentAdvancedSettingsForm'

interface AgentAdvancedSettingsTabProps {
  tenantId: string
  agentId: string
}

export async function AgentAdvancedSettingsTab({ tenantId, agentId }: AgentAdvancedSettingsTabProps) {
  const session = await auth()

  if (!session?.user?.orgId) {
    notFound()
  }

  const agent = await getAgentById(agentId, session.user.orgId)
  if (!agent) {
    notFound()
  }

  return <AgentAdvancedSettingsForm agent={agent} tenantId={tenantId} />
}
