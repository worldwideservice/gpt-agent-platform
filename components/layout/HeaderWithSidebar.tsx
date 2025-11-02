'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'

interface Session {
  user?: {
    id?: string
    email?: string
    name?: string
    orgId?: string
  }
}

interface Organization {
  id: string
  name: string
  slug?: string
}

interface HeaderWithSidebarProps {
  session: Session | null
  organizations: Organization[]
  activeOrganization: Organization | null
  children: ReactNode
}

export const HeaderWithSidebar = ({
  session,
  organizations,
  activeOrganization,
  children
}: HeaderWithSidebarProps) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <header className="border-b border-slate-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold text-slate-900 dark:text-white">
                GPT Agent Platform
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {session?.user && (
                <span className="text-sm text-slate-600 dark:text-gray-300">
                  {session.user.email || session.user.name || 'Пользователь'}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

