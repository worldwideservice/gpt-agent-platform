import { z } from 'zod'

/**
 * Схема для регистрации нового пользователя.
 * - `email` должен быть валидным email.
 * - `password` должен быть мин. 8 символов.
 * - `organizationName` опционален.
 */
export const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' }),
  organizationName: z.string().optional(),
})

/**
 * Схема для входа пользователя.
 */
export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
