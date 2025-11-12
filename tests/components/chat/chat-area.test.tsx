import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatArea } from '@/components/chat/chat-area'

describe('ChatArea Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render empty state when no chat selected', () => {
    render(<ChatArea selectedChat={null} />)
    
    expect(screen.getByText(/выберите чат или начните новый/i)).toBeInTheDocument()
  })

  it('should render chat area when chat is selected', () => {
    render(<ChatArea selectedChat="1" />)
    
    // Проверяем что компонент рендерится (может быть текст "Начните разговор...")
    const chatArea = document.querySelector('div[class*="flex-1"]')
    expect(chatArea).toBeInTheDocument()
  })

  it('should render message input', () => {
    render(<ChatArea selectedChat="1" />)
    
    const textarea = screen.getByPlaceholderText(/введите сообщение/i)
    expect(textarea).toBeInTheDocument()
  })

  it('should render send button', () => {
    render(<ChatArea selectedChat="1" />)
    
    const sendButton = screen.getByRole('button', { name: /отправить/i })
    expect(sendButton).toBeInTheDocument()
  })

  it('should update message on input', async () => {
    const user = userEvent.setup()
    render(<ChatArea selectedChat="1" />)
    
    const textarea = screen.getByPlaceholderText(/введите сообщение/i) as HTMLTextAreaElement
    await user.type(textarea, 'Test message')
    
    expect(textarea.value).toBe('Test message')
  })

  it('should render agent selector', () => {
    render(<ChatArea selectedChat="1" />)
    
    // Проверяем что есть селектор агента
    const agentSelector = screen.getByText(/выберите агента ИИ/i)
    expect(agentSelector).toBeInTheDocument()
  })

  it('should render message input area', () => {
    render(<ChatArea selectedChat="1" />)
    
    // Проверяем что есть область для ввода сообщений
    const messageArea = document.querySelector('div[class*="border-t"]')
    expect(messageArea).toBeInTheDocument()
  })
})

