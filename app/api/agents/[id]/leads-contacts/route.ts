import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getAgentById, updateAgent } from '@/lib/repositories/agents'

const fieldUpdateRuleSchema = z.object({
  id: z.string(),
  fieldValue: z.string(),
  overwriteExisting: z.boolean(),
  updateCondition: z.string(),
})

const leadsContactsSchema = z.object({
  selectedLeadFields: z.array(z.string()).optional(),
  selectedContactFields: z.array(z.string()).optional(),
  leadUpdateRules: z.array(fieldUpdateRuleSchema).optional(),
  contactUpdateRules: z.array(fieldUpdateRuleSchema).optional(),
})

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    // Verify agent exists
    const agent = await getAgentById(id, session.user.orgId)
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Агент не найден' }, { status: 404 })
    }

    const body = await request.json()
    const parsed = leadsContactsSchema.safeParse(body)

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

    // Update agent with leads/contacts settings
    await updateAgent(id, session.user.orgId, {
      settings: {
        ...agent.settings,
        leadsContactsSettings: {
          selectedLeadFields: parsed.data.selectedLeadFields ?? [],
          selectedContactFields: parsed.data.selectedContactFields ?? [],
          leadUpdateRules: parsed.data.leadUpdateRules ?? [],
          contactUpdateRules: parsed.data.contactUpdateRules ?? [],
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Настройки сделок и контактов обновлены',
    })
  } catch (error) {
    console.error('Update leads/contacts settings error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось обновить настройки',
      },
      { status: 500 },
    )
  }
}
