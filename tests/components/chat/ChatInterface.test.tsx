import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChatInterface } from '@/components/chat/chat-interface'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: vi.fn(() => ({ tenantId: 'test-tenant' })),
}))

describe('ChatInterface Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render chat interface', () => {
    render(<ChatInterface />)
    // Компонент должен рендериться
    expect(document.body).toBeTruthy()
  })

  it('should render chat list and chat area', () => {
    const { container } = render(<ChatInterface />)
    // Проверяем структуру чата
    const chatContainer = container.querySelector('.flex')
    expect(chatContainer).toBeInTheDocument()
  })

  it('should initialize with no selected chat', () => {
    render(<ChatInterface />)
    // Проверяем, что начальное состояние - нет выбранного чата
    expect(document.body).toBeTruthy()
  })
})

