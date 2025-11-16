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

/**
 * Схема для валидации query-параметров GET /api/manage/[tenantId]/agents
 * Задача 4.1: Advanced Filters
 */
export const getAgentsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
  search: z.string().optional(),
  status: z.enum(['all', 'active', 'inactive']).default('all').optional(),
  model: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
})

export type GetAgentsInput = z.infer<typeof getAgentsSchema>
