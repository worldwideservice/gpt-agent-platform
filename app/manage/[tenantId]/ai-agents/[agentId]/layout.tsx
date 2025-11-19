import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { loadAgent } from '@/lib/repositories/agents'
import { AgentTabs } from '@/components/features/agents/AgentTabs'

interface AgentLayoutProps {
    children: React.ReactNode
    params: Promise<{
        tenantId: string
        agentId: string
    }>
}

export default async function AgentLayout({ children, params }: AgentLayoutProps) {
    const { tenantId, agentId } = await params
    const t = await getTranslations('manage.agents.page')

    const agent = await loadAgent(agentId)

    if (!agent) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Редактирование ${agent.name}`}
                breadcrumbs={[
                    { label: t('header.title'), href: `/manage/${tenantId}/ai-agents` },
                    { label: agent.name, href: `/manage/${tenantId}/ai-agents/${agentId}/edit` },
                ]}
                actions={
                    <Button variant="destructive" size="sm">
                        Удалить
                    </Button>
                }
            />

            <AgentTabs tenantId={tenantId} agentId={agentId} />

            {children}
        </div>
    )
}
