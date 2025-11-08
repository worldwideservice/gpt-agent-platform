import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RealTimeNotifications } from '@/components/notifications/RealTimeNotifications'

// Мокаем WebSocket клиент
const mockOnNotification = vi.fn(() => vi.fn()) // Возвращает функцию unsubscribe
const mockOnSystemAnnouncement = vi.fn(() => vi.fn())
const mockOnJobUpdate = vi.fn(() => vi.fn())
const mockOnAgentStatusChange = vi.fn(() => vi.fn())
const mockMarkNotificationAsRead = vi.fn()
const mockIsConnected = vi.fn(() => true)

vi.mock('@/lib/websocket/client', () => ({
  useWebSocket: () => ({
    onNotification: mockOnNotification,
    onSystemAnnouncement: mockOnSystemAnnouncement,
    onJobUpdate: mockOnJobUpdate,
    onAgentStatusChange: mockOnAgentStatusChange,
    markNotificationAsRead: mockMarkNotificationAsRead,
    isConnected: mockIsConnected,
  }),
}))

describe('RealTimeNotifications Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsConnected.mockReturnValue(true)
  })

  it('should render notifications card', () => {
    render(<RealTimeNotifications />)
    
    expect(screen.getByText(/уведомления/i)).toBeInTheDocument()
  })

  it('should show connection status', () => {
    render(<RealTimeNotifications />)
    
    expect(screen.getByText(/онлайн/i)).toBeInTheDocument()
  })

  it('should show offline status when disconnected', () => {
    mockIsConnected.mockReturnValue(false)
    
    render(<RealTimeNotifications />)
    
    expect(screen.getByText(/оффлайн/i)).toBeInTheDocument()
  })

  it('should display empty state when no notifications', () => {
    render(<RealTimeNotifications />)
    
    expect(screen.getByText(/нет уведомлений/i)).toBeInTheDocument()
  })

  it('should subscribe to notification events on mount', () => {
    render(<RealTimeNotifications />)
    
    expect(mockOnNotification).toHaveBeenCalled()
    expect(mockOnSystemAnnouncement).toHaveBeenCalled()
    expect(mockOnJobUpdate).toHaveBeenCalled()
    expect(mockOnAgentStatusChange).toHaveBeenCalled()
  })

  it('should display notification when received', async () => {
    render(<RealTimeNotifications />)
    
    // Симулируем получение уведомления
    const notificationCallback = mockOnNotification.mock.calls[0][0]
    notificationCallback({
      id: '1',
      type: 'notification',
      level: 'info',
      title: 'Test Notification',
      message: 'Test message',
      timestamp: new Date().toISOString(),
      read: false,
    })

    await waitFor(() => {
      expect(screen.getByText('Test Notification')).toBeInTheDocument()
      expect(screen.getByText('Test message')).toBeInTheDocument()
    })
  })

  it('should display unread count badge', async () => {
    render(<RealTimeNotifications />)
    
    const notificationCallback = mockOnNotification.mock.calls[0][0]
    notificationCallback({
      id: '1',
      type: 'notification',
      level: 'info',
      title: 'Test Notification',
      message: 'Test message',
      timestamp: new Date().toISOString(),
      read: false,
    })

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  it('should mark notification as read', async () => {
    const user = userEvent.setup()
    
    render(<RealTimeNotifications />)
    
    const notificationCallback = mockOnNotification.mock.calls[0][0]
    notificationCallback({
      id: '1',
      type: 'notification',
      level: 'info',
      title: 'Test Notification',
      message: 'Test message',
      timestamp: new Date().toISOString(),
      read: false,
    })

    await waitFor(() => {
      expect(screen.getByText('Test Notification')).toBeInTheDocument()
    })

    const markAsReadButton = screen.getByRole('button', { name: /прочитано/i })
    await user.click(markAsReadButton)

    expect(mockMarkNotificationAsRead).toHaveBeenCalledWith('1')
  })

  it('should mark all notifications as read', async () => {
    const user = userEvent.setup()
    
    render(<RealTimeNotifications />)
    
    const notificationCallback = mockOnNotification.mock.calls[0][0]
    notificationCallback({
      id: '1',
      type: 'notification',
      level: 'info',
      title: 'Test Notification',
      message: 'Test message',
      timestamp: new Date().toISOString(),
      read: false,
    })

    await waitFor(() => {
      expect(screen.getByText('Test Notification')).toBeInTheDocument()
    })

    const markAllButton = screen.getByRole('button', { name: /отметить все/i })
    await user.click(markAllButton)

    // Unread count should be 0
    await waitFor(() => {
      expect(screen.queryByText('1')).not.toBeInTheDocument()
    })
  })

  it('should delete notification', async () => {
    const user = userEvent.setup()
    
    render(<RealTimeNotifications />)
    
    const notificationCallback = mockOnNotification.mock.calls[0][0]
    notificationCallback({
      id: '1',
      type: 'notification',
      level: 'info',
      title: 'Test Notification',
      message: 'Test message',
      timestamp: new Date().toISOString(),
      read: false,
    })

    await waitFor(() => {
      expect(screen.getByText('Test Notification')).toBeInTheDocument()
    })

    // Находим кнопку удаления (X)
    const deleteButtons = screen.getAllByRole('button')
    const deleteButton = deleteButtons.find(btn => btn.querySelector('svg'))
    
    if (deleteButton) {
      await user.click(deleteButton)
      
      await waitFor(() => {
        expect(screen.queryByText('Test Notification')).not.toBeInTheDocument()
      })
    }
  })

  it('should filter unread notifications when showUnreadOnly is true', async () => {
    render(<RealTimeNotifications showUnreadOnly={true} />)
    
    const notificationCallback = mockOnNotification.mock.calls[0][0]
    
    // Добавляем прочитанное уведомление
    notificationCallback({
      id: '1',
      type: 'notification',
      level: 'info',
      title: 'Read Notification',
      message: 'Read message',
      timestamp: new Date().toISOString(),
      read: true,
    })
    
    // Добавляем непрочитанное уведомление
    notificationCallback({
      id: '2',
      type: 'notification',
      level: 'info',
      title: 'Unread Notification',
      message: 'Unread message',
      timestamp: new Date().toISOString(),
      read: false,
    })

    await waitFor(() => {
      // Должно показываться только непрочитанное
      expect(screen.queryByText('Read Notification')).not.toBeInTheDocument()
      expect(screen.getByText('Unread Notification')).toBeInTheDocument()
    })
  })

  it('should limit notifications to maxNotifications', async () => {
    render(<RealTimeNotifications maxNotifications={2} />)
    
    const notificationCallback = mockOnNotification.mock.calls[0][0]
    
    // Добавляем 3 уведомления
    for (let i = 1; i <= 3; i++) {
      notificationCallback({
        id: `${i}`,
        type: 'notification',
        level: 'info',
        title: `Notification ${i}`,
        message: `Message ${i}`,
        timestamp: new Date().toISOString(),
        read: false,
      })
    }

    await waitFor(() => {
      // Должно быть только 2 уведомления
      expect(screen.getByText('Notification 3')).toBeInTheDocument()
      expect(screen.getByText('Notification 2')).toBeInTheDocument()
      expect(screen.queryByText('Notification 1')).not.toBeInTheDocument()
    })
  })

  it('should display different notification types with correct icons', async () => {
    render(<RealTimeNotifications />)
    
    const notificationCallback = mockOnNotification.mock.calls[0][0]
    const announcementCallback = mockOnSystemAnnouncement.mock.calls[0][0]
    const jobCallback = mockOnJobUpdate.mock.calls[0][0]
    const agentCallback = mockOnAgentStatusChange.mock.calls[0][0]
    
    notificationCallback({
      id: '1',
      type: 'notification',
      level: 'info',
      title: 'Regular Notification',
      message: 'Message',
      timestamp: new Date().toISOString(),
      read: false,
    })
    
    announcementCallback({
      id: '2',
      level: 'info',
      title: 'Announcement',
      message: 'Message',
      timestamp: new Date().toISOString(),
    })
    
    jobCallback({
      jobId: 'job-1',
      message: 'Job update',
      timestamp: new Date().toISOString(),
    })
    
    agentCallback({
      agentId: 'agent-1',
      status: 'active',
      timestamp: new Date().toISOString(),
    })

    await waitFor(() => {
      expect(screen.getByText('Regular Notification')).toBeInTheDocument()
      expect(screen.getByText('Announcement')).toBeInTheDocument()
      expect(screen.getByText('Обновление задачи')).toBeInTheDocument()
      expect(screen.getByText('Изменение статуса агента')).toBeInTheDocument()
    })
  })
})

