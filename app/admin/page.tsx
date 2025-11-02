import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { checkAdminAccess } from '@/lib/admin'

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Check if user has admin access
  const hasAdminAccess = await checkAdminAccess(session.user.id)

  if (!hasAdminAccess) {
    redirect('/dashboard')
  }

  return <AdminDashboard />
}
