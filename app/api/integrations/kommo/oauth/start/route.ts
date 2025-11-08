import { NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'


import { auth } from '@/auth'

import { backendFetch } from '@/lib/backend/client'


const bodySchema = z.object({

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
// Force dynamic rendering (uses headers from auth())
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
 } catch (error) {
 console.error('Kommo oauth start error:', error)

 return NextResponse.json(
 {
 success: false,
 error: error instanceof z.ZodError ? 'Некорректные параметры запроса' : 'Не удалось запустить OAuth авторизацию Kommo',
 },
 { status: error instanceof z.ZodError ? 400 : 500 },
 )
 }
}
