// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getAgentById, updateAgent } from '@/lib/repositories/agents'

const kommoSettingsSchema = z.object({
  isActive: z.boolean(),
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
    const parsed = kommoSettingsSchema.safeParse(body)

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

    // Update agent with Kommo integration settings
    await updateAgent(id, session.user.orgId, {
      settings: {
        ...agent.settings,
        kommoIntegration: {
          isActive: parsed.data.isActive,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Настройки интеграции Kommo обновлены',
    })
  } catch (error) {
    console.error('Update Kommo integration error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось обновить настройки интеграции',
      },
      { status: 500 },
    )
  }
}
