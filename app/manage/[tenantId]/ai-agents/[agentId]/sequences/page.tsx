import { AgentSequencesTab } from '@/components/features/agents/AgentSequencesTab'

interface SequencesPageProps {
  params: Promise<{
    tenantId: string
    agentId: string
  }>
}

export default async function SequencesPage({ params }: SequencesPageProps) {
  const { tenantId, agentId } = await params
  return <AgentSequencesTab tenantId={tenantId} agentId={agentId} />
}
