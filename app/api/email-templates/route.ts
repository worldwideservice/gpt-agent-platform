import { NextResponse, type NextRequest } from 'next/server'

import { z } from 'zod'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'



// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
const createTemplateSchema = z.object({
 name: z.string().min(1, 'Название обязательно').max(255),
 subject: z.string().min(1, 'Тема обязательна'),
 html: z.string().min(1, 'HTML контент обязателен'),
 text: z.string().optional(),
 variables: z.array(z.string()).optional().default([]),
 is_active: z.boolean().optional().default(true),
})

const updateTemplateSchema = createTemplateSchema.partial()

/**
 * GET /api/email-templates - Получение шаблонов email организации
 */
export const GET = async (request: NextRequest) => {
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const { searchParams } = new URL(request.url)
 const activeOnly = searchParams.get('active_only') === 'true'

 const supabase = getSupabaseServiceRoleClient()

 let query = supabase
 .from('email_templates')
 .select('*')
 .eq('org_id', session.user.orgId)
 .order('created_at', { ascending: false })

 if (activeOnly) {
 query = query.eq('is_active', true)
 }

 const { data: templates, error } = await query

 if (error) {
 logger.error('Failed to fetch email templates:', error, {
   endpoint: '/api/email-templates',
   method: 'GET',
 })
 return NextResponse.json(
 { success: false, error: 'Не удалось получить шаблоны' },
 { status: 500 },
 )
 }

 return NextResponse.json({
 success: true,
 templates: templates || [],
 })
 } catch (error: unknown) {
 logger.error('Email templates API error:', error, {
   endpoint: '/api/email-templates',
   method: 'GET',
 })
 return NextResponse.json(
 { success: false, error: 'Внутренняя ошибка сервера' },
 { status: 500 },
 )
 }
}

/**
 * POST /api/email-templates - Создание шаблона email
 */
export const POST = async (request: NextRequest) => {
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const body = await request.json()
 const parsed = createTemplateSchema.safeParse(body)

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

 const templateData = {
 ...parsed.data,
 org_id: session.user.orgId,
 created_by: session.user.id,
 updated_by: session.user.id,
 }

 const supabase = getSupabaseServiceRoleClient()
 const { data: template, error } = await supabase
 .from('email_templates')
 .insert(templateData)
 .select()
 .single()

 if (error) {
 logger.error('Failed to create email template:', error, {
   endpoint: '/api/email-templates',
   method: 'POST',
 })
 return NextResponse.json(
 { success: false, error: 'Не удалось создать шаблон' },
 { status: 500 },
 )
 }

 return NextResponse.json({
 success: true,
 template,
 }, { status: 201 })
 } catch (error: unknown) {
 logger.error('Create email template API error:', error, {
   endpoint: '/api/email-templates',
   method: 'POST',
 })
 return NextResponse.json(
 { success: false, error: 'Внутренняя ошибка сервера' },
 { status: 500 },
 )
 }
}
