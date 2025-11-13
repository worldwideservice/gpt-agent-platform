import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

interface AgentBasicsTabProps {
  tenantId: string
  agentId: string
}

export async function AgentBasicsTab({ tenantId, agentId }: AgentBasicsTabProps) {
  const session = await auth()

  if (!session?.user?.orgId) {
    notFound()
  }

  const agent = await getAgentById(agentId, session.user.orgId)
  if (!agent) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Профиль агента */}
      <Card>
        <CardHeader>
          <CardTitle>Профиль агента</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Содержимое вкладки "Основные" будет реализовано в Phase 11
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Включает: Название, Активность, Инструкции, Настройки воронок, Каналы, База знаний
          </p>
        </CardContent>
      </Card>

      {/* Placeholder для других секций */}
      <Card>
        <CardHeader>
          <CardTitle>Настройки воронок</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Синхронизация с Kommo CRM - Phase 12
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
