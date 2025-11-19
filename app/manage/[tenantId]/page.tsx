import { redirect } from 'next/navigation'

interface ManageTenantPageProps {
  params: Promise<{
    tenantId: string
  }>
}

export default async function ManageTenantPage({ params }: ManageTenantPageProps) {
  const { tenantId } = await params
  redirect(`/manage/${tenantId}/dashboard`)
}
