import { redirect } from 'next/navigation'

import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { auth } from '@/auth'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col">
          <Header />
          <main className="flex-1 bg-gray-50">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default ProtectedLayout






