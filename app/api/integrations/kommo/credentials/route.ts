import { NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'


import { auth } from '@/auth'

import { backendFetch } from '@/lib/backend/client'



// Force dynamic rendering (uses headers from auth())
// Force dynamic rendering (uses headers from auth())
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const bodySchema = z.object({

export async function POST(request: NextRequest) {
 try {
 const body = bodySchema.parse(await request.json())
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 await backendFetch('/crm/credentials', {
 method: 'POST',
 body: JSON.stringify({
 orgId: session.user.orgId,
 provider: 'kommo',
 clientId: body.clientId,
 clientSecret: body.clientSecret,
 redirectUri: body.redirectUri,
 }),
 })

 return NextResponse.json({ success: true })
 } catch (error) {
 console.error('Kommo credentials error:', error)
 return NextResponse.json(
 {
 success: false,
 error: error instanceof z.ZodError ? 'Некорректные параметры запроса' : 'Не удалось сохранить данные Kommo',
 },
 { status: error instanceof z.ZodError ? 400 : 500 },
 )
 }
}
