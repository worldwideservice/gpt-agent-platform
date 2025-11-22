import { AgentBasicsTab } from '@/components/features/agents/AgentBasicsTab'

interface AgentEditPageProps {
  params: {
    tenantId: string
    agentId: string
  }
}

export default async function AgentEditPage({ params }: AgentEditPageProps) {
  // The layout already handles authentication and agent loading
  // This page renders the "Основные" (Basics) tab content
  return <AgentBasicsTab tenantId={params.tenantId} agentId={params.agentId} />
}
