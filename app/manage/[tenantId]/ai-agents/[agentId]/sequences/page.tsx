import { AgentSequencesTab } from '@/components/features/agents/AgentSequencesTab'

interface AgentSequencesPageProps {
  params: Promise<{
    tenantId: string
    agentId: string
  }>
}

export default async function AgentSequencesPage({ params }: AgentSequencesPageProps) {
  const { tenantId, agentId } = await params
  return <AgentSequencesTab tenantId={tenantId} agentId={agentId} />
}
