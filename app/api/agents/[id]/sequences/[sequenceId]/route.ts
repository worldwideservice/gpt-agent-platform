import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/auth'
import { deleteSequence } from '@/lib/services/sequences'

/**
 * DELETE /api/agents/[id]/sequences/[sequenceId] - Удаление последовательности
 */
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string; sequenceId: string } },
) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const success = await deleteSequence(params.sequenceId, session.user.orgId)

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Не удалось удалить последовательность' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: { deleted: true },
    })
  } catch (error) {
    console.error('Delete sequence API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось удалить последовательность',
      },
      { status: 500 },
    )
  }
}