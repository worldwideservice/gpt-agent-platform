import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { deleteAgentSequence, getAgentSequenceById, updateAgentSequence } from '@/lib/repositories/agent-sequences'

const stepSchema = z.object({
  id: z.string().uuid().optional(),
  stepType: z.string().min(1),
  payload: z.record(z.unknown()).optional(),
  delaySeconds: z.number().int().min(0).max(86400).optional(),
  sortOrder: z.number().int().min(0).optional(),
})

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  settings: z.record(z.unknown()).optional(),
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

    const updated = await updateAgentSequence(session.user.orgId, id, sequenceId, {
      name: parsed.data.name ?? undefined,
      description: parsed.data.description ?? null,
      isActive: parsed.data.isActive,
      sortOrder: parsed.data.sortOrder,
      settings: parsed.data.settings ?? {},
      steps: parsed.data.steps?.map((step, index) => ({
        id: step.id ?? undefined,
        stepType: step.stepType,
        payload: (step.payload as Record<string, unknown> | undefined) ?? {},
        delaySeconds: step.delaySeconds ?? 0,
        sortOrder: step.sortOrder ?? index,
      })),
    })

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

