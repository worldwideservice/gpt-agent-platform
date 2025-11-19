import { AgentLeadsContactsTab } from '@/components/features/agents/AgentLeadsContactsTab'

interface AgentLeadsContactsPageProps {
  params: Promise<{
    tenantId: string
    agentId: string
  }>
}

export default async function AgentLeadsContactsPage({ params }: AgentLeadsContactsPageProps) {
  const { tenantId, agentId } = await params
  return <AgentLeadsContactsTab tenantId={tenantId} agentId={agentId} />
}
