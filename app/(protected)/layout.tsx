import { redirect } from 'next/navigation'

import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { auth } from '@/auth'
import { getOrganizationsForUser } from '@/lib/repositories/organizations'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  // Демо режим для локального тестирования
  const isDemoMode = process.env.NODE_ENV === 'development' ||
    process.env.DEMO_MODE === 'true'

  let session: any
  let organizations: any[] = []
  let activeOrganization: any = null

  if (isDemoMode) {
    // В демо режиме создаем фиктивные данные
    session = {
      user: {
        id: 'demo-user-123',
        name: 'Demo Founder',
        email: 'founder@example.com',
        orgId: 'demo-org-123'
      }
    }
    organizations = [{
      id: 'demo-org-123',
      name: 'World Wide Services',
      createdAt: new Date().toISOString()
    }]
    activeOrganization = organizations[0]
  } else {
    session = await auth()

    if (!session?.user?.orgId) {
      redirect('/login')
    }

    organizations = await getOrganizationsForUser(session.user.id)
    activeOrganization =
      organizations.find((organization) => organization.id === session.user.orgId) ?? organizations[0] ?? null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar
          organizations={organizations}
          activeOrganizationId={activeOrganization?.id ?? session.user.orgId}
        />
        <div className="flex-1 lg:ml-72 xl:ml-80 flex flex-col">
          <Header user={session.user} />
          <main className="flex-1 bg-slate-50">
            <div className="px-6 py-6 lg:px-8 lg:py-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default ProtectedLayout






