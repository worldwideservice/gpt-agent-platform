// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/auth'
import { backendFetch } from '@/lib/backend/client'
import { trackCrmSynced } from '@/lib/analytics/examples'

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

 const startTime = Date.now()
 await backendFetch('/crm/sync', {
 method: 'POST',
 body: JSON.stringify(payload),
 })
 const durationSeconds = (Date.now() - startTime) / 1000

 // Track CRM sync for analytics
 try {
 trackCrmSynced({
 integrationType: 'kommo',
 syncType: 'pipelines',
 itemsCount: 0, // Will be updated by backend
 organizationId: session.user.orgId,
 durationSeconds,
 })
 } catch (analyticsError) {
 console.error('Failed to track CRM sync', analyticsError)
 }

 return NextResponse.json({ success: true })
 } catch (error) {
 console.error('Kommo sync pipelines error', error)
 return NextResponse.json({ success: false, error: 'Не удалось запустить синхронизацию Kommo' }, { status: 500 })
 }
}
