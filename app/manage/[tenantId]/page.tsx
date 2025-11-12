import { redirect } from 'next/navigation'

interface ManageTenantPageProps {
  params: {
    tenantId: string
  }
}

export default function ManageTenantPage({ params }: ManageTenantPageProps) {
  redirect(`/manage/${params.tenantId}/dashboard`)
}
