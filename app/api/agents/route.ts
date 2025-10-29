import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getAgents } from '@/lib/repositories/agents'

const querySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
  page: z
    .string()
    .regex(/^\d+$/)
    .transform((value) => Number.parseInt(value, 10))
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform((value) => Number.parseInt(value, 10))
    .optional(),
})

import { createAgent } from '@/lib/repositories/agents'

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const parsedParams = querySchema.safeParse(Object.fromEntries(searchParams))

  if (!parsedParams.success) {
    const issues = parsedParams.error.issues.map((issue) => issue.message)
    return NextResponse.json(
      {
        success: false,
        error: 'Некорректные параметры запроса',
        details: issues,
      },
      { status: 400 },
    )
  }

  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const { agents, total } = await getAgents({
      organizationId: session.user.orgId,
      search: parsedParams.data.search,
      status: parsedParams.data.status,
      page: parsedParams.data.page,
      limit: parsedParams.data.limit,
    })

    return NextResponse.json({
      success: true,
      data: agents,
      pagination: {
        total,
        page: parsedParams.data.page ?? 1,
        limit: parsedParams.data.limit ?? 25,
      },
    })
  } catch (error) {
    console.error('Agents API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить агентов',
      },
      { status: 500 },
    )
  }
}

const settingsSchema = z
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
  name: z.string().min(1, 'Название обязательно'),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
  model: z.string().optional(),
  instructions: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().min(128).max(8000).optional(),
  responseDelaySeconds: z.number().int().min(0).max(86400).optional(),
  settings: settingsSchema,
})

export const POST = async (request: NextRequest) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = createAgentSchema.safeParse(body)

    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) => issue.message)
      return NextResponse.json(
        {
          success: false,
          error: 'Некорректные данные',
          details: issues,
        },
        { status: 400 },
      )
    }

    const agent = await createAgent(session.user.orgId, {
      name: parsed.data.name,
      status: parsed.data.status,
      model: parsed.data.model,
      instructions: parsed.data.instructions,
      temperature: parsed.data.temperature,
      maxTokens: parsed.data.maxTokens,
      responseDelaySeconds: parsed.data.responseDelaySeconds,
      settings: parsed.data.settings ?? {},
    })

    return NextResponse.json({
      success: true,
      data: agent,
    })
  } catch (error) {
    console.error('Agent create API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось создать агента',
      },
      { status: 500 },
    )
  }
}

