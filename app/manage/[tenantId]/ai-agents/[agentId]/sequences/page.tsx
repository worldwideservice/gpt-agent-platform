import { AgentSequencesTab } from '@/components/features/agents/AgentSequencesTab'

interface AgentSequencesPageProps {
  params: {
    tenantId: string
    agentId: string
  }
}

export default async function AgentSequencesPage({ params }: AgentSequencesPageProps) {
  return <AgentSequencesTab tenantId={params.tenantId} agentId={params.agentId} />
}
