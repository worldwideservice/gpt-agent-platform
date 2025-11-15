import { AgentIntegrationsPage } from '@/components/features/agents/AgentIntegrationsPage'

interface AgentIntegrationsRouteProps {
  params: Promise<{
    tenantId: string
    agentId: string
  }>
}

export default async function AgentIntegrationsRoute({ params }: AgentIntegrationsRouteProps) {
  const resolvedParams = await params

  return (
    <AgentIntegrationsPage
      tenantId={resolvedParams.tenantId}
      agentId={resolvedParams.agentId}
    />
  )
}
