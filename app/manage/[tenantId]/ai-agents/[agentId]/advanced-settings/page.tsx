import { AgentAdvancedSettingsTab } from '@/components/features/agents/AgentAdvancedSettingsTab'

interface AgentAdvancedSettingsPageProps {
  params: {
    tenantId: string
    agentId: string
  }
}

export default async function AgentAdvancedSettingsPage({ params }: AgentAdvancedSettingsPageProps) {
  return <AgentAdvancedSettingsTab tenantId={params.tenantId} agentId={params.agentId} />
}
