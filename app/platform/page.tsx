import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getTenantIdFromSession } from '@/lib/utils/getTenantRedirect'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

/**
 * Fallback страница для редиректа на правильный tenant
 * Используется когда не удалось получить tenant-id в других местах
 */
export default async function PlatformPage() {
  const session = await auth()

  if (!session?.user?.orgId) {
    redirect('/login')
  }

  try {
    const tenantId = await getTenantIdFromSession()

    if (tenantId) {
      redirect(`/manage/${tenantId}`)
    }
  } catch (error) {
    console.error('[PlatformPage] Error getting tenant-id', error)
  }

  // Если не удалось получить tenant-id, показываем сообщение об ошибке
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Ошибка</h1>
        <p className="text-gray-600 mb-4">
          Не удалось определить вашу организацию
        </p>
        <a
          href="/login"
          className="text-blue-600 hover:underline"
        >
          Войти заново
        </a>
      </div>
    </div>
  )
}

