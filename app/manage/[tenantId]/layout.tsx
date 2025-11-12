import type { ReactNode } from 'react'

import { ManageSidebar } from '@/components/layout/ManageSidebar'
import { ManageHeader } from '@/components/layout/ManageHeader'
import { TenantProvider } from '@/components/providers/TenantProvider'
import { ProductAnalyticsProvider } from '@/components/providers/ProductAnalyticsProvider'
import { auth } from '@/auth'
import { getOrganizationById } from '@/lib/repositories/organizations'

interface ManageTenantLayoutProps {
  children: ReactNode
  params: {
    tenantId: string
  }
}

export default async function ManageTenantLayout({ children, params }: ManageTenantLayoutProps) {
  const { tenantId } = params
  const session = await auth()
  const organization = session?.user?.orgId
    ? await getOrganizationById(session.user.orgId)
    : null
  const tenantContextValue = {
    tenantId,
    organizationId: session?.user?.orgId ?? null,
    organizationName: organization && 'name' in organization ? organization.name : null,
  }

  return (
    <TenantProvider value={tenantContextValue}>
      <ProductAnalyticsProvider context="app">
        <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
          <div className="flex min-h-screen">
            <ManageSidebar />
            <div className="flex flex-1 flex-col">
              <ManageHeader />
              <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">{children}</main>
            </div>
          </div>
        </div>
      </ProductAnalyticsProvider>
    </TenantProvider>
  )
}
