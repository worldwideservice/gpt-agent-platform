import { AgentIntegrationsTab } from '@/components/features/agents/AgentIntegrationsTab'

interface AgentIntegrationsPageProps {
  params: {
    tenantId: string
    agentId: string
  }
}

export default async function AgentIntegrationsPage({ params }: AgentIntegrationsPageProps) {
  return <AgentIntegrationsTab tenantId={params.tenantId} agentId={params.agentId} />
}
