import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getOnboardingState, upsertOnboardingAgent } from '@/lib/onboarding/server'

const agentSchema = z.object({
  name: z.string().min(2, 'Имя агента слишком короткое'),
  model: z.string().min(1, 'Укажите модель агента'),
  goal: z.string().min(10, 'Опишите задачи агента подробнее'),
  channels: z.array(z.string()).min(1, 'Выберите хотя бы один канал'),
  schedule: z.string().min(1, 'Укажите расписание работы'),
})

export const POST = async (request: NextRequest) => {
  try {
    const session = await auth()

    if (!session?.user?.orgId) {
      return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
    }

    const payload = await request.json()
    const parsed = agentSchema.safeParse(payload)

    if (!parsed.success) {
      const message = parsed.error.issues.map((issue) => issue.message).join('\n')
      return NextResponse.json({ success: false, error: message }, { status: 400 })
    }

    await upsertOnboardingAgent({
      orgId: session.user.orgId,
      name: parsed.data.name,
      model: parsed.data.model,
      goal: parsed.data.goal,
      channels: parsed.data.channels,
      schedule: parsed.data.schedule,
    })

    const state = await getOnboardingState(session.user.orgId)

    return NextResponse.json({ success: true, state })
  } catch (error) {
    console.error('Onboarding agent error:', error)
    return NextResponse.json(
      { success: false, error: 'Не удалось создать агента' },
      { status: 500 },
    )
  }
}
