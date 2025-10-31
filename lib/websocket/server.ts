import { Server as HTTPServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import { auth } from '@/auth'
import { UserRepository } from '@/lib/repositories/users'
import type { NextApiRequest, NextApiResponse } from 'next'

interface ServerToClientEvents {
  'notification:new': (notification: any) => void
  'job:updated': (job: any) => void
  'agent:status_changed': (agent: any) => void
  'system:announcement': (announcement: any) => void
  'user:online_status': (onlineUsers: string[]) => void
}

interface ClientToServerEvents {
  'user:join': (userId: string) => void
  'user:leave': (userId: string) => void
  'notification:mark_read': (notificationId: string) => void
  'job:subscribe': (jobId: string) => void
  'job:unsubscribe': (jobId: string) => void
}

interface InterServerEvents {
  ping: () => void
}

interface SocketData {
  userId?: string
  orgId?: string
  sessionId?: string
}

let io: SocketServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> | null = null

// Online users tracking
const onlineUsers = new Map<string, Set<string>>() // orgId -> Set of userIds
const userSockets = new Map<string, string>() // userId -> socketId

export function initializeWebSocketServer(httpServer: HTTPServer) {
  io = new SocketServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  })

  io.use(async (socket, next) => {
    try {
      // Get session from socket handshake
      const sessionToken = socket.handshake.auth.token

      if (sessionToken) {
        // Verify session token (simplified - in production use proper JWT verification)
        const session = await auth()
        if (session?.user) {
          socket.data.userId = session.user.id
          socket.data.orgId = session.user.orgId
          socket.data.sessionId = socket.id
        }
      }

      next()
    } catch (error) {
      console.error('WebSocket auth error:', error)
      next(new Error('Authentication failed'))
    }
  })

  io.on('connection', async (socket) => {
    console.log('User connected:', socket.data.userId || 'anonymous')

    const userId = socket.data.userId
    const orgId = socket.data.orgId || userId

    if (userId) {
      // Track online users
      if (!onlineUsers.has(orgId!)) {
        onlineUsers.set(orgId!, new Set())
      }
      onlineUsers.get(orgId!)!.add(userId)
      userSockets.set(userId, socket.id)

      // Join user to their personal room
      socket.join(`user:${userId}`)

      // Join user to organization room
      if (orgId) {
        socket.join(`org:${orgId}`)
      }

      // Notify others about online status change
      socket.to(`org:${orgId}`).emit('user:online_status',
        Array.from(onlineUsers.get(orgId!) || [])
      )

      // Send welcome notification
      socket.emit('notification:new', {
        id: `welcome_${Date.now()}`,
        type: 'system',
        title: 'Подключено к серверу',
        message: 'Вы успешно подключились к системе уведомлений',
        timestamp: new Date(),
        read: false,
      })
    }

    // Handle user join/leave events
    socket.on('user:join', (joinUserId: string) => {
      if (orgId) {
        socket.join(`user:${joinUserId}`)
      }
    })

    socket.on('user:leave', (leaveUserId: string) => {
      socket.leave(`user:${leaveUserId}`)
    })

    // Handle notification mark as read
    socket.on('notification:mark_read', async (notificationId: string) => {
      if (!userId) return

      try {
        // Mark notification as read in database
        await markNotificationAsRead(notificationId, userId)

        // Confirm to user
        socket.emit('notification:new', {
          id: `read_confirm_${Date.now()}`,
          type: 'system',
          title: 'Уведомление прочитано',
          message: `Уведомление ${notificationId} отмечено как прочитанное`,
          timestamp: new Date(),
          read: true,
        })
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    })

    // Handle job subscriptions
    socket.on('job:subscribe', (jobId: string) => {
      socket.join(`job:${jobId}`)
      console.log(`User ${userId} subscribed to job ${jobId}`)
    })

    socket.on('job:unsubscribe', (jobId: string) => {
      socket.leave(`job:${jobId}`)
      console.log(`User ${userId} unsubscribed from job ${jobId}`)
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', userId || 'anonymous')

      if (userId && orgId) {
        // Remove from online users
        const orgUsers = onlineUsers.get(orgId)
        if (orgUsers) {
          orgUsers.delete(userId)

          // If no more users in org, clean up
          if (orgUsers.size === 0) {
            onlineUsers.delete(orgId)
          } else {
            // Notify remaining users
            socket.to(`org:${orgId}`).emit('user:online_status',
              Array.from(orgUsers)
            )
          }
        }

        userSockets.delete(userId)
      }
    })
  })

  console.log('WebSocket server initialized')
  return io
}

export function getIO() {
  if (!io) {
    throw new Error('WebSocket server not initialized')
  }
  return io
}

// Notification functions
export async function sendNotificationToUser(userId: string, notification: any) {
  if (!io) return

  io.to(`user:${userId}`).emit('notification:new', notification)

  // Also send to organization room for admin notifications
  const user = await UserRepository.getUserById(userId)
  if (user?.orgId) {
    io.to(`org:${user.orgId}`).emit('notification:new', {
      ...notification,
      targetUser: userId,
    })
  }
}

export async function sendNotificationToOrganization(orgId: string, notification: any) {
  if (!io) return

  io.to(`org:${orgId}`).emit('notification:new', notification)
}

export async function sendSystemAnnouncement(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (!io) return

  const announcement = {
    id: `announcement_${Date.now()}`,
    type: 'announcement',
    level,
    title: 'Системное объявление',
    message,
    timestamp: new Date(),
  }

  io.emit('system:announcement', announcement)
}

export async function notifyJobUpdate(jobId: string, jobData: any) {
  if (!io) return

  io.to(`job:${jobId}`).emit('job:updated', {
    jobId,
    ...jobData,
    timestamp: new Date(),
  })
}

export async function notifyAgentStatusChange(agentId: string, status: string, orgId?: string) {
  if (!io) return

  const notification = {
    agentId,
    status,
    timestamp: new Date(),
  }

  if (orgId) {
    io.to(`org:${orgId}`).emit('agent:status_changed', notification)
  } else {
    io.emit('agent:status_changed', notification)
  }
}

export function getOnlineUsersCount(orgId?: string): number {
  if (orgId) {
    return onlineUsers.get(orgId)?.size || 0
  }

  let total = 0
  for (const users of onlineUsers.values()) {
    total += users.size
  }
  return total
}

export function getOnlineUsers(orgId?: string): string[] {
  if (orgId) {
    return Array.from(onlineUsers.get(orgId) || [])
  }

  const allUsers = new Set<string>()
  for (const users of onlineUsers.values()) {
    users.forEach(user => allUsers.add(user))
  }
  return Array.from(allUsers)
}

// Helper function to mark notification as read
async function markNotificationAsRead(notificationId: string, userId: string) {
  // This would update the notification in the database
  // For now, just log it
  console.log(`Marking notification ${notificationId} as read for user ${userId}`)
}
