import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { AgentEditForm } from '@/app/(protected)/agents/[id]/_components/AgentEditForm'

import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'

export const dynamic = process.env.NODE_ENV === 'development' || process.env.DEMO_MODE === 'true'
  ? 'force-dynamic'
  : 'auto'

export const metadata: Metadata = {
  title: 'Редактирование агента',
  description: 'Настройка параметров и поведения AI-агента',
}

interface EditAgentPageProps {
  params: Promise<{ tenantId: string; id: string }>
}

const EditAgentPage = async ({ params }: EditAgentPageProps) => {
  const resolvedParams = await params
  const { id, tenantId } = resolvedParams

  const isDemoMode = process.env.NODE_ENV === 'development' || process.env.DEMO_MODE === 'true'

  let agent

  if (isDemoMode) {
    // Mock данные для демо-режима
    if (id === 'new') {
      agent = null
    } else {
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
    }
  } else {
    const session = await auth()

    if (!session?.user?.orgId) {
      redirect('/login')
    }

    if (id !== 'new') {
      agent = await getAgentById(id, session.user.orgId)
      if (!agent) {
        notFound()
      }
    }
  }

  // Ensure agent has all required fields
  const agentWithDefaults = agent ? {
    ...agent,
    messagesTotal: agent.messagesTotal ?? 0,
    lastActivityAt: agent.lastActivityAt ?? null,
    ownerName: agent.ownerName ?? null,
  } : null

  return <AgentEditForm agentId={id} initialAgent={agentWithDefaults} tenantId={tenantId} />
}

export default EditAgentPage

