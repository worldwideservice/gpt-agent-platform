import { AgentTriggersTab } from '@/components/features/agents/AgentTriggersTab'

interface AgentTriggersPageProps {
  params: {
    tenantId: string
    agentId: string
  }
}

export default async function AgentTriggersPage({ params }: AgentTriggersPageProps) {
  return <AgentTriggersTab tenantId={params.tenantId} agentId={params.agentId} />
}
