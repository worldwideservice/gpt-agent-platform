// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { __testable } from '@/lib/services/rule-engine'

type RuleActionPayload = {
  action: 'send_message' | 'change_stage' | 'create_task' | 'update_field'
  value?: string
  field?: string
}

export const POST = async (request: NextRequest) => {
  if (process.env.E2E_ONBOARDING_FAKE !== '1') {
    return NextResponse.json({ success: false, error: 'Available only in E2E mode' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const payload = body as RuleActionPayload

    const context = {
      organizationId: 'org-test',
      agentId: 'agent-test',
      leadId: '42',
      triggerType: 'manual',
      triggerData: {},
    }

    let result = false
    switch (payload.action) {
      case 'send_message':
        result = await __testable.executeSendMessage(
          { type: 'send_message', template: payload.value ?? 'Test message' },
          context,
        )
        break
      case 'change_stage':
        result = await __testable.executeChangeStage(
          { type: 'change_stage', newValue: payload.value ?? '100' },
          context,
        )
        break
      case 'create_task':
        result = await __testable.executeCreateTask(
          { type: 'create_task', template: payload.value ?? 'Task body' },
          context,
        )
        break
      case 'update_field':
        result = await __testable.executeUpdateField(
          { type: 'update_field', targetField: payload.field ?? 'status_id', newValue: payload.value ?? '0' },
          context,
        )
        break
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Rule engine flow test failed', error)
    return NextResponse.json({ success: false, error: 'Rule engine test failed' }, { status: 500 })
  }
}
