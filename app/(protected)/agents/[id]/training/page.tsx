import { redirect } from 'next/navigation'

import { AgentTrainingPage } from './_components/AgentTrainingPage'

import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'

interface TrainingPageProps {
  params: Promise<{
    id: string
  }>
}

const TrainingPage = async ({ params }: TrainingPageProps) => {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    redirect('/login')
  }

  try {
    const agent = await getAgentById(id, session.user.orgId)

    if (!agent) {
      redirect('/agents')
    }

    return <AgentTrainingPage agentId={id} agentName={agent.name} />
  } catch (error) {
    console.error('Failed to load agent', error)
    redirect('/agents')
  }
}

export default TrainingPage










