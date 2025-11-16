import { z } from 'zod'

/**
 * Схема для обновления профиля пользователя
 * PUT /api/user/profile
 */
export const updateProfileSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required.' }).max(50),
  lastName: z.string().min(1, { message: 'Last name is required.' }).max(50),
  email: z.string().email({ message: 'Invalid email address.' }),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

/**
 * Схема для смены пароля
 * POST /api/user/change-password
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required.' }),
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .max(100),
  confirmPassword: z.string().min(1, { message: 'Confirm password is required.' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

/**
 * Схема для создания API ключа
 * POST /api/api-keys
 */
export const createApiKeySchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }).max(100),
  description: z.string().max(500).optional(),
  expiresAt: z.string().datetime().optional(), // ISO 8601 date string
})

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>

/**
 * Схема для обновления общих настроек
 * PUT /api/account/settings
 */
export const updateAccountSettingsSchema = z.object({
  stopAiAgentsOnManualMessage: z.boolean().optional(),
  // Другие настройки можно добавить здесь
})

export type UpdateAccountSettingsInput = z.infer<typeof updateAccountSettingsSchema>
