import { notFound } from 'next/navigation'
import { EditAgentAdvancedForm } from '@/components/features/agents/EditAgentAdvancedForm'
import { loadAgent } from '@/lib/repositories/agents'

interface PageProps {
  params: Promise<{
    tenantId: string
    agentId: string
  }>
}

export default async function AdvancedSettingsPage({ params }: PageProps) {
  const { tenantId, agentId } = await params
  const agent = await loadAgent(agentId)

  if (!agent) {
    notFound()
  }

  return <EditAgentAdvancedForm agent={agent} tenantId={tenantId} />
}
