import { NextResponse, type NextRequest } from 'next/server'

import { z } from 'zod'

import { auth } from '@/auth'
import { createRule, getRules, executeRules } from '@/lib/services/rule-engine'
import type { AutomationRule, RuleExecutionContext } from '@/lib/services/rule-engine'


// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
const createRuleSchema = z.object({
 name: z.string().min(1, 'Название правила обязательно'),
 description: z.string().optional(),
 trigger_type: z.enum(['lead_created', 'lead_updated', 'message_received', 'stage_changed', 'time_based', 'manual']),
 conditions: z.array(z.object({
 type: z.enum(['field_value', 'stage_changed', 'time_elapsed', 'event_triggered', 'custom_condition']),
 field: z.string().optional(),
 operator: z.enum(['equals', 'contains', 'greater_than', 'less_than', 'changed_to', 'not_empty']).optional(),
 value: z.any().optional(),
 timeUnit: z.enum(['minutes', 'hours', 'days', 'weeks']).optional(),
 timeValue: z.number().optional(),
 customLogic: z.string().optional(),
 })),
 actions: z.array(z.object({
 type: z.enum(['send_message', 'change_stage', 'create_task', 'update_field', 'send_email', 'webhook', 'ai_response']),
 template: z.string().optional(),
 targetField: z.string().optional(),
 newValue: z.any().optional(),
 recipient: z.string().optional(),
 webhookUrl: z.string().optional(),
 aiPrompt: z.string().optional(),
 })),
 is_active: z.boolean().optional().default(true),
 priority: z.number().min(1).max(100).optional().default(10),
 cooldown_minutes: z.number().min(0).optional(),
 max_executions_per_day: z.number().min(1).optional(),
})

const executeRulesSchema = z.object({
 triggerType: z.string(),
 leadId: z.string().optional(),
 contactId: z.string().optional(),
 triggerData: z.record(z.string(), z.any()),
 previousState: z.record(z.string(), z.any()).optional(),
 currentState: z.record(z.string(), z.any()).optional(),
})

/**
 * GET /api/agents/[id]/rules - Получение правил агента
 */
export const GET = async (
 request: NextRequest,
 { params }: { params: Promise<{ id: string }> },
) => {
 const { id } = await params
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const { searchParams } = new URL(request.url)
 const activeOnly = searchParams.get('active_only') !== 'false'

 const rules = await getRules(session.user.orgId, id, activeOnly)

 return NextResponse.json({
 success: true,
 data: rules,
 })
 } catch (error) {
 console.error('Get rules API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось загрузить правила',
 },
 { status: 500 },
 )
 }
}

/**
 * POST /api/agents/[id]/rules - Создание нового правила
 */
export const POST = async (
 request: NextRequest,
 { params }: { params: Promise<{ id: string }> },
) => {
 const { id } = await params
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const body = await request.json()
 const parsed = createRuleSchema.safeParse(body)

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

 const ruleData = {
 ...parsed.data,
 agent_id: id,
 metadata: {},
 }

 const ruleId = await createRule(session.user.orgId, ruleData)

 if (!ruleId) {
 return NextResponse.json(
 { success: false, error: 'Не удалось создать правило' },
 { status: 500 },
 )
 }

 // Логируем создание правила
 const { logActivity } = await import('@/lib/services/activity-logger')
 await logActivity({
   orgId: session.user.orgId,
   userId: session.user.id,
   agentId: id,
   activityType: 'rule_created' as any,
   title: `Создано правило: ${parsed.data.name}`,
   description: `Пользователь создал новое правило автоматизации "${parsed.data.name}"`,
   metadata: { rule_id: ruleId, rule_name: parsed.data.name },
 }).catch((error) => {
   console.error('Failed to log rule creation:', error)
 })

 return NextResponse.json({
 success: true,
 data: { id: ruleId },
 })
 } catch (error) {
 console.error('Create rule API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось создать правило',
 },
 { status: 500 },
 )
 }
}

/**
 * PUT /api/agents/[id]/rules - Выполнение правил (dry-run или реальное выполнение)
 */
export const PUT = async (
 request: NextRequest,
 { params }: { params: Promise<{ id: string }> },
) => {
 const { id } = await params
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const body = await request.json()
 const parsed = executeRulesSchema.safeParse(body)

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

 const { searchParams } = new URL(request.url)
 const isPreview = searchParams.get('preview') === 'true'

 const context: RuleExecutionContext = {
 organizationId: session.user.orgId,
 agentId: id,
 ...parsed.data,
 }

 if (isPreview) {
 // Импортируем функцию предварительного просмотра
 const { previewRules } = await import('@/lib/services/rule-engine')
 const previewResults = await previewRules(context)

 return NextResponse.json({
 success: true,
 data: {
 preview: true,
 rules: previewResults,
 },
 })
 } else {
 // Реальное выполнение правил
 const executionResults = await executeRules(context)

 return NextResponse.json({
 success: true,
 data: {
 preview: false,
 executions: executionResults,
 },
 })
 }
 } catch (error) {
 console.error('Execute rules API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось выполнить правила',
 },
 { status: 500 },
 )
 }
}


