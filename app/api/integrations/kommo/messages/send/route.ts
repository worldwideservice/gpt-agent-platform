import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { backendFetch } from '@/lib/backend/client'

// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const bodySchema = z.object({
  dealId: z.string().min(1),
 channel: z.enum(['email', 'chat']),
 message: z.object({
 subject: z.string().min(1).optional(),
 body: z.string().min(1),
 attachments: z
 .array(
 z.object({
 url: z.string().url(),
 name: z.string().min(1),
 }),
 )
 .optional(),
 }),
})

export const POST = async (request: NextRequest) => {
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const json = await request.json()
 const payload = bodySchema.parse(json)

 const response = await backendFetch('/kommo/messages/send', {
 method: 'POST',
 body: JSON.stringify({
 orgId: session.user.orgId,
 dealId: payload.dealId,
 channel: payload.channel,
 message: payload.message,
 }),
 })

 return NextResponse.json(response)
 } catch (error) {
 if (error instanceof z.ZodError) {
 return NextResponse.json(
 {
 success: false,
 error: 'Некорректные данные для отправки сообщения',
 details: error.issues.map((issue) => issue.message),
 },
 { status: 400 },
 )
 }

 console.error('Kommo send message error', error)
 return NextResponse.json({ success: false, error: 'Не удалось отправить сообщение через Kommo' }, { status: 500 })
 }
}
