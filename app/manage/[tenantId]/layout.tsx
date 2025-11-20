import type { ReactNode } from 'react'
import { TenantProvider } from '@/components/providers/TenantProvider'
import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

interface ManageTenantLayoutProps {
  children: ReactNode
  params: Promise<{
    tenantId: string
  }>
}

export default async function ManageTenantLayout({ children, params }: ManageTenantLayoutProps) {
  const { tenantId } = await params
  const session = await auth()

  let orgId = session?.user?.orgId
  let organizationName: string | null = null

  // Fallback: if orgId is missing from session, try to resolve from tenantId (slug)
  if (!orgId && tenantId) {
    try {
      const supabase = getSupabaseServiceRoleClient()
      const { data: org } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('slug', tenantId)
        .maybeSingle()

      if (org) {
        orgId = org.id
        organizationName = org.name
      }
    } catch (error) {
      console.error('[Layout] Error resolving orgId from slug:', error)
    }
  }

  // If still no orgId, provide dummy values
  if (!orgId) {
    orgId = ''
  }

  // Get organization details if not already available
  if (orgId && !organizationName) {
    try {
      const { getOrganizationById } = await import('@/lib/repositories/organizations')
      const organization = await getOrganizationById(orgId)
      organizationName = organization && 'name' in organization ? organization.name : null
    } catch (error) {
      console.error('[Layout] Error fetching organization:', error)
    }
  }

  const tenantContextValue = {
    tenantId,
    organizationId: orgId,
    organizationName,
  }

  return (
    <TenantProvider value={tenantContextValue}>
      <div className="min-h-screen bg-white dark:bg-gray-950">
        {children}
      </div>
    </TenantProvider>
  )
}
