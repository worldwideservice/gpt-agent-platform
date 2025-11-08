import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { backendFetch } from '@/lib/backend/client'
import { logger } from '@/lib/utils/logger'



// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export async function GET() {
 try {
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 const result = await backendFetch<{
 success: boolean
 status: {
 provider: string
 credentialsConfigured: boolean
 connectionConfigured: boolean
 connection: unknown
 credentials: unknown
 sync: unknown
 }
 error?: string
 }>('/crm/status', {
 method: 'GET',
 searchParams: {
 orgId: session.user.orgId,
 provider: 'kommo',
 },
 })

 return NextResponse.json(result)
 } catch (error: unknown) {
 logger.error('Kommo status error:', error, {
   endpoint: '/api/integrations/kommo/status',
 })
 return NextResponse.json(
 { success: false, error: 'Не удалось получить статус подключения Kommo' },
 { status: 500 },
 )
 }
}
