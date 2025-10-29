import { redirect } from 'next/navigation'

import { AgentEditForm } from './_components/AgentEditForm'

import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'

interface AgentEditPageProps {
  params: Promise<{
    id: string
  }>
}

const AgentEditPage = async ({ params }: AgentEditPageProps) => {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    redirect('/login')
  }

  let agent = null

  if (id !== 'new') {
    try {
      agent = await getAgentById(id, session.user.orgId)
      
      if (!agent) {
        redirect('/agents')
      }
    } catch (error) {
      console.error('Failed to load agent', error)
      redirect('/agents')
    }
  }

  return <AgentEditForm agentId={id} initialAgent={agent} />
}

export default AgentEditPage
