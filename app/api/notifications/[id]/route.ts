import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/providers/auth-provider'
import {
  deleteNotification,
  markNotificationAsRead,
} from '@/lib/repositories/notifications'
import { logger } from '@/lib/utils/logger'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orgId } = body

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    await markNotificationAsRead(params.id, orgId)

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read',
    })
  } catch (error) {
    logger.error('Failed to mark notification as read', error as Error)
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('orgId')

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    await deleteNotification(params.id, organizationId)

    return NextResponse.json({
      success: true,
      message: 'Notification deleted',
    })
  } catch (error) {
    logger.error('Failed to delete notification', error as Error)
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    )
  }
}
