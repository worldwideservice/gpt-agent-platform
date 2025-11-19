import type { ReactNode } from 'react'
import { Suspense } from 'react'

import { ManageSidebar } from '@/components/layout/ManageSidebar'
import { ManageHeader } from '@/components/layout/ManageHeader'
import { TenantProvider } from '@/components/providers/TenantProvider'
import { ProductAnalyticsProvider } from '@/components/providers/ProductAnalyticsProvider'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { auth } from '@/auth'
import { getOrganizationById } from '@/lib/repositories/organizations'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface ManageTenantLayoutProps {
  children: ReactNode
  params: Promise<{
    tenantId: string
  }>
}

export default async function ManageTenantLayout({ children, params }: ManageTenantLayoutProps) {
  const { tenantId } = await params
  const session = await auth()

  // Debug logging for production
  console.log('[Layout] TenantId:', tenantId)
  console.log('[Layout] Session exists:', !!session)
  console.log('[Layout] Session user:', session?.user)
  console.log('[Layout] Session user orgId:', session?.user?.orgId)
  console.log('[Layout] Session user organizationSlug:', session?.user?.organizationSlug)

  let orgId = session?.user?.orgId
  let organizationName: string | null = null
  let hasError = false

  // Fallback: if orgId is missing from session, try to resolve from tenantId (slug)
  if (!orgId && tenantId) {
    console.log('[Layout] orgId missing from session, attempting to resolve from tenantId:', tenantId)
    try {
      const supabase = getSupabaseServiceRoleClient()
      const { data: org, error } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('slug', tenantId)
        .maybeSingle()

      if (error) {
        console.error('[Layout] Error resolving orgId from slug:', error)
      } else if (org) {
        orgId = org.id
        organizationName = org.name
        console.log('[Layout] ✅ Resolved orgId from slug:', orgId, organizationName)
      } else {
        console.error('[Layout] Organization not found for slug:', tenantId)
        hasError = true
      }
    } catch (error) {
      console.error('[Layout] Exception while resolving orgId from slug:', error)
      hasError = true
    }
  }

  // If still no orgId, mark as error (but still provide context to avoid crash)
  if (!orgId) {
    console.error('[Layout] ❌ CRITICAL: No orgId available after all attempts')
    hasError = true
    // Provide dummy values to prevent TenantProvider crash
    orgId = ''
  }

  // Get organization details if not already available
  if (orgId && !organizationName && !hasError) {
    try {
      const organization = await getOrganizationById(orgId)
      organizationName = organization && 'name' in organization ? organization.name : null
      console.log('[Layout] Fetched organization name:', organizationName)
    } catch (error) {
      console.error('[Layout] Error fetching organization:', error)
    }
  }

  const tenantContextValue = {
    tenantId,
    organizationId: orgId,
    organizationName,
  }

  console.log('[Layout] ✅ Final tenant context:', tenantContextValue)

  // IMPORTANT: Always wrap in TenantProvider, even for error case,
  // because ManageHeader uses useTenant() hook
  return (
    <TenantProvider value={tenantContextValue}>
      {hasError ? (
        // Error UI without ManageHeader/Sidebar to avoid useTenant() crash
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center space-y-4 py-8 text-center">
              <h2 className="text-2xl font-bold">Сессия истекла</h2>
              <p className="text-muted-foreground">
                Пожалуйста, войдите в систему заново
              </p>
              <Button asChild size="lg">
                <a href="/login">Войти</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Normal layout with header/sidebar
        <Suspense fallback={null}>
          <ProductAnalyticsProvider context="app">
            <SidebarProvider defaultOpen={true}>
              <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50">
                <ManageSidebar />
                <SidebarInset>
                  <ManageHeader />
                  <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">{children}</main>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </ProductAnalyticsProvider>
        </Suspense>
      )}
    </TenantProvider>
  )
}
