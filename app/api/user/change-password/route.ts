// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getErrorMessage } from '@/lib/utils'
import { changePasswordSchema } from '@/lib/validation/schemas/account-settings'


/**
 * POST /api/user/change-password
 * Смена пароля пользователя
 */
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validation = changePasswordSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.format() },
        { status: 400 }
      )
    }

    const { currentPassword, newPassword } = validation.data

    // [MOCK] В реальном проекте:
    // 1. Проверить текущий пароль с хешем в БД
    // 2. Захешировать новый пароль
    // 3. Обновить в БД
    // 4. Опционально: инвалидировать все сессии кроме текущей

    // const user = await supabase.auth.getUser()
    // const { error } = await supabase.auth.updateUser({
    //   password: newPassword
    // })
    // if (error) throw error

    // eslint-disable-next-line no-console
    console.log(`[MOCK] Password changed for user ${session.user.id}`)

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (e) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 })
  }
}
