import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { createRule, getRules, executeRules } from '@/lib/services/rule-engine'
import type { AutomationRule, RuleExecutionContext } from '@/lib/services/rule-engine'

const conditionSchema = z.object({
  type: z.enum(['field_value', 'stage_changed', 'time_elapsed', 'event_triggered', 'custom_condition']).default('field_value'),
  field: z.string().min(1).optional(),
  operator: z.enum(['equals', 'contains', 'greater_than', 'less_than', 'changed_to', 'not_empty']).optional(),
  value: z.string().optional(),
})

const actionSchema = z.object({
  type: z.enum(['send_message', 'change_stage', 'create_task', 'update_field', 'send_email', 'webhook', 'ai_response']),
  template: z.string().optional(),
  targetField: z.string().optional(),
  newValue: z.string().optional(),
  recipient: z.string().optional(),
  webhookUrl: z.string().optional(),
  aiPrompt: z.string().optional(),
})

export const createRuleSchema = z.object({
  name: z.string().min(1, 'Название правила обязательно'),
  description: z.string().optional(),
  trigger_type: z.enum(['lead_created', 'lead_updated', 'message_received', 'stage_changed', 'time_based', 'manual']),
  conditions: z.array(conditionSchema).min(1, 'Добавьте хотя бы одно условие'),
  actions: z.array(actionSchema).min(1, 'Добавьте действие'),
  is_active: z.boolean().optional().default(true),
  priority: z.number().min(1).max(100).optional().default(10),
  cooldown_minutes: z.number().min(0).optional(),
  max_executions_per_day: z.number().min(1).optional(),
})

export const updateRuleSchema = createRuleSchema.partial()

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
 { params }: { params: { id: string } },
) => {
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const { searchParams } = new URL(request.url)
 const activeOnly = searchParams.get('active_only') !== 'false'

 const rules = await getRules(session.user.orgId, params.id, activeOnly)

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
 { params }: { params: { id: string } },
) => {
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
  agent_id: params.id,
  metadata: {},
  conditions: parsed.data.conditions.map((cond) => ({
    ...cond,
    type: cond.type || 'field_value',
  })),
 }

 const ruleId = await createRule(session.user.orgId, ruleData)

 if (!ruleId) {
 return NextResponse.json(
 { success: false, error: 'Не удалось создать правило' },
 { status: 500 },
 )
 }

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
 { params }: { params: { id: string } },
) => {
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
 agentId: params.id,
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
