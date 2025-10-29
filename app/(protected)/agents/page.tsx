import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

import { AgentsClient } from './_components/AgentsClient'

import { auth } from '@/auth'
import { getAgents } from '@/lib/repositories/agents'

export const metadata: Metadata = {
  title: 'Агенты ИИ',
  description: 'Управление AI-агентами и настройка их поведения',
}

const AgentsPage = async () => {
  const session = await auth()

  if (!session?.user?.orgId) {
    redirect('/login')
  }

  const { agents, total } = await getAgents({ organizationId: session.user.orgId })

  return <AgentsClient initialAgents={agents} total={total} />
}

export default AgentsPage
