import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getErrorMessage } from '@/lib/utils'
import { updateAccountSettingsSchema } from '@/lib/validation/schemas/account-settings'

export const dynamic = 'force-dynamic'

/**
 * GET /api/account/settings
 * Получение настроек аккаунта (согласно KWID)
 */
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // [MOCK] В реальном проекте - запрос к БД
    const mockSettings = {
      stopAiAgentsOnManualMessage: false, // Настройка из KWID
    }

    return NextResponse.json({ settings: mockSettings })
  } catch (e) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 })
  }
}

/**
 * PUT /api/account/settings
 * Обновление настроек аккаунта
 */
export async function PUT(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validation = updateAccountSettingsSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.format() },
        { status: 400 }
      )
    }

    // [MOCK] В реальном проекте - обновление в БД
    // eslint-disable-next-line no-console
    console.log(`[MOCK] Settings updated for user ${session.user.id}:`, validation.data)

    return NextResponse.json({
      settings: validation.data,
      message: 'Settings updated successfully',
    })
  } catch (e) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 })
  }
}
