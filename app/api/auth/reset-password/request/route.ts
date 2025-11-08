import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { createPasswordReset } from '@/lib/repositories/passwordResets'
import { UserRepository } from '@/lib/repositories/users'
import { logger } from '@/lib/utils/logger'

const requestSchema = z.object({
 email: z
 .string()
 .min(1, 'Email обязателен')
 .email('Некорректный email'),
})

const buildResetUrl = (request: NextRequest, token: string): string => {
 const origin = request.nextUrl.origin
 return `${origin}/reset-password/${token}`
}

export const POST = async (request: NextRequest) => {
 try {
 const body = await request.json()
 const parsed = requestSchema.parse(body)

 const normalizedEmail = parsed.email.toLowerCase()
 const user = await UserRepository.findUserByEmail(normalizedEmail)

 if (!user) {
 return NextResponse.json({ success: true })
 }

 const { token, expiresAt } = await createPasswordReset(user.id)

 const resetUrl = buildResetUrl(request, token)

 // Отправляем email через SendGrid
 try {
 const { sendPasswordResetEmail } = await import('@/lib/services/email')
 await sendPasswordResetEmail(normalizedEmail, token, resetUrl)
 logger.info(`Password reset email sent to ${normalizedEmail}`)
 } catch (error: unknown) {
 logger.error('Failed to send password reset email:', error, {
   endpoint: '/api/auth/reset-password/request',
   method: 'POST',
   email: normalizedEmail,
 })
 // Продолжаем выполнение даже если email не отправился
 }

 return NextResponse.json({ success: true })
 } catch (error: unknown) {
 if (error instanceof z.ZodError) {
 return NextResponse.json({ success: false, error: 'Некорректные данные' }, { status: 400 })
 }

 logger.error('Password reset request error', error, {
   endpoint: '/api/auth/reset-password/request',
   method: 'POST',
 })
 return NextResponse.json({ success: false, error: 'Не удалось создать запрос на сброс пароля' }, { status: 500 })
 }
}
