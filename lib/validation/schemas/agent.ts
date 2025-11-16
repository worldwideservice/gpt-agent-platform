import { z } from 'zod'

/**
 * Схема для создания нового AI Агента.
 * Основано на 'AI_AGENTS_PAGE_DETAILED_REPORT.md'.
 */
export const createAgentSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Agent name is required.' })
    .max(255),
  instructions: z
    .string()
    .min(1, { message: 'Instructions are required.' })
    .max(10000)
    .optional(),
  model: z.string().optional(),
  // is_active по умолчанию false при создании
})

export type CreateAgentInput = z.infer<typeof createAgentSchema>
