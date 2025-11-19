import { AgentIntegrationsTab } from '@/components/features/agents/AgentIntegrationsTab'

interface AgentIntegrationsPageProps {
  params: Promise<{
    tenantId: string
    agentId: string
  }>
}

export default async function AgentIntegrationsPage({ params }: AgentIntegrationsPageProps) {
  const { tenantId, agentId } = await params
  return <AgentIntegrationsTab tenantId={tenantId} agentId={agentId} />
}
