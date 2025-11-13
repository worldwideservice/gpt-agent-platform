import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { KommoIntegrationSettings } from '@/components/features/agents/KommoIntegrationSettings'

interface KommoIntegrationPageProps {
  params: {
    tenantId: string
    agentId: string
  }
}

export default async function KommoIntegrationPage({ params }: KommoIntegrationPageProps) {
  const session = await auth()

  if (!session?.user?.orgId) {
    notFound()
  }

  const agent = await getAgentById(params.agentId, session.user.orgId)
  if (!agent) {
    notFound()
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Kommo</h1>
      <KommoIntegrationSettings agent={agent} tenantId={params.tenantId} />
    </div>
  )
}
