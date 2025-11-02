import { redirect } from 'next/navigation'

import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { auth } from '@/auth'
import { checkAdminAccess } from '@/lib/admin'
import { redirectToTenantPath } from '@/lib/utils/getTenantRedirect'

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Check if user has admin access
  const hasAdminAccess = await checkAdminAccess(session.user.id)

  if (!hasAdminAccess) {
    return redirectToTenantPath('/')
  }

  return <AdminDashboard />
}
