import { notFound } from 'next/navigation'
import { EditAgentLeadsContactsForm } from '@/components/features/agents/EditAgentLeadsContactsForm'
import { loadAgent } from '@/lib/repositories/agents'

interface PageProps {
  params: Promise<{
    tenantId: string
    agentId: string
  }>
}

export default async function LeadsContactsPage({ params }: PageProps) {
  const { tenantId, agentId } = await params
  const agent = await loadAgent(agentId)

  if (!agent) {
    notFound()
  }

  return <EditAgentLeadsContactsForm agent={agent} tenantId={tenantId} />
}
