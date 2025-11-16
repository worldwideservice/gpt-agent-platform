import { z } from 'zod'

/**
 * Схема для POST /api/manage/[tenantId]/subscription/change-plan
 * Смена тарифного плана пользователем
 */
export const changePlanSchema = z.object({
  newPlanId: z.string().min(1, { message: 'Plan ID is required.' }),
  interval: z.enum(['month', 'year'], {
    message: 'Interval must be "month" or "year".',
  }),
})

export type ChangePlanInput = z.infer<typeof changePlanSchema>

/**
 * Схема для POST /api/manage/[tenantId]/subscription/cancel
 * Отмена подписки (требует подтверждения)
 */
export const cancelSubscriptionSchema = z.object({
  confirm: z.literal(true, {
    errorMap: () => ({ message: 'Confirmation is required to cancel.' }),
  }),
})

export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>
