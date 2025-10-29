import { redirect } from 'next/navigation'

import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { auth } from '@/auth'
import { getOrganizationsForUser } from '@/lib/repositories/organizations'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    redirect('/login')
  }

  const organizations = await getOrganizationsForUser(session.user.id)
  const activeOrganization =
    organizations.find((organization) => organization.id === session.user.orgId) ?? organizations[0] ?? null

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






