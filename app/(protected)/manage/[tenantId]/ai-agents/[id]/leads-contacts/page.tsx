import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Settings, Users, Zap, Clock, Plug, Settings2, ChevronRight } from 'lucide-react'

import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { DealContactFieldsSelector } from '@/components/crm/DealContactFieldsSelector'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata: Metadata = {
  title: 'Сделки и контакты',
  description: 'Настройки доступа к данным сделок и контактов',
}

interface LeadsContactsPageProps {
  params: Promise<{ tenantId: string; id: string }>
}

export default async function LeadsContactsPage({ params }: LeadsContactsPageProps) {
  const resolvedParams = await params
  const { tenantId, id: agentId } = resolvedParams

  const session = await auth()

  if (!session?.user?.orgId) {
    redirect('/login')
  }

  // Проверяем что tenantId совпадает с orgId пользователя
  if (session.user.orgId !== tenantId) {
    redirect('/login')
  }

  const agent = await getAgentById(agentId, session.user.orgId)

  if (!agent) {
    notFound()
  }

  const editPath = `/manage/${tenantId}/ai-agents/${agentId}/edit`
  const currentPath = `/manage/${tenantId}/ai-agents/${agentId}/leads-contacts`
  const integrationsPath = `/manage/${tenantId}/ai-agents/${agentId}/available-integrations`
  const agentsPath = `/manage/${tenantId}/ai-agents`

  const tabs = [
    { value: 'basic', label: 'Основные', icon: Settings },
    { value: 'crm', label: 'Сделки и контакты', icon: Users },
    { value: 'triggers', label: 'Триггеры', icon: Zap },
    { value: 'chains', label: 'Цепочки', icon: Clock },
    { value: 'integrations', label: 'Интеграции', icon: Plug },
    { value: 'advanced', label: 'Дополнительно', icon: Settings2 },
  ]

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Хлебные крошки">
        <ul className="flex items-center gap-0">
          <li>
            <Link
              href={agentsPath}
              className="fi-breadcrumbs-item-label text-sm font-medium text-gray-500 transition duration-75 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Агенты ИИ
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 mx-1" />
            <Link
              href={editPath}
              className="fi-breadcrumbs-item-label text-sm font-medium text-gray-500 transition duration-75 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {agent.name}
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 mx-1" />
            <span className="fi-breadcrumbs-item-label text-sm font-medium text-gray-500 dark:text-gray-400">
              Данные сделок и контактов
            </span>
          </li>
        </ul>
      </nav>

      {/* Заголовок */}
      <header className="fi-header">
        <h1 className="fi-header-heading text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
          Сделки и контакты
        </h1>
      </header>

      {/* Табы навигации */}
      <div className="space-y-6">
        <nav
          className="fi-tabs flex max-w-full gap-x-1 overflow-x-auto mx-auto rounded-xl bg-white p-2 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10 fi-page-sub-navigation-tabs"
          role="tablist"
        >
          {tabs.map((tab) => {
            const isActive = tab.value === 'crm'
            const tabHrefs: Record<string, string> = {
              basic: editPath,
              crm: currentPath,
              triggers: `${editPath}?tab=triggers`,
              chains: `${editPath}?tab=chains`,
              integrations: integrationsPath,
              advanced: `${editPath}?tab=advanced`,
            }
            const tabHref = tabHrefs[tab.value] || editPath

            return (
              <Link
                key={tab.value}
                href={tabHref}
                className={`fi-tabs-item group flex items-center justify-center gap-x-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium outline-none transition duration-75 hover:bg-gray-50 focus-visible:bg-gray-50 dark:hover:bg-white/5 dark:focus-visible:bg-white/5 ${
                  isActive
                    ? 'fi-active fi-tabs-item-active bg-gray-50 dark:bg-white/5 text-gray-950 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                role="tab"
                aria-selected={isActive}
              >
                {tab.icon && (
                  <tab.icon
                    className={`h-4 w-4 ${
                      isActive
                        ? 'text-gray-700 dark:text-gray-300'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  />
                )}
                <span>{tab.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Контент страницы */}
        <DealContactFieldsSelector agentId={agentId} />

        {/* Кнопки действий */}
        <div className="flex items-center justify-start gap-3">
          <Link href={editPath}>
            <button
              type="button"
              className="fi-btn relative grid-flow-col items-center justify-center font-semibold outline-none transition duration-75 focus-visible:ring-2 rounded-lg inline-grid gap-1 shadow-sm fi-size-md px-4 py-2 text-base bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500/50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              Сохранить
            </button>
          </Link>
          <Link href={editPath}>
            <button
              type="button"
              className="fi-btn relative grid-flow-col items-center justify-center font-semibold outline-none transition duration-75 focus-visible:ring-2 rounded-lg inline-grid gap-1 shadow-sm fi-size-md px-4 py-2 text-base border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500/50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              Отмена
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

