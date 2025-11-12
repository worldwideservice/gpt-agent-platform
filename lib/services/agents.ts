import { z } from 'zod'

import {
  getAgents,
  createAgent as createAgentRepository,
  updateAgent as updateAgentRepository,
  deleteAgent as deleteAgentRepository,
  getAgentById,
  type AgentListParams,
} from '@/lib/repositories/agents'

import type { Agent } from '@/types'

const listAgentsSchema = z
  .object({
    search: z.string().max(200).optional(),
    status: z.enum(['active', 'inactive', 'draft']).optional(),
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(100).optional(),
  })
  .optional()

const agentSettingsSchema = z
  .object({
    language: z.string().optional(),
    welcomeMessage: z.string().optional(),
    description: z.string().optional(),
    presencePenalty: z.number().min(-2).max(2).optional(),
    frequencyPenalty: z.number().min(-2).max(2).optional(),
    defaultChannels: z.array(z.string()).optional(),
    knowledgeBaseAllCategories: z.boolean().optional(),
    createTaskOnNotFound: z.boolean().optional(),
    notFoundMessage: z.string().optional(),
  })
  .optional()

const createAgentSchema = z.object({
  name: z.string().min(1, 'Название обязательно').max(100),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
  model: z.string().max(200).optional(),
  instructions: z.string().max(5000).optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().min(128).max(8000).optional(),
  responseDelaySeconds: z.number().int().min(0).max(86400).optional(),
  settings: agentSettingsSchema,
})

const updateAgentSchema = createAgentSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'Необходимо передать данные для обновления',
)

const assertOrganizationId = (organizationId: string) => {
  if (!organizationId || typeof organizationId !== 'string') {
    throw new Error('Требуется идентификатор организации')
  }
}

export const listAgents = async (
  organizationId: string,
  params?: AgentListParams,
): Promise<Awaited<ReturnType<typeof getAgents>>> => {
  assertOrganizationId(organizationId)

  const parsed = listAgentsSchema.parse(params)

  try {
    return await getAgents({
      organizationId,
      search: parsed?.search,
      status: parsed?.status,
      page: parsed?.page,
      limit: parsed?.limit,
    })
  } catch (error) {
    console.error('AgentsService.listAgents failed', { error, organizationId })
    throw new Error('Не удалось получить список агентов')
  }
}

export const createAgent = async (
  organizationId: string,
  input: unknown,
): Promise<Agent> => {
  assertOrganizationId(organizationId)

  const data = createAgentSchema.parse(input)

  try {
    return await createAgentRepository(organizationId, {
      name: data.name,
      status: data.status,
      model: data.model,
      instructions: data.instructions,
      temperature: data.temperature,
      maxTokens: data.maxTokens,
      responseDelaySeconds: data.responseDelaySeconds,
      settings: data.settings ?? {},
    })
  } catch (error) {
    console.error('AgentsService.createAgent failed', { error, organizationId })
    throw new Error('Не удалось создать агента')
  }
}

export const updateAgent = async (
  organizationId: string,
  agentId: string,
  input: unknown,
): Promise<Agent> => {
  assertOrganizationId(organizationId)

  if (!agentId) {
    throw new Error('Требуется идентификатор агента')
  }

  const data = updateAgentSchema.parse(input)

  try {
    return await updateAgentRepository(agentId, organizationId, {
      name: data.name,
      status: data.status,
      model: data.model,
      instructions: data.instructions,
      temperature: data.temperature,
      maxTokens: data.maxTokens,
      responseDelaySeconds: data.responseDelaySeconds,
      settings: data.settings ?? undefined,
    })
  } catch (error) {
    console.error('AgentsService.updateAgent failed', { error, organizationId, agentId })
    throw new Error('Не удалось обновить агента')
  }
}

export const deleteAgent = async (
  organizationId: string,
  agentId: string,
): Promise<void> => {
  assertOrganizationId(organizationId)

  if (!agentId) {
    throw new Error('Требуется идентификатор агента')
  }

  try {
    await deleteAgentRepository(agentId, organizationId)
  } catch (error) {
    console.error('AgentsService.deleteAgent failed', { error, organizationId, agentId })
    throw new Error('Не удалось удалить агента')
  }
}

export const getAgent = async (
  organizationId: string,
  agentId: string,
): Promise<Agent | null> => {
  assertOrganizationId(organizationId)

  if (!agentId) {
    throw new Error('Требуется идентификатор агента')
  }

  try {
    return await getAgentById(agentId, organizationId)
  } catch (error) {
    console.error('AgentsService.getAgent failed', { error, organizationId, agentId })
    throw new Error('Не удалось получить данные агента')
  }
}

export const getAgentOrThrow = async (
  organizationId: string,
  agentId: string,
): Promise<Agent> => {
  const agent = await getAgent(organizationId, agentId)

  if (!agent) {
    throw new Error('Агент не найден')
  }

  return agent
}

export const AgentsService = {
  listAgents,
  createAgent,
  updateAgent,
  deleteAgent,
  getAgent,
  getAgentOrThrow,
}

export type AgentsService = typeof AgentsService
