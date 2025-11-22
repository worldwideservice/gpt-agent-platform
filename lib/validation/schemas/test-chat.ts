import { z } from 'zod'

/**
 * Схема для создания новой тестовой беседы
 * POST /api/manage/[tenantId]/test-chat/conversations
 */
export const createTestConversationSchema = z.object({
  title: z.string().max(255).optional(),
  agentId: z.string().uuid().optional().nullable(),
})

/**
 * Схема для отправки нового сообщения в тестовом чате
 * POST /api/manage/[tenantId]/test-chat/conversations/[id]/messages
 */
export const createTestMessageSchema = z.object({
  content: z
    .string()
    .min(1, { message: 'Message content is required.' })
    .max(20000, { message: 'Message content must be at most 20000 characters.' }),
  agentId: z.string().uuid({ message: 'Valid Agent ID is required.' }),
})

/**
 * Схема для получения сообщений (query параметры)
 * GET /api/manage/[tenantId]/test-chat/conversations/[id]
 */
export const getMessagesSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 50))
    .pipe(z.number().min(1).max(200)),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0))
    .pipe(z.number().min(0)),
})

// Export типов для TypeScript
export type CreateTestConversationInput = z.infer<typeof createTestConversationSchema>
export type CreateTestMessageInput = z.infer<typeof createTestMessageSchema>
export type GetMessagesInput = z.infer<typeof getMessagesSchema>
