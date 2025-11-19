import { AgentAdvancedSettingsTab } from '@/components/features/agents/AgentAdvancedSettingsTab'

interface AgentAdvancedSettingsPageProps {
  params: Promise<{
    tenantId: string
    agentId: string
  }>
}

export default async function AgentAdvancedSettingsPage({ params }: AgentAdvancedSettingsPageProps) {
  const { tenantId, agentId } = await params
  return <AgentAdvancedSettingsTab tenantId={tenantId} agentId={agentId} />
}
