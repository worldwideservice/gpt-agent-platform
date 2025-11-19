import { getTranslations } from 'next-intl/server'
import { CreateAgentForm } from '@/components/features/agents/CreateAgentForm'
import { PageHeader } from '@/components/layout/PageHeader'

interface CreateAgentPageProps {
  params: Promise<{
    tenantId: string
  }>
}

export default async function CreateAgentPage({ params }: CreateAgentPageProps) {
  const { tenantId } = await params
  const t = await getTranslations('manage.agents.page')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Создать Агент ИИ"
        breadcrumbs={[
          { label: t('header.title'), href: `/manage/${tenantId}/ai-agents` },
          { label: 'Создать', href: `/manage/${tenantId}/ai-agents/create` },
        ]}
      />

      <CreateAgentForm tenantId={tenantId} />
    </div>
  )
}
