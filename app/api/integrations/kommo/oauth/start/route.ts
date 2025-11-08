import { NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { auth } from '@/auth'
import { backendFetch } from '@/lib/backend/client'
import { logger } from '@/lib/utils/logger'




// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
const bodySchema = z.object({
  baseDomain: z.string().min(1),
})

export async function POST(request: NextRequest) {
 try {
 const body = bodySchema.parse(await request.json())
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 const result = await backendFetch<{ success: boolean; authUrl: string; state: string }>('/kommo/oauth/start', {
 method: 'POST',
 body: JSON.stringify({
 orgId: session.user.orgId,
 baseDomain: body.baseDomain,
 }),
 })

 return NextResponse.json(result)
 } catch (error: unknown) {
 logger.error('Kommo oauth start error:', error, {
   endpoint: '/api/integrations/kommo/oauth/start',
 })

 return NextResponse.json(
 {
 success: false,
 error: error instanceof z.ZodError ? 'Некорректные параметры запроса' : 'Не удалось запустить OAuth авторизацию Kommo',
 },
 { status: error instanceof z.ZodError ? 400 : 500 },
 )
 }
}
