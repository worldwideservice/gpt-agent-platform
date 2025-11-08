import { NextResponse } from 'next/server'


import { auth } from '@/auth'
import { getConversations } from '@/lib/repositories/conversations'



// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const GET = async (request: Request) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agentId')
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    const result = await getConversations(session.user.orgId, {
      agentId: agentId || undefined,
      userId: session.user.id,
      limit,
      offset,
    })

    return NextResponse.json({
      success: true,
      data: {
        conversations: result.conversations,
        total: result.total,
      },
    })
  } catch (error) {
    console.error('Failed to fetch conversations:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить список диалогов',
      },
      { status: 500 },
    )
  }
}


