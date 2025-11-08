import { NextResponse, type NextRequest } from 'next/server'

import { z } from 'zod'


import { auth } from '@/auth'

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'


export const GET = async () => {

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
// Force dynamic rendering (uses headers from auth())
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const supabase = getSupabaseServiceRoleClient()

 const { data: org, error } = await supabase
 .from('organizations')
 .select('settings')
 .eq('id', session.user.orgId)
 .single()

 if (error) {
 throw error
 }

 return NextResponse.json({
 success: true,
 data: {
 settings: org?.settings ?? {},
 },
 })
 } catch (error) {
 console.error('Organization settings API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось загрузить настройки организации',
 },
 { status: 500 },
 )
 }
}

const updateSettingsSchema = z.object({
 stopOnHumanReply: z.boolean().optional(),
})

export const PATCH = async (request: NextRequest) => {
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const body = await request.json()
 const parsed = updateSettingsSchema.safeParse(body)

 if (!parsed.success) {
 const issues = parsed.error.issues.map((issue) => issue.message)
 return NextResponse.json(
 {
 success: false,
 error: 'Некорректные данные',
 details: issues,
 },
 { status: 400 },
 )
 }

 const supabase = getSupabaseServiceRoleClient()

 const { data: currentOrg } = await supabase
 .from('organizations')
 .select('settings')
 .eq('id', session.user.orgId)
 .single()

 const currentSettings = (currentOrg?.settings as Record<string, unknown>) ?? {}

 const { data: org, error } = await supabase
 .from('organizations')
 .update({
 settings: {
 ...currentSettings,
 stopOnHumanReply: parsed.data.stopOnHumanReply,
 },
 } as never)
 .eq('id', session.user.orgId)
 .select('settings')
 .single()

 if (error) {
 throw error
 }

 return NextResponse.json({
 success: true,
 data: {
 settings: org?.settings ?? {},
 },
 })
 } catch (error) {
 console.error('Organization settings update API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось обновить настройки организации',
 },
 { status: 500 },
 )
 }
}





































