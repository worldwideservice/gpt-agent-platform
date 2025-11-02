import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { AgentTrainingPage } from './_components/AgentTrainingPage'

import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'

export const dynamic = process.env.NODE_ENV === 'development' || process.env.DEMO_MODE === 'true'
  ? 'force-dynamic'
  : 'auto'

export const metadata: Metadata = {
  title: 'Обучение агента',
  description: 'Управление базой знаний и обучением AI-агента',
}

interface TrainingPageProps {
  params: Promise<{ tenantId: string; id: string }>
}

const TrainingPage = async ({ params }: TrainingPageProps) => {
  const resolvedParams = await params
  const { id, tenantId } = resolvedParams

  const isDemoMode = process.env.NODE_ENV === 'development' || process.env.DEMO_MODE === 'true'

  let agent

  if (isDemoMode) {
    agent = {
      id,
      name: 'Демо агент',
      status: 'active' as const,
      model: 'gpt-4o-mini',
      instructions: 'Вы - демо агент...',
      temperature: 0.7,
      maxTokens: 4000,
      responseDelaySeconds: 2,
      settings: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  } else {
    const session = await auth()

    if (!session?.user?.orgId) {
      redirect('/login')
    }

    agent = await getAgentById(id, session.user.orgId)
    if (!agent) {
      notFound()
    }
  }

  return <AgentTrainingPage agentId={id} agentName={agent.name} tenantId={tenantId} />
}

export default TrainingPage

