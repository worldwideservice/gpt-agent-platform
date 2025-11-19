import { AgentBasicsTab } from '@/components/features/agents/AgentBasicsTab'

interface AgentEditPageProps {
  params: Promise<{
    tenantId: string
    agentId: string
  }>
}

export default async function AgentEditPage({ params }: AgentEditPageProps) {
  const { tenantId, agentId } = await params
  // The layout already handles authentication and agent loading
  // This page renders the "Основные" (Basics) tab content
  return <AgentBasicsTab tenantId={tenantId} agentId={agentId} />
}
