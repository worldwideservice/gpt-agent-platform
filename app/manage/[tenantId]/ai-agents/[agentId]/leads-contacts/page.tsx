import { AgentLeadsContactsTab } from '@/components/features/agents/AgentLeadsContactsTab'

interface AgentLeadsContactsPageProps {
  params: {
    tenantId: string
    agentId: string
  }
}

export default async function AgentLeadsContactsPage({ params }: AgentLeadsContactsPageProps) {
  return <AgentLeadsContactsTab tenantId={params.tenantId} agentId={params.agentId} />
}
