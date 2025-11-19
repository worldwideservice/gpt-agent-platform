import { AgentTriggersTab } from '@/components/features/agents/AgentTriggersTab'

interface AgentTriggersPageProps {
  params: Promise<{
    tenantId: string
    agentId: string
  }>
}

export default async function AgentTriggersPage({ params }: AgentTriggersPageProps) {
  const { tenantId, agentId } = await params
  return <AgentTriggersTab tenantId={tenantId} agentId={agentId} />
}
