import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { createAgentSequence, getAgentSequences } from '@/lib/repositories/agent-sequences'

const stepSchema = z.object({
  id: z.string().uuid().optional(),
  stepType: z.string().min(1, 'Тип шага обязателен'),
  payload: z.record(z.string(), z.unknown()).optional(),
  delaySeconds: z.number().int().min(0).max(86400).optional(),
  sortOrder: z.number().int().min(0).optional(),
})

const sequenceSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
  steps: z.array(stepSchema).optional(),
})

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const sequences = await getAgentSequences(session.user.orgId, id)

    return NextResponse.json({
      success: true,
      data: sequences,
    })
  } catch (error) {
    console.error('Agent sequences GET error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить цепочки',
      },
      { status: 500 },
    )
  }
}

export const POST = async (
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
    const parsed = sequenceSchema.safeParse(body)

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

    const sequence = await createAgentSequence(session.user.orgId, id, {
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      isActive: parsed.data.isActive,
      sortOrder: parsed.data.sortOrder,
      settings: parsed.data.settings ?? {},
      steps: parsed.data.steps?.map((step, index) => ({
        id: step.id,
        stepType: step.stepType,
        payload: (step.payload as Record<string, unknown> | undefined) ?? {},
        delaySeconds: step.delaySeconds ?? 0,
        sortOrder: step.sortOrder ?? index,
      })),
    })

    return NextResponse.json({
      success: true,
      data: sequence,
    })
  } catch (error) {
    console.error('Agent sequences POST error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось создать цепочку',
      },
      { status: 500 },
    )
  }
}



