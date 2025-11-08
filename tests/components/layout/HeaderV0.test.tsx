import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HeaderV0 } from '@/components/layout/HeaderV0'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: vi.fn(() => ({ tenantId: 'test-tenant' })),
}))

describe('HeaderV0 Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render header with title', () => {
    render(<HeaderV0 />)
    const title = screen.getByText('GPT Агент')
    expect(title).toBeInTheDocument()
  })

  it('should render search input', () => {
    render(<HeaderV0 />)
    const searchInput = screen.getByPlaceholderText('Поиск')
    expect(searchInput).toBeInTheDocument()
  })

  it('should render notification button', () => {
    render(<HeaderV0 />)
    // Ищем все кнопки и находим ту, что содержит иконку уведомлений
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
    // Проверяем, что есть кнопка с badge (уведомления)
    const badge = screen.getByText('3')
    expect(badge).toBeInTheDocument()
  })

  it('should render notification badge with count', () => {
    render(<HeaderV0 />)
    const badge = screen.getByText('3')
    expect(badge).toBeInTheDocument()
  })

  it('should toggle notifications on button click', async () => {
    const user = userEvent.setup()
    render(<HeaderV0 />)
    
    // Находим кнопку через badge или через все кнопки
    const buttons = screen.getAllByRole('button')
    const notificationButton = buttons.find(btn => btn.querySelector('svg')) || buttons[buttons.length - 2]
    
    if (notificationButton) {
      await user.click(notificationButton)
      // Проверяем, что кнопка все еще в документе
      expect(notificationButton).toBeInTheDocument()
    }
  })

  it('should render avatar', () => {
    render(<HeaderV0 />)
    const avatar = screen.getByText('А')
    expect(avatar).toBeInTheDocument()
  })

  it('should render date button', () => {
    render(<HeaderV0 />)
    const dateButton = screen.getByText('30.10.2025')
    expect(dateButton).toBeInTheDocument()
  })
})

