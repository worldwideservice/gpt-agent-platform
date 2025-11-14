import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/providers/auth-provider'
import {
  getNotifications,
  markAllNotificationsAsRead,
  deleteAllNotifications,
  getUnreadCount,
} from '@/lib/repositories/notifications'
import { logger } from '@/lib/utils/logger'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('orgId')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    const [notifications, unreadCount] = await Promise.all([
      getNotifications(organizationId, session.user.id, { unreadOnly, limit }),
      getUnreadCount(organizationId, session.user.id),
    ])

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    })
  } catch (error) {
    logger.error('Failed to fetch notifications', error as Error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, orgId } = body

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    if (action === 'markAllRead') {
      await markAllNotificationsAsRead(orgId, session.user.id)

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    logger.error('Failed to process notification action', error as Error)
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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

    await deleteAllNotifications(organizationId, session.user.id)

    return NextResponse.json({
      success: true,
      message: 'All notifications deleted',
    })
  } catch (error) {
    logger.error('Failed to delete all notifications', error as Error)
    return NextResponse.json(
      { error: 'Failed to delete notifications' },
      { status: 500 }
    )
  }
}
