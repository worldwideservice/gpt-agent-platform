'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface AgentTabsProps {
    tenantId: string
    agentId: string
}

export function AgentTabs({ tenantId, agentId }: AgentTabsProps) {
    const pathname = usePathname()
    const baseUrl = `/manage/${tenantId}/ai-agents/${agentId}`

    const tabs = [
        {
            label: 'Основные',
            href: `${baseUrl}/edit`,
            isActive: (path: string) => path === `${baseUrl}/edit`,
        },
        {
            label: 'Сделки и контакты',
            href: `${baseUrl}/leads-contacts`,
            isActive: (path: string) => path.startsWith(`${baseUrl}/leads-contacts`),
        },
        {
            label: 'Триггеры',
            href: `${baseUrl}/triggers`,
            isActive: (path: string) => path.startsWith(`${baseUrl}/triggers`),
        },
        {
            label: 'Интеграции',
            href: `${baseUrl}/available-integrations`,
            isActive: (path: string) => path.startsWith(`${baseUrl}/available-integrations`),
        },
        {
            label: 'Дополнительно',
            href: `${baseUrl}/advanced-settings`,
            isActive: (path: string) => path.startsWith(`${baseUrl}/advanced-settings`),
        },
    ]

    return (
        <div className="border-b border-gray-200 dark:border-gray-800">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => {
                    const isCurrent = tab.isActive(pathname || '')
                    return (
                        <Link
                            key={tab.label}
                            href={tab.href}
                            className={cn(
                                isCurrent
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                                'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                            )}
                            aria-current={isCurrent ? 'page' : undefined}
                        >
                            {tab.label}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
