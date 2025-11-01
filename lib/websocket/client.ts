import { io, Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from './server'

const SOCKET_PATH = '/api/socket/io'

class WebSocketClient {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private connected = false
  private initializationPromise: Promise<void> | null = null

  // Event listeners
  private listeners = {
    notification: new Set<(notification: any) => void>(),
    jobUpdate: new Set<(job: any) => void>(),
    agentStatusChange: new Set<(agent: any) => void>(),
    systemAnnouncement: new Set<(announcement: any) => void>(),
    onlineStatus: new Set<(users: string[]) => void>(),
  }

  constructor() {
    void this.ensureSocketReady()
  }

  private async ensureSocketReady(): Promise<void> {
    if (this.socket || typeof window === 'undefined') {
      return
    }

    if (!this.initializationPromise) {
      this.initializationPromise = this.initializeSocket()
    }

    await this.initializationPromise
  }

  private async initializeSocket(): Promise<void> {
    try {
      await fetch(SOCKET_PATH, { method: 'GET', cache: 'no-store' })
    } catch (error) {
      console.error('Failed to initialize WebSocket endpoint', error)
    }

    const socketUrl = process.env.NODE_ENV === 'production'
      ? process.env.WEBSOCKET_URL || window.location.origin
      : 'http://localhost:3000'

    this.socket = io(socketUrl, {
      auth: {
        token: this.getAuthToken(),
      },
      path: SOCKET_PATH,
      transports: ['websocket', 'polling'],
      autoConnect: true,
    })

    this.setupEventListeners()
  }

  private getAuthToken(): string | undefined {
    // Try to get token from various sources
    if (typeof window !== 'undefined') {
      // From localStorage
      const token = localStorage.getItem('auth_token')
      if (token) return token

      // From cookies
      const cookies = document.cookie.split(';')
      const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='))
      if (authCookie) {
        return authCookie.split('=')[1]
      }
    }

    return undefined
  }

  private setupEventListeners() {
    if (!this.socket) return

    // Connection events
    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.connected = true
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
      this.connected = false

      if (reason === 'io server disconnect') {
        // Server disconnected us, try to reconnect
        this.attemptReconnect()
      }
    })

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      this.attemptReconnect()
    })

    // Application events
    this.socket.on('notification:new', (notification) => {
      console.log('New notification:', notification)
      this.listeners.notification.forEach(listener => listener(notification))
    })

    this.socket.on('job:updated', (job) => {
      console.log('Job updated:', job)
      this.listeners.jobUpdate.forEach(listener => listener(job))
    })

    this.socket.on('agent:status_changed', (agent) => {
      console.log('Agent status changed:', agent)
      this.listeners.agentStatusChange.forEach(listener => listener(agent))
    })

    this.socket.on('system:announcement', (announcement) => {
      console.log('System announcement:', announcement)
      this.listeners.systemAnnouncement.forEach(listener => listener(announcement))
    })

    this.socket.on('user:online_status', (users) => {
      console.log('Online users updated:', users)
      this.listeners.onlineStatus.forEach(listener => listener(users))
    })
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`)

    setTimeout(() => {
      if (this.socket && !this.socket.connected) {
        this.socket.connect()
      }
    }, delay)
  }

  // Public API
  public async connect() {
    await this.ensureSocketReady()

    if (this.socket && !this.socket.connected) {
      this.socket.connect()
    }
  }

  public async disconnect() {
    await this.ensureSocketReady()

    if (this.socket) {
      this.socket.disconnect()
    }
  }

  public isConnected(): boolean {
    return this.connected
  }

  // Event subscription
  public onNotification(callback: (notification: any) => void) {
    this.listeners.notification.add(callback)
    return () => this.listeners.notification.delete(callback)
  }

  public onJobUpdate(callback: (job: any) => void) {
    this.listeners.jobUpdate.add(callback)
    return () => this.listeners.jobUpdate.delete(callback)
  }

  public onAgentStatusChange(callback: (agent: any) => void) {
    this.listeners.agentStatusChange.add(callback)
    return () => this.listeners.agentStatusChange.delete(callback)
  }

  public onSystemAnnouncement(callback: (announcement: any) => void) {
    this.listeners.systemAnnouncement.add(callback)
    return () => this.listeners.systemAnnouncement.delete(callback)
  }

  public onOnlineStatusChange(callback: (users: string[]) => void) {
    this.listeners.onlineStatus.add(callback)
    return () => this.listeners.onlineStatus.delete(callback)
  }

  // Actions
  public async markNotificationAsRead(notificationId: string) {
    await this.ensureSocketReady()

    if (this.socket && this.connected) {
      this.socket.emit('notification:mark_read', notificationId)
    }
  }

  public async subscribeToJob(jobId: string) {
    await this.ensureSocketReady()

    if (this.socket && this.connected) {
      this.socket.emit('job:subscribe', jobId)
    }
  }

  public async unsubscribeFromJob(jobId: string) {
    await this.ensureSocketReady()

    if (this.socket && this.connected) {
      this.socket.emit('job:unsubscribe', jobId)
    }
  }

  public async joinUserRoom(userId: string) {
    await this.ensureSocketReady()

    if (this.socket && this.connected) {
      this.socket.emit('user:join', userId)
    }
  }

  public async leaveUserRoom(userId: string) {
    await this.ensureSocketReady()

    if (this.socket && this.connected) {
      this.socket.emit('user:leave', userId)
    }
  }

  // Get online users count
  public getOnlineUsersCount(): number {
    // This would be implemented with a REST API call
    // For now, return a mock value
    return 0
  }
}

// Singleton instance
let websocketClient: WebSocketClient | null = null

export function getWebSocketClient(): WebSocketClient {
  if (!websocketClient) {
    websocketClient = new WebSocketClient()
  }
  return websocketClient
}

export { WebSocketClient }

// React hook for using WebSocket
export function useWebSocket() {
  return getWebSocketClient()
}
