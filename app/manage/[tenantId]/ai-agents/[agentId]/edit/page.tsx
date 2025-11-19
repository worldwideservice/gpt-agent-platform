import { notFound } from 'next/navigation'
import { EditAgentGeneralForm } from '@/components/features/agents/EditAgentGeneralForm'
import { loadAgent } from '@/lib/repositories/agents'

interface EditAgentPageProps {
  params: Promise<{
    tenantId: string
    agentId: string
  }>
}

export default async function EditAgentPage({ params }: EditAgentPageProps) {
  const { tenantId, agentId } = await params
  const agent = await loadAgent(agentId)

  if (!agent) {
    notFound()
  }

  return <EditAgentGeneralForm agent={agent} tenantId={tenantId} />
}
