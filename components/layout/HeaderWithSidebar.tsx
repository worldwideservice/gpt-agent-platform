'use client'

import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useSidebar } from './SidebarToggle'

interface HeaderWithSidebarProps {
  session: {
    user: {
      id: string
      name?: string | null
      email?: string | null
      orgId: string
    }
  }
  organizations: Array<{
    id: string
    name: string
    slug: string
  }>
  activeOrganization: {
    id: string
    name: string
    slug: string
  } | null
  tenantId?: string
  children: React.ReactNode
}

export const HeaderWithSidebar = ({
  session,
  organizations,
  activeOrganization,
  tenantId,
  children,
}: HeaderWithSidebarProps) => {
  const { toggle, isOpen } = useSidebar()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar
          organizations={organizations}
          activeOrganizationId={activeOrganization?.id ?? session.user.orgId}
          tenantId={tenantId}
          isOpen={isOpen}
        />
        <div className="flex-1 lg:ml-72 xl:ml-80 flex flex-col">
          <Header user={session.user} tenantId={tenantId} onSidebarToggle={toggle} />
          <main className="fi-main mx-auto h-full w-full px-4 md:px-6 lg:px-8 max-w-7xl flex-1 bg-slate-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

