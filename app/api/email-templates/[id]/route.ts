import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'


const updateTemplateSchema = z.object({
 name: z.string().min(1, 'Название обязательно').max(255).optional(),
 subject: z.string().min(1, 'Тема обязательна').optional(),
 html: z.string().min(1, 'HTML контент обязателен').optional(),
 text: z.string().optional(),
 variables: z.array(z.string()).optional(),
 is_active: z.boolean().optional(),
})

/**
 * GET /api/email-templates/[id] - Получение шаблона email по ID
 */
export const GET = async (
 request: NextRequest,
 { params }: { params: { id: string } },
) => {
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const supabase = getSupabaseServiceRoleClient()
 const { data: template, error } = await supabase
 .from('email_templates')
 .select('*')
 .eq('id', params.id)
 .eq('org_id', session.user.orgId)
 .single()

 if (error) {
 if (error.code === 'PGRST116') {
 return NextResponse.json(
 { success: false, error: 'Шаблон не найден' },
 { status: 404 },
 )
 }
 console.error('Failed to fetch email template:', error)
 return NextResponse.json(
 { success: false, error: 'Не удалось получить шаблон' },
 { status: 500 },
 )
 }

 return NextResponse.json({
 success: true,
 template,
 })
 } catch (error) {
 console.error('Get email template API error:', error)
 return NextResponse.json(
 { success: false, error: 'Внутренняя ошибка сервера' },
 { status: 500 },
 )
 }
}

/**
 * PUT /api/email-templates/[id] - Обновление шаблона email
 */
export const PUT = async (
 request: NextRequest,
 { params }: { params: { id: string } },
) => {
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const body = await request.json()
 const parsed = updateTemplateSchema.safeParse(body)

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

 const updateData = {
 ...parsed.data,
 updated_by: session.user.id,
 updated_at: new Date().toISOString(),
 }

 const supabase = getSupabaseServiceRoleClient()
 const { data: template, error } = await supabase
 .from('email_templates')
 .update(updateData)
 .eq('id', params.id)
 .eq('org_id', session.user.orgId)
 .select()
 .single()

 if (error) {
 if (error.code === 'PGRST116') {
 return NextResponse.json(
 { success: false, error: 'Шаблон не найден' },
 { status: 404 },
 )
 }
 console.error('Failed to update email template:', error)
 return NextResponse.json(
 { success: false, error: 'Не удалось обновить шаблон' },
 { status: 500 },
 )
 }

 return NextResponse.json({
 success: true,
 template,
 })
 } catch (error) {
 console.error('Update email template API error:', error)
 return NextResponse.json(
 { success: false, error: 'Внутренняя ошибка сервера' },
 { status: 500 },
 )
 }
}

/**
 * DELETE /api/email-templates/[id] - Удаление шаблона email
 */
export const DELETE = async (
 request: NextRequest,
 { params }: { params: { id: string } },
) => {
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const supabase = getSupabaseServiceRoleClient()
 const { error } = await supabase
 .from('email_templates')
 .delete()
 .eq('id', params.id)
 .eq('org_id', session.user.orgId)

 if (error) {
 console.error('Failed to delete email template:', error)
 return NextResponse.json(
 { success: false, error: 'Не удалось удалить шаблон' },
 { status: 500 },
 )
 }

 return NextResponse.json({
 success: true,
 message: 'Шаблон удален успешно',
 })
 } catch (error) {
 console.error('Delete email template API error:', error)
 return NextResponse.json(
 { success: false, error: 'Внутренняя ошибка сервера' },
 { status: 500 },
 )
 }
}
