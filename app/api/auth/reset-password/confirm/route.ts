import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { z } from 'zod'

import { findValidPasswordResetByToken, markPasswordResetAsUsed } from '@/lib/repositories/passwordResets'
import { updateUserPasswordHash } from '@/lib/repositories/users'

const confirmSchema = z.object({
  token: z
    .string()
    .min(1, 'Токен обязателен')
    .min(20, 'Токен слишком короткий'),
  password: z
    .string()
    .min(1, 'Пароль обязателен')
    .min(8, 'Минимум 8 символов'),
})

const PASSWORD_SALT_ROUNDS = 12

export const POST = async (request: Request) => {
  try {
    const body = await request.json()
    const parsed = confirmSchema.parse(body)

    const resetEntry = await findValidPasswordResetByToken(parsed.token)

    if (!resetEntry) {
      return NextResponse.json({ success: false, error: 'Неверный или истёкший токен' }, { status: 400 })
    }

    const passwordHash = await hash(parsed.password, PASSWORD_SALT_ROUNDS)

    await updateUserPasswordHash(resetEntry.user_id, passwordHash)
    await markPasswordResetAsUsed(resetEntry.id, resetEntry.user_id)

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Некорректные данные' }, { status: 400 })
    }

    console.error('Password reset confirm error', error)
    return NextResponse.json({ success: false, error: 'Не удалось обновить пароль' }, { status: 500 })
  }
}
