import { NextResponse, type NextRequest } from 'next/server'


import { auth } from '@/auth'

import { backendFetch } from '@/lib/backend/client'


// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const POST = async (request: NextRequest) => {
  const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const body = await request.json().catch(() => ({}))
 const payload = {
 orgId: session.user.orgId,
 provider: 'kommo',
 connectionId: typeof body.connectionId === 'string' ? body.connectionId : undefined,
 baseDomain: typeof body.baseDomain === 'string' ? body.baseDomain : undefined,
 }

 await backendFetch('/crm/sync', {
 method: 'POST',
 body: JSON.stringify(payload),
 })

 // Логируем синхронизацию интеграции
 const { ActivityLogger } = await import('@/lib/services/activity-logger')
 await ActivityLogger.integrationSynced(session.user.orgId, 'kommo', true).catch((error) => {
   console.error('Failed to log integration sync:', error)
 })

 return NextResponse.json({ success: true })
 } catch (error) {
 console.error('Kommo sync pipelines error', error)
 return NextResponse.json({ success: false, error: 'Не удалось запустить синхронизацию Kommo' }, { status: 500 })
 }
}
