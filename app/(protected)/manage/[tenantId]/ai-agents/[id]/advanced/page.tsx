import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Settings, Users, Zap, Clock, Plug, Settings2, ArrowLeft, ChevronRight } from 'lucide-react'

import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { AdvancedSettingsClient } from '@/app/(protected)/agents/[id]/_components/AdvancedSettingsClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata: Metadata = {
  title: 'Расширенные настройки',
  description: 'Расширенные настройки AI-агента',
}

interface AdvancedPageProps {
  params: Promise<{ tenantId: string; id: string }>
}

const AdvancedPage = async ({ params }: AdvancedPageProps) => {
  const resolvedParams = await params
  const { id: agentId, tenantId } = resolvedParams

  const session = await auth()

  if (!session?.user?.orgId || session.user.orgId !== tenantId) {
    notFound()
  }

  const agent = await getAgentById(agentId, session.user.orgId)

  if (!agent) {
    notFound()
  }

  const agentsPath = `/manage/${tenantId}/ai-agents`
  const editPath = `/manage/${tenantId}/ai-agents/${agentId}/edit`
  const currentPath = `/manage/${tenantId}/ai-agents/${agentId}/advanced`

  const tabs = [
    { value: 'basic', label: 'Основные', icon: Settings, href: editPath },
    { value: 'crm', label: 'Сделки и контакты', icon: Users, href: `/manage/${tenantId}/ai-agents/${agentId}/leads-contacts` },
    { value: 'triggers', label: 'Триггеры', icon: Zap, href: `/manage/${tenantId}/ai-agents/${agentId}/triggers` },
    { value: 'chains', label: 'Цепочки', icon: Clock, href: `/manage/${tenantId}/ai-agents/${agentId}/sequences` },
    { value: 'integrations', label: 'Интеграции', icon: Plug, href: `/manage/${tenantId}/ai-agents/${agentId}/available-integrations` },
    { value: 'advanced', label: 'Дополнительно', icon: Settings2, href: currentPath },
  ]

  return (
    <div className="fi-layout-panel fi-panel">
      <nav className="fi-tabs flex flex-col gap-y-4">
        <ul className="fi-tabs-header flex gap-x-3">
          <li>
            <Link
              href={agentsPath}
              className="fi-tabs-item flex items-center gap-x-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-gray-500 outline-none transition duration-75 hover:text-gray-700 focus:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:focus:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад к агентам
            </Link>
          </li>
        </ul>
      </nav>

      <header className="fi-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <ul className="flex items-center gap-x-1">
              <li>
                <Link
                  href={agentsPath}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Агенты ИИ
                </Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 mx-1" />
              </li>
              <li>
                <Link
                  href={editPath}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {agent.name}
                </Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 mx-1" />
              </li>
              <li>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Редактирование
                </span>
              </li>
            </ul>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            Расширенные настройки
          </h1>
        </div>
      </header>

      <div className="fi-tabs-content">
        <div className="fi-tabs-header flex gap-x-3">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={tab.href}
              className={`fi-tabs-item flex items-center gap-x-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium outline-none transition duration-75 ${
                tab.value === 'advanced'
                  ? 'bg-gray-50 text-primary-600 shadow-sm dark:bg-white/5 dark:text-primary-400'
                  : 'text-gray-500 hover:text-gray-700 focus:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:focus:bg-white/5'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </Link>
          ))}
        </div>
        <div className="fi-tabs-panel space-y-6 p-6">
          <AdvancedSettingsClient agentId={agentId} initialAgent={agent} />
        </div>
      </div>
    </div>
  )
}

export default AdvancedPage

