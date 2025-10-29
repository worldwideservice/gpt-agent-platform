import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { deleteAgentSequence, getAgentSequenceById, updateAgentSequence } from '@/lib/repositories/agent-sequences'

const stepSchema = z.object({
  id: z.string().uuid().optional(),
  stepType: z.string().min(1),
  payload: z.record(z.string(), z.unknown()).optional(),
  delaySeconds: z.number().int().min(0).max(86400).optional(),
  sortOrder: z.number().int().min(0).optional(),
})

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
  steps: z.array(stepSchema).optional(),
})

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sequenceId: string }> },
) => {
  const { id, sequenceId } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const sequence = await getAgentSequenceById(session.user.orgId, id, sequenceId)

    if (!sequence) {
      return NextResponse.json({ success: false, error: 'Цепочка не найдена' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: sequence })
  } catch (error) {
    console.error('Agent sequence GET error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить цепочку',
      },
      { status: 500 },
    )
  }
}

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sequenceId: string }> },
) => {
  const { id, sequenceId } = await params
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

    const updateData: {
      name?: string
      description?: string | null
      isActive?: boolean
      sortOrder?: number
      settings?: Record<string, unknown>
      steps?: Array<{
        id?: string
        stepType: string
        payload: Record<string, unknown>
        delaySeconds: number
        sortOrder: number
      }>
    } = {}
    
    if (parsed.data.name !== undefined) {
      updateData.name = parsed.data.name
    }
    if (parsed.data.description !== undefined) {
      updateData.description = parsed.data.description ?? null
    }
    if (parsed.data.isActive !== undefined) {
      updateData.isActive = parsed.data.isActive
    }
    if (parsed.data.sortOrder !== undefined) {
      updateData.sortOrder = parsed.data.sortOrder
    }
    if (parsed.data.settings !== undefined) {
      updateData.settings = parsed.data.settings ?? {}
    }
    if (parsed.data.steps !== undefined) {
      updateData.steps = parsed.data.steps.map((step, index) => ({
        id: step.id ?? undefined,
        stepType: step.stepType,
        payload: (step.payload as Record<string, unknown> | undefined) ?? {},
        delaySeconds: step.delaySeconds ?? 0,
        sortOrder: step.sortOrder ?? index,
      }))
    }

    const updated = await updateAgentSequence(session.user.orgId, id, sequenceId, updateData)

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Agent sequence PATCH error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось обновить цепочку',
      },
      { status: 500 },
    )
  }
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sequenceId: string }> },
) => {
  const { id, sequenceId } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    await deleteAgentSequence(session.user.orgId, id, sequenceId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Agent sequence DELETE error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось удалить цепочку',
      },
      { status: 500 },
    )
  }
}

