import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { LandingPageClient } from './LandingPageClient'

// Force dynamic rendering for landing page
export const dynamic = 'force-dynamic'

export default async function LandingPage() {
 // Проверяем авторизацию на сервере
 const session = await auth()
 
 // Если пользователь авторизован, получаем tenant-id и редиректим
 if (session?.user?.orgId) {
 try {
 const { getTenantIdFromSession } = await import('@/lib/utils/getTenantRedirect')
 const tenantId = await getTenantIdFromSession()
 
 if (tenantId) {
 redirect(`/manage/${tenantId}`)
 } else {
 // Fallback на /platform если tenant-id не получен
 redirect('/platform')
 }
 } catch (error) {
 console.error('[LandingPage] Error getting tenant-id', error)
 redirect('/platform')
 }
 }

 return <LandingPageClient />
}
