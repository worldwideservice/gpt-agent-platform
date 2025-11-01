import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getAgentById, updateAgent, deleteAgent } from '@/lib/repositories/agents'

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
    checkBeforeSending: z.boolean().optional(),
  })
  .optional()

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
  model: z.string().optional(),
  instructions: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().min(128).max(8000).optional(),
  responseDelaySeconds: z.number().int().min(0).max(86400).optional(),
  settings: settingsSchema,
})

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params
  
  // Демо-режим: возвращаем mock-данные
  // Временно всегда используем демо-режим для продакшена
  const isDemoMode = true; // Временно всегда true

  if (isDemoMode) {
    // Возвращаем mock-агента
    const mockAgent = {
      id,
      name: 'Демо-агент',
      status: 'active' as const,
      model: 'gpt-4o-mini',
      messagesTotal: 0,
      lastActivityAt: null,
      ownerName: 'Demo User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      temperature: 0.7,
      maxTokens: 4000,
      responseDelaySeconds: 2,
      instructions: 'Вы - AI ассистент...',
      settings: {},
    }

    return NextResponse.json({
      success: true,
      data: mockAgent,
    })
  }

  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const agent = await getAgentById(id, session.user.orgId)

    if (!agent) {
      return NextResponse.json({ success: false, error: 'Агент не найден' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: agent,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить агента',
      },
      { status: 500 },
    )
  }
}

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)

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

    const agent = await updateAgent(id, session.user.orgId, {
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
    console.error('Agent update API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось обновить агента',
      },
      { status: 500 },
    )
  }
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params
  
  // Демо-режим: просто возвращаем успех
  // Временно всегда используем демо-режим для продакшена
  const isDemoMode = true; // Временно всегда true

  if (isDemoMode) {
    // В демо-режиме просто возвращаем успех
    return NextResponse.json({
      success: true,
    })
  }

  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    await deleteAgent(id, session.user.orgId)

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось удалить агента',
      },
      { status: 500 },
    )
  }
}

