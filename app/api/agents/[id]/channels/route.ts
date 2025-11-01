import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/auth'
import { getAgentChannels } from '@/lib/repositories/agent-sequences'

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
    const channels = await getAgentChannels(session.user.orgId, id)

    return NextResponse.json({
      success: true,
      data: channels,
    })
  } catch (error) {
    console.error('Agent channels GET error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить каналы',
      },
      { status: 500 },
    )
  }
}














